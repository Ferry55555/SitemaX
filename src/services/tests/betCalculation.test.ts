import {
  calculateBetEconomics,
  calculateBankrollEconomics,
  settleBetWithScore,
  settleBetManualStatus,
} from '../betCalculationService';
import { Bet } from '../../types';

export function runAllBetCalculationTests() {
  const results: { name: string; passed: boolean; expected: any; actual: any }[] = [];

  // TEST 1: Esempio esatto da specifiche utente (quota = 2.80, potenziale vincita / guadagno netto = €100)
  // stake = 100 / (2.80 - 1) = 55.5555... => €55.56
  // totalReturn = 55.56 * 2.80 = 155.568 => €155.57
  // netProfit = 155.57 - 55.56 = €100.01
  const calc1 = calculateBetEconomics(100, 2.80, 1000);
  const pass1 =
    calc1.stake === 55.56 &&
    calc1.totalReturn === 155.57 &&
    calc1.netProfit === 100.01 &&
    calc1.isStakeExceeding === false;

  results.push({
    name: 'Test 1: Calcolo esatto da specifiche (Quota 2.80, Guadagno €100 => Puntata €55.56)',
    passed: pass1,
    expected: { stake: 55.56, totalReturn: 155.57, netProfit: 100.01, isStakeExceeding: false },
    actual: { stake: calc1.stake, totalReturn: calc1.totalReturn, netProfit: calc1.netProfit, isStakeExceeding: calc1.isStakeExceeding },
  });

  // TEST 2: Controllo superamento cassa attuale (stake > current_bankroll)
  const calc2 = calculateBetEconomics(100, 2.80, 50); // Cassa attuale = €50, Puntata = €55.56
  const pass2 = calc2.stake === 55.56 && calc2.isStakeExceeding === true;

  results.push({
    name: 'Test 2: Rilevamento puntata che supera la cassa attuale (€55.56 > €50.00)',
    passed: pass2,
    expected: { isStakeExceeding: true },
    actual: { isStakeExceeding: calc2.isStakeExceeding },
  });

  // TEST 3: Invarianza della cassa all'inserimento di scommesse in stato "pending"
  const pendingBets: Bet[] = [
    {
      id: 'bet-1',
      leagueId: 'it-serie-a',
      leagueName: 'Serie A',
      countryFlag: '🇮🇹',
      season: 2025,
      homeTeam: 'Milan',
      awayTeam: 'Inter',
      matchDate: '2026-08-20',
      betType: '1X2_DRAW',
      odds: 3.20,
      stake: 45.45,
      targetProfit: 100,
      potentialPayout: 145.44,
      netProfit: 99.99,
      status: 'pending',
      result_checked: false,
      createdAt: '2026-08-15',
    },
    {
      id: 'bet-2',
      leagueId: 'it-serie-a',
      leagueName: 'Serie A',
      countryFlag: '🇮🇹',
      season: 2025,
      homeTeam: 'Juventus',
      awayTeam: 'Roma',
      matchDate: '2026-08-21',
      betType: '1X2_DRAW',
      odds: 2.90,
      stake: 52.63,
      targetProfit: 100,
      potentialPayout: 152.63,
      netProfit: 100.00,
      status: 'pending',
      result_checked: false,
      createdAt: '2026-08-15',
    },
  ];

  const bankroll3 = calculateBankrollEconomics(1000, pendingBets);
  const pass3 = bankroll3.initialBankroll === 1000 && bankroll3.currentBankroll === 1000 && bankroll3.effectiveProfits === 0;

  results.push({
    name: 'Test 3: Cassa invariata con scommesse "pending" (Cassa attuale resta €1000.00)',
    passed: pass3,
    expected: { initial: 1000, current: 1000, effectiveProfits: 0 },
    actual: { initial: bankroll3.initialBankroll, current: bankroll3.currentBankroll, effectiveProfits: bankroll3.effectiveProfits },
  });

  // TEST 4: Aggiornamento cassa ESCLUSIVAMENTE alla regolazione (won / lost)
  const mixedBets: Bet[] = [
    ...pendingBets, // pending non toccano la cassa
    {
      id: 'bet-won',
      leagueId: 'fr-ligue-1',
      leagueName: 'Ligue 1',
      countryFlag: '🇫🇷',
      season: 2025,
      homeTeam: 'PSG',
      awayTeam: 'Monaco',
      matchDate: '2026-08-10',
      betType: '1X2_DRAW',
      odds: 3.50,
      stake: 40.00,
      potentialPayout: 140.00,
      netProfit: 100.00,
      status: 'won',
      result_checked: true,
      createdAt: '2026-08-10',
    },
    {
      id: 'bet-lost',
      leagueId: 'es-la-liga',
      leagueName: 'La Liga',
      countryFlag: '🇪🇸',
      season: 2025,
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      matchDate: '2026-08-11',
      betType: '1X2_DRAW',
      odds: 3.10,
      stake: 47.62,
      potentialPayout: 147.62,
      netProfit: 100.00,
      status: 'lost',
      result_checked: true,
      createdAt: '2026-08-11',
    },
  ];

  // Profitti = +100 (won) - 47.62 (lost stake) = +52.38
  // Cassa finale = 1000 + 52.38 = 1052.38
  const bankroll4 = calculateBankrollEconomics(1000, mixedBets);
  const pass4 = bankroll4.effectiveProfits === 52.38 && bankroll4.currentBankroll === 1052.38;

  results.push({
    name: 'Test 4: Regolazione cassa su scommesse vinte e perse (Profitti effettivi = +€52.38, Cassa = €1052.38)',
    passed: pass4,
    expected: { effectiveProfits: 52.38, currentBankroll: 1052.38 },
    actual: { effectiveProfits: bankroll4.effectiveProfits, currentBankroll: bankroll4.currentBankroll },
  });

  // TEST 5: Quota 3.50 con Guadagno Netto €150
  // stake = 150 / 2.50 = €60.00
  // totalReturn = 60.00 * 3.50 = €210.00
  // netProfit = 210.00 - 60.00 = €150.00
  const calc5 = calculateBetEconomics(150, 3.50, 500);
  const pass5 = calc5.stake === 60.00 && calc5.totalReturn === 210.00 && calc5.netProfit === 150.00;

  results.push({
    name: 'Test 5: Quota 3.50, Guadagno Netto €150 => Puntata €60.00, Ritorno €210.00',
    passed: pass5,
    expected: { stake: 60.00, totalReturn: 210.00, netProfit: 150.00 },
    actual: { stake: calc5.stake, totalReturn: calc5.totalReturn, netProfit: calc5.netProfit },
  });

  // TEST 6: Regolazione automatica su pareggio (home_goals === away_goals => WON)
  // stake = 50, odds = 3.00 => total_return = 150, net_profit = 100, status = won, result_checked = true, settled_at valorizzato
  const testBetPending: Bet = {
    id: 'bet-auto-1',
    leagueId: 'it-serie-a',
    leagueName: 'Serie A',
    countryFlag: '🇮🇹',
    season: 2025,
    homeTeam: 'Torino',
    awayTeam: 'Genoa',
    matchDate: '2026-08-14',
    betType: '1X2_DRAW',
    odds: 3.00,
    stake: 50.00,
    targetProfit: 100.00,
    potentialPayout: 150.00,
    netProfit: 100.00,
    status: 'pending',
    result_checked: false,
    createdAt: '2026-08-10',
  };

  const settledWon = settleBetWithScore(testBetPending, 1, 1);
  const pass6 =
    settledWon.status === 'won' &&
    settledWon.potentialPayout === 150.00 &&
    settledWon.netProfit === 100.00 &&
    settledWon.result_checked === true &&
    Boolean(settledWon.settledAt);

  results.push({
    name: 'Test 6: Regolazione automatica su pareggio 1-1 => WON, Vincita €150.00, Guadagno Netto +€100.00',
    passed: pass6,
    expected: { status: 'won', totalReturn: 150.00, netProfit: 100.00, result_checked: true },
    actual: {
      status: settledWon.status,
      totalReturn: settledWon.potentialPayout,
      netProfit: settledWon.netProfit,
      result_checked: settledWon.result_checked,
    },
  });

  // TEST 7: Regolazione automatica su non-pareggio (home_goals !== away_goals => LOST)
  // stake = 50, odds = 3.00 => total_return = 0, net_profit = -50, status = lost, result_checked = true
  const settledLost = settleBetWithScore(testBetPending, 2, 0);
  const pass7 =
    settledLost.status === 'lost' &&
    settledLost.potentialPayout === 0 &&
    settledLost.netProfit === -50.00 &&
    settledLost.result_checked === true &&
    Boolean(settledLost.settledAt);

  results.push({
    name: 'Test 7: Regolazione automatica su non-pareggio 2-0 => LOST, Vincita €0.00, Guadagno Netto -€50.00',
    passed: pass7,
    expected: { status: 'lost', totalReturn: 0, netProfit: -50.00, result_checked: true },
    actual: {
      status: settledLost.status,
      totalReturn: settledLost.potentialPayout,
      netProfit: settledLost.netProfit,
      result_checked: settledLost.result_checked,
    },
  });

  // TEST 8: Protezione scommessa già regolata (una scommessa già regolata non deve essere regolata nuovamente)
  const alreadySettled: Bet = {
    ...settledWon,
    netProfit: 100.00,
  };
  const attemptReSettle = settleBetWithScore(alreadySettled, 0, 3, false);
  const pass8 =
    attemptReSettle.status === 'won' &&
    attemptReSettle.potentialPayout === 150.00 &&
    attemptReSettle.netProfit === 100.00;

  results.push({
    name: 'Test 8: Protezione idempotenza: scommessa già regolata non viene alterata da ulteriori verifiche',
    passed: pass8,
    expected: { status: 'won', netProfit: 100.00 },
    actual: { status: attemptReSettle.status, netProfit: attemptReSettle.netProfit },
  });

  // TEST 9: Ricostruzione cassa dopo eliminazione scommessa
  // Partendo da cassa iniziale 1000, 1 won (+100) e 1 lost (-50) => Cassa = 1050
  // Se eliminiamo la scommessa persa (-50), la cassa diventa 1100.
  const initialPool = [settledWon, settledLost];
  const bankrollBefore = calculateBankrollEconomics(1000, initialPool);
  const poolAfterDeletion = [settledWon]; // eliminata settledLost
  const bankrollAfter = calculateBankrollEconomics(1000, poolAfterDeletion);

  const pass9 =
    bankrollBefore.currentBankroll === 1050.00 &&
    bankrollAfter.currentBankroll === 1100.00 &&
    bankrollAfter.effectiveProfits === 100.00;

  results.push({
    name: 'Test 9: Ricostruzione deterministica cassa post-eliminazione scommessa (€1050.00 -> €1100.00)',
    passed: pass9,
    expected: { before: 1050.00, after: 1100.00 },
    actual: { before: bankrollBefore.currentBankroll, after: bankrollAfter.currentBankroll },
  });

  const allPassed = results.every((r) => r.passed);

  return {
    total: results.length,
    passed: results.filter((r) => r.passed).length,
    allPassed,
    results,
  };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('betCalculation.test')) {
  console.log('=== ESECUZIONE TEST AUTOMATICI CALCOLI & DATABASE SCOMMESSE (MENU 3 & MENU 4) ===');
  const out = runAllBetCalculationTests();
  out.results.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.passed ? 'PASSED ✅' : 'FAILED ❌'}] ${r.name}`);
  });
  console.log(`Risultato: ${out.passed}/${out.total} test superati con successo.`);
}

