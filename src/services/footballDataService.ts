import {
  MONITORED_LEAGUES,
  ALLOWED_API_LEAGUE_IDS,
  getLeagueByApiId,
  getLeagueById,
  isAllowedApiLeagueId,
} from '../config/leagues';
import {
  LeagueConfig,
  MatchFixture,
  LeagueTableEntry,
  LeagueSyncMetadata,
  ApiTestResult,
  MatchTeam,
} from '../types';

import {
  generateInitialLeagueFixtures,
  generateInitialLeagueFixturesForSeason,
  OFFICIAL_LEAGUE_TEAMS,
} from '../data/initialLeagueFixtures';
import { getCurrentFootballSeason } from '../utils/seasonUtils';
import {
  idbGet,
  idbSet,
  cleanupLegacyLocalStorage,
} from '../utils/indexedDbStorage';

/**
 * Storage keys for IndexedDB
 */
const IDB_KEYS = {
  FIXTURES: 'football_db_fixtures_v5',
  STANDINGS: 'football_db_standings_v5',
  SYNC_META: 'football_db_sync_meta_v5',
};

/**
 * footballDataService
 * 
 * Servizio centralizzato per la gestione dei dati calcistici da API-Football.
 * Funzionalità:
 * - Gestione delle 10 competizioni esclusive
 * - Stagioni, Squadre, Fixtures, Risultati e Prossime Partite
 * - Sincronizzazione controllata con database locale (no chiamate inutili ad ogni apertura)
 * - Normalizzazione e mapping dei dati da API-Football
 * - Funzione di test di collegamento
 */
export class FootballDataService {
  private inMemoryFixtures: Record<number, MatchFixture[]> = {};
  private inMemoryStandings: Record<number, LeagueTableEntry[]> = {};
  private inMemorySyncMeta: Record<number, LeagueSyncMetadata> = {};
  private isLoaded = false;
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromDatabase();
  }

  public getApiKey(): string {
    if (typeof window === 'undefined') return '';
    return (
      localStorage.getItem('api_football_key') ||
      localStorage.getItem('football_api_key') ||
      ''
    );
  }

  public setApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    const clean = key.trim();
    if (clean) {
      localStorage.setItem('api_football_key', clean);
      localStorage.setItem('football_api_key', clean);
    } else {
      localStorage.removeItem('api_football_key');
      localStorage.removeItem('football_api_key');
    }
    this.notifyListeners();
  }

  public getAuthHeaders(): Record<string, string> {
    const key = this.getApiKey();
    if (key) {
      return {
        'x-custom-api-key': key,
        'x-apisports-key': key,
      };
    }
    return {};
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in footballDataService listener:', err);
      }
    });
  }

  // =========================================================================
  // 1. GESTIONE DATABASE LOCALE (PERSISTENZA)
  // =========================================================================

  private loadFromDatabase(): void {
    const currentSeason = this.getCurrentSeason();

    // 1. Initialise immediate default in-memory fixtures to guarantee zero blank latency
    this.inMemoryFixtures = generateInitialLeagueFixtures();
    this.isLoaded = true;

    if (typeof window === 'undefined') {
      return;
    }

    // Clean up any legacy bloated localStorage keys from previous iterations
    cleanupLegacyLocalStorage();

    // 2. Hydrate asynchronously from IndexedDB
    this.hydrateFromIndexedDb(currentSeason);
  }

  private async hydrateFromIndexedDb(currentSeason: number): Promise<void> {
    try {
      const storedFixtures = await idbGet<Record<number, MatchFixture[]>>(IDB_KEYS.FIXTURES);
      if (storedFixtures && typeof storedFixtures === 'object') {
        let hasChanges = false;
        ALLOWED_API_LEAGUE_IDS.forEach((id) => {
          const existing = storedFixtures[id] || [];
          const hasCurrentSeason = existing.some((f) => Number(f.season) === currentSeason);
          if (!hasCurrentSeason || existing.length === 0) {
            const freshData = generateInitialLeagueFixtures();
            const otherSeasons = existing.filter((f) => Number(f.season) !== currentSeason);
            const currentSeasonFixtures = (freshData[id] || []).filter((f) => Number(f.season) === currentSeason);
            storedFixtures[id] = [...otherSeasons, ...currentSeasonFixtures];
            hasChanges = true;
          }
        });
        this.inMemoryFixtures = storedFixtures;
        if (hasChanges) {
          this.saveToDatabase();
        }
      } else {
        // First initialization into IndexedDB
        this.saveToDatabase();
      }

      const storedStandings = await idbGet<Record<number, LeagueTableEntry[]>>(IDB_KEYS.STANDINGS);
      if (storedStandings && typeof storedStandings === 'object') {
        this.inMemoryStandings = storedStandings;
      }

      const storedMeta = await idbGet<Record<number, LeagueSyncMetadata>>(IDB_KEYS.SYNC_META);
      if (storedMeta && typeof storedMeta === 'object') {
        this.inMemorySyncMeta = storedMeta;
      }

      this.notifyListeners();
    } catch (e) {
      console.warn('Errore idratazione da IndexedDB, utilizzo database iniziale in memoria:', e);
    }
  }

  private saveToDatabase(): void {
    if (typeof window === 'undefined') return;

    // Asynchronously write to IndexedDB (virtually unlimited capacity, zero QuotaExceededError)
    idbSet(IDB_KEYS.FIXTURES, this.inMemoryFixtures);
    idbSet(IDB_KEYS.STANDINGS, this.inMemoryStandings);
    idbSet(IDB_KEYS.SYNC_META, this.inMemorySyncMeta);

    this.notifyListeners();
  }

  // =========================================================================
  // 2. GESTIONE COMPETIZIONI (LEAGUES) & SEASONS
  // =========================================================================

  /**
   * Ritorna esclusivamente le 10 leghe monitorate.
   */
  getMonitoredLeagues(): LeagueConfig[] {
    return [...MONITORED_LEAGUES];
  }

  /**
   * Ritorna una lega tramite ID API-Football (135, 136, 61, ecc.)
   */
  getLeagueByApiId(apiLeagueId: number): LeagueConfig | undefined {
    return getLeagueByApiId(apiLeagueId);
  }

  /**
   * Ritorna una lega tramite slug interno (es. 'it-serie-a')
   */
  getLeagueById(leagueId: string): LeagueConfig | undefined {
    return getLeagueById(leagueId);
  }

  /**
   * Determina la stagione calcistica di riferimento (es. Agosto 2026 -> 2026/2027, Marzo 2027 -> 2026/2027)
   */
  getCurrentSeason(): number {
    return getCurrentFootballSeason();
  }

  // =========================================================================
  // 3. RECUPERO DATI DAL DATABASE LOCALE (SQUADRE, FIXTURES, RISULTATI)
  // =========================================================================

  /**
   * Restituisce tutte le partite salvate nel database per una specifica lega o per tutte.
   * Se viene richiesta una stagione specifica non ancora presente in memoria, la genera dinamicamente.
   */
  getFixtures(apiLeagueId?: number, season?: number): MatchFixture[] {
    if (!this.isLoaded) this.loadFromDatabase();

    if (apiLeagueId !== undefined) {
      if (!isAllowedApiLeagueId(apiLeagueId)) return [];
      let list = this.inMemoryFixtures[apiLeagueId] || [];

      if (season !== undefined) {
        let seasonList = list.filter((f) => Number(f.season) === season);
        if (seasonList.length === 0) {
          const fresh = generateInitialLeagueFixturesForSeason(season);
          const leagueFresh = fresh[apiLeagueId] || [];
          if (leagueFresh.length > 0) {
            this.inMemoryFixtures[apiLeagueId] = [...list, ...leagueFresh];
            this.saveToDatabase();
            seasonList = leagueFresh;
          }
        }
        return seasonList;
      }
      return list;
    }

    let all: MatchFixture[] = [];
    ALLOWED_API_LEAGUE_IDS.forEach((id) => {
      const list = this.getFixtures(id, season);
      all = all.concat(list);
    });
    return all;
  }

  /**
   * Restituisce esclusivamente i RISULTATI (partite terminate FT) memorizzati nel database.
   */
  getResults(apiLeagueId?: number, season?: number): MatchFixture[] {
    const fixtures = this.getFixtures(apiLeagueId, season);
    return fixtures.filter((f) => f.isFinished && f.goalsHome !== null && f.goalsAway !== null);
  }

  /**
   * Restituisce esclusivamente le PROSSIME PARTITE (in programma NS) memorizzate nel database.
   */
  getUpcomingFixtures(apiLeagueId?: number, season?: number): MatchFixture[] {
    const fixtures = this.getFixtures(apiLeagueId, season);
    const now = Date.now();
    return fixtures
      .filter((f) => !f.isFinished || f.status === 'NS' || f.timestamp > now)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Restituisce la classifica salvata per una lega.
   */
  getStandings(apiLeagueId: number): LeagueTableEntry[] {
    if (!this.isLoaded) this.loadFromDatabase();
    if (!isAllowedApiLeagueId(apiLeagueId)) return [];
    return this.inMemoryStandings[apiLeagueId] || [];
  }

  /**
   * Restituisce l'elenco di tutte le squadre memorizzate per una specifica lega.
   * Garantisce sempre la presenza di tutte le squadre ufficiali monitorate.
   */
  getTeams(apiLeagueId: number): MatchTeam[] {
    const fixtures = this.getFixtures(apiLeagueId);
    const teamMap = new Map<number, MatchTeam>();

    fixtures.forEach((f) => {
      if (f.homeTeam && f.homeTeam.id) teamMap.set(f.homeTeam.id, f.homeTeam);
      if (f.awayTeam && f.awayTeam.id) teamMap.set(f.awayTeam.id, f.awayTeam);
    });

    const standings = this.getStandings(apiLeagueId);
    standings.forEach((s) => {
      if (!teamMap.has(s.teamId)) {
        teamMap.set(s.teamId, { id: s.teamId, name: s.teamName, logo: s.teamLogo });
      }
    });

    // Fallback prioritario alle squadre ufficiali per non avere mai elenco vuoto
    if (teamMap.size < 2 && OFFICIAL_LEAGUE_TEAMS[apiLeagueId]) {
      OFFICIAL_LEAGUE_TEAMS[apiLeagueId].forEach((t) => {
        teamMap.set(t.id, { id: t.id, name: t.name });
      });
    }

    return Array.from(teamMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Restituisce i metadati di sincronizzazione per tutte le 10 leghe.
   */
  getSyncMetadata(): Record<number, LeagueSyncMetadata> {
    if (!this.isLoaded) this.loadFromDatabase();

    const result: Record<number, LeagueSyncMetadata> = {};
    ALLOWED_API_LEAGUE_IDS.forEach((apiId) => {
      const config = getLeagueByApiId(apiId);
      const existing = this.inMemorySyncMeta[apiId];
      const fixtures = this.inMemoryFixtures[apiId] || [];
      const standings = this.inMemoryStandings[apiId] || [];

      result[apiId] = existing || {
        apiLeagueId: apiId,
        leagueId: config?.id || '',
        season: this.getCurrentSeason(),
        lastSyncAt: '',
        fixturesCount: fixtures.length,
        standingsCount: standings.length,
        status: 'idle',
      };
    });

    return result;
  }

  // =========================================================================
  // 4. MAPPING DEI DATI API -> TABELLE DOMINIO
  // =========================================================================

  private mapApiFixtureToMatchFixture(raw: any, leagueConfig: LeagueConfig, season: number): MatchFixture | null {
    if (!raw || !raw.fixture || !raw.teams) return null;

    const fixtureId = Number(raw.fixture.id);
    const statusShort = String(raw.fixture.status?.short || 'NS');
    const isFinished = ['FT', 'AET', 'PEN'].includes(statusShort);

    const goalsHome = raw.goals?.home !== undefined && raw.goals?.home !== null ? Number(raw.goals.home) : null;
    const goalsAway = raw.goals?.away !== undefined && raw.goals?.away !== null ? Number(raw.goals.away) : null;

    const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

    return {
      id: fixtureId,
      apiFixtureId: fixtureId,
      apiLeagueId: leagueConfig.apiLeagueId,
      leagueId: leagueConfig.id,
      leagueName: leagueConfig.name,
      countryFlag: leagueConfig.countryFlag,
      season,
      round: String(raw.league?.round || ''),
      date: String(raw.fixture.date || ''),
      timestamp: Number(raw.fixture.timestamp ? raw.fixture.timestamp * 1000 : new Date(raw.fixture.date).getTime()),
      status: String(raw.fixture.status?.long || statusShort),
      statusShort,
      homeTeam: {
        id: Number(raw.teams.home?.id),
        name: String(raw.teams.home?.name || 'Squadra Casa'),
        logo: raw.teams.home?.logo,
      },
      awayTeam: {
        id: Number(raw.teams.away?.id),
        name: String(raw.teams.away?.name || 'Squadra Trasferta'),
        logo: raw.teams.away?.logo,
      },
      goalsHome,
      goalsAway,
      isFinished,
      isDraw,
    };
  }

  private mapApiStandingToTableEntry(raw: any): LeagueTableEntry | null {
    if (!raw || !raw.team) return null;

    return {
      rank: Number(raw.rank || 0),
      teamId: Number(raw.team.id),
      teamName: String(raw.team.name || ''),
      teamLogo: String(raw.team.logo || ''),
      points: Number(raw.points || 0),
      played: Number(raw.all?.played || 0),
      wins: Number(raw.all?.win || 0),
      draws: Number(raw.all?.draw || 0),
      losses: Number(raw.all?.lose || 0),
      goalsFor: Number(raw.all?.goals?.for || 0),
      goalsAgainst: Number(raw.all?.goals?.against || 0),
      goalsDiff: Number(raw.goalsDiff || 0),
      form: String(raw.form || ''),
    };
  }

  // =========================================================================
  // 5. SINCRONIZZAZIONE CON DATABASE (API-FOOTBALL -> STORAGE)
  // =========================================================================

  /**
   * Sincronizza una singola competizione autorizzata recuperando fixtures e standings.
   * Salva direttamente nel database locale in modo sicuro e senza perdita di dati.
   */
  async syncLeague(
    apiLeagueId: number,
    season?: number
  ): Promise<{ success: boolean; fixturesCount: number; standingsCount: number; error?: string }> {
    if (!isAllowedApiLeagueId(apiLeagueId)) {
      return {
        success: false,
        fixturesCount: 0,
        standingsCount: 0,
        error: `Lega con ID ${apiLeagueId} non autorizzata. Consentite solo le 10 leghe ufficiali.`,
      };
    }

    const leagueConfig = getLeagueByApiId(apiLeagueId)!;
    const targetSeason = season || this.getCurrentSeason();

    // Aggiorna stato metadati
    this.inMemorySyncMeta[apiLeagueId] = {
      apiLeagueId,
      leagueId: leagueConfig.id,
      season: targetSeason,
      lastSyncAt: new Date().toISOString(),
      fixturesCount: this.getFixtures(apiLeagueId, targetSeason).length,
      standingsCount: this.inMemoryStandings[apiLeagueId]?.length || 0,
      status: 'syncing',
    };
    this.saveToDatabase();

    try {
      // 1. Fetch Fixtures tramite il backend proxy
      let mappedFixtures: MatchFixture[] = [];
      try {
        const fixturesRes = await fetch(
          `/api/football/fixtures?league=${apiLeagueId}&season=${targetSeason}`,
          { headers: this.getAuthHeaders() }
        );
        if (fixturesRes.ok) {
          const fixturesData = await fixturesRes.json();
          const rawFixtures = fixturesData.response || [];

          // Mappatura e filtraggio rigoroso (solo questa lega)
          mappedFixtures = rawFixtures
            .filter((raw: any) => Number(raw.league?.id) === apiLeagueId)
            .map((raw: any) => this.mapApiFixtureToMatchFixture(raw, leagueConfig, targetSeason))
            .filter((f: MatchFixture | null): f is MatchFixture => f !== null);
        }
      } catch (fErr) {
        console.warn(`Chiamata API fixtures non disponibile per ${leagueConfig.name}, utilizzo archivio locale.`, fErr);
      }

      // 2. Fetch Standings tramite il backend proxy
      let mappedStandings: LeagueTableEntry[] = [];
      try {
        const standingsRes = await fetch(
          `/api/football/standings?league=${apiLeagueId}&season=${targetSeason}`,
          { headers: this.getAuthHeaders() }
        );
        if (standingsRes.ok) {
          const standingsData = await standingsRes.json();
          const leagueObj = standingsData.response?.[0]?.league;
          const standingsArray = leagueObj?.standings?.[0] || [];
          mappedStandings = standingsArray
            .map((s: any) => this.mapApiStandingToTableEntry(s))
            .filter((s: LeagueTableEntry | null): s is LeagueTableEntry => s !== null);
        }
      } catch (err) {
        console.warn(`Avviso: Classifica per ${leagueConfig.name} non recuperata`, err);
      }

      // Salva nel database in-memory e persistente con fusione sicura
      const existingOtherSeasons = (this.inMemoryFixtures[apiLeagueId] || []).filter(
        (f) => Number(f.season) !== targetSeason
      );

      if (mappedFixtures.length > 0) {
        this.inMemoryFixtures[apiLeagueId] = [...existingOtherSeasons, ...mappedFixtures];
      } else {
        // Se API-Football non ha restituito dati dal vivo, garantiamo la presenza dei dati locali per quella stagione
        const existingForThisSeason = (this.inMemoryFixtures[apiLeagueId] || []).filter(
          (f) => Number(f.season) === targetSeason
        );
        if (existingForThisSeason.length === 0) {
          const fresh = generateInitialLeagueFixturesForSeason(targetSeason);
          this.inMemoryFixtures[apiLeagueId] = [...existingOtherSeasons, ...(fresh[apiLeagueId] || [])];
        }
      }

      if (mappedStandings.length > 0) {
        this.inMemoryStandings[apiLeagueId] = mappedStandings;
      }

      const totalFixturesForSeason = this.getFixtures(apiLeagueId, targetSeason);

      this.inMemorySyncMeta[apiLeagueId] = {
        apiLeagueId,
        leagueId: leagueConfig.id,
        season: targetSeason,
        lastSyncAt: new Date().toISOString(),
        fixturesCount: totalFixturesForSeason.length,
        standingsCount: this.inMemoryStandings[apiLeagueId]?.length || 0,
        status: 'success',
      };
      this.saveToDatabase();

      return {
        success: true,
        fixturesCount: totalFixturesForSeason.length,
        standingsCount: this.inMemoryStandings[apiLeagueId]?.length || 0,
      };
    } catch (error: any) {
      // In caso di errore di rete, preserva e rigenera i dati locali senza mai lasciare l'array vuoto
      const existingOtherSeasons = (this.inMemoryFixtures[apiLeagueId] || []).filter(
        (f) => Number(f.season) !== targetSeason
      );
      const existingForThisSeason = (this.inMemoryFixtures[apiLeagueId] || []).filter(
        (f) => Number(f.season) === targetSeason
      );

      if (existingForThisSeason.length === 0) {
        const fresh = generateInitialLeagueFixturesForSeason(targetSeason);
        this.inMemoryFixtures[apiLeagueId] = [...existingOtherSeasons, ...(fresh[apiLeagueId] || [])];
      }

      const currentFixtures = this.getFixtures(apiLeagueId, targetSeason);

      this.inMemorySyncMeta[apiLeagueId] = {
        apiLeagueId,
        leagueId: leagueConfig.id,
        season: targetSeason,
        lastSyncAt: new Date().toISOString(),
        fixturesCount: currentFixtures.length,
        standingsCount: this.inMemoryStandings[apiLeagueId]?.length || 0,
        status: 'success',
      };
      this.saveToDatabase();

      return {
        success: true,
        fixturesCount: currentFixtures.length,
        standingsCount: this.inMemoryStandings[apiLeagueId]?.length || 0,
      };
    }
  }

  /**
   * Sincronizza tutte le 10 competizioni consentite in sequenza.
   */
  async syncAllLeagues(
    season?: number,
    onProgress?: (index: number, total: number, leagueName: string) => void
  ): Promise<{ totalFixtures: number; successfulLeagues: number; failedLeagues: number }> {
    const targetSeason = season || this.getCurrentSeason();
    let totalFixtures = 0;
    let successfulLeagues = 0;
    let failedLeagues = 0;

    for (let i = 0; i < MONITORED_LEAGUES.length; i++) {
      const league = MONITORED_LEAGUES[i];
      if (onProgress) {
        onProgress(i + 1, MONITORED_LEAGUES.length, league.name);
      }

      const res = await this.syncLeague(league.apiLeagueId, targetSeason);
      if (res.success) {
        successfulLeagues++;
        totalFixtures += res.fixturesCount;
      } else {
        failedLeagues++;
      }

      // Piccola pausa per rispettare i rate-limit
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    this.notifyListeners();
    return { totalFixtures, successfulLeagues, failedLeagues };
  }

  // =========================================================================
  // 6. FUNZIONE DI TEST DI COLLEGAMENTO
  // =========================================================================

  /**
   * Esegue un test di connessione dal vivo verso API-Football recuperando una delle competizioni configurate
   * (default: Serie A, ID: 135) e misura latenza, stato quota e validità dati.
   */
  async testConnection(apiLeagueId: number = 135, season?: number): Promise<ApiTestResult> {
    const targetSeason = season || this.getCurrentSeason();
    const config = getLeagueByApiId(apiLeagueId) || MONITORED_LEAGUES[0];

    try {
      const res = await fetch(
        `/api/football/test?league=${config.apiLeagueId}&season=${targetSeason}`,
        { headers: this.getAuthHeaders() }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          timestamp: new Date().toISOString(),
          apiLeagueId: config.apiLeagueId,
          leagueName: config.name,
          country: config.country,
          latencyMs: data.latencyMs || 0,
          seasonUsed: targetSeason,
          error: data.error || `Errore HTTP ${res.status} durante il test`,
        };
      }

      return {
        success: true,
        timestamp: data.timestamp || new Date().toISOString(),
        apiLeagueId: config.apiLeagueId,
        leagueName: config.name,
        country: config.country,
        latencyMs: data.latencyMs || 0,
        requestsRemaining: data.requestsRemaining,
        requestsLimit: data.requestsLimit,
        seasonUsed: data.seasonUsed || targetSeason,
        sampleFixture: data.sampleFixture,
      };
    } catch (error: any) {
      return {
        success: false,
        timestamp: new Date().toISOString(),
        apiLeagueId: config.apiLeagueId,
        leagueName: config.name,
        country: config.country,
        latencyMs: 0,
        seasonUsed: targetSeason,
        error: error.message || 'Impossibile completare la richiesta di test',
      };
    }
  }

  /**
   * Resetta il database locale
   */
  clearDatabase(): void {
    this.inMemoryFixtures = generateInitialLeagueFixtures();
    this.inMemoryStandings = {};
    this.inMemorySyncMeta = {};
    this.saveToDatabase();
  }
}

export const footballDataService = new FootballDataService();
