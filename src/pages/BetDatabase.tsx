import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  Filter,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Wallet,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { Bet, BetStatus, MatchFixture, PageId, PrefillBetData } from '../types';
import { dataService } from '../services/dataService';
import { MONITORED_LEAGUES } from '../config/leagues';
import { LeagueBadge } from '../components/common/LeagueBadge';
import { calculateBankrollEconomics } from '../services/betCalculationService';
import { getAvailableSeasons, getCurrentFootballSeason } from '../utils/seasonUtils';

interface BetDatabaseProps {
  onNavigate: (page: PageId) => void;
  onSelectBetMatch?: (match: PrefillBetData) => void;
}

export const BetDatabase: React.FC<BetDatabaseProps> = ({
  onNavigate,
  onSelectBetMatch,
}) => {
  // Vista attiva: 'bets' (Scommesse) oppure 'matches' (Risultati partite)
  const [activeView, setActiveView] = useState<'bets' | 'matches'>('bets');

  // Dati scommesse e impostazioni
  const [bets, setBets] = useState<Bet[]>(() => dataService.getBets());
  const [settings, setSettings] = useState(() => dataService.getSettings());
  const [statusFilter, setStatusFilter] = useState<'all' | BetStatus>('all');
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtri per Risultati Partite
  const availableSeasons = getAvailableSeasons(4);
  const currentSeason = getCurrentFootballSeason();
  const [matchLeagueFilter, setMatchLeagueFilter] = useState<string>('all');
  const [matchSeasonFilter, setMatchSeasonFilter] = useState<number>(currentSeason);
  const [matchOutcomeFilter, setMatchOutcomeFilter] = useState<'all' | 'draws_only' | 'home_wins' | 'away_wins' | 'upcoming'>('all');
  const [matchSearchQuery, setMatchSearchQuery] = useState<string>('');

  // Modale regolazione punteggio scommessa
  const [scoreModalBet, setScoreModalBet] = useState<Bet | null>(null);
  const [homeGoals, setHomeGoals] = useState<number>(1);
  const [awayGoals, setAwayGoals] = useState<number>(1);

  // Modale conferma eliminazione scommessa
  const [deleteModalBetId, setDeleteModalBetId] = useState<string | null>(null);

  // Modale conferma svuotamento completo archivio scommesse
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState<boolean>(false);

  // Modale modifica cassa iniziale
  const [isEditingBankroll, setIsEditingBankroll] = useState<boolean>(false);
  const [initialBankrollInput, setInitialBankrollInput] = useState<string>(
    settings.initialBankroll.toString()
  );

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshData = () => {
    setBets(dataService.getBets());
    setSettings(dataService.getSettings());
  };

  // Calcolo deterministico della cassa dal database delle scommesse
  const bankrollSummary = useMemo(() => {
    return calculateBankrollEconomics(settings.initialBankroll, bets);
  }, [settings.initialBankroll, bets]);

  // Gestione cambio cassa iniziale
  const handleSaveInitialBankroll = () => {
    const val = parseFloat(initialBankrollInput);
    if (!isNaN(val) && val >= 0) {
      dataService.setInitialBankroll(val);
      refreshData();
      setIsEditingBankroll(false);
      showToast(`Cassa iniziale aggiornata a €${val.toFixed(2)}`, 'success');
    }
  };

  // Gestione cambio stato manuale scommessa
  const handleStatusChange = (id: string, newStatus: BetStatus) => {
    dataService.updateBetStatus(id, newStatus);
    refreshData();
    const statusLabels = { won: 'VINTA ✅', lost: 'PERSA ❌', pending: 'IN ATTESA ⏳' };
    showToast(`Scommessa impostata su: ${statusLabels[newStatus]}`, 'info');
  };

  // Gestione regolazione da punteggio scommessa
  const handleOpenScoreModal = (bet: Bet) => {
    setScoreModalBet(bet);
    setHomeGoals(1);
    setAwayGoals(1);
  };

  const handleConfirmScoreSettle = () => {
    if (!scoreModalBet) return;
    const isDraw = homeGoals === awayGoals;
    dataService.settleBetScore(scoreModalBet.id, homeGoals, awayGoals);
    refreshData();
    setScoreModalBet(null);
    showToast(
      `Partita terminata ${homeGoals}-${awayGoals}: Scommessa ${isDraw ? 'VINTA (+€' + (scoreModalBet.potentialPayout - scoreModalBet.stake).toFixed(2) + ')' : 'PERSA (-€' + scoreModalBet.stake.toFixed(2) + ')'}`,
      isDraw ? 'success' : 'info'
    );
  };

  // Regolazione automatica da risultati del database
  const handleAutoSettle = () => {
    const res = dataService.settleAllPendingBetsAgainstFixtures();
    refreshData();
    if (res.settledCount > 0) {
      showToast(
        `Regolate automaticamente ${res.settledCount} scommesse (${res.wonCount} Vinte, ${res.lostCount} Perse)`,
        'success'
      );
    } else {
      showToast(
        'Nessuna nuova scommessa da regolare: le partite associate non sono ancora concluse o sono già state regolate.',
        'info'
      );
    }
  };

  // Gestione eliminazione singola scommessa
  const handleConfirmDelete = () => {
    if (!deleteModalBetId) return;
    dataService.deleteBet(deleteModalBetId);
    refreshData();
    setDeleteModalBetId(null);
    showToast('Scommessa eliminata. Cassa ricalcolata con successo.', 'success');
  };

  // Gestione svuotamento completo archivio scommesse
  const handleConfirmClearAll = () => {
    dataService.clearAllBets();
    refreshData();
    setIsClearAllModalOpen(false);
    showToast('Tutte le scommesse sono state eliminate definitivamente.', 'success');
  };

  // Scommesse filtrate
  const filteredBets = useMemo(() => {
    return bets.filter((bet) => {
      const matchesStatus = statusFilter === 'all' || bet.status === statusFilter;
      const matchesLeague = leagueFilter === 'all' || bet.leagueId === leagueFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        bet.homeTeam.toLowerCase().includes(query) ||
        bet.awayTeam.toLowerCase().includes(query) ||
        bet.leagueName.toLowerCase().includes(query) ||
        (bet.alertTeam && bet.alertTeam.toLowerCase().includes(query));
      return matchesStatus && matchesLeague && matchesSearch;
    });
  }, [bets, statusFilter, leagueFilter, searchQuery]);

  // Risultati partite recuperati dal database
  const allFixtures = useMemo(() => {
    return dataService.getAllMatchFixtures(matchLeagueFilter, matchSeasonFilter);
  }, [matchLeagueFilter, matchSeasonFilter]);

  // Risultati partite filtrati
  const filteredFixtures = useMemo(() => {
    return allFixtures.filter((f) => {
      // Filtro esito
      if (matchOutcomeFilter === 'draws_only') {
        if (!f.isFinished || !f.isDraw) return false;
      } else if (matchOutcomeFilter === 'home_wins') {
        if (!f.isFinished || f.goalsHome === null || f.goalsAway === null || f.goalsHome <= f.goalsAway) return false;
      } else if (matchOutcomeFilter === 'away_wins') {
        if (!f.isFinished || f.goalsHome === null || f.goalsAway === null || f.goalsAway <= f.goalsHome) return false;
      } else if (matchOutcomeFilter === 'upcoming') {
        if (f.isFinished) return false;
      }

      // Ricerca per squadra
      if (matchSearchQuery.trim()) {
        const q = matchSearchQuery.toLowerCase().trim();
        const homeMatch = f.homeTeam.name.toLowerCase().includes(q);
        const awayMatch = f.awayTeam.name.toLowerCase().includes(q);
        const leagueMatch = f.leagueName.toLowerCase().includes(q);
        if (!homeMatch && !awayMatch && !leagueMatch) return false;
      }

      return true;
    });
  }, [allFixtures, matchOutcomeFilter, matchSearchQuery]);

  // Statistiche per le partite
  const matchStats = useMemo(() => {
    const total = allFixtures.length;
    const finished = allFixtures.filter((f) => f.isFinished).length;
    const draws = allFixtures.filter((f) => f.isFinished && f.isDraw).length;
    const upcoming = allFixtures.filter((f) => !f.isFinished).length;
    const drawPercentage = finished > 0 ? (draws / finished) * 100 : 0;
    return { total, finished, draws, upcoming, drawPercentage };
  }, [allFixtures]);

  // Gestione precompilazione scommessa da partita
  const handleBetOnFixture = (fixture: MatchFixture) => {
    if (onSelectBetMatch) {
      onSelectBetMatch({
        leagueId: fixture.leagueId,
        leagueName: fixture.leagueName,
        countryFlag: fixture.countryFlag,
        season: fixture.season,
        homeTeam: fixture.homeTeam.name,
        awayTeam: fixture.awayTeam.name,
        matchDate: fixture.date,
        defaultOdds: 3.10,
      });
    }
    onNavigate('bet-entry');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : toastMessage.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top action header with Quick Actions */}
      <div className="flex items-center justify-end gap-3 flex-wrap">
        {activeView === 'bets' && (
          <button
            id="btn-auto-settle-results"
            type="button"
            onClick={handleAutoSettle}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Verifica automatica dei risultati delle partite e aggiornamento esiti"
          >
            <Zap className="w-4 h-4 text-amber-700" />
            <span>Regola Automaticamente</span>
          </button>
        )}

        <button
          id="btn-add-new-bet-from-db"
          type="button"
          onClick={() => onNavigate('bet-entry')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-700 rounded-xl hover:bg-purple-800 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova Scommessa</span>
        </button>
      </div>

      {/* Main Title Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 text-2xl shadow-inner">
            📊
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              DATABASE SCOMMESSE
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Archivio storico dei risultati delle partite e delle scommesse
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DUE NUOVI PULSANTI FILTRO PRINCIPALI: SCOMMESSE & RISULTATI PARTITE */}
      {/* ========================================================= */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            id="filter-btn-scommesse"
            type="button"
            onClick={() => setActiveView('bets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeView === 'bets'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>📊 Scommesse</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeView === 'bets'
                  ? 'bg-purple-900 text-purple-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {bets.length}
            </span>
          </button>

          <button
            id="filter-btn-risultati-partite"
            type="button"
            onClick={() => setActiveView('matches')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeView === 'matches'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>⚽ Risultati partite</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeView === 'matches'
                  ? 'bg-purple-900 text-purple-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {allFixtures.length}
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium px-2">
          {activeView === 'bets'
            ? 'Visualizzazione archivio giocate, cassa e resoconti economici'
            : 'Visualizzazione database risultati campionati e verifica pareggi (Segno X)'}
        </span>
      </div>

      {/* ========================================================= */}
      {/* VISTA 1: SCOMMESSE (BETS DATABASE) */}
      {/* ========================================================= */}
      {activeView === 'bets' && (
        <div className="space-y-4 animate-fadeIn">
          {/* 4 Economic Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Cassa Iniziale */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  Cassa Iniziale
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingBankroll(true)}
                  className="p-1 text-slate-400 hover:text-purple-600 rounded cursor-pointer"
                  title="Modifica Cassa Iniziale"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  €{settings.initialBankroll.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Capitale iniziale impostato
              </p>
            </div>

            {/* Card 2: Cassa Attuale */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  Cassa Attuale
                </span>
                <Wallet className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`text-2xl font-black font-mono ${
                    bankrollSummary.currentBankroll >= settings.initialBankroll
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  €{bankrollSummary.currentBankroll.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Iniziale + Vinte - Perse
              </p>
            </div>

            {/* Card 3: Vincite Effettive */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  Vincite Effettive
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`text-2xl font-black font-mono ${
                    bankrollSummary.effectiveProfits >= 0
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {bankrollSummary.effectiveProfits >= 0
                    ? `+€${bankrollSummary.effectiveProfits.toFixed(2)}`
                    : `-€${Math.abs(bankrollSummary.effectiveProfits).toFixed(2)}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Somma net profit scommesse regolate
              </p>
            </div>

            {/* Card 4: Scommesse Regolate e in Attesa */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  Scommesse
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {bets.length} totali
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 font-mono text-sm">
                <span className="text-emerald-700 font-extrabold">
                  {bankrollSummary.wonBetsCount}V
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-700 font-extrabold">
                  {bankrollSummary.lostBetsCount}P
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-900 font-extrabold">
                  {bankrollSummary.pendingBetsCount} In attesa
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Win Rate:{' '}
                {bankrollSummary.wonBetsCount + bankrollSummary.lostBetsCount > 0
                  ? `${(
                      (bankrollSummary.wonBetsCount /
                        (bankrollSummary.wonBetsCount + bankrollSummary.lostBetsCount)) *
                      100
                    ).toFixed(1)}%`
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Filter and Search Bar for Bets */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Stato:
                </span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tutte ({bets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  In attesa ({bankrollSummary.pendingBetsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('won')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'won'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Vinte ({bankrollSummary.wonBetsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('lost')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    statusFilter === 'lost'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Perse ({bankrollSummary.lostBetsCount})
                </button>

                {bets.length > 0 && (
                  <button
                    id="btn-clear-all-bets"
                    type="button"
                    onClick={() => setIsClearAllModalOpen(true)}
                    className="ml-auto sm:ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    title="Elimina tutte le scommesse dal database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Svuota ({bets.length})</span>
                  </button>
                )}
              </div>

              {/* Search Field & League Dropdown */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full sm:w-48">
                  <select
                    id="select-db-league"
                    value={leagueFilter}
                    onChange={(e) => setLeagueFilter(e.target.value)}
                    aria-label="Filtra per campionato"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="all">Tutti i Campionati</option>
                    {MONITORED_LEAGUES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.countryFlag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="input-search-bets"
                    type="text"
                    placeholder="Cerca squadra o partita..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bets Table: EXACT 12 COLUMNS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[1050px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3">1. Data Ins.</th>
                    <th className="py-3 px-3">2. Campionato</th>
                    <th className="py-3 px-2">3. Stagione</th>
                    <th className="py-3 px-3">4. Data Partita</th>
                    <th className="py-3 px-3">5. Partita</th>
                    <th className="py-3 px-3">6. Squadra Sel.</th>
                    <th className="py-3 px-2 text-center">7. Quota X</th>
                    <th className="py-3 px-3 text-right">8. Puntata</th>
                    <th className="py-3 px-3 text-right">9. Vincita Tot.</th>
                    <th className="py-3 px-3 text-right">10. Guadagno Netto</th>
                    <th className="py-3 px-3 text-center">11. Stato</th>
                    <th className="py-3 px-3 text-right">12. Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBets.map((bet) => {
                    const totalReturn =
                      bet.status === 'won'
                        ? bet.potentialPayout
                        : bet.status === 'lost'
                        ? 0
                        : bet.potentialPayout;

                    const netProfit =
                      bet.status === 'won'
                        ? (bet.netProfit !== undefined ? bet.netProfit : (bet.potentialPayout - bet.stake))
                        : bet.status === 'lost'
                        ? -bet.stake
                        : (bet.potentialPayout - bet.stake);

                    return (
                      <tr
                        key={bet.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          bet.status === 'won'
                            ? 'bg-emerald-50/30'
                            : bet.status === 'lost'
                            ? 'bg-rose-50/20'
                            : 'bg-amber-50/20'
                        }`}
                      >
                        {/* 1. Data inserimento */}
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {bet.createdAt}
                        </td>

                        {/* 2. Campionato */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                            <span>{bet.countryFlag}</span>
                            <span>{bet.leagueName}</span>
                          </span>
                        </td>

                        {/* 3. Stagione */}
                        <td className="py-3 px-2 font-mono text-slate-500 text-[11px]">
                          {bet.season}/{bet.season + 1}
                        </td>

                        {/* 4. Data partita */}
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                          {bet.matchDate}
                        </td>

                        {/* 5. Partita */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 whitespace-nowrap">
                            {bet.homeTeam} <span className="text-slate-400 font-normal">vs</span> {bet.awayTeam}
                          </div>
                          {bet.notes && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px]" title={bet.notes}>
                              {bet.notes}
                            </div>
                          )}
                        </td>

                        {/* 6. Squadra selezionata */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md text-[11px]">
                            {bet.alertTeam || `${bet.homeTeam}/${bet.awayTeam}`}
                          </span>
                        </td>

                        {/* 7. Quota X */}
                        <td className="py-3 px-2 text-center font-bold font-mono text-slate-900">
                          @{bet.odds.toFixed(2)}
                        </td>

                        {/* 8. Puntata */}
                        <td className="py-3 px-3 text-right font-bold font-mono text-slate-900">
                          €{bet.stake.toFixed(2)}
                        </td>

                        {/* 9. Vincita totale */}
                        <td className="py-3 px-3 text-right font-mono">
                          {bet.status === 'won' ? (
                            <span className="font-extrabold text-emerald-700">
                              €{totalReturn.toFixed(2)}
                            </span>
                          ) : bet.status === 'lost' ? (
                            <span className="font-semibold text-slate-400 line-through">
                              €{bet.potentialPayout.toFixed(2)}
                            </span>
                          ) : (
                            <span className="font-medium text-slate-600">
                              (€{bet.potentialPayout.toFixed(2)})
                            </span>
                          )}
                        </td>

                        {/* 10. Guadagno netto */}
                        <td className="py-3 px-3 text-right font-mono">
                          {bet.status === 'won' ? (
                            <span className="font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                              +€{netProfit.toFixed(2)}
                            </span>
                          ) : bet.status === 'lost' ? (
                            <span className="font-black text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                              -€{bet.stake.toFixed(2)}
                            </span>
                          ) : (
                            <span className="font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                              +€{bet.targetProfit?.toFixed(2) || (bet.potentialPayout - bet.stake).toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* 11. Stato (Colori richiesti: PENDING = arancione/giallo, WON = verde, LOST = rosso) */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {bet.status === 'won' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              WON
                            </span>
                          )}
                          {bet.status === 'lost' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
                              <XCircle className="w-3.5 h-3.5 text-rose-700" />
                              LOST
                            </span>
                          )}
                          {bet.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              PENDING
                            </span>
                          )}
                        </td>

                        {/* 12. Azioni */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* Regola con punteggio esatto */}
                            <button
                              type="button"
                              onClick={() => handleOpenScoreModal(bet)}
                              className="px-2 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border border-slate-200"
                              title="Regola con punteggio partita"
                            >
                              ⚽ Regola
                            </button>

                            {/* Azioni rapide di cambio stato */}
                            {bet.status === 'pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(bet.id, 'won')}
                                  className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md transition-colors cursor-pointer"
                                  title="Imposta come VINTA"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(bet.id, 'lost')}
                                  className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-md transition-colors cursor-pointer"
                                  title="Imposta come PERSA"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(bet.id, 'pending')}
                                className="p-1 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer text-[10px]"
                                title="Riporta a PENDING"
                              >
                                ⏳
                              </button>
                            )}

                            {/* Elimina */}
                            <button
                              type="button"
                              onClick={() => setDeleteModalBetId(bet.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Elimina scommessa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredBets.length === 0 && (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-3xl">📭</span>
                          <span className="font-semibold text-slate-600 text-sm">
                            Nessuna scommessa trovata con i filtri attuali.
                          </span>
                          <button
                            type="button"
                            onClick={() => onNavigate('bet-entry')}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Inserisci la prima giocata</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 2: RISULTATI PARTITE (MATCHES RESULTS DATABASE) */}
      {/* ========================================================= */}
      {activeView === 'matches' && (
        <div className="space-y-4 animate-fadeIn">
          {/* 4 Summary Cards per i Risultati Partite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block">
                Partite Totali nel DB
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {matchStats.total}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {MONITORED_LEAGUES.length} Campionati monitorati
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block">
                Risultati Conclusi (FT)
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {matchStats.finished}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Partite regolarmente terminate
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block">
                Pareggi Registrati (Segno X)
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-700 font-mono">
                  {matchStats.draws}
                </span>
                <span className="text-xs font-bold text-amber-700">
                  ({matchStats.drawPercentage.toFixed(1)}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Esiti terminati in parità
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block">
                In Programma (NS)
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-700 font-mono">
                  {matchStats.upcoming}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Prossimi turni giocabili
              </p>
            </div>
          </div>

          {/* Filter Bar per i Risultati Partite */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Filtro Esito Partita */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Esito:
                </span>
                <button
                  type="button"
                  onClick={() => setMatchOutcomeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    matchOutcomeFilter === 'all'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tutte ({matchStats.total})
                </button>
                <button
                  type="button"
                  onClick={() => setMatchOutcomeFilter('draws_only')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    matchOutcomeFilter === 'draws_only'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  🟡 Solo Pareggi X ({matchStats.draws})
                </button>
                <button
                  type="button"
                  onClick={() => setMatchOutcomeFilter('home_wins')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    matchOutcomeFilter === 'home_wins'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Vittorie Casa (1)
                </button>
                <button
                  type="button"
                  onClick={() => setMatchOutcomeFilter('away_wins')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    matchOutcomeFilter === 'away_wins'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Vittorie Trasferta (2)
                </button>
                <button
                  type="button"
                  onClick={() => setMatchOutcomeFilter('upcoming')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    matchOutcomeFilter === 'upcoming'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  In Programma ({matchStats.upcoming})
                </button>
              </div>

              {/* Filtri Campionato, Stagione e Ricerca */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {/* Select Campionato */}
                <div className="relative w-full sm:w-44">
                  <select
                    id="select-match-league"
                    value={matchLeagueFilter}
                    onChange={(e) => setMatchLeagueFilter(e.target.value)}
                    aria-label="Filtra partite per campionato"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="all">Tutti i Campionati</option>
                    {MONITORED_LEAGUES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.countryFlag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Stagione */}
                <div className="relative w-full sm:w-36">
                  <select
                    id="select-match-season"
                    value={matchSeasonFilter}
                    onChange={(e) => setMatchSeasonFilter(Number(e.target.value))}
                    aria-label="Filtra partite per stagione"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  >
                    {availableSeasons.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input Ricerca Squadra */}
                <div className="relative w-full sm:w-52">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="input-search-matches"
                    type="text"
                    placeholder="Cerca squadra..."
                    value={matchSearchQuery}
                    onChange={(e) => setMatchSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabella Risultati Partite */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[850px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Data & Orario</th>
                    <th className="py-3 px-3">Campionato</th>
                    <th className="py-3 px-2">Giornata</th>
                    <th className="py-3 px-4">Partita</th>
                    <th className="py-3 px-3 text-center">Risultato Finale</th>
                    <th className="py-3 px-3 text-center">Segno / Esito</th>
                    <th className="py-3 px-3 text-right">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredFixtures.map((fixture) => {
                    const formattedDate = new Date(fixture.date).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    let outcomeLabel = 'In programma';
                    let outcomeBadgeClass = 'bg-slate-100 text-slate-600 border-slate-200';

                    if (fixture.isFinished) {
                      if (fixture.goalsHome !== null && fixture.goalsAway !== null) {
                        if (fixture.goalsHome === fixture.goalsAway) {
                          outcomeLabel = 'SEGNO X (Pareggio)';
                          outcomeBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300 font-black';
                        } else if (fixture.goalsHome > fixture.goalsAway) {
                          outcomeLabel = 'SEGNO 1 (Casa)';
                          outcomeBadgeClass = 'bg-blue-50 text-blue-800 border-blue-200';
                        } else {
                          outcomeLabel = 'SEGNO 2 (Trasferta)';
                          outcomeBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                        }
                      }
                    }

                    return (
                      <tr
                        key={fixture.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          fixture.isDraw ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        {/* Data & Orario */}
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Campionato */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                            <span>{fixture.countryFlag}</span>
                            <span>{fixture.leagueName}</span>
                          </span>
                        </td>

                        {/* Giornata */}
                        <td className="py-3 px-2 font-semibold text-slate-600 text-[11px] whitespace-nowrap">
                          {fixture.round}
                        </td>

                        {/* Partita */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 font-bold text-slate-900 whitespace-nowrap">
                            <span className={fixture.isFinished && fixture.goalsHome! > fixture.goalsAway! ? 'text-blue-900 font-black' : ''}>
                              {fixture.homeTeam.name}
                            </span>
                            <span className="text-slate-400 font-normal text-[11px]">vs</span>
                            <span className={fixture.isFinished && fixture.goalsAway! > fixture.goalsHome! ? 'text-blue-900 font-black' : ''}>
                              {fixture.awayTeam.name}
                            </span>
                          </div>
                        </td>

                        {/* Risultato Finale */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {fixture.isFinished && fixture.goalsHome !== null && fixture.goalsAway !== null ? (
                            <span
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-mono font-black text-sm tracking-wider ${
                                fixture.isDraw
                                  ? 'bg-amber-100 text-amber-950 border border-amber-300 ring-2 ring-amber-400/20'
                                  : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {fixture.goalsHome} - {fixture.goalsAway}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <Clock className="w-3 h-3 text-slate-400" />
                              Da Giocare
                            </span>
                          )}
                        </td>

                        {/* Segno / Esito */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${outcomeBadgeClass}`}
                          >
                            {fixture.isDraw && <span className="text-amber-600">⨉</span>}
                            {outcomeLabel}
                          </span>
                        </td>

                        {/* Azione rapida */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleBetOnFixture(fixture)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                            title="Scommetti sul pareggio di questa partita"
                          >
                            <Plus className="w-3 h-3 text-emerald-600" />
                            <span>Scommetti X</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredFixtures.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-3xl">⚽</span>
                          <span className="font-semibold text-slate-600 text-sm">
                            Nessuna partita trovata con i filtri selezionati.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALI: REGOLAZIONE, ELIMINAZIONE, CASSA INIZIALE */}
      {/* ========================================================= */}

      {/* MODAL 1: Regolazione Esito da Risultato Partita */}
      {scoreModalBet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Regola Esito Partita
              </h3>
              <button
                type="button"
                onClick={() => setScoreModalBet(null)}
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <div className="font-bold text-slate-900">
                {scoreModalBet.homeTeam} vs {scoreModalBet.awayTeam}
              </div>
              <div className="text-slate-500">
                {scoreModalBet.leagueName} • Quota X: @{scoreModalBet.odds.toFixed(2)} • Puntata: €{scoreModalBet.stake.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Inserisci Risultato Finale:
              </label>
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-600 block mb-1">
                    {scoreModalBet.homeTeam}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={homeGoals}
                    onChange={(e) => setHomeGoals(parseInt(e.target.value, 10) || 0)}
                    className="w-16 text-center text-xl font-bold py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <span className="text-2xl font-black text-slate-400 mt-4">-</span>

                <div className="text-center">
                  <span className="text-xs font-bold text-slate-600 block mb-1">
                    {scoreModalBet.awayTeam}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={awayGoals}
                    onChange={(e) => setAwayGoals(parseInt(e.target.value, 10) || 0)}
                    className="w-16 text-center text-xl font-bold py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Anteprima esito automatico */}
            <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
              homeGoals === awayGoals
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {homeGoals === awayGoals ? (
                <span>
                  ✅ Pareggio ({homeGoals}-{awayGoals}): Scommessa VINTA (+€
                  {(scoreModalBet.potentialPayout - scoreModalBet.stake).toFixed(2)})
                </span>
              ) : (
                <span>
                  ❌ Nessun pareggio ({homeGoals}-{awayGoals}): Scommessa PERSA (-€
                  {scoreModalBet.stake.toFixed(2)})
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setScoreModalBet(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleConfirmScoreSettle}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-2xs cursor-pointer"
              >
                Salva & Regola
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Conferma Eliminazione Singola Scommessa */}
      {deleteModalBetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
              🗑
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Conferma Eliminazione
              </h3>
              <p className="text-xs text-slate-500">
                Sei sicuro di voler eliminare questa scommessa dall'archivio? La cassa attuale verrà ricalcolata automaticamente.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalBetId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Annulla
              </button>
              <button
                id="btn-confirm-delete-bet"
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs cursor-pointer"
              >
                🗑 Elimina Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2B: Conferma Svuotamento Completo Database Scommesse */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Svuotare tutto il Database?
              </h3>
              <p className="text-xs text-slate-500">
                Stai per eliminare tutte le <span className="font-bold text-slate-800">{bets.length}</span> scommesse registrate. L'operazione è definitiva e non verranno più ripristinate all'avvio.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Annulla
              </button>
              <button
                id="btn-confirm-clear-all-bets"
                type="button"
                onClick={handleConfirmClearAll}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs cursor-pointer"
              >
                🗑 Svuota Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Modifica Cassa Iniziale */}
      {isEditingBankroll && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Modifica Cassa Iniziale
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingBankroll(false)}
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Importo Cassa Iniziale (€)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={initialBankrollInput}
                onChange={(e) => setInitialBankrollInput(e.target.value)}
                className="w-full text-base font-bold px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingBankroll(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSaveInitialBankroll}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-2xs cursor-pointer"
              >
                Salva Cassa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
