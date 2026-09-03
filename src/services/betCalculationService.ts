import { Bet } from '../types';
import { dataService } from './dataService';

export interface BetCalculationResult {
  stake: number;
  totalReturn: number;
  netProfit: number;
  isStakeExceeding: boolean;
}

/**
 * Calcolo matematico ed economico deterministico della scommessa sul segno X.
 * 
 * FORMULA:
 * stake = target_profit / (odds - 1)
 * total_return = stake * odds
 * net_profit = total_return - stake
 * 
 * Precisione monetaria a 2 decimali con arrotondamento standard bancario.
 */
export function calculateBetEconomics(
  targetProfit: number,
  odds: number,
  currentBankroll: number
): BetCalculationResult {
  const numOdds = Number(odds);
  const numTarget = Number(targetProfit);

  if (isNaN(numOdds) || numOdds <= 1 || isNaN(numTarget) || numTarget <= 0) {
    return {
      stake: 0,
      totalReturn: 0,
      netProfit: 0,
      isStakeExceeding: false,
    };
  }

  // stake = target_profit / (odds - 1)
  const rawStake = numTarget / (numOdds - 1);
  const stake = Number(rawStake.toFixed(2));

  // Vincita totale = stake * odds
  const totalReturn = Number((stake * numOdds).toFixed(2));

  // Guadagno netto = total_return - stake
  const netProfit = Number((totalReturn - stake).toFixed(2));

  // Controllo: la puntata supera la cassa attuale?
  const isStakeExceeding = stake > currentBankroll;

  return {
    stake,
    totalReturn,
    netProfit,
    isStakeExceeding,
  };
}

/**
 * Calcola la Cassa Attuale e le Vincite Effettive in modo deterministico.
 * 
 * REGOLA ASSOLUTA:
 * - Le scommesse in stato "pending" NON modificano la cassa.
 * - La cassa varia ESCLUSIVAMENTE quando la scommessa viene regolata (won / lost).
 */
export function calculateBankrollEconomics(
  initialBankroll: number,
  bets: Bet[]
): {
  initialBankroll: number;
  currentBankroll: number;
  effectiveProfits: number;
  wonBetsCount: number;
  lostBetsCount: number;
  pendingBetsCount: number;
} {
  let effectiveProfits = 0;
  let wonBetsCount = 0;
  let lostBetsCount = 0;
  let pendingBetsCount = 0;

  for (const bet of bets) {
    if (bet.status === 'won') {
      wonBetsCount++;
      const wonNet = (bet.netProfit !== undefined)
        ? bet.netProfit
        : (bet.stake * bet.odds - bet.stake);
      effectiveProfits += wonNet;
    } else if (bet.status === 'lost') {
      lostBetsCount++;
      effectiveProfits -= bet.stake;
    } else if (bet.status === 'pending') {
      pendingBetsCount++;
    }
  }

  effectiveProfits = Number(effectiveProfits.toFixed(2));
  const currentBankroll = Number((initialBankroll + effectiveProfits).toFixed(2));

  return {
    initialBankroll,
    currentBankroll,
    effectiveProfits,
    wonBetsCount,
    lostBetsCount,
    pendingBetsCount,
  };
}

/**
 * Regola una scommessa in base al risultato finale (homeGoals, awayGoals).
 * 
 * REGOLA ASSOLUTA:
 * - Una scommessa già regolata (result_checked === true o status !== 'pending')
 *   NON deve essere regolata nuovamente.
 * - Se homeGoals === awayGoals => WON
 *     total_return = stake * odds
 *     net_profit = total_return - stake
 * - Se homeGoals !== awayGoals => LOST
 *     total_return = 0
 *     net_profit = -stake
 * - result_checked = true
 * - settledAt = ISO timestamp
 */
export function settleBetWithScore(
  bet: Bet,
  homeGoals: number,
  awayGoals: number,
  forceSettle: boolean = false
): Bet {
  // Se già regolata e non forzata, non ricalcolare
  if (!forceSettle && (bet.result_checked || bet.status !== 'pending')) {
    return bet;
  }

  const isDraw = Number(homeGoals) === Number(awayGoals);
  const nowIso = new Date().toISOString();

  if (isDraw) {
    const totalReturn = Number((bet.stake * bet.odds).toFixed(2));
    const netProfit = Number((totalReturn - bet.stake).toFixed(2));
    return {
      ...bet,
      status: 'won',
      potentialPayout: totalReturn,
      netProfit,
      result_checked: true,
      settledAt: nowIso,
    };
  } else {
    return {
      ...bet,
      status: 'lost',
      potentialPayout: 0,
      netProfit: -Number(bet.stake.toFixed(2)),
      result_checked: true,
      settledAt: nowIso,
    };
  }
}

/**
 * Regola manualmente una scommessa (stato WON o LOST o reset a PENDING).
 */
export function settleBetManualStatus(bet: Bet, newStatus: Bet['status']): Bet {
  const nowIso = new Date().toISOString();

  if (newStatus === 'won') {
    const totalReturn = Number((bet.stake * bet.odds).toFixed(2));
    const netProfit = Number((totalReturn - bet.stake).toFixed(2));
    return {
      ...bet,
      status: 'won',
      potentialPayout: totalReturn,
      netProfit,
      result_checked: true,
      settledAt: nowIso,
    };
  } else if (newStatus === 'lost') {
    return {
      ...bet,
      status: 'lost',
      potentialPayout: 0,
      netProfit: -Number(bet.stake.toFixed(2)),
      result_checked: true,
      settledAt: nowIso,
    };
  } else {
    // Reset a pending
    const potentialPayout = Number((bet.stake * bet.odds).toFixed(2));
    const expectedProfit = Number((potentialPayout - bet.stake).toFixed(2));
    return {
      ...bet,
      status: 'pending',
      potentialPayout,
      netProfit: bet.targetProfit !== undefined ? bet.targetProfit : expectedProfit,
      result_checked: false,
      settledAt: undefined,
    };
  }
}

