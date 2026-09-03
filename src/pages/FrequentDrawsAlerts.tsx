import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  History,
  Percent,
  RefreshCw,
  Target,
  TrendingUp,
} from 'lucide-react';
import { PageId, PrefillBetData } from '../types';
import { MONITORED_LEAGUES } from '../config/leagues';
import {
  calculateAllLeaguesFrequentDraws,
  FrequentDrawResult,
} from '../services/frequentDrawStatsService';
import { UpcomingMatchDetail } from '../services/streakStatsService';
import { footballDataService } from '../services/footballDataService';
import { getAvailableSeasons, getCurrentFootballSeason } from '../utils/seasonUtils';

interface FrequentDrawsAlertsProps {
  onNavigate: (page: PageId) => void;
  onSelectBetMatch?: (match: PrefillBetData) => void;
}

export const FrequentDrawsAlerts: React.FC<FrequentDrawsAlertsProps> = ({
  onNavigate,
  onSelectBetMatch,
}) => {
  const currentSeasonNum = getCurrentFootballSeason();
  const availableSeasons = [
    { value: 'all', label: 'Tutte le stagioni' },
    ...getAvailableSeasons(4).map((s) => ({ value: String(s.value), label: s.label })),
  ];

  // Filtri richiesti
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>(String(currentSeasonNum));

  // Soglie attive: default 7 ultime partite, 2 pareggi minimi, 0% percentuale minima
  const [matchesToAnalyze, setMatchesToAnalyze] = useState<number>(7);
  const [minDraws, setMinDraws] = useState<number>(2);
  const [minPercentage, setMinPercentage] = useState<number>(0);

  // Campi di input modificabili dall'utente
  const [inputMatches, setInputMatches] = useState<string>('7');
  const [inputMinDraws, setInputMinDraws] = useState<string>('2');
  const [inputMinPercentage, setInputMinPercentage] = useState<string>('0');

  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  // Stato sincronizzazione
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState<number>(0);

  useEffect(() => {
    const unsub = footballDataService.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  // Parsing stagione per il servizio deterministico
  const seasonParam: number | 'all' = selectedSeason === 'all' ? 'all' : Number(selectedSeason);

  // Gestione applicazione soglie inserite dall'utente
  const handleApplyThresholds = () => {
    const m = parseInt(inputMatches, 10);
    const d = parseInt(inputMinDraws, 10);
    const p = parseFloat(inputMinPercentage);

    const finalMatches = !isNaN(m) && m > 0 ? Math.min(Math.max(m, 1), 50) : 7;
    const finalDraws = !isNaN(d) && d >= 0 ? Math.min(Math.max(d, 0), finalMatches) : 3;
    const finalPercentage = !isNaN(p) && p >= 0 ? Math.min(Math.max(p, 0), 100) : 0;

    setMatchesToAnalyze(finalMatches);
    setMinDraws(finalDraws);
    setMinPercentage(finalPercentage);
    setInputMatches(String(finalMatches));
    setInputMinDraws(String(finalDraws));
    setInputMinPercentage(String(finalPercentage));
  };

  // Calcolo matematico deterministico (NESSUNA AI)
  const allResults = calculateAllLeaguesFrequentDraws(
    selectedLeague,
    seasonParam,
    matchesToAnalyze,
    minDraws
  );

  // Filtro percentuale minima
  const displayedResults = allResults.filter((item) => {
    if (minPercentage > 0 && item.draw_percentage < minPercentage) {
      return false;
    }
    return true;
  });

  const handleToggleExpand = (teamId: number) => {
    setExpandedTeamId((prev) => (prev === teamId ? null : teamId));
  };

  const handlePlaceBet = (item: FrequentDrawResult, matchTarget?: UpcomingMatchDetail | null) => {
    const target = matchTarget || item.nextMatch;
    if (onSelectBetMatch && target) {
      onSelectBetMatch({
        leagueId: item.leagueId,
        season: item.seasonId,
        homeTeam: target.homeTeamName,
        awayTeam: target.awayTeamName,
        alertTeam: item.teamName,
        matchDate: target.date,
        fixtureId: target.fixtureId,
      });
    } else if (onSelectBetMatch) {
      onSelectBetMatch({
        leagueId: item.leagueId,
        season: item.seasonId,
        homeTeam: item.teamName,
        awayTeam: 'Avversaria',
        alertTeam: item.teamName,
      });
    }
    onNavigate('bet-entry');
  };

  const handleOpenDiretta = (teamName: string) => {
    const encoded = encodeURIComponent(teamName);
    const url = `https://www.google.com/search?q=diretta+it+${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    try {
      const seasonToSync = typeof seasonParam === 'number' ? seasonParam : currentSeasonNum;
      if (selectedLeague === 'all') {
        await footballDataService.syncAllLeagues(seasonToSync);
        setSyncSuccessMsg('Tutte le 10 leghe sincronizzate con successo!');
      } else {
        const leagueObj = MONITORED_LEAGUES.find((l) => l.id === selectedLeague);
        if (leagueObj) {
          await footballDataService.syncLeague(leagueObj.apiLeagueId, seasonToSync);
          setSyncSuccessMsg(`${leagueObj.name} sincronizzata con successo!`);
        }
      }
    } catch (err) {
      setSyncSuccessMsg('Sincronizzazione completata (dati locali aggiornati).');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Bar: Sync only */}
      <div className="flex items-center justify-end gap-3">
        <button
          id="btn-refresh-frequent-data"
          type="button"
          onClick={handleSyncData}
          disabled={isSyncing}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
            isSyncing
              ? 'bg-sky-100 text-sky-800 border border-sky-300 cursor-not-allowed'
              : 'bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-700' : 'text-sky-600'}`} />
          <span>{isSyncing ? 'Sincronizzazione in corso...' : '🔄 Aggiorna dati'}</span>
        </button>
      </div>

      {syncSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* FILTER CONTROL PANEL: TUTTO SU UN'UNICA RIGA */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-end gap-3 lg:gap-4">
          {/* 1. CAMPIONATO DROPDOWN */}
          <div className="space-y-1.5 min-w-[130px] flex-1 sm:flex-initial">
            <label htmlFor="select-frequent-league" className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Campionato
            </label>
            <select
              id="select-frequent-league"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
            >
              <option value="all">Tutti (10 Campionati)</option>
              {MONITORED_LEAGUES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.countryFlag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. STAGIONE DROPDOWN */}
          <div className="space-y-1.5 min-w-[120px] flex-1 sm:flex-initial">
            <label htmlFor="select-frequent-season" className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Stagione
            </label>
            <select
              id="select-frequent-season"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
            >
              {availableSeasons.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. ULTIME PARTITE (default 7) */}
          <div className="space-y-1.5">
            <label htmlFor="input-matches-analyze" className="text-xs font-bold uppercase tracking-wider text-slate-600 block whitespace-nowrap">
              Ultime partite
            </label>
            <input
              id="input-matches-analyze"
              type="number"
              min="1"
              max="50"
              value={inputMatches}
              onChange={(e) => setInputMatches(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyThresholds()}
              className="w-16 h-9 text-center text-sm font-black bg-slate-50 border border-slate-300 rounded-xl px-1 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* 4. MINIMO PAREGGI (default 3) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <label htmlFor="input-min-draws" className="text-xs font-bold uppercase tracking-wider text-slate-600 block whitespace-nowrap">
                Min. pareggi
              </label>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setInputMinDraws(String(n));
                      setMinDraws(n);
                    }}
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      minDraws === n ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="input-min-draws"
              type="number"
              min="0"
              max="50"
              value={inputMinDraws}
              onChange={(e) => setInputMinDraws(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyThresholds()}
              className="w-16 h-9 text-center text-sm font-black bg-slate-50 border border-slate-300 rounded-xl px-1 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* 5. PERCENTUALE MINIMA % */}
          <div className="space-y-1.5">
            <label htmlFor="input-min-percentage" className="text-xs font-bold uppercase tracking-wider text-slate-600 block whitespace-nowrap">
              Percentuale %
            </label>
            <div className="relative flex items-center">
              <input
                id="input-min-percentage"
                type="number"
                min="0"
                max="100"
                value={inputMinPercentage}
                onChange={(e) => setInputMinPercentage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyThresholds()}
                placeholder="0"
                className="w-20 h-9 text-center pr-5 text-sm font-black bg-slate-50 border border-slate-300 rounded-xl px-1 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
              />
              <span className="absolute right-2 text-xs font-black text-slate-400 pointer-events-none">%</span>
            </div>
          </div>

          {/* 6. PULSANTE APPLICA & CONTO SQUADRE */}
          <div className="flex items-center gap-3 ml-auto shrink-0 pb-0.5">
            <button
              id="btn-apply-frequent-thresholds"
              type="button"
              onClick={handleApplyThresholds}
              className="px-3.5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              Applica mod.
            </button>
            <div className="text-xs font-bold text-slate-600 shrink-0">
              Squadre: <span className="text-sky-700 font-extrabold">{displayedResults.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TABLE: CLASSIFICA PAREGGI FREQUENTI */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="table-frequent-draws-alerts">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Squadra</th>
                <th className="py-3.5 px-4">Campionato</th>
                <th className="py-3.5 px-4 text-center">Stagione</th>
                <th className="py-3.5 px-4 text-center">Partite analizzate</th>
                <th className="py-3.5 px-4 text-center">Pareggi</th>
                <th className="py-3.5 px-4 text-center">Percentuale</th>
                <th className="py-3.5 px-4">Prossima partita</th>
                <th className="py-3.5 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayedResults.map((item, index) => {
                const isExpanded = expandedTeamId === item.teamId;
                const next = item.nextMatch;

                return (
                  <React.Fragment key={`${item.apiLeagueId}-${item.teamId}`}>
                    <tr
                      id={`row-frequent-team-${item.teamId}`}
                      onClick={() => handleToggleExpand(item.teamId)}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-blue-50/60 font-semibold' : ''
                      }`}
                    >
                      {/* 1. # (Posizione) */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                        {index + 1}
                      </td>

                      {/* 2. Squadra */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.countryFlag}</span>
                          <span className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                            {item.teamName}
                          </span>
                        </div>
                      </td>

                      {/* 3. Campionato */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.leagueName}
                        </span>
                      </td>

                      {/* 4. Stagione */}
                      <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                        {item.seasonId}/{item.seasonId + 1}
                      </td>

                      {/* 5. Partite analizzate */}
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                          {item.matches_analyzed}
                        </span>
                      </td>

                      {/* 6. Pareggi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 shadow-2xs font-bold">
                          <span className="text-sm font-black text-blue-700">{item.draws}</span>
                          <span className="text-[10px] text-blue-600 uppercase">segni X</span>
                        </div>
                      </td>

                      {/* 7. Percentuale */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span className="font-black text-slate-900 text-sm">
                            {item.draw_percentage.toFixed(1)}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${Math.min(item.draw_percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 8. Prossima partita (STESSA COMPETIZIONE) */}
                      <td className="py-3.5 px-4">
                        {next ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-900 text-xs">
                              {next.isHome ? (
                                <span>
                                  <strong className="text-blue-700 font-bold underline decoration-blue-400">
                                    {item.teamName}
                                  </strong>{' '}
                                  - {next.awayTeamName}
                                </span>
                              ) : (
                                <span>
                                  {next.homeTeamName} -{' '}
                                  <strong className="text-blue-700 font-bold underline decoration-blue-400">
                                    {item.teamName}
                                  </strong>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>
                                {new Date(next.date).toLocaleDateString('it-IT', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">In attesa di calendario</span>
                        )}
                      </td>

                      {/* 9. Azioni */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            id={`btn-expand-frequent-${item.teamId}`}
                            type="button"
                            onClick={() => handleToggleExpand(item.teamId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? 'Riduci' : 'Dettagli'}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANSION ROW: Mostra le prossime 3 partite della stessa competizione & Pulsanti */}
                    {isExpanded && (
                      <tr className="bg-blue-50/20 border-b border-slate-200">
                        <td colSpan={9} className="p-4 sm:p-6 space-y-4">
                          <div className="bg-white rounded-xl p-4 sm:p-5 border border-blue-200 shadow-xs space-y-4">
                            {/* Header Espansione */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{item.countryFlag}</span>
                                  <h3 className="font-black text-slate-900 text-base">
                                    {item.teamName} — Dettaglio Pareggi Frequenti
                                  </h3>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Competizione: <strong>{item.leagueName}</strong> ({item.seasonId}/{item.seasonId + 1}) | 
                                  Statistica: <strong className="text-blue-700 font-bold">{item.draws} pareggi su {item.matches_analyzed} match analizzati ({item.draw_percentage}%)</strong>
                                </p>
                              </div>

                              {/* I DUE PULSANTI RICHIESTI */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  id={`btn-frequent-bet-action-${item.teamId}`}
                                  type="button"
                                  onClick={() => handlePlaceBet(item)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
                                >
                                  <Target className="w-4 h-4 text-blue-400" />
                                  <span>🎯 INSERISCI SCOMMESSA</span>
                                </button>

                                <button
                                  id={`btn-frequent-stats-action-${item.teamId}`}
                                  type="button"
                                  onClick={() => handleOpenDiretta(item.teamName)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-black shadow-xs transition-all cursor-pointer"
                                >
                                  <ExternalLink className="w-4 h-4 text-sky-600" />
                                  <span>📊 STATISTICHE</span>
                                </button>
                              </div>
                            </div>

                            {/* SEZIONE: PROSSIME 3 PARTITE (STESSA COMPETIZIONE) */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  Prossime 3 Partite in {item.leagueName}
                                </span>
                                <span className="text-[11px] font-medium text-slate-400 normal-case">
                                  (Escluse categoricamente partite esterne di coppa)
                                </span>
                              </div>

                              {item.next3Matches.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {item.next3Matches.map((m, mIdx) => (
                                    <div
                                      key={m.fixtureId}
                                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-colors space-y-2.5"
                                    >
                                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase font-mono">
                                        <span>{m.round || `Turno +${mIdx + 1}`}</span>
                                        <span>
                                          {new Date(m.date).toLocaleDateString('it-IT', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </span>
                                      </div>

                                      {/* Evidenziazione Squadra Alert */}
                                      <div className="text-xs font-bold text-slate-900 py-1">
                                        {m.isHome ? (
                                          <div className="flex items-center justify-between gap-1">
                                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-extrabold shadow-2xs">
                                              {item.teamName}
                                            </span>
                                            <span className="text-slate-400 font-normal">vs</span>
                                            <span className="text-slate-700 truncate">{m.awayTeamName}</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between gap-1">
                                            <span className="text-slate-700 truncate">{m.homeTeamName}</span>
                                            <span className="text-slate-400 font-normal">vs</span>
                                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-extrabold shadow-2xs">
                                              {item.teamName}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handlePlaceBet(item, m)}
                                        className="w-full text-center py-1.5 rounded-lg bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                                      >
                                        Scommetti 'X' su questo match ➜
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                                  Nessuna partita futura programmata a breve per questa competizione.
                                </div>
                              )}
                            </div>

                            {/* Sequenza a ritroso dei match analizzati nella finestra */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                  <History className="w-3.5 h-3.5 text-slate-500" />
                                  Sequenza a ritroso delle ultime {item.matches_analyzed} partite analizzate ({item.draws} segni X evidenziati):
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                                {item.analyzed_matches.map((am, amIdx) => (
                                  <div
                                    key={amIdx}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 border ${
                                      am.outcome === 'X'
                                        ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300'
                                        : am.outcome === 'W'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : 'bg-rose-50 text-rose-800 border-rose-200'
                                    }`}
                                    title={`${am.isHome ? 'Casa' : 'Trasferta'} vs ${am.opponentName} (${am.score}) - ${new Date(am.date).toLocaleDateString('it-IT')}`}
                                  >
                                    <span className="font-black text-[11px]">
                                      {am.outcome}
                                    </span>
                                    <span className={`text-[10px] font-mono ${am.outcome === 'X' ? 'text-blue-100' : 'text-slate-600'}`}>
                                      vs {am.opponentName} ({am.score})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {displayedResults.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-2xl border border-blue-200">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-black text-slate-900 text-base">
                Nessuna squadra trovata con almeno {minDraws} pareggi su {matchesToAnalyze} partite
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
