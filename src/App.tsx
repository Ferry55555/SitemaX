/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, PrefillBetData } from './types';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { NoDrawAlerts } from './pages/NoDrawAlerts';
import { FrequentDrawsAlerts } from './pages/FrequentDrawsAlerts';
import { BetEntry } from './pages/BetEntry';
import { BetDatabase } from './pages/BetDatabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [prefillMatch, setPrefillMatch] = useState<PrefillBetData | null>(null);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBetMatch = (matchInfo: PrefillBetData) => {
    setPrefillMatch(matchInfo);
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'no-draw-alerts' && (
        <NoDrawAlerts
          onNavigate={handleNavigate}
          onSelectBetMatch={handleSelectBetMatch}
        />
      )}
      {currentPage === 'frequent-draws-alerts' && (
        <FrequentDrawsAlerts
          onNavigate={handleNavigate}
          onSelectBetMatch={handleSelectBetMatch}
        />
      )}
      {currentPage === 'bet-entry' && (
        <BetEntry onNavigate={handleNavigate} prefillMatch={prefillMatch} />
      )}
      {currentPage === 'bet-database' && (
        <BetDatabase
          onNavigate={handleNavigate}
          onSelectBetMatch={handleSelectBetMatch}
        />
      )}
    </AppLayout>
  );
}
