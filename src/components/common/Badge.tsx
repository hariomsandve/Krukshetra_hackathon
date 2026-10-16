import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'mastered' | 'improving' | 'weak' | 'critical' | 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  size = 'md' 
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'easy':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'hard':
      case 'danger':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'mastered':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'improving':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'weak':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'primary':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${getStyles()} ${sizeClasses} ${className}`}>
      {children}
    </span>
  );
};
