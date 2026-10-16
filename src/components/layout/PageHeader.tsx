import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'primary',
  children,
}) => {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'success': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'danger': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          {badgeText && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
};
