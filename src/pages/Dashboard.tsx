import React, { useState, useEffect, useMemo } from 'react';
import { PageId } from '../types';
import { dataService } from '../services/dataService';
import { footballDataService } from '../services/footballDataService';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState(() => dataService.getSettings());
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    const unsub1 = dataService.subscribe(() => {
      setSettings(dataService.getSettings());
      setDataVersion((v) => v + 1);
    });
    const unsub2 = footballDataService.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Dati in tempo reale per Card 1 (Alert non pareggia da)
  const noDrawAlerts = useMemo(() => {
    return dataService.getNoDrawAlerts('all');
  }, [settings, dataVersion]);

  // Dati in tempo reale per Card 2 (Alert pareggi frequenti)
  const frequentDrawAlerts = useMemo(() => {
    return dataService.getFrequentDrawAlerts('all', undefined, 7, 2, 0);
  }, [settings, dataVersion]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* ========================================================= */}
        {/* RIQUADRO 1: ALERT NON PAREGGIA DA */}
        {/* ========================================================= */}
        <div
          id="card-home-menu-1"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('no-draw-alerts')}
          className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-rose-300 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-rose-500"
        >
          <div>
            {/* Header Card con titolo a piena larghezza */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                🚨
              </div>
              <h3 className="text-base font-black text-slate-900 leading-tight group-hover:text-rose-700 transition-colors">
                ALERT NON PAREGGIA DA
              </h3>
            </div>

            {/* Tabella / Resoconto Allineato con Badge Attivi integrato sotto */}
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Campionati:</span>
                <span className="font-bold text-slate-900">Tutti (10 Leghe Europee)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Range Minimo selezionato:</span>
                <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                  {settings.noDrawAlertThreshold || 7} partite
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Squadre in Alert Attivo:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
                  <span className="text-sm font-extrabold">{noDrawAlerts.length}</span>
                  <span>attivi</span>
                </span>
              </div>

              {/* Top 3 squadre con serie più lunga */}
              {noDrawAlerts.length > 0 && (
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    Principali squadre in alert:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {noDrawAlerts.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-slate-200/90 px-2 py-0.5 rounded-lg text-slate-800 shadow-2xs"
                      >
                        <span>{item.countryFlag}</span>
                        <span className="font-bold text-slate-900">{item.teamName}</span>
                        <span className="text-slate-900 font-bold">({item.matchesWithoutDraw} g.)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIQUADRO 2: ALERT PAREGGI FREQUENTI */}
        {/* ========================================================= */}
        <div
          id="card-home-menu-2"
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('frequent-draws-alerts')}
          className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <div>
            {/* Header Card con titolo a piena larghezza */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center text-lg shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                🔄
              </div>
              <h3 className="text-base font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                ALERT PAREGGI FREQUENTI
              </h3>
            </div>

            {/* Tabella / Resoconto Allineato con Badge Attivi integrato sotto */}
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Campionati:</span>
                <span className="font-bold text-slate-900">Tutti (10 Leghe Europee)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Range / Finestra Partite:</span>
                <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                  Ultime 7 p. (Min. 2 pareggi)
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Squadre in Alert Frequenti:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                  <span className="text-sm font-extrabold">{frequentDrawAlerts.length}</span>
                  <span>attivi</span>
                </span>
              </div>

              {/* Top 3 squadre con frequenza più alta */}
              {frequentDrawAlerts.length > 0 && (
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    Club con la frequenza più alta:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {frequentDrawAlerts.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-slate-200/90 px-2 py-0.5 rounded-lg text-slate-800 shadow-2xs"
                      >
                        <span>{item.countryFlag}</span>
                        <span className="font-bold text-slate-900">{item.teamName}</span>
                        <span className="text-slate-900 font-bold">
                          ({item.drawsCount}X - {item.drawPercentage.toFixed(1)}%)
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
