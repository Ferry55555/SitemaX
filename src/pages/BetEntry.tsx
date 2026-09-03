import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Coins,
  DollarSign,
  Edit2,
  Flame,
  History,
  Info,
  Layers,
  Percent,
  PlusCircle,
  RefreshCw,
  Save,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  XCircle,
} from 'lucide-react';
import { PageId, PrefillBetData, Bet } from '../types';
import { MONITORED_LEAGUES } from '../config/leagues';
import { OFFICIAL_LEAGUE_TEAMS } from '../data/initialLeagueFixtures';
import { dataService } from '../services/dataService';
import { footballDataService } from '../services/footballDataService';
import {
  calculateBetEconomics,
  calculateBankrollEconomics,
} from '../services/betCalculationService';
import { runAllBetCalculationTests } from '../services/tests/betCalculation.test';
import { getAvailableSeasons, getCurrentFootballSeason } from '../utils/seasonUtils';

interface BetEntryProps {
  onNavigate: (page: PageId) => void;
  prefillMatch?: PrefillBetData | null;
}

export const BetEntry: React.FC<BetEntryProps> = ({
  onNavigate,
  prefillMatch,
}) => {
  const currentSeasonNum = getCurrentFootballSeason();
  const availableSeasons = getAvailableSeasons(4).map((s) => ({
    value: String(s.value),
    label: s.label,
  }));

  // 1. CARDS IN ALTO: STATI ECONOMICI
  const [initialBankrollInput, setInitialBankrollInput] = useState<number>(() => {
    return dataService.getSettings().initialBankroll || 1000;
  });
  const [isEditingInitialBankroll, setIsEditingInitialBankroll] = useState<boolean>(false);
  const [tempInitialBankroll, setTempInitialBankroll] = useState<string>(
    String(dataService.getSettings().initialBankroll || 1000)
  );

  // Potenziale vincita (GUADAGNO NETTO desiderato)
  const [targetProfitInput, setTargetProfitInput] = useState<number | string>(100);

  // 2. FORM SCOMMESSA
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('it-serie-a');
  const [selectedSeason, setSelectedSeason] = useState<string>(String(currentSeasonNum));
  const [matchDate, setMatchDate] = useState<string>(() => {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    return now.toISOString().slice(0, 16);
  });
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [alertTeam, setAlertTeam] = useState<string>('');
  const [oddsInput, setOddsInput] = useState<number | string>(2.80);

  // Stato inserimento e feedback
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [lastInsertedBet, setLastInsertedBet] = useState<Bet | null>(null);

  // Unit tests drawer
  const [showTests, setShowTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<ReturnType<typeof runAllBetCalculationTests> | null>(null);

  // Lista scommesse registrate
  const allBets = dataService.getBets();

  // Calcolo automatico della cassa ed economiche
  const bankrollData = calculateBankrollEconomics(initialBankrollInput, allBets);

  // PRECOMPILAZIONE SE PROVENIENTI DA MENU 1 O MENU 2
  useEffect(() => {
    if (prefillMatch) {
      if (prefillMatch.leagueId) setSelectedLeagueId(prefillMatch.leagueId);
      if (prefillMatch.season) setSelectedSeason(String(prefillMatch.season));
      if (prefillMatch.homeTeam) setHomeTeam(prefillMatch.homeTeam);
      if (prefillMatch.awayTeam) setAwayTeam(prefillMatch.awayTeam);
      if (prefillMatch.alertTeam) setAlertTeam(prefillMatch.alertTeam);
      if (prefillMatch.matchDate) {
        try {
          const d = new Date(prefillMatch.matchDate);
          if (!isNaN(d.getTime())) {
            setMatchDate(d.toISOString().slice(0, 16));
          }
        } catch {
          // safe fallback
        }
      }
    }
  }, [prefillMatch]);

  // Seleziona la configurazione della lega corrente
  const currentLeague = MONITORED_LEAGUES.find(
    (l) => l.id === selectedLeagueId || l.apiLeagueId === Number(selectedLeagueId)
  ) || MONITORED_LEAGUES[0];

  const leagueTeams = footballDataService.getTeams(currentLeague.apiLeagueId);

  // CALCOLO MATEMATICO ED ECONOMICO (DETERMINISTICO)
  // stake = target_profit / (odds - 1)
  // total_return = stake * odds
  // net_profit = total_return - stake
  const numTargetProfit = Number(targetProfitInput) || 0;
  const numOdds = Number(oddsInput) || 0;
  const calculation = calculateBetEconomics(numTargetProfit, numOdds, bankrollData.currentBankroll);

  // Gestione salvataggio Cassa Iniziale
  const handleSaveInitialBankroll = () => {
    const val = Math.max(0, Number(tempInitialBankroll) || 0);
    const updated = dataService.setInitialBankroll(val);
    setInitialBankrollInput(updated);
    setIsEditingInitialBankroll(false);
  };

  // Gestione Salvataggio Scommessa (💾 INSERISCI SCOMMESSA)
  const handleSaveBet = (e: React.FormEvent) => {
    e.preventDefault();

    if (!homeTeam.trim() || !awayTeam.trim()) {
      return;
    }

    if (numOdds <= 1 || calculation.stake <= 0) {
      return;
    }

    // Salva nel database con: status = pending, result_checked = false
    const newBet = dataService.addBet({
      leagueId: currentLeague.id,
      leagueName: currentLeague.name,
      countryFlag: currentLeague.countryFlag,
      season: Number(selectedSeason),
      homeTeam: homeTeam.trim(),
      awayTeam: awayTeam.trim(),
      alertTeam: alertTeam.trim() || undefined,
      matchDate,
      betType: '1X2_DRAW', // La scommessa riguarda sempre il segno X
      odds: numOdds,
      stake: calculation.stake,
      targetProfit: numTargetProfit,
      potentialPayout: calculation.totalReturn,
      netProfit: calculation.netProfit,
      status: 'pending',
      result_checked: false,
      notes: alertTeam ? `Alert attivo su: ${alertTeam}` : undefined,
    });

    setLastInsertedBet(newBet);
    setSubmittedSuccess(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <button
          id="btn-goto-bet-database"
          type="button"
          onClick={() => onNavigate('bet-database')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-blue-400" />
          <span>Database Scommesse ({allBets.length}) ➜</span>
        </button>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-600 shadow-inner text-2xl font-black">
            💰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Calcolo Matematico Segno X</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              INSERIMENTO SCOMMESSA
            </h1>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 CARDS PRINCIPALI IN ALTO (CASSA INIZIALE, CASSA ATTUALE, VINCITE, POTENZIALE) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CASSA INIZIALE (INSERIMENTO MANUALE) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-600" />
                Cassa Iniziale
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                Manuale
              </span>
            </div>

            {isEditingInitialBankroll ? (
              <div className="mt-2 space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">€</span>
                  <input
                    id="input-initial-bankroll"
                    type="number"
                    step="10"
                    min="0"
                    value={tempInitialBankroll}
                    onChange={(e) => setTempInitialBankroll(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-emerald-400 rounded-lg text-sm font-black text-slate-900 focus:outline-hidden"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSaveInitialBankroll}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                  >
                    Salva
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempInitialBankroll(String(initialBankrollInput));
                      setIsEditingInitialBankroll(false);
                    }}
                    className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  €{bankrollData.initialBankroll.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingInitialBankroll(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  title="Modifica Cassa Iniziale"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Modifica</span>
                </button>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            Capitale di partenza impostato
          </div>
        </div>

        {/* CASSA ATTUALE (CALCOLO AUTOMATICO) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-blue-600" />
                Cassa Attuale
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                Auto
              </span>
            </div>
            <div className="mt-1 text-2xl font-black text-slate-900 font-mono">
              €{bankrollData.currentBankroll.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Cassa reale regolata</span>
            <span className="font-semibold text-slate-700">({bankrollData.pendingBetsCount} in corso)</span>
          </div>
        </div>

        {/* VINCITE EFFETTIVE (CALCOLO AUTOMATICO) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Vincite Effettive
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                Auto
              </span>
            </div>
            <div
              className={`mt-1 text-2xl font-black font-mono ${
                bankrollData.effectiveProfits >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {bankrollData.effectiveProfits >= 0 ? '+' : ''}
              €{bankrollData.effectiveProfits.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            {bankrollData.wonBetsCount} Vinte / {bankrollData.lostBetsCount} Perse
          </div>
        </div>

        {/* POTENZIALE VINCITA (INSERIMENTO MANUALE - GUADAGNO NETTO DESIDERATO) */}
        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                Potenziale Vincita
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                Manuale
              </span>
            </div>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">€</span>
              <input
                id="input-card4-target-profit"
                type="number"
                step="5"
                min="1"
                value={targetProfitInput}
                onChange={(e) => setTargetProfitInput(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-lg font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 shadow-2xs font-mono"
              />
            </div>
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-3 pt-2 border-t border-emerald-200">
            Guadagno Netto Desiderato
          </div>
        </div>
      </div>

      {/* CALLOUT DI PRECOMPILAZIONE SE ATTIVO */}
      {prefillMatch && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-900 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">Dati precompilati da Alert: </span>
              <span>
                {prefillMatch.alertTeam ? (
                  <strong className="underline decoration-blue-400">{prefillMatch.alertTeam}</strong>
                ) : (
                  `${prefillMatch.homeTeam} vs ${prefillMatch.awayTeam}`
                )}
                {' '}in {currentLeague.name}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAlertTeam('');
              setHomeTeam('');
              setAwayTeam('');
            }}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer shrink-0"
          >
            Azzera Precompilazione
          </button>
        </div>
      )}

      {/* WARNING BOX: SE LA PUNTATA SUPERA LA CASSA ATTUALE */}
      {calculation.isStakeExceeding && (
        <div
          id="banner-stake-exceeding-bankroll"
          className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3.5 text-rose-900 animate-shake"
        >
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-black text-sm text-rose-900">
              ATTENZIONE: la puntata supera la cassa attuale.
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              La puntata calcolata di <strong>€{calculation.stake.toFixed(2)}</strong> è superiore al saldo disponibile nella cassa attuale (<strong>€{bankrollData.currentBankroll.toFixed(2)}</strong>). Riduci il guadagno netto desiderato o incrementa la quota X.
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL / BANNER */}
      {submittedSuccess && lastInsertedBet && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3 text-emerald-950 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-sm">
                SCOMMESSA SUL SEGNO X REGISTRATA CON SUCCESSO NEL DATABASE!
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
              STATUS: PENDING
            </span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Partita</span>
              <strong className="text-slate-900">{lastInsertedBet.homeTeam} - {lastInsertedBet.awayTeam}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Quota X</span>
              <strong className="text-blue-700 font-mono">@{lastInsertedBet.odds.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Puntata</span>
              <strong className="text-slate-900 font-mono">€{lastInsertedBet.stake.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Guadagno Netto</span>
              <strong className="text-emerald-700 font-mono">+€{lastInsertedBet.netProfit?.toFixed(2)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('bet-database')}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-xs"
            >
              Apri Database Scommesse ➜
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmittedSuccess(false);
                setLastInsertedBet(null);
                setHomeTeam('');
                setAwayTeam('');
                setAlertTeam('');
              }}
              className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Inserisci un'altra scommessa
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORM PRINCIPALE SOTTO CON TUTTI I CAMPI RICHIESTI */}
      {/* ========================================================================= */}
      <form onSubmit={handleSaveBet} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Sezione 1: Dati Evento */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Dettagli Partita & Competizione</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">
                Solo 10 competizioni ufficiali ammesse
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Campionato */}
              <div className="space-y-1.5">
                <label htmlFor="select-bet-league" className="text-xs font-bold text-slate-700 block">
                  Campionato *
                </label>
                <select
                  id="select-bet-league"
                  value={selectedLeagueId}
                  onChange={(e) => setSelectedLeagueId(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <optgroup label="Italia">
                    <option value="it-serie-a">🇮🇹 Serie A</option>
                    <option value="it-serie-b">🇮🇹 Serie B</option>
                  </optgroup>
                  <optgroup label="Francia">
                    <option value="fr-ligue-1">🇫🇷 Ligue 1</option>
                    <option value="fr-ligue-2">🇫🇷 Ligue 2</option>
                  </optgroup>
                  <optgroup label="Inghilterra">
                    <option value="en-premier-league">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</option>
                    <option value="en-championship">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Championship</option>
                  </optgroup>
                  <optgroup label="Spagna">
                    <option value="es-la-liga">🇪🇸 La Liga</option>
                    <option value="es-segunda-division">🇪🇸 Segunda División</option>
                  </optgroup>
                  <optgroup label="Germania">
                    <option value="de-bundesliga">🇩🇪 Bundesliga</option>
                    <option value="de-2-bundesliga">🇩🇪 2. Bundesliga</option>
                  </optgroup>
                </select>
              </div>

              {/* Stagione */}
              <div className="space-y-1.5">
                <label htmlFor="select-bet-season" className="text-xs font-bold text-slate-700 block">
                  Stagione *
                </label>
                <select
                  id="select-bet-season"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  {availableSeasons.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Partita */}
              <div className="space-y-1.5">
                <label htmlFor="input-bet-date" className="text-xs font-bold text-slate-700 block">
                  Data & Ora Partita *
                </label>
                <input
                  id="input-bet-date"
                  type="datetime-local"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono"
                  required
                />
              </div>
            </div>

            {/* Squadre e Squadra Selezionata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Squadra Casa */}
              <div className="space-y-1.5">
                <label htmlFor="input-bet-home" className="text-xs font-bold text-slate-700 block">
                  Squadra Casa *
                </label>
                <input
                  id="input-bet-home"
                  type="text"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="Es. Juventus"
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  required
                  list="league-teams-list"
                />
              </div>

              {/* Squadra Ospite */}
              <div className="space-y-1.5">
                <label htmlFor="input-bet-away" className="text-xs font-bold text-slate-700 block">
                  Squadra Ospite *
                </label>
                <input
                  id="input-bet-away"
                  type="text"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="Es. Torino"
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  required
                  list="league-teams-list"
                />
              </div>

              {/* Squadra Selezionata / Alert */}
              <div className="space-y-1.5">
                <label htmlFor="input-bet-alert-team" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Squadra Selezionata (Alert)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Opzionale</span>
                </label>
                <input
                  id="input-bet-alert-team"
                  type="text"
                  value={alertTeam}
                  onChange={(e) => setAlertTeam(e.target.value)}
                  placeholder="Club con striscia o frequenza"
                  className="w-full text-xs font-bold bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2.5 text-blue-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  list="league-teams-list"
                />
              </div>

              {/* Datalist per autocompletamento squadre ufficiali */}
              <datalist id="league-teams-list">
                {leagueTeams.map((t) => (
                  <option key={t.id} value={t.name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Sezione 2: QUOTA X, POTENZIALE VINCITA E CALCOLI ECONOMICI */}
          {/* ========================================================================= */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Parametri Economici & Formula Segno X</span>
              </h2>
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                stake = target_profit / (odds - 1)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
              {/* 1. QUOTA X (INSERIMENTO MANUALE) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <label htmlFor="input-bet-odds" className="text-[11px] font-bold uppercase text-slate-600 block">
                  Quota X *
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">@</span>
                  <input
                    id="input-bet-odds"
                    type="number"
                    step="0.05"
                    min="1.05"
                    max="50"
                    value={oddsInput}
                    onChange={(e) => setOddsInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-black text-blue-700 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 shadow-2xs"
                    required
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Inserimento manuale
                </div>
              </div>

              {/* 2. POTENZIALE VINCITA (GUADAGNO NETTO DESIDERATO) */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <label htmlFor="input-form-target-profit" className="text-[11px] font-bold uppercase text-emerald-900 block">
                  Potenziale Vincita *
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">€</span>
                  <input
                    id="input-form-target-profit"
                    type="number"
                    step="5"
                    min="1"
                    value={targetProfitInput}
                    onChange={(e) => setTargetProfitInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-white border border-emerald-400 rounded-lg text-sm font-black text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 shadow-2xs"
                    required
                  />
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  Guadagno netto target
                </div>
              </div>

              {/* 3. PUNTATA (CALCOLO AUTOMATICO) */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-blue-900 block">
                  Puntata (Stake)
                </span>
                <div className="text-base font-black text-blue-700 font-mono py-1">
                  €{calculation.stake.toFixed(2)}
                </div>
                <div className="text-[10px] text-blue-600 font-medium font-mono">
                  = €{numTargetProfit} / ({(numOdds - 1).toFixed(2)})
                </div>
              </div>

              {/* 4. VINCITA TOTALE (CALCOLO AUTOMATICO) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-600 block">
                  Vincita Totale
                </span>
                <div className="text-base font-black text-slate-900 font-mono py-1">
                  €{calculation.totalReturn.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 font-medium font-mono">
                  = €{calculation.stake.toFixed(2)} × {numOdds.toFixed(2)}
                </div>
              </div>

              {/* 5. GUADAGNO NETTO (CALCOLO AUTOMATICO) */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                <span className="text-[11px] font-bold uppercase text-emerald-900 block">
                  Guadagno Netto
                </span>
                <div className="text-base font-black text-emerald-700 font-mono py-1">
                  +€{calculation.netProfit.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium font-mono">
                  = €{calculation.totalReturn.toFixed(2)} - €{calculation.stake.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* PULSANTE SUBMIT: 💾 INSERISCI SCOMMESSA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              id="btn-submit-save-bet"
              type="submit"
              disabled={calculation.stake <= 0}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition-all shadow-md cursor-pointer ${
                calculation.stake <= 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>💾 INSERISCI SCOMMESSA</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
