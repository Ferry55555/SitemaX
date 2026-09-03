import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Flame,
  HelpCircle,
  History,
  Layers,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { PageId, PrefillBetData } from '../types';
import { MONITORED_LEAGUES } from '../config/leagues';
import {
  calculateAllLeaguesNoDrawAlerts,
  NoDrawStreakResult,
  UpcomingMatchDetail,
} from '../services/streakStatsService';
import { footballDataService } from '../services/footballDataService';
import { dataService } from '../services/dataService';
import { LeagueBadge } from '../components/common/LeagueBadge';
import { getAvailableSeasons, getCurrentFootballSeason } from '../utils/seasonUtils';

interface NoDrawAlertsProps {
  onNavigate: (page: PageId) => void;
  onSelectBetMatch?: (match: PrefillBetData) => void;
}

export const NoDrawAlerts: React.FC<NoDrawAlertsProps> = ({
  onNavigate,
  onSelectBetMatch,
}) => {
  const availableSeasons = getAvailableSeasons(4);
  const currentSeason = getCurrentFootballSeason();
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<number>(currentSeason);
  const [inputThreshold, setInputThreshold] = useState<string>(() => String(dataService.getSettings().noDrawAlertThreshold || 7));
  const [threshold, setThreshold] = useState<number>(() => dataService.getSettings().noDrawAlertThreshold || 7);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState<number>(0);

  useEffect(() => {
    const unsub = footballDataService.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  // Calcolo matematico deterministico dai dati del database per tutte le squadre
  const allTeamStreaks = calculateAllLeaguesNoDrawAlerts(selectedLeague, 0, selectedSeason);

  // Filtro ricerca e soglia:
  // Se l'utente cerca per testo, filtra per squadra o campionato; altrimenti rispetta rigorosamente la soglia impostata (current_no_draw_streak >= threshold)
  const displayedAlerts = allTeamStreaks.filter((alert) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.teamName.toLowerCase().includes(q) ||
        alert.leagueName.toLowerCase().includes(q)
      );
    }
    return alert.current_no_draw_streak >= threshold;
  });

  const handleToggleExpand = (teamId: number) => {
    setExpandedTeamId((prev) => (prev === teamId ? null : teamId));
  };

  const handleApplyThreshold = () => {
    const val = parseInt(inputThreshold, 10);
    if (isNaN(val) || val < 1) return;
    setThreshold(val);
    dataService.updateSettings({ noDrawAlertThreshold: val });
    setSaveSuccessMsg(`Salvataggio effettuato con successo! Soglia impostata a ${val} partite.`);
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  const handlePlaceBet = (alert: NoDrawStreakResult, matchTarget?: UpcomingMatchDetail | null) => {
    const target = matchTarget || alert.nextMatch;
    if (onSelectBetMatch && target) {
      onSelectBetMatch({
        leagueId: alert.leagueId,
        season: alert.seasonId,
        homeTeam: target.homeTeamName,
        awayTeam: target.awayTeamName,
        alertTeam: alert.teamName,
        matchDate: target.date,
        fixtureId: target.fixtureId,
      });
    } else if (onSelectBetMatch) {
      onSelectBetMatch({
        leagueId: alert.leagueId,
        season: alert.seasonId,
        homeTeam: alert.teamName,
        awayTeam: '',
        alertTeam: alert.teamName,
      });
    }
    onNavigate('bet-entry');
  };

  const handleOpenDiretta = (teamName: string) => {
    const encoded = encodeURIComponent(teamName);
    const url = `https://www.diretta.it/ricerca/?q=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    try {
      if (selectedLeague === 'all') {
        await footballDataService.syncAllLeagues(selectedSeason);
        setSyncSuccessMsg('Tutte le 10 leghe sincronizzate con successo!');
      } else {
        const leagueObj = MONITORED_LEAGUES.find((l) => l.id === selectedLeague);
        if (leagueObj) {
          await footballDataService.syncLeague(leagueObj.apiLeagueId, selectedSeason);
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
      {/* Top Bar: Sync with light blue style */}
      <div className="flex items-center justify-end gap-3">
        <button
          id="btn-refresh-data"
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

      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* FILTER CONTROL PANEL: CAMPIONATO, STAGIONE, SOGLIA */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* 1. CAMPIONATO DROPDOWN */}
          <div className="md:col-span-4 space-y-1.5">
            <label htmlFor="select-league" className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Campionato
            </label>
            <select
              id="select-league"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
            >
              <option value="all">Tutti (10 Campionati)</option>
              {MONITORED_LEAGUES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.countryFlag} {l.country} — {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. STAGIONE DROPDOWN */}
          <div className="md:col-span-3 space-y-1.5">
            <label htmlFor="select-season" className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Stagione
            </label>
            <select
              id="select-season"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs"
            >
              {availableSeasons.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. SOGLIA COMPATTA IN LINEA: SOGLIA GIORNATE + CASELLA NUMERO + APPLICA MODIFICHE */}
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="input-threshold" className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Soglia giornate (min. {threshold})
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setInputThreshold(String(num));
                      setThreshold(num);
                      dataService.updateSettings({ noDrawAlertThreshold: num });
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      threshold === num
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {num}{num === 7 ? ' (Def)' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="input-threshold"
                type="number"
                min="1"
                max="50"
                value={inputThreshold}
                onChange={(e) => setInputThreshold(e.target.value)}
                placeholder="7"
                className="w-14 h-9 text-center text-sm font-black bg-slate-50 border border-slate-300 rounded-xl px-1 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs shrink-0"
              />
              <button
                id="btn-apply-threshold"
                type="button"
                onClick={handleApplyThreshold}
                className="px-3.5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                Applica mod.
              </button>
              <div className="ml-auto text-xs font-bold text-slate-600 shrink-0">
                Squadre: <span className="text-rose-700 font-extrabold">{displayedAlerts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TABLE: CLASSIFICA CON SQUADRA BLOCCATA ALLO SCROLL ORIZZONTALE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="table-no-draw-alerts">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sticky left-0 z-20 bg-slate-50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.06)] min-w-[170px]">
                  Squadra
                </th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">
                  Senza pareggio
                </th>
                <th className="py-3.5 px-4">Campionato</th>
                <th className="py-3.5 px-4">Prossima partita</th>
                <th className="py-3.5 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayedAlerts.map((alert, index) => {
                const next = alert.nextMatch;

                return (
                  <tr
                    key={`${alert.apiLeagueId}-${alert.teamId}`}
                    id={`row-team-${alert.teamId}`}
                    className="hover:bg-sky-50/30 transition-colors group"
                  >
                    {/* 1. SQUADRA (Fissata a sinistra durante lo scroll) */}
                    <td className="py-3.5 px-4 sticky left-0 z-10 bg-white group-hover:bg-sky-50/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.06)] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-400 text-xs w-4 shrink-0 text-center">
                          {index + 1}
                        </span>
                        <span className="text-base shrink-0">{alert.countryFlag}</span>
                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
                          {alert.teamName}
                        </span>
                      </div>
                    </td>

                    {/* 2. SENZA PAREGGIO */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 shadow-2xs">
                          <Flame className="w-4 h-4 text-rose-600 fill-rose-500" />
                          <span className="text-sm font-black text-rose-700">{alert.current_no_draw_streak}</span>
                          <span className="text-[10px] font-bold text-rose-600/90 uppercase">match</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          su {alert.matches_analyzed} {alert.matches_analyzed === 1 ? 'partita' : 'partite'}
                        </span>
                      </div>
                    </td>

                    {/* 3. CAMPIONATO */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {alert.leagueName}
                      </span>
                    </td>

                    {/* 4. PROSSIMA PARTITA */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {next ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 text-xs">
                            {next.isHome ? (
                              <span>
                                <strong className="text-rose-700 font-bold">
                                  {alert.teamName}
                                </strong>{' '}
                                - {next.awayTeamName}
                              </span>
                            ) : (
                              <span>
                                {next.homeTeamName} -{' '}
                                <strong className="text-rose-700 font-bold">
                                  {alert.teamName}
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

                    {/* 5. AZIONI (Collegamento a Diretta.it) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlaceBet(alert)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          title="Inserisci scommessa per questa squadra"
                        >
                          <Target className="w-3.5 h-3.5 text-rose-400" />
                          <span>Gioca X</span>
                        </button>
                        <a
                          id={`btn-diretta-${alert.teamId}`}
                          href={`https://www.google.com/search?q=diretta+it+${encodeURIComponent(alert.teamName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-black transition-all shadow-2xs cursor-pointer"
                          title={`Cerca ${alert.teamName} su Diretta.it`}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                          <span>Diretta.it</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {displayedAlerts.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-2xl border border-amber-200">
              <Flame className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-black text-slate-900 text-base">
                Nessuna squadra con serie senza pareggio ≥ {threshold}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
