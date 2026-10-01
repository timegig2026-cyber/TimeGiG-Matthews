import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AdminFloatingButtonProps {
  onClick: () => void;
}

export const AdminFloatingButton: React.FC<AdminFloatingButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed top-4 right-4 z-40 sm:top-5 sm:right-5">
      <button
        type="button"
        onClick={onClick}
        aria-label="Open Admin Console"
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 dark:bg-indigo-600/90 hover:bg-slate-900 dark:hover:bg-indigo-600 text-white shadow-xl shadow-slate-900/20 backdrop-blur-md border border-slate-700/60 dark:border-indigo-400/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
      >
        {/* Animated pulse dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-300"></span>
        </span>

        {/* Shield Admin Icon */}
        <ShieldCheck className="w-4 h-4 text-indigo-300 group-hover:rotate-6 transition-transform" />

        <span className="text-xs font-semibold tracking-wide pr-1">Admin</span>
      </button>
    </div>
  );
};
