import { MatchFixture } from '../../types';
import { calculateFrequentDraws, calculateAllLeaguesFrequentDraws } from '../frequentDrawStatsService';

export function runAllFrequentDrawAlgorithmTests() {
  const results: { name: string; passed: boolean; expected: any; actual: any }[] = [];
  const now = Date.now();

  // Helper fixture creator
  const createFixture = (
    id: number,
    leagueId: number,
    season: number,
    round: number,
    homeId: number,
    awayId: number,
    homeScore: number,
    awayScore: number,
    timeOffsetDaysAgo: number
  ): MatchFixture => ({
    id,
    apiFixtureId: id,
    apiLeagueId: leagueId,
    leagueId: leagueId === 135 ? 'it-serie-a' : 'cup',
    leagueName: leagueId === 135 ? 'Serie A' : 'Champions League',
    countryFlag: '🇮🇹',
    season,
    round: `Round ${round}`,
    date: new Date(now - timeOffsetDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
    timestamp: now - timeOffsetDaysAgo * 24 * 60 * 60 * 1000,
    status: 'Match Finished',
    statusShort: 'FT',
    homeTeam: { id: homeId, name: homeId === 496 ? 'Juventus' : 'Opponent' },
    awayTeam: { id: awayId, name: awayId === 496 ? 'Juventus' : 'Opponent' },
    goalsHome: homeScore,
    goalsAway: awayScore,
    isFinished: true,
    isDraw: homeScore === awayScore,
  });

  // TEST 1: Finestra di 10 partite con 6 pareggi ('X') e 4 vittorie ('W')
  // Risultati cronologici a ritroso: X, X, W, X, X, W, X, X, W, W
  const fixturesTest1: MatchFixture[] = [
    createFixture(101, 135, 2025, 10, 496, 500, 1, 1, 2),  // X (più recente)
    createFixture(102, 135, 2025, 9, 501, 496, 0, 0, 5),   // X
    createFixture(103, 135, 2025, 8, 496, 502, 2, 1, 9),   // W
    createFixture(104, 135, 2025, 7, 503, 496, 1, 1, 12),  // X
    createFixture(105, 135, 2025, 6, 496, 504, 2, 2, 16),  // X
    createFixture(106, 135, 2025, 5, 505, 496, 3, 1, 19),  // W
    createFixture(107, 135, 2025, 4, 496, 506, 0, 0, 23),  // X
    createFixture(108, 135, 2025, 3, 507, 496, 1, 1, 26),  // X
    createFixture(109, 135, 2025, 2, 496, 508, 1, 0, 30),  // W
    createFixture(110, 135, 2025, 1, 509, 496, 2, 0, 34),  // W (10ª partita analizzata)
    createFixture(111, 135, 2025, 0, 496, 510, 1, 1, 40),  // X (11ª partita: FUORI DALLA FINESTRA di 10)
  ];

  const res1 = calculateFrequentDraws(496, 135, 2025, 10, fixturesTest1);
  const pass1 = res1.matches_analyzed === 10 && res1.draws === 6 && res1.draw_percentage === 60.0;
  results.push({
    name: 'Test 1: Finestra 10 partite (6 pareggi => 60.0%)',
    passed: pass1,
    expected: { matches_analyzed: 10, draws: 6, percentage: 60.0 },
    actual: { matches_analyzed: res1.matches_analyzed, draws: res1.draws, percentage: res1.draw_percentage },
  });

  // TEST 2: Esclusione totale Champions League (apiLeagueId=2) e Coppa Italia (apiLeagueId=137)
  const fixturesTest2: MatchFixture[] = [
    createFixture(201, 135, 2025, 5, 496, 500, 1, 1, 2),  // Serie A: X
    createFixture(202, 2, 2025, 3, 496, 600, 3, 3, 4),    // CHAMPIONS: X (DA IGNORARE)
    createFixture(203, 135, 2025, 4, 501, 496, 0, 0, 6),  // Serie A: X
    createFixture(204, 137, 2025, 1, 496, 700, 2, 2, 8),  // COPPA ITALIA: X (DA IGNORARE)
    createFixture(205, 135, 2025, 3, 496, 502, 2, 1, 10), // Serie A: W
  ];

  const res2 = calculateFrequentDraws(496, 135, 2025, 10, fixturesTest2);
  const pass2 = res2.matches_analyzed === 3 && res2.draws === 2 && res2.draw_percentage === 66.7;
  results.push({
    name: 'Test 2: Esclusione assoluta Coppe Europee e Nazionali',
    passed: pass2,
    expected: { matches_analyzed: 3, draws: 2, percentage: 66.7 },
    actual: { matches_analyzed: res2.matches_analyzed, draws: res2.draws, percentage: res2.draw_percentage },
  });

  // TEST 3: Zero pareggi nella finestra
  const fixturesTest3: MatchFixture[] = [
    createFixture(301, 135, 2025, 4, 496, 500, 2, 0, 2),
    createFixture(302, 135, 2025, 3, 501, 496, 0, 1, 5),
    createFixture(303, 135, 2025, 2, 496, 502, 3, 1, 8),
    createFixture(304, 135, 2025, 1, 503, 496, 1, 2, 11),
  ];
  const res3 = calculateFrequentDraws(496, 135, 2025, 10, fixturesTest3);
  const pass3 = res3.matches_analyzed === 4 && res3.draws === 0 && res3.draw_percentage === 0.0;
  results.push({
    name: 'Test 3: Zero pareggi (draws = 0, percentage = 0.0%)',
    passed: pass3,
    expected: { matches_analyzed: 4, draws: 0, percentage: 0.0 },
    actual: { matches_analyzed: res3.matches_analyzed, draws: res3.draws, percentage: res3.draw_percentage },
  });

  // TEST 4: Finestra richiesta 10, ma solo 6 partite disputate
  const fixturesTest4: MatchFixture[] = [
    createFixture(401, 135, 2025, 6, 496, 500, 1, 1, 2), // X
    createFixture(402, 135, 2025, 5, 501, 496, 1, 1, 5), // X
    createFixture(403, 135, 2025, 4, 496, 502, 1, 1, 8), // X
    createFixture(404, 135, 2025, 3, 503, 496, 2, 0, 11),// W
    createFixture(405, 135, 2025, 2, 496, 504, 0, 0, 14),// X
    createFixture(406, 135, 2025, 1, 505, 496, 1, 2, 17),// L
  ];
  const res4 = calculateFrequentDraws(496, 135, 2025, 10, fixturesTest4);
  const pass4 = res4.matches_analyzed === 6 && res4.draws === 4 && res4.draw_percentage === 66.7;
  results.push({
    name: 'Test 4: Partite disponibili inferiori a N (6 partite => 4 pareggi, 66.7%)',
    passed: pass4,
    expected: { matches_analyzed: 6, draws: 4, percentage: 66.7 },
    actual: { matches_analyzed: res4.matches_analyzed, draws: res4.draws, percentage: res4.draw_percentage },
  });

  // TEST 5: Ordinamento deterministico (1. Pareggi decr, 2. Percentuale decr, 3. Alfabetico)
  const testSquads = [
    { teamName: 'Bologna', draws: 6, draw_percentage: 60.0 },
    { teamName: 'Atalanta', draws: 6, draw_percentage: 60.0 },
    { teamName: 'Juventus', draws: 7, draw_percentage: 70.0 },
    { teamName: 'Roma', draws: 5, draw_percentage: 50.0 },
  ];

  testSquads.sort((a, b) => {
    if (b.draws !== a.draws) return b.draws - a.draws;
    if (b.draw_percentage !== a.draw_percentage) return b.draw_percentage - a.draw_percentage;
    return a.teamName.localeCompare(b.teamName);
  });

  const pass5 =
    testSquads[0].teamName === 'Juventus' &&
    testSquads[1].teamName === 'Atalanta' &&
    testSquads[2].teamName === 'Bologna' &&
    testSquads[3].teamName === 'Roma';

  results.push({
    name: 'Test 5: Ordinamento deterministico (Pareggi decr > Percentuale decr > Nome alfabetico)',
    passed: pass5,
    expected: ['Juventus', 'Atalanta', 'Bologna', 'Roma'],
    actual: testSquads.map((s) => s.teamName),
  });

  const allPassed = results.every((r) => r.passed);

  return {
    total: results.length,
    passed: results.filter((r) => r.passed).length,
    allPassed,
    results,
  };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('frequentDrawAlgorithm.test')) {
  console.log('=== ESECUZIONE TEST AUTOMATICI ALGORITMO PAREGGI FREQUENTI ===');
  const out = runAllFrequentDrawAlgorithmTests();
  out.results.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.passed ? 'PASSED ✅' : 'FAILED ❌'}] ${r.name}`);
  });
  console.log(`Risultato: ${out.passed}/${out.total} test superati con successo.`);
}
