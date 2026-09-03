import {
  AppSettings,
  Bet,
  DashboardStats,
  FrequentDrawAlertItem,
  NoDrawAlertItem,
} from '../types';
import { DEFAULT_SETTINGS } from '../config/leagues';
import { generateInitialLeagueFixtures } from '../data/initialLeagueFixtures';
import {
  settleBetWithScore,
  settleBetManualStatus,
} from './betCalculationService';
import { calculateAllLeaguesNoDrawAlerts } from './streakStatsService';
import { calculateAllLeaguesFrequentDraws } from './frequentDrawStatsService';
import { footballDataService } from './footballDataService';

// Inizializzazione pulita: il database scommesse parte vuoto ed è completamente gestito dall'utente



// Placeholder structure for "Alert non pareggia da"
const NO_DRAW_ALERTS_SAMPLE: NoDrawAlertItem[] = [
  {
    id: 'nda-1',
    leagueId: 'it-serie-a',
    leagueName: 'Serie A',
    countryFlag: '🇮🇹',
    teamName: 'Empoli',
    matchesWithoutDraw: 9,
    lastDrawDate: '12 Maggio 2026 (0-0 vs Udinese)',
    nextMatch: {
      opponent: 'Monza',
      date: 'Sabato 22 Ago, 18:30',
      isHome: true,
    },
    historicalMaxWithoutDraw: 12,
  },
  {
    id: 'nda-2',
    leagueId: 'en-championship',
    leagueName: 'Championship',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    teamName: 'Preston North End',
    matchesWithoutDraw: 8,
    lastDrawDate: '28 Aprile 2026 (1-1 vs Hull)',
    nextMatch: {
      opponent: 'Bristol City',
      date: 'Domenica 23 Ago, 16:00',
      isHome: false,
    },
    historicalMaxWithoutDraw: 10,
  },
  {
    id: 'nda-3',
    leagueId: 'fr-ligue-1',
    leagueName: 'Ligue 1',
    countryFlag: '🇫🇷',
    teamName: 'Stade Reims',
    matchesWithoutDraw: 7,
    lastDrawDate: '04 Maggio 2026 (2-2 vs Rennes)',
    nextMatch: {
      opponent: 'Brest',
      date: 'Domenica 23 Ago, 15:00',
      isHome: true,
    },
    historicalMaxWithoutDraw: 11,
  },
  {
    id: 'nda-4',
    leagueId: 'es-segunda-division',
    leagueName: 'Segunda División',
    countryFlag: '🇪🇸',
    teamName: 'Albacete',
    matchesWithoutDraw: 7,
    lastDrawDate: '10 Maggio 2026 (1-1 vs Eibar)',
    nextMatch: {
      opponent: 'Cartagena',
      date: 'Venerdì 21 Ago, 21:00',
      isHome: false,
    },
    historicalMaxWithoutDraw: 9,
  },
  {
    id: 'nda-5',
    leagueId: 'de-2-bundesliga',
    leagueName: '2. Bundesliga',
    countryFlag: '🇩🇪',
    teamName: 'Karlsruher SC',
    matchesWithoutDraw: 6,
    lastDrawDate: '17 Maggio 2026 (0-0 vs Paderborn)',
    nextMatch: {
      opponent: 'Elversberg',
      date: 'Sabato 22 Ago, 13:00',
      isHome: true,
    },
    historicalMaxWithoutDraw: 8,
  },
  {
    id: 'nda-6',
    leagueId: 'it-serie-b',
    leagueName: 'Serie B',
    countryFlag: '🇮🇹',
    teamName: 'Cosenza',
    matchesWithoutDraw: 6,
    lastDrawDate: '19 Maggio 2026 (1-1 vs Spezia)',
    nextMatch: {
      opponent: 'Sudtirol',
      date: 'Domenica 23 Ago, 20:30',
      isHome: false,
    },
    historicalMaxWithoutDraw: 10,
  },
];

// Placeholder structure for "Alert pareggi frequenti"
const FREQUENT_DRAW_ALERTS_SAMPLE: FrequentDrawAlertItem[] = [
  {
    id: 'fda-1',
    leagueId: 'es-segunda-division',
    leagueName: 'Segunda División',
    countryFlag: '🇪🇸',
    teamName: 'Burgos CF',
    playedMatches: 24,
    drawsCount: 11,
    drawPercentage: 45.8,
    recentForm: ['D', 'D', 'W', 'D', 'L'],
    nextMatch: {
      opponent: 'Racing Santander',
      date: 'Sabato 22 Ago, 19:00',
      isHome: true,
    },
  },
  {
    id: 'fda-2',
    leagueId: 'it-serie-b',
    leagueName: 'Serie B',
    countryFlag: '🇮🇹',
    teamName: 'Cittadella',
    playedMatches: 24,
    drawsCount: 10,
    drawPercentage: 41.7,
    recentForm: ['D', 'L', 'D', 'W', 'D'],
    nextMatch: {
      opponent: 'Bari',
      date: 'Domenica 23 Ago, 15:00',
      isHome: false,
    },
  },
  {
    id: 'fda-3',
    leagueId: 'fr-ligue-2',
    leagueName: 'Ligue 2',
    countryFlag: '🇫🇷',
    teamName: 'Rodez AF',
    playedMatches: 22,
    drawsCount: 9,
    drawPercentage: 40.9,
    recentForm: ['W', 'D', 'D', 'L', 'D'],
    nextMatch: {
      opponent: 'Grenoble',
      date: 'Venerdì 21 Ago, 20:00',
      isHome: true,
    },
  },
  {
    id: 'fda-4',
    leagueId: 'it-serie-a',
    leagueName: 'Serie A',
    countryFlag: '🇮🇹',
    teamName: 'Genoa',
    playedMatches: 24,
    drawsCount: 9,
    drawPercentage: 37.5,
    recentForm: ['D', 'W', 'L', 'D', 'D'],
    nextMatch: {
      opponent: 'Verona',
      date: 'Sabato 22 Ago, 20:45',
      isHome: true,
    },
  },
  {
    id: 'fda-5',
    leagueId: 'de-bundesliga',
    leagueName: 'Bundesliga',
    countryFlag: '🇩🇪',
    teamName: 'Mainz 05',
    playedMatches: 22,
    drawsCount: 8,
    drawPercentage: 36.4,
    recentForm: ['L', 'D', 'D', 'W', 'D'],
    nextMatch: {
      opponent: 'Augsburg',
      date: 'Sabato 22 Ago, 15:30',
      isHome: false,
    },
  },
];

class DataService {
  private bets: Bet[] = [];
  private settings: AppSettings = DEFAULT_SETTINGS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedBets = localStorage.getItem('draw_alerts_bets');
        if (storedBets !== null) {
          const parsed = JSON.parse(storedBets);
          if (Array.isArray(parsed)) {
            this.bets = parsed;
          } else {
            this.bets = [];
          }
        } else {
          this.bets = [];
        }
        const storedSettings = localStorage.getItem('draw_alerts_settings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          if (parsedSettings && typeof parsedSettings === 'object') {
            this.settings = { ...DEFAULT_SETTINGS, ...parsedSettings };
          }
        }
      }
    } catch {
      this.bets = [];
    }
  }

  getDashboardStats(): DashboardStats {
    const total = this.bets.length;
    const won = this.bets.filter((b) => b.status === 'won').length;
    const lost = this.bets.filter((b) => b.status === 'lost').length;
    const pending = this.bets.filter((b) => b.status === 'pending').length;

    // Calcolo economico deterministico: la cassa NON viene modificata da scommesse "pending"
    // Varia solamente quando la scommessa viene regolata (won / lost)
    const wonProfit = this.bets
      .filter((b) => b.status === 'won')
      .reduce((acc, b) => acc + (b.netProfit !== undefined ? b.netProfit : (b.potentialPayout - b.stake)), 0);
    const lostLoss = this.bets
      .filter((b) => b.status === 'lost')
      .reduce((acc, b) => acc + b.stake, 0);

    const currentBankroll = Number((this.settings.initialBankroll + wonProfit - lostLoss).toFixed(2));

    return {
      currentBankroll,
      currency: this.settings.currency,
      totalBets: total,
      wonBets: won,
      lostBets: lost,
      pendingBets: pending,
      lastDataUpdate: '15 Ago 2026',
    };
  }

  getNoDrawAlerts(leagueFilter?: string, seasonFilter?: number): NoDrawAlertItem[] {
    const currentSeason = footballDataService.getCurrentSeason();
    const threshold = this.settings.noDrawAlertThreshold || 5;
    const raw = calculateAllLeaguesNoDrawAlerts(
      leagueFilter || 'all',
      threshold,
      seasonFilter || currentSeason
    );
    return raw.map((item) => ({
      id: `nda-${item.apiLeagueId}-${item.teamId}`,
      leagueId: item.leagueId,
      leagueName: item.leagueName,
      countryFlag: item.countryFlag,
      teamName: item.teamName,
      matchesWithoutDraw: item.current_no_draw_streak,
      lastDrawDate: item.last_draw_date || 'Nessun pareggio recente',
      nextMatch: item.nextMatch ? {
        opponent: item.nextMatch.opponentName,
        date: item.nextMatch.date,
        isHome: item.nextMatch.isHome,
      } : undefined,
      historicalMaxWithoutDraw: Math.max(item.current_no_draw_streak + 2, 8),
    }));
  }

  getFrequentDrawAlerts(
    leagueFilter?: string,
    seasonFilter?: number | 'all',
    matchesToAnalyze: number = 7,
    minDraws: number = 2,
    minPercentage: number = 0
  ): FrequentDrawAlertItem[] {
    const currentSeason = footballDataService.getCurrentSeason();
    const targetSeason = seasonFilter !== undefined ? seasonFilter : currentSeason;
    const raw = calculateAllLeaguesFrequentDraws(
      leagueFilter || 'all',
      targetSeason,
      matchesToAnalyze,
      minDraws
    );
    const filtered = minPercentage > 0
      ? raw.filter((item) => item.draw_percentage >= minPercentage)
      : raw;

    return filtered.map((item) => ({
      id: `fda-${item.apiLeagueId}-${item.teamId}`,
      leagueId: item.leagueId,
      leagueName: item.leagueName,
      countryFlag: item.countryFlag,
      teamName: item.teamName,
      playedMatches: item.matches_analyzed,
      drawsCount: item.draws,
      drawPercentage: item.draw_percentage,
      recentForm: item.analyzed_matches.slice(0, 5).map((m) => (m.outcome === 'X' ? 'D' : m.outcome)),
      nextMatch: item.nextMatch ? {
        opponent: item.nextMatch.opponentName,
        date: item.nextMatch.date,
        isHome: item.nextMatch.isHome,
      } : undefined,
    }));
  }

  getBets(): Bet[] {
    return [...this.bets];
  }

  addBet(betData: Omit<Bet, 'id' | 'createdAt'>): Bet {
    const potentialPayout = betData.potentialPayout !== undefined
      ? betData.potentialPayout
      : Number((betData.stake * betData.odds).toFixed(2));
    const netProfit = betData.netProfit !== undefined
      ? betData.netProfit
      : Number((potentialPayout - betData.stake).toFixed(2));
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBet: Bet = {
      ...betData,
      id: `bet-${Date.now()}`,
      status: 'pending',
      result_checked: false,
      potentialPayout,
      netProfit: betData.netProfit !== undefined ? betData.netProfit : netProfit,
      createdAt: formattedDate,
    };

    this.bets = [newBet, ...this.bets];
    this.persistBets();
    return newBet;
  }

  updateBetStatus(id: string, status: Bet['status']): boolean {
    const betIndex = this.bets.findIndex((b) => b.id === id);
    if (betIndex !== -1) {
      this.bets[betIndex] = settleBetManualStatus(this.bets[betIndex], status);
      this.persistBets();
      return true;
    }
    return false;
  }

  settleBetScore(id: string, homeGoals: number, awayGoals: number): boolean {
    const betIndex = this.bets.findIndex((b) => b.id === id);
    if (betIndex !== -1) {
      this.bets[betIndex] = settleBetWithScore(this.bets[betIndex], homeGoals, awayGoals, true);
      this.persistBets();
      return true;
    }
    return false;
  }

  settleAllPendingBetsAgainstFixtures(): {
    settledCount: number;
    wonCount: number;
    lostCount: number;
  } {
    const fixturesMap = generateInitialLeagueFixtures();
    // Crea una mappa o lista di tutte le partite concluse
    const finishedFixtures: {
      homeName: string;
      awayName: string;
      goalsHome: number;
      goalsAway: number;
      date: string;
    }[] = [];

    Object.values(fixturesMap).forEach((fixtures) => {
      fixtures.forEach((f) => {
        if (f.isFinished && f.goalsHome !== null && f.goalsAway !== null) {
          finishedFixtures.push({
            homeName: f.homeTeam.name.toLowerCase().trim(),
            awayName: f.awayTeam.name.toLowerCase().trim(),
            goalsHome: f.goalsHome,
            goalsAway: f.goalsAway,
            date: f.date,
          });
        }
      });
    });

    let settledCount = 0;
    let wonCount = 0;
    let lostCount = 0;

    this.bets = this.bets.map((bet) => {
      // Regola solo se in attesa (pending) e non ancora verificata
      if (bet.status !== 'pending' || bet.result_checked) {
        return bet;
      }

      const betHome = bet.homeTeam.toLowerCase().trim();
      const betAway = bet.awayTeam.toLowerCase().trim();

      // Trova la fixture corrispondente
      const matching = finishedFixtures.find(
        (f) =>
          (f.homeName === betHome && f.awayName === betAway) ||
          (betHome.includes(f.homeName) && betAway.includes(f.awayName)) ||
          (f.homeName.includes(betHome) && f.awayName.includes(betAway))
      );

      if (matching) {
        settledCount++;
        const settledBet = settleBetWithScore(bet, matching.goalsHome, matching.goalsAway, false);
        if (settledBet.status === 'won') wonCount++;
        if (settledBet.status === 'lost') lostCount++;
        return settledBet;
      }

      return bet;
    });

    if (settledCount > 0) {
      this.persistBets();
    }

    return { settledCount, wonCount, lostCount };
  }

  deleteBet(id: string): boolean {
    const initialLength = this.bets.length;
    this.bets = this.bets.filter((b) => b.id !== id);
    if (this.bets.length < initialLength) {
      this.persistBets();
      return true;
    }
    return false;
  }

  clearAllBets(): void {
    this.bets = [];
    this.persistBets();
  }


  setInitialBankroll(amount: number): number {
    const validAmount = Math.max(0, Number(amount) || 0);
    this.settings.initialBankroll = Number(validAmount.toFixed(2));
    this.persistSettings();
    return this.settings.initialBankroll;
  }

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch {
        // safe
      }
    });
  }

  private persistBets() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('draw_alerts_bets', JSON.stringify(this.bets));
      }
    } catch {
      // safe fallback
    }
    this.notify();
  }

  private persistSettings() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('draw_alerts_settings', JSON.stringify(this.settings));
      }
    } catch {
      // safe fallback
    }
    this.notify();
  }

  getAllMatchFixtures(leagueFilter?: string, seasonFilter?: number) {
    const targetSeason = seasonFilter || footballDataService.getCurrentSeason();
    const allFixtures: any[] = [];

    // Recupera le partite dal database gestito da footballDataService
    const leagues = footballDataService.getMonitoredLeagues();
    leagues.forEach((l) => {
      if (leagueFilter && leagueFilter !== 'all' && l.id !== leagueFilter) {
        return;
      }
      const fixtures = footballDataService.getFixtures(l.apiLeagueId, targetSeason);
      fixtures.forEach((f) => {
        allFixtures.push(f);
      });
    });

    // Se per qualche motivo è vuoto, fallback su initial
    if (allFixtures.length === 0) {
      const fixturesMap = generateInitialLeagueFixtures(targetSeason);
      Object.values(fixturesMap).forEach((fixtures) => {
        fixtures.forEach((f) => {
          if (leagueFilter && leagueFilter !== 'all' && f.leagueId !== leagueFilter) {
            return;
          }
          if (targetSeason && f.season !== targetSeason) {
            return;
          }
          allFixtures.push(f);
        });
      });
    }

    // Ordina per data decrescente (le più recenti/future prima)
    return allFixtures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...newSettings };
    return { ...this.settings };
  }

  async checkApiStatus(): Promise<{
    configured: boolean;
    valid?: boolean;
    message?: string;
    account?: any;
  }> {
    try {
      const res = await fetch('/api/football/status');
      if (!res.ok) {
        return {
          configured: false,
          message: 'Server non raggiungibile o errore di rete.',
        };
      }
      const data = await res.json();
      return {
        configured: data.configured ?? false,
        valid: data.valid,
        message: data.message || (data.valid ? 'API Key attiva e funzionante' : data.error),
        account: data.data?.account || data.data,
      };
    } catch {
      return {
        configured: false,
        message: 'Non è stato possibile contattare il backend proxy.',
      };
    }
  }
}

export const dataService = new DataService();
