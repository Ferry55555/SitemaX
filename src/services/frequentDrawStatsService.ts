import { MatchFixture } from '../types';
import { MONITORED_LEAGUES } from '../config/leagues';
import { OFFICIAL_LEAGUE_TEAMS } from '../data/initialLeagueFixtures';
import { footballDataService } from './footballDataService';
import { UpcomingMatchDetail } from './streakStatsService';
import { getCurrentFootballSeason } from '../utils/seasonUtils';

export interface FrequentDrawMatchDetail {
  fixtureId: number;
  date: string;
  round?: string;
  homeTeamName: string;
  awayTeamName: string;
  opponentId: number;
  opponentName: string;
  isHome: boolean;
  goalsHome: number;
  goalsAway: number;
  score: string;
  isDraw: boolean;
  outcome: 'W' | 'L' | 'X';
}

export interface FrequentDrawResult {
  teamId: number;
  teamName: string;
  leagueId: string;
  apiLeagueId: number;
  leagueName: string;
  countryFlag: string;
  seasonId: number;
  matches_analyzed: number;
  draws: number;
  draw_percentage: number;
  analyzed_matches: FrequentDrawMatchDetail[];
  nextMatch?: UpcomingMatchDetail | null;
  next3Matches: UpcomingMatchDetail[];
}

/**
 * Calcola in modo deterministico e matematico il numero di pareggi
 * e la percentuale di pareggi nelle ultime N partite della SPECIFICA COMPETIZIONE.
 *
 * REGOLA ASSOLUTA:
 * - Filtra SOLO partite con apiLeagueId === targetApiLeagueId
 * - Esclude categoricamente Champions, Europa League, Conference League, Coppe Nazionali, Amichevoli
 * - Non fa uso di intelligenza artificiale o dati approssimati.
 */
export function calculateFrequentDraws(
  teamId: number,
  leagueId: number | string,
  seasonId: number | 'all' = getCurrentFootballSeason(),
  matchesToAnalyze: number = 10,
  customFixtures?: MatchFixture[]
): FrequentDrawResult {
  const leagueConfig = typeof leagueId === 'number'
    ? MONITORED_LEAGUES.find((l) => l.apiLeagueId === leagueId)
    : MONITORED_LEAGUES.find((l) => l.id === leagueId || l.apiLeagueId === Number(leagueId));

  const targetApiLeagueId = leagueConfig?.apiLeagueId || (typeof leagueId === 'number' ? leagueId : 135);
  const targetLeagueName = leagueConfig?.name || 'Competizione';
  const targetCountryFlag = leagueConfig?.countryFlag || '⚽';
  const targetStringLeagueId = leagueConfig?.id || 'it-serie-a';

  // 1. Recupero di tutte le partite candidate
  const rawFixtures = customFixtures || footballDataService.getFixtures(
    targetApiLeagueId,
    seasonId === 'all' ? undefined : seasonId
  );

  // 2. FILTRO RIGOROSO: ESCLUSIVAMENTE la lega target e la stagione target (se specificata)
  // Rigorosamente dalla prima giornata (mese di Luglio dell'anno di inizio stagione)
  const seasonStartTimestamp = typeof seasonId === 'number' ? Date.UTC(seasonId, 6, 1, 0, 0, 0) : null;
  const seasonEndTimestamp = typeof seasonId === 'number' ? Date.UTC(seasonId + 1, 6, 1, 0, 0, 0) : null;

  const finishedLeagueMatches = rawFixtures.filter((m) => {
    if (m.apiLeagueId !== targetApiLeagueId) return false;
    if (seasonId !== 'all' && m.season !== seasonId) return false;
    if (seasonStartTimestamp && seasonEndTimestamp) {
      const matchTime = m.timestamp || new Date(m.date).getTime();
      if (matchTime < seasonStartTimestamp || matchTime >= seasonEndTimestamp) {
        return false;
      }
    }
    if (!m.isFinished) return false;
    return m.homeTeam.id === teamId || m.awayTeam.id === teamId;
  });

  // 3. Ordinamento cronologico decrescente (dalla più recente alla più vecchia)
  finishedLeagueMatches.sort((a, b) => {
    const timeA = a.timestamp || new Date(a.date).getTime();
    const timeB = b.timestamp || new Date(b.date).getTime();
    return timeB - timeA;
  });

  // 4. Estrazione della finestra di ultime N partite
  const windowMatches = finishedLeagueMatches.slice(0, Math.max(1, matchesToAnalyze));
  const matches_analyzed = windowMatches.length;

  let drawsCount = 0;
  const analyzed_matches: FrequentDrawMatchDetail[] = [];

  for (const m of windowMatches) {
    const isHome = m.homeTeam.id === teamId;
    const goalsHome = m.goalsHome ?? 0;
    const goalsAway = m.goalsAway ?? 0;
    const teamGoals = isHome ? goalsHome : goalsAway;
    const opponentGoals = isHome ? goalsAway : goalsHome;
    const opponentId = isHome ? m.awayTeam.id : m.homeTeam.id;
    const opponentName = isHome ? m.awayTeam.name : m.homeTeam.name;

    const isDraw = goalsHome === goalsAway;
    if (isDraw) {
      drawsCount++;
    }

    let outcome: 'W' | 'L' | 'X' = 'X';
    if (isDraw) {
      outcome = 'X';
    } else if (teamGoals > opponentGoals) {
      outcome = 'W';
    } else {
      outcome = 'L';
    }

    analyzed_matches.push({
      fixtureId: m.apiFixtureId || m.id,
      date: m.date,
      round: m.round,
      homeTeamName: m.homeTeam.name,
      awayTeamName: m.awayTeam.name,
      opponentId,
      opponentName,
      isHome,
      goalsHome,
      goalsAway,
      score: `${goalsHome}-${goalsAway}`,
      isDraw,
      outcome,
    });
  }

  // 5. Calcolo deterministico della percentuale
  const draw_percentage = matches_analyzed > 0
    ? Number(((drawsCount / matches_analyzed) * 100).toFixed(1))
    : 0;

  // Recupera il nome della squadra
  let teamName = `Team ${teamId}`;
  const teamList = OFFICIAL_LEAGUE_TEAMS[targetApiLeagueId] || [];
  const foundTeam = teamList.find((t) => t.id === teamId);
  if (foundTeam) {
    teamName = foundTeam.name;
  } else if (finishedLeagueMatches[0]) {
    teamName = finishedLeagueMatches[0].homeTeam.id === teamId
      ? finishedLeagueMatches[0].homeTeam.name
      : finishedLeagueMatches[0].awayTeam.name;
  }

  // 6. Prossime partite in programma ESCLUSIVAMENTE nella stessa competizione
  const upcomingMatches = (customFixtures || footballDataService.getUpcomingFixtures(targetApiLeagueId))
    .filter(
      (m) =>
        m.apiLeagueId === targetApiLeagueId &&
        (seasonId === 'all' || m.season === seasonId) &&
        (m.homeTeam.id === teamId || m.awayTeam.id === teamId)
    )
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  const next3Matches: UpcomingMatchDetail[] = upcomingMatches.slice(0, 3).map((m) => {
    const isHome = m.homeTeam.id === teamId;
    return {
      fixtureId: m.apiFixtureId || m.id,
      apiLeagueId: m.apiLeagueId,
      season: m.season,
      round: m.round,
      date: m.date,
      homeTeamName: m.homeTeam.name,
      awayTeamName: m.awayTeam.name,
      opponentId: isHome ? m.awayTeam.id : m.homeTeam.id,
      opponentName: isHome ? m.awayTeam.name : m.homeTeam.name,
      isHome,
    };
  });

  const next = next3Matches[0] || null;

  return {
    teamId,
    teamName,
    leagueId: targetStringLeagueId,
    apiLeagueId: targetApiLeagueId,
    leagueName: targetLeagueName,
    countryFlag: targetCountryFlag,
    seasonId: seasonId === 'all' ? getCurrentFootballSeason() : seasonId,
    matches_analyzed,
    draws: drawsCount,
    draw_percentage,
    analyzed_matches,
    nextMatch: next,
    next3Matches,
  };
}

/**
 * Calcola i pareggi frequenti per tutti i campionati o per un campionato specifico.
 * Filtra solo le squadre con:
 * draws >= minDraws
 *
 * Ordinamento:
 * 1. numero di pareggi decrescente
 * 2. percentuale decrescente
 * 3. nome squadra alfabetico
 */
export function calculateAllLeaguesFrequentDraws(
  leagueFilter: string = 'all',
  seasonFilter: number | 'all' = getCurrentFootballSeason(),
  matchesToAnalyze: number = 10,
  minDraws: number = 5,
  customFixtures?: MatchFixture[]
): FrequentDrawResult[] {
  const leaguesToScan = leagueFilter === 'all'
    ? MONITORED_LEAGUES
    : MONITORED_LEAGUES.filter((l) => l.id === leagueFilter || l.apiLeagueId === Number(leagueFilter));

  const results: FrequentDrawResult[] = [];

  for (const league of leaguesToScan) {
    const teams = footballDataService.getTeams(league.apiLeagueId);
    for (const team of teams) {
      const stats = calculateFrequentDraws(
        team.id,
        league.apiLeagueId,
        seasonFilter,
        matchesToAnalyze,
        customFixtures
      );

      // Criterio di inclusione: draws >= minDraws e almeno 1 match analizzato
      if (stats.draws >= minDraws && stats.matches_analyzed > 0) {
        results.push(stats);
      }
    }
  }

  // Ordinamento rigoroso:
  // 1. numero di pareggi decrescente
  // 2. percentuale decrescente
  // 3. nome squadra alfabetico
  results.sort((a, b) => {
    if (b.draws !== a.draws) {
      return b.draws - a.draws;
    }
    if (b.draw_percentage !== a.draw_percentage) {
      return b.draw_percentage - a.draw_percentage;
    }
    return a.teamName.localeCompare(b.teamName);
  });

  return results;
}
