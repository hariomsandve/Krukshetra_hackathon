import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  height?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'auto';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 'h-2',
  colorScheme = 'auto',
  showLabel = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const getColorClass = () => {
    if (colorScheme !== 'auto') {
      switch (colorScheme) {
        case 'indigo': return 'bg-indigo-600';
        case 'emerald': return 'bg-emerald-500';
        case 'amber': return 'bg-amber-500';
        case 'rose': return 'bg-rose-500';
      }
    }

    if (clampedValue >= 80) return 'bg-emerald-500';
    if (clampedValue >= 60) return 'bg-indigo-600';
    if (clampedValue >= 45) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1">
          <span>Proficiency</span>
          <span className="font-semibold text-slate-700">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${getColorClass()} ${height} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
