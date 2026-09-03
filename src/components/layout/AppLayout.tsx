import React from 'react';
import { PageId } from '../../types';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 4) Barra Superiore Fissa con i 5 elementi in ordine */}
      <Navbar
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      {/* Area Contenuto Principale a schermo intero (senza sidebar a sinistra) con padding inferiore per la bottom bar */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">
        {children}
      </main>

      {/* 2) Barra Inferiore sempre fissa (visibile anche durante lo scroll) */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
    </div>
  );
};
