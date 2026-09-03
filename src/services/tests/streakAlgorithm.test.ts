import { calculateNoDrawStreak } from '../streakStatsService';
import { MatchFixture } from '../../types';

/**
 * UNIT TEST SUITE PER L'ALGORITMO "ALLERT NON PAREGGIA DA"
 * 
 * Verifica deterministica di:
 * 1. Esempio esatto utente (V, V, V, V, V, X, V => Striscia: 5)
 * 2. Esclusione categorica di competizioni esterne (Champions League, Coppa Italia, ecc.)
 * 3. Arresto immediato al primo pareggio andando a ritroso
 * 4. Gestione di serie senza alcun pareggio nella stagione
 * 5. Gestione di pareggio nell'ultimo turno disputato (striscia 0)
 * 6. Filtraggio per stagione
 */

interface TestCaseResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  details?: string;
}

export function runAllStreakAlgorithmTests(): {
  total: number;
  passed: number;
  failed: number;
  results: TestCaseResult[];
} {
  const testResults: TestCaseResult[] = [];

  const TEAM_MILAN_ID = 489;
  const SERIE_A_ID = 135;
  const CHAMPIONS_LEAGUE_ID = 2;
  const COPPA_ITALIA_ID = 137;
  const SEASON = 2025;

  // Helper per costruire fixtures deterministiche di test
  function createTestFixture(opts: {
    id: number;
    leagueId: number;
    season?: number;
    date: string;
    timestamp: number;
    homeId: number;
    homeName: string;
    awayId: number;
    awayName: string;
    goalsHome: number;
    goalsAway: number;
  }): MatchFixture {
    const goalsHome = opts.goalsHome;
    const goalsAway = opts.goalsAway;
    const isDraw = goalsHome === goalsAway;

    return {
      id: opts.id,
      apiFixtureId: opts.id,
      apiLeagueId: opts.leagueId,
      leagueId: opts.leagueId === 135 ? 'it-serie-a' : 'other',
      leagueName: opts.leagueId === 135 ? 'Serie A' : 'Altra Competizione',
      countryFlag: '🇮🇹',
      season: opts.season || SEASON,
      round: 'Regular Season',
      date: opts.date,
      timestamp: opts.timestamp,
      status: 'Match Finished',
      statusShort: 'FT',
      homeTeam: { id: opts.homeId, name: opts.homeName },
      awayTeam: { id: opts.awayId, name: opts.awayName },
      goalsHome,
      goalsAway,
      isFinished: true,
      isDraw,
    };
  }

  // --------------------------------------------------------------------------
  // TEST 1: Esempio Esatto dell'Utente (V, V, V, V, V, X, V => Striscia = 5)
  // --------------------------------------------------------------------------
  {
    // Partite ordinate dal tempo più vecchio al più recente:
    // 1. V (Milan 2 - Inter 1) - T1
    // 2. X (Milan 1 - Roma 1) - T2 (Pareggio)
    // 3. V (Milan 3 - Napoli 0) - T3
    // 4. V (Juventus 0 - Milan 1) - T4
    // 5. V (Milan 2 - Torino 1) - T5
    // 6. V (Lazio 1 - Milan 2) - T6
    // 7. V (Milan 1 - Fiorentina 0) - T7 (più recente)
    const fixturesTest1: MatchFixture[] = [
      createTestFixture({
        id: 101,
        leagueId: SERIE_A_ID,
        date: '2025-09-01',
        timestamp: 1000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 991,
        awayName: 'Inter',
        goalsHome: 2,
        goalsAway: 1, // V
      }),
      createTestFixture({
        id: 102,
        leagueId: SERIE_A_ID,
        date: '2025-09-08',
        timestamp: 2000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 992,
        awayName: 'Roma',
        goalsHome: 1,
        goalsAway: 1, // X (Primo pareggio a ritroso)
      }),
      createTestFixture({
        id: 103,
        leagueId: SERIE_A_ID,
        date: '2025-09-15',
        timestamp: 3000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 993,
        awayName: 'Napoli',
        goalsHome: 3,
        goalsAway: 0, // V
      }),
      createTestFixture({
        id: 104,
        leagueId: SERIE_A_ID,
        date: '2025-09-22',
        timestamp: 4000,
        homeId: 994,
        homeName: 'Juventus',
        awayId: TEAM_MILAN_ID,
        awayName: 'Milan',
        goalsHome: 0,
        goalsAway: 1, // V
      }),
      createTestFixture({
        id: 105,
        leagueId: SERIE_A_ID,
        date: '2025-09-29',
        timestamp: 5000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 995,
        awayName: 'Torino',
        goalsHome: 2,
        goalsAway: 1, // V
      }),
      createTestFixture({
        id: 106,
        leagueId: SERIE_A_ID,
        date: '2025-10-06',
        timestamp: 6000,
        homeId: 996,
        homeName: 'Lazio',
        awayId: TEAM_MILAN_ID,
        awayName: 'Milan',
        goalsHome: 1,
        goalsAway: 2, // V
      }),
      createTestFixture({
        id: 107,
        leagueId: SERIE_A_ID,
        date: '2025-10-13',
        timestamp: 7000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 997,
        awayName: 'Fiorentina',
        goalsHome: 1,
        goalsAway: 0, // V (più recente)
      }),
    ];

    const result = calculateNoDrawStreak(TEAM_MILAN_ID, SERIE_A_ID, SEASON, fixturesTest1);

    const isMatch =
      result.current_no_draw_streak === 5 &&
      result.last_draw_date === '2025-09-08' &&
      result.matches_analyzed === 7 &&
      result.streak_matches.length === 5;

    testResults.push({
      name: 'Test 1: Esempio esatto utente (V, V, V, V, V, X, V => Striscia = 5)',
      passed: isMatch,
      expected: { current_no_draw_streak: 5, last_draw_date: '2025-09-08', matches_analyzed: 7 },
      actual: {
        current_no_draw_streak: result.current_no_draw_streak,
        last_draw_date: result.last_draw_date,
        matches_analyzed: result.matches_analyzed,
      },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 2: Esclusione Categorica di Champions League e Coppe nel Mezzo
  // --------------------------------------------------------------------------
  {
    // Serie A:
    // T1: Serie A (X) 1-1
    // T2: Champions League (X) 0-0 -> DA IGNORARE ASSOLUTAMENTE!
    // T3: Coppa Italia (X) 2-2 -> DA IGNORARE ASSOLUTAMENTE!
    // T4: Serie A (V) 2-1
    // T5: Champions League (V) 3-0 -> DA IGNORARE!
    // T6: Serie A (P) 0-1 (Sconfitta = NON pareggio, aumenta la striscia)
    // T7: Serie A (V) 1-0 (più recente)
    //
    // Nelle sole partite di Serie A a ritroso abbiamo: T7 (V), T6 (P), T4 (V) -> 3 partite senza pareggio, poi T1 (X) ferma la serie.
    // Risultato atteso per Serie A: Striscia = 3!
    const fixturesTest2: MatchFixture[] = [
      createTestFixture({
        id: 201,
        leagueId: SERIE_A_ID,
        date: '2025-09-01',
        timestamp: 1000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 991,
        awayName: 'Inter',
        goalsHome: 1,
        goalsAway: 1, // X in Serie A (Data: 2025-09-01)
      }),
      createTestFixture({
        id: 202,
        leagueId: CHAMPIONS_LEAGUE_ID, // CHAMPIONS LEAGUE
        date: '2025-09-10',
        timestamp: 2000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 881,
        awayName: 'Real Madrid',
        goalsHome: 0,
        goalsAway: 0, // X in Champions League (DA IGNORARE)
      }),
      createTestFixture({
        id: 203,
        leagueId: COPPA_ITALIA_ID, // COPPA ITALIA
        date: '2025-09-17',
        timestamp: 3000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 882,
        awayName: 'Sassuolo',
        goalsHome: 2,
        goalsAway: 2, // X in Coppa Italia (DA IGNORARE)
      }),
      createTestFixture({
        id: 204,
        leagueId: SERIE_A_ID,
        date: '2025-09-24',
        timestamp: 4000,
        homeId: 992,
        homeName: 'Roma',
        awayId: TEAM_MILAN_ID,
        awayName: 'Milan',
        goalsHome: 1,
        goalsAway: 2, // V in Serie A
      }),
      createTestFixture({
        id: 205,
        leagueId: CHAMPIONS_LEAGUE_ID, // CHAMPIONS LEAGUE
        date: '2025-10-01',
        timestamp: 5000,
        homeId: 883,
        homeName: 'PSG',
        awayId: TEAM_MILAN_ID,
        awayName: 'Milan',
        goalsHome: 0,
        goalsAway: 3, // V in Champions League (DA IGNORARE)
      }),
      createTestFixture({
        id: 206,
        leagueId: SERIE_A_ID,
        date: '2025-10-08',
        timestamp: 6000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 993,
        awayName: 'Napoli',
        goalsHome: 0,
        goalsAway: 1, // P in Serie A (Sconfitta = non pareggio)
      }),
      createTestFixture({
        id: 207,
        leagueId: SERIE_A_ID,
        date: '2025-10-15',
        timestamp: 7000,
        homeId: 994,
        homeName: 'Juventus',
        awayId: TEAM_MILAN_ID,
        awayName: 'Milan',
        goalsHome: 1,
        goalsAway: 2, // V in Serie A (più recente)
      }),
    ];

    const result = calculateNoDrawStreak(TEAM_MILAN_ID, SERIE_A_ID, SEASON, fixturesTest2);

    const isMatch =
      result.current_no_draw_streak === 3 &&
      result.last_draw_date === '2025-09-01' &&
      result.matches_analyzed === 4; // Solo le 4 partite di Serie A

    testResults.push({
      name: 'Test 2: Esclusione totale Champions League e Coppa Italia',
      passed: isMatch,
      expected: { current_no_draw_streak: 3, last_draw_date: '2025-09-01', matches_analyzed: 4 },
      actual: {
        current_no_draw_streak: result.current_no_draw_streak,
        last_draw_date: result.last_draw_date,
        matches_analyzed: result.matches_analyzed,
      },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 3: Pareggio nell'ultimo match disputato (Striscia = 0)
  // --------------------------------------------------------------------------
  {
    const fixturesTest3: MatchFixture[] = [
      createTestFixture({
        id: 301,
        leagueId: SERIE_A_ID,
        date: '2025-09-01',
        timestamp: 1000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 991,
        awayName: 'Inter',
        goalsHome: 2,
        goalsAway: 0, // V
      }),
      createTestFixture({
        id: 302,
        leagueId: SERIE_A_ID,
        date: '2025-09-08',
        timestamp: 2000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 992,
        awayName: 'Roma',
        goalsHome: 1,
        goalsAway: 1, // X (più recente)
      }),
    ];

    const result = calculateNoDrawStreak(TEAM_MILAN_ID, SERIE_A_ID, SEASON, fixturesTest3);

    const isMatch =
      result.current_no_draw_streak === 0 &&
      result.last_draw_date === '2025-09-08' &&
      result.matches_analyzed === 2;

    testResults.push({
      name: 'Test 3: Pareggio al turno più recente (Striscia = 0)',
      passed: isMatch,
      expected: { current_no_draw_streak: 0, last_draw_date: '2025-09-08', matches_analyzed: 2 },
      actual: {
        current_no_draw_streak: result.current_no_draw_streak,
        last_draw_date: result.last_draw_date,
        matches_analyzed: result.matches_analyzed,
      },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 4: Nessun pareggio nell'intera stagione (Striscia = totale partite)
  // --------------------------------------------------------------------------
  {
    const fixturesTest4: MatchFixture[] = [
      createTestFixture({
        id: 401,
        leagueId: SERIE_A_ID,
        date: '2025-09-01',
        timestamp: 1000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 991,
        awayName: 'Inter',
        goalsHome: 2,
        goalsAway: 1,
      }),
      createTestFixture({
        id: 402,
        leagueId: SERIE_A_ID,
        date: '2025-09-08',
        timestamp: 2000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 992,
        awayName: 'Roma',
        goalsHome: 0,
        goalsAway: 3, // P
      }),
      createTestFixture({
        id: 403,
        leagueId: SERIE_A_ID,
        date: '2025-09-15',
        timestamp: 3000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 993,
        awayName: 'Napoli',
        goalsHome: 1,
        goalsAway: 0, // V
      }),
    ];

    const result = calculateNoDrawStreak(TEAM_MILAN_ID, SERIE_A_ID, SEASON, fixturesTest4);

    const isMatch =
      result.current_no_draw_streak === 3 &&
      result.last_draw_date === null &&
      result.matches_analyzed === 3;

    testResults.push({
      name: 'Test 4: Nessun pareggio nella stagione (Striscia = 3, last_draw_date = null)',
      passed: isMatch,
      expected: { current_no_draw_streak: 3, last_draw_date: null, matches_analyzed: 3 },
      actual: {
        current_no_draw_streak: result.current_no_draw_streak,
        last_draw_date: result.last_draw_date,
        matches_analyzed: result.matches_analyzed,
      },
    });
  }

  // --------------------------------------------------------------------------
  // TEST 5: Filtro Stagione (Stagione precedente ignorata)
  // --------------------------------------------------------------------------
  {
    const fixturesTest5: MatchFixture[] = [
      createTestFixture({
        id: 501,
        leagueId: SERIE_A_ID,
        season: 2024, // STAGIONE PRECEDENTE (DA IGNORARE)
        date: '2024-05-15',
        timestamp: 500,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 991,
        awayName: 'Inter',
        goalsHome: 1,
        goalsAway: 1, // X
      }),
      createTestFixture({
        id: 502,
        leagueId: SERIE_A_ID,
        season: 2025, // STAGIONE ATTUALE
        date: '2025-09-01',
        timestamp: 1000,
        homeId: TEAM_MILAN_ID,
        homeName: 'Milan',
        awayId: 992,
        awayName: 'Roma',
        goalsHome: 2,
        goalsAway: 1, // V
      }),
    ];

    const result = calculateNoDrawStreak(TEAM_MILAN_ID, SERIE_A_ID, 2025, fixturesTest5);

    const isMatch =
      result.current_no_draw_streak === 1 &&
      result.last_draw_date === null &&
      result.matches_analyzed === 1;

    testResults.push({
      name: 'Test 5: Isolamento per stagione (stagione precedente esclusa)',
      passed: isMatch,
      expected: { current_no_draw_streak: 1, last_draw_date: null, matches_analyzed: 1 },
      actual: {
        current_no_draw_streak: result.current_no_draw_streak,
        last_draw_date: result.last_draw_date,
        matches_analyzed: result.matches_analyzed,
      },
    });
  }

  const passed = testResults.filter((t) => t.passed).length;
  const failed = testResults.filter((t) => !t.passed).length;

  return {
    total: testResults.length,
    passed,
    failed,
    results: testResults,
  };
}

// Se eseguito direttamente via tsx / node
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('streakAlgorithm.test')) {
  console.log('=== ESECUZIONE TEST AUTOMATICI ALGORITMO NON PAREGGIA DA ===');
  const outcome = runAllStreakAlgorithmTests();
  outcome.results.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.passed ? 'PASSED ✅' : 'FAILED ❌'}] ${r.name}`);
    if (!r.passed) {
      console.log('   Expected:', JSON.stringify(r.expected));
      console.log('   Actual:  ', JSON.stringify(r.actual));
    }
  });
  console.log(`\nRisultato: ${outcome.passed}/${outcome.total} test superati con successo.`);
  if (outcome.failed > 0) {
    process.exit(1);
  }
}
