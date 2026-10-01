import React from 'react';
import { Building2, User, ArrowRight } from 'lucide-react';
import type { SubscriptionType } from '../types';

interface SubscriptionSelectionScreenProps {
  onSelect: (type: SubscriptionType) => void;
  onSkipAdmin?: () => void;
}

export const SubscriptionSelectionScreen: React.FC<SubscriptionSelectionScreenProps> = ({
  onSelect,
  onSkipAdmin,
}) => {
  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Skip as Admin button at top right */}
      {onSkipAdmin && (
        <div className="absolute top-6 right-6 z-30">
          <button
            type="button"
            onClick={onSkipAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Skip all setup and enter as Admin (timegig2026@gmail.com)"
          >
            <span>⚡ Skip as Admin</span>
          </button>
        </div>
      )}
      {/* Subtle soft ambient tint in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto flex flex-col items-center text-center z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header kicker */}
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-2">
          Getting Started
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Select Subscription
        </h1>

        <p className="text-sm text-slate-500 max-w-xs mb-10">
          Choose an option below to start your session
        </p>

        {/* The 2 Bubble Options */}
        <div className="w-full grid grid-cols-1 gap-5">
          {/* Bubble 1: Tenant Subscription */}
          <button
            type="button"
            onClick={() => onSelect('tenant')}
            className="group relative w-full p-6 sm:p-7 rounded-[32px] bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-indigo-400 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer flex items-center justify-between text-left active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex items-center gap-4">
              {/* Bubble Icon Circle */}
              <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-inner shrink-0">
                <Building2 className="w-6 h-6 stroke-[1.75]" />
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Tenant Subscription
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enterprise, corporate & property access
                </p>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0 ml-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Bubble 2: User Subscription */}
          <button
            type="button"
            onClick={() => onSelect('user')}
            className="group relative w-full p-6 sm:p-7 rounded-[32px] bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-purple-400 shadow-md hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer flex items-center justify-between text-left active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div className="flex items-center gap-4">
              {/* Bubble Icon Circle */}
              <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-200 shadow-inner shrink-0">
                <User className="w-6 h-6 stroke-[1.75]" />
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                  User Subscription
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Individual seekers, gig workers & members
                </p>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0 ml-2">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
