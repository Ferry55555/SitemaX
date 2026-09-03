import React from 'react';
import { Home, BarChart3, ArrowLeftRight, Plus, Database } from 'lucide-react';
import { PageId } from '../../types';

interface BottomNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navItems: {
    id: PageId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'no-draw-alerts',
      label: 'Non Pareggia da',
      icon: BarChart3,
    },
    {
      id: 'frequent-draws-alerts',
      label: 'Pareggi Frequenti',
      icon: ArrowLeftRight,
    },
    {
      id: 'bet-entry',
      label: 'Inserisci scommessa',
      icon: Plus,
    },
    {
      id: 'bet-database',
      label: 'Database',
      icon: Database,
    },
  ];

  return (
    <nav
      id="fixed-bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="max-w-5xl mx-auto px-1 sm:px-4">
        <div className="grid grid-cols-5 items-stretch h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center h-full px-1 py-1.5 transition-colors cursor-pointer group select-none ${
                  isActive
                    ? 'text-sky-700 font-extrabold bg-sky-100/60'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/50 font-semibold'
                }`}
              >
                {/* Light Blue Top Line Indicator for Active Item */}
                {isActive && (
                  <span
                    className="absolute top-0 left-0 right-0 h-1 bg-sky-400 shadow-[0_2px_8px_rgba(56,189,248,0.7)]"
                    aria-hidden="true"
                  />
                )}

                <div className="flex items-center justify-center mb-0.5">
                  <Icon
                    className={`transition-transform duration-150 ${
                      isActive
                        ? 'w-5 h-5 text-sky-600 stroke-[2.75px] scale-110'
                        : 'w-5 h-5 text-slate-600 group-hover:text-sky-700 stroke-[2px]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] sm:text-xs text-center leading-tight tracking-tight truncate max-w-full px-0.5 ${
                    isActive ? 'text-sky-700 font-black scale-105' : 'text-slate-600 font-semibold'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

