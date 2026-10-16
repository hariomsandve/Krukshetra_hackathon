import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo',
  onClick,
}) => {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
          border: 'border-l-4 border-l-emerald-500',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-50 text-amber-600',
          border: 'border-l-4 border-l-amber-500',
        };
      case 'rose':
        return {
          iconBg: 'bg-rose-50 text-rose-600',
          border: 'border-l-4 border-l-rose-500',
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-50 text-blue-600',
          border: 'border-l-4 border-l-blue-500',
        };
      default:
        return {
          iconBg: 'bg-indigo-50 text-indigo-600',
          border: 'border-l-4 border-l-indigo-600',
        };
    }
  };

  const styles = getAccentStyles();

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 ${styles.border} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {trend.value}
              </span>
              <span className="text-xs text-slate-400">vs last cycle</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
