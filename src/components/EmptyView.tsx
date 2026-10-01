import React from 'react';
import { Users, Briefcase, User, Inbox, RefreshCw } from 'lucide-react';
import type { TabType, EmptyStyle } from '../types';

interface EmptyViewProps {
  activeTab: TabType;
  emptyStyle: EmptyStyle;
  onResetToEmpty: () => void;
}

const tabMetadata: Record<
  TabType,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    emptyHeading: string;
    emptyDescription: string;
    category: string;
  }
> = {
  seekers: {
    name: 'Seekers',
    icon: Users,
    emptyHeading: 'Seekers is Empty',
    emptyDescription:
      'There are currently no seekers registered or listed in this section.',
    category: 'Talent & Candidates',
  },
  gigs: {
    name: 'GiGs',
    icon: Briefcase,
    emptyHeading: 'GiGs is Empty',
    emptyDescription:
      'There are currently no active gigs or available opportunities listed.',
    category: 'Work & Projects',
  },
  profile: {
    name: 'Profile',
    icon: User,
    emptyHeading: 'Profile is Empty',
    emptyDescription:
      'There is no profile information, account history, or bio data available yet.',
    category: 'Account & Identity',
  },
};

export const EmptyView: React.FC<EmptyViewProps> = ({
  activeTab,
  emptyStyle,
  onResetToEmpty,
}) => {
  const current = tabMetadata[activeTab];
  const Icon = current.icon;

  // Pure blank mode: render a completely empty pristine surface
  if (emptyStyle === 'blank') {
    return (
      <div
        className="w-full flex-1 flex flex-col items-center justify-center min-h-[400px] p-6"
        aria-label={`${current.name} empty canvas`}
      >
        {/* Subtle watermark indication that this is strictly empty */}
        <div className="text-center opacity-30 select-none">
          <p className="text-xs uppercase tracking-widest font-mono text-slate-400">
            {current.name} · Empty
          </p>
        </div>
      </div>
    );
  }

  // Minimalist placeholder empty state mode
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[420px] p-6 text-center animate-in fade-in duration-200">
      <div className="max-w-sm mx-auto flex flex-col items-center">
        {/* Minimalist icon container with hairline border */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-5 shadow-xs">
          <Icon className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* Feature Tag */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-2">
          <span>{current.name}</span>
          <span aria-hidden="true">·</span>
          <span>{current.category}</span>
        </div>

        {/* Empty Heading */}
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight mb-2">
          {current.emptyHeading}
        </h2>

        {/* Empty Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          {current.emptyDescription}
        </p>

        {/* Action button to confirm empty status */}
        <button
          type="button"
          onClick={onResetToEmpty}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Keep Empty</span>
        </button>
      </div>
    </div>
  );
};
