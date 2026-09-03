import {
  getLeagueByApiId,
  getLeagueById,
  isAllowedApiLeagueId,
  MONITORED_LEAGUES,
} from '../config/leagues';
import { MatchFixture } from '../types';
import { footballDataService } from './footballDataService';

export interface StreakMatchDetail {
  fixtureId: number;
  apiLeagueId: number;
  season: number;
  date: string;
  opponentId: number;
  opponentName: string;
  isHome: boolean;
  score: string;
  outcome: 'W' | 'L' | 'D'; // V = Vittoria, P = Sconfitta, X = Pareggio
  isDraw: boolean;
}

export interface UpcomingMatchDetail {
  fixtureId: number;
  apiLeagueId: number;
  season: number;
  round?: string;
  date: string;
  homeTeamName: string;
  awayTeamName: string;
  opponentId: number;
  opponentName: string;
  isHome: boolean;
}

export interface NoDrawStreakResult {
  teamId: number;
  teamName: string;
  leagueId: string;
  apiLeagueId: number;
  leagueName: string;
  countryFlag: string;
  seasonId: number;
  current_no_draw_streak: number;
  last_draw_date: string | null;
  last_draw_match: StreakMatchDetail | null;
  matches_analyzed: number;
  streak_matches: StreakMatchDetail[];
  nextMatch?: UpcomingMatchDetail | null;
  next3Matches: UpcomingMatchDetail[];
}

/**
 * Funzione puramente deterministica e matematica per calcolare l'esito di una partita
 * per una specifica squadra (W = Vittoria, L = Sconfitta, D = Pareggio/X).
 */
export function getMatchOutcomeForTeam(
  match: MatchFixture,
  teamId: number
): { outcome: 'W' | 'L' | 'D'; isDraw: boolean; isHome: boolean; opponentId: number; opponentName: string } {
  const isHome = match.homeTeam.id === teamId;
  const opponentId = isHome ? match.awayTeam.id : match.homeTeam.id;
  const opponentName = isHome ? match.awayTeam.name : match.homeTeam.name;

  const homeGoals = match.goalsHome ?? 0;
  const awayGoals = match.goalsAway ?? 0;

  if (homeGoals === awayGoals) {
    return { outcome: 'D', isDraw: true, isHome, opponentId, opponentName };
  }

  const teamWon = isHome ? homeGoals > awayGoals : awayGoals > homeGoals;
  return {
    outcome: teamWon ? 'W' : 'L',
    isDraw: false,
    isHome,
    opponentId,
    opponentName,
  };
}

/**
 * ALGORITMO DETERMINISTICO: ALLERT NON PAREGGIA DA
 * 
 * Regola Assoluta:
 * - Utilizza ESCLUSIVAMENTE le partite della specifica competizione (leagueId).
 * - Qualsiasi match di Champions League, Coppa Italia, amichevoli o altre leghe
 *   viene categoricamente escluso direttamente dal filtro.
 * 
 * Passaggi dell'algoritmo:
 * 1. Recupera le partite concluse della specifica competizione.
 * 2. Filtra rigorosamente per stagione (seasonId).
 * 3. Ordina dalla più recente alla più vecchia (timestamp decrescente).
 * 4. Parte dalla partita più recente.
 * 5. Se il risultato NON è un pareggio, aumenta il contatore (current_no_draw_streak++).
 * 6. Continua con la precedente partita della stessa competizione.
 * 7. Si FERMA non appena viene trovato il primo pareggio (X).
 * 
 * @param teamId ID univoco della squadra
 * @param leagueId ID ufficiale API-Football (es. 135) oppure slug interno (es. 'it-serie-a')
 * @param seasonId Anno della stagione (default: stagione corrente)
 * @param customFixtures Opzionale: array di partite personalizzate per test unitari e simulazioni
 */
export function calculateNoDrawStreak(
  teamId: number,
  leagueId: number | string,
  seasonId?: number,
  customFixtures?: MatchFixture[]
): NoDrawStreakResult {
  // Risoluzione e validazione rigorosa della lega
  let resolvedLeague = typeof leagueId === 'number'
    ? getLeagueByApiId(leagueId)
    : getLeagueById(leagueId) || getLeagueByApiId(Number(leagueId));

  if (!resolvedLeague) {
    // Se non trovata nelle 10, fallback alla prima monitorata
    resolvedLeague = MONITORED_LEAGUES[0];
  }

  const targetApiLeagueId = resolvedLeague.apiLeagueId;
  const targetSeason = seasonId || footballDataService.getCurrentSeason();

  // 1. Recupera tutte le partite candidate (dal database o dal set custom per i test)
  const allFixtures: MatchFixture[] = customFixtures || footballDataService.getFixtures(targetApiLeagueId, targetSeason);

  // 2. FILTRO RIGIDO DETERMINISTICO:
  // - Solo la competizione target (esclude categoricamente tutte le altre competizioni, coppe, amichevoli)
  // - Solo la stagione specificata
  // - Rigorosamente a partire dalla prima giornata (mese di Luglio dell'anno di inizio stagione)
  //   Tutte le partite giocate prima di Luglio dell'anno appartengono alla stagione precedente e vengono escluse.
  // - Solo partite concluse con punteggio valido
  // - Solo partite in cui ha giocato la squadra target
  const seasonStartTimestamp = Date.UTC(targetSeason, 6, 1, 0, 0, 0); // 1° Luglio
  const seasonEndTimestamp = Date.UTC(targetSeason + 1, 6, 1, 0, 0, 0); // 1° Luglio anno successivo

  const finishedLeagueMatches = allFixtures.filter((match) => {
    // Verifica rigorosa ID competizione
    if (Number(match.apiLeagueId) !== targetApiLeagueId) {
      return false;
    }
    // Verifica rigorosa stagione
    if (Number(match.season) !== targetSeason) {
      return false;
    }
    // Verifica rigorosa data: solo partite a partire da Luglio della stagione target
    const matchTime = match.timestamp || new Date(match.date).getTime();
    if (matchTime < seasonStartTimestamp || matchTime >= seasonEndTimestamp) {
      return false;
    }
    // Verifica che la partita sia conclusa
    if (!match.isFinished || match.goalsHome === null || match.goalsAway === null) {
      return false;
    }
    // Verifica che la squadra target abbia partecipato alla partita
    const isParticipant = match.homeTeam.id === teamId || match.awayTeam.id === teamId;
    return isParticipant;
  });

  // 3. ORDINAMENTO: Dalla più recente alla più vecchia
  finishedLeagueMatches.sort((a, b) => {
    const timeA = a.timestamp || new Date(a.date).getTime();
    const timeB = b.timestamp || new Date(b.date).getTime();
    return timeB - timeA; // Discendente (newest first)
  });

  // 4, 5, 6, 7. ESECUZIONE CICLO DI CALCOLO STRISCIA
  let current_no_draw_streak = 0;
  let last_draw_date: string | null = null;
  let last_draw_match: StreakMatchDetail | null = null;
  const streak_matches: StreakMatchDetail[] = [];

  let resolvedTeamName = '';

  for (let i = 0; i < finishedLeagueMatches.length; i++) {
    const match = finishedLeagueMatches[i];
    const { outcome, isDraw, isHome, opponentId, opponentName } = getMatchOutcomeForTeam(match, teamId);

    if (!resolvedTeamName) {
      resolvedTeamName = isHome ? match.homeTeam.name : match.awayTeam.name;
    }

    const detail: StreakMatchDetail = {
      fixtureId: match.apiFixtureId || match.id,
      apiLeagueId: match.apiLeagueId,
      season: match.season,
      date: match.date,
      opponentId,
      opponentName,
      isHome,
      score: `${match.goalsHome}-${match.goalsAway}`,
      outcome,
      isDraw,
    };

    if (!isDraw) {
      // Se NON è pareggio: aumenta contatore e continua
      current_no_draw_streak++;
      streak_matches.push(detail);
    } else {
      // Si ferma al primo pareggio incontrato a ritroso
      last_draw_date = match.date;
      last_draw_match = detail;
      break;
    }
  }

  // Se non abbiamo ancora il nome squadra (es. 0 partite giocate)
  if (!resolvedTeamName) {
    const teamObj = allFixtures.find(
      (f) => f.homeTeam.id === teamId || f.awayTeam.id === teamId
    );
    if (teamObj) {
      resolvedTeamName = teamObj.homeTeam.id === teamId ? teamObj.homeTeam.name : teamObj.awayTeam.name;
    } else {
      resolvedTeamName = `Squadra #${teamId}`;
    }
  }

  // Recupera le prossime partite in programma ESCLUSIVAMENTE nella stessa competizione e stagione
  const upcomingMatches = (customFixtures || footballDataService.getUpcomingFixtures(targetApiLeagueId))
    .filter(
      (m) =>
        Number(m.apiLeagueId) === targetApiLeagueId &&
        Number(m.season) === targetSeason &&
        !m.isFinished &&
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
    teamName: resolvedTeamName,
    leagueId: resolvedLeague.id,
    apiLeagueId: targetApiLeagueId,
    leagueName: resolvedLeague.name,
    countryFlag: resolvedLeague.countryFlag,
    seasonId: targetSeason,
    current_no_draw_streak,
    last_draw_date,
    last_draw_match,
    matches_analyzed: finishedLeagueMatches.length,
    streak_matches,
    nextMatch: next,
    next3Matches,
  };
}

/**
 * Calcola la classifica completa degli alert "Non Pareggia Da" per tutte le squadre
 * di una lega o di tutte le 10 leghe monitorate.
 */
export function calculateAllLeaguesNoDrawAlerts(
  leagueFilter: string = 'all',
  minStreak: number = 0,
  seasonId?: number
): NoDrawStreakResult[] {
  const targetLeagues = leagueFilter === 'all'
    ? MONITORED_LEAGUES
    : MONITORED_LEAGUES.filter((l) => l.id === leagueFilter || String(l.apiLeagueId) === leagueFilter);

  const results: NoDrawStreakResult[] = [];

  targetLeagues.forEach((league) => {
    const teams = footballDataService.getTeams(league.apiLeagueId);
    teams.forEach((team) => {
      const streak = calculateNoDrawStreak(team.id, league.apiLeagueId, seasonId);
      if (streak.current_no_draw_streak >= minStreak && streak.matches_analyzed > 0) {
        results.push(streak);
      }
    });
  });

  // Ordina per striscia decrescente (la più lunga in cima)
  return results.sort((a, b) => b.current_no_draw_streak - a.current_no_draw_streak);
}
