import React from 'react';
import { MONITORED_LEAGUES } from '../../config/leagues';

interface LeagueBadgeProps {
  leagueId?: string;
  leagueName?: string;
  countryFlag?: string;
  tier?: 1 | 2;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LeagueBadge: React.FC<LeagueBadgeProps> = ({
  leagueId,
  leagueName,
  countryFlag,
  tier,
  size = 'md',
  className = '',
}) => {
  const league = leagueId
    ? MONITORED_LEAGUES.find((l) => l.id === leagueId)
    : undefined;

  const displayName = leagueName || league?.name || 'Campionato';
  const flag = countryFlag || league?.countryFlag || '⚽';
  const displayTier = tier || league?.tier || 1;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs ${sizeClasses[size]} ${className}`}
    >
      <span className="text-sm leading-none">{flag}</span>
      <span>{displayName}</span>
      <span
        className={`text-[10px] font-semibold px-1 rounded ${
          displayTier === 1
            ? 'bg-slate-200 text-slate-700'
            : 'bg-amber-100 text-amber-800'
        }`}
      >
        {displayTier === 1 ? '1ª Div' : '2ª Div'}
      </span>
    </span>
  );
};
