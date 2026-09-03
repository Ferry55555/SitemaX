import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageId } from '../../types';

interface BackButtonProps {
  onNavigate: (page: PageId) => void;
  targetPage?: PageId;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onNavigate,
  targetPage = 'dashboard',
  label = 'Torna alla Dashboard',
  className = '',
}) => {
  return (
    <button
      id="back-to-dashboard-btn"
      type="button"
      onClick={() => onNavigate(targetPage)}
      className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 shadow-xs cursor-pointer active:scale-98 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-slate-500" />
      <span>← {label}</span>
    </button>
  );
};
