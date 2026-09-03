import React, { ReactNode } from 'react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'primary';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200 text-slate-900',
    success: 'bg-emerald-50/50 border-emerald-200 text-emerald-950',
    danger: 'bg-rose-50/50 border-rose-200 text-rose-950',
    warning: 'bg-amber-50/50 border-amber-200 text-amber-950',
    info: 'bg-sky-50/50 border-sky-200 text-sky-950',
    primary: 'bg-indigo-50/50 border-indigo-200 text-indigo-950',
  };

  const iconStyles = {
    default: 'text-slate-600 bg-slate-100',
    success: 'text-emerald-600 bg-emerald-100',
    danger: 'text-rose-600 bg-rose-100',
    warning: 'text-amber-600 bg-amber-100',
    info: 'text-sky-600 bg-sky-100',
    primary: 'text-indigo-600 bg-indigo-100',
  };

  return (
    <div
      id={id}
      className={`rounded-xl border p-4 sm:p-5 shadow-xs transition-all ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-slate-500">{title}</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 pt-0.5">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg shrink-0 ${iconStyles[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
