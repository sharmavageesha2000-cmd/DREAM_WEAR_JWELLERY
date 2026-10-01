import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-stone-200 gap-6 overflow-x-auto no-scrollbar ${className}`}>
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-gold text-charcoal-dark'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              {t.icon && <span>{t.icon}</span>}
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-gold-light/30 text-gold-dark' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-2xl overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white text-charcoal-dark shadow-sm'
                : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            {t.icon && <span>{t.icon}</span>}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#B88E3A] text-white shadow-2xs' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
