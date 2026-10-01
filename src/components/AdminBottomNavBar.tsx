import React from 'react';
import { LayoutDashboard, BadgeCheck, Building2, UserCheck } from 'lucide-react';
import type { AdminTabType } from '../types';

interface AdminBottomNavBarProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
}

export const AdminBottomNavBar: React.FC<AdminBottomNavBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'overview' as AdminTabType,
      label: 'overview',
      icon: LayoutDashboard,
    },
    {
      id: 'verification' as AdminTabType,
      label: 'Verification',
      icon: BadgeCheck,
    },
    {
      id: 'tenant_pop' as AdminTabType,
      label: 'Tenant PoP',
      icon: Building2,
    },
    {
      id: 'user_pop' as AdminTabType,
      label: 'User PoP',
      icon: UserCheck,
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Admin Bottom Navigation"
      className="w-full bg-white border-t border-slate-200 shadow-md select-none sticky bottom-0 z-40"
    >
      <div className="max-w-md sm:max-w-lg mx-auto px-2 sm:px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all duration-150 relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg ${
                isActive
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div
                className={`relative flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-indigo-50' : 'group-hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                />
              </div>

              <span
                className={`text-[11px] tracking-tight mt-0.5 leading-none transition-colors whitespace-nowrap ${
                  isActive ? 'font-semibold' : 'font-normal'
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
