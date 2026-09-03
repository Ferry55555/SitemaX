import React, { useState, useEffect } from 'react';
import { PageId } from '../../types';
import { dataService } from '../../services/dataService';
import { calculateBankrollEconomics } from '../../services/betCalculationService';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const [settings, setSettings] = useState(() => dataService.getSettings());
  const [bets, setBets] = useState(() => dataService.getBets());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setSettings(dataService.getSettings());
      setBets(dataService.getBets());
    });
    return () => unsubscribe();
  }, []);

  const bankrollSummary = calculateBankrollEconomics(settings.initialBankroll, bets);

  const getMenuDisplayName = (page: PageId): string => {
    switch (page) {
      case 'dashboard':
        return 'Home';
      case 'no-draw-alerts':
        return 'Alert Non Pareggia Da';
      case 'frequent-draws-alerts':
        return 'Alert Pareggi Frequenti';
      case 'bet-entry':
        return 'Inserimento Scommessa';
      case 'bet-database':
        return 'Database Scommesse';
      default:
        return 'Home';
    }
  };

  const getMenuEmoji = (page: PageId): string => {
    switch (page) {
      case 'dashboard':
        return '🏠';
      case 'no-draw-alerts':
        return '🚨';
      case 'frequent-draws-alerts':
        return '🔄';
      case 'bet-entry':
        return '💰';
      case 'bet-database':
        return '📊';
      default:
        return '⚽';
    }
  };

  const currentMenuName = getMenuDisplayName(currentPage);
  const currentEmoji = getMenuEmoji(currentPage);

  return (
    <header
      id="top-fixed-navbar"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 space-y-2">
        {/* 1. Sistema X da sola al centro senza pallino, senza riquadro ovale, senza sfondo nero */}
        <div className="text-center">
          <h1
            id="brand-sistema-x-title"
            style={{ fontFamily: '"Belwe Bd BT", "Belwe Bold", "Belwe", "Cinzel Decorative", "Cinzel", "Copperplate", "Georgia", serif' }}
            className="text-lg sm:text-xl font-bold tracking-widest text-slate-900 uppercase select-none font-belwe"
          >
            SISTEMA X
          </h1>
        </div>

        {/* 2. Subito sotto: Casella del menu attivo (Home, Alert Non Pareggia Da, ecc.) al centro */}
        <div className="flex items-center justify-center">
          <div
            id="current-page-indicator"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs sm:text-sm font-extrabold shadow-2xs transition-all ${
              currentPage === 'dashboard'
                ? 'bg-blue-50 text-[#0d2847] border border-blue-200 ring-1 ring-blue-500/20'
                : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            <span className="text-sm sm:text-base leading-none">{currentEmoji}</span>
            <span className="tracking-tight uppercase">{currentMenuName}</span>
          </div>
        </div>

        {/* 3. Subito sotto: Le tre Casse allineate al centro rigorosamente sulla stessa linea */}
        <div className="flex items-center justify-center flex-nowrap overflow-x-auto no-scrollbar gap-1.5 sm:gap-2.5 py-0.5 max-w-full">
          {/* Cassa Iniziale */}
          <div
            id="header-initial-bankroll"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] sm:text-xs whitespace-nowrap shrink-0 shadow-2xs"
            title="Capitale Iniziale impostato"
          >
            <span className="text-slate-500 font-medium">Iniziale:</span>
            <span className="font-bold text-slate-900 font-mono">
              €{settings.initialBankroll.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Cassa Attuale */}
          <div
            id="header-current-bankroll"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] sm:text-xs whitespace-nowrap shrink-0 shadow-2xs"
            title="Cassa Attuale (Iniziale + Vinte - Perse)"
          >
            <span className="text-slate-500 font-medium">Attuale:</span>
            <span
              className={`font-black font-mono ${
                bankrollSummary.currentBankroll >= settings.initialBankroll
                  ? 'text-emerald-700'
                  : 'text-rose-700'
              }`}
            >
              €{bankrollSummary.currentBankroll.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Vincita Netta */}
          <div
            id="header-effective-profits"
            className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl border text-[10px] sm:text-xs font-bold whitespace-nowrap shrink-0 shadow-2xs ${
              bankrollSummary.effectiveProfits >= 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
            title="Somma dei net profit delle scommesse regolate"
          >
            <span className="font-medium">Netta:</span>
            <span className="font-black font-mono">
              {bankrollSummary.effectiveProfits >= 0
                ? `+€${bankrollSummary.effectiveProfits.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `-€${Math.abs(bankrollSummary.effectiveProfits).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
