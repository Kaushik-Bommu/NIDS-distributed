import React from 'react';

export default function StatCard({ 
  icon, 
  title, 
  value, 
  trendIcon, 
  trendText, 
  variant = 'primary' 
}) {
  const styles = {
    primary: {
      groupHoverBorder: 'hover:border-primary-container',
      valueColor: 'text-primary',
      iconColor: '',
      trendColor: 'text-primary-fixed-dim',
      animateClass: ''
    },
    error: {
      groupHoverBorder: 'hover:border-error',
      valueColor: 'text-error',
      iconColor: 'text-error',
      trendColor: 'text-error',
      animateClass: 'animate-pulse-red'
    },
    secondary: {
      groupHoverBorder: 'hover:border-secondary',
      valueColor: 'text-secondary',
      iconColor: 'text-secondary',
      trendColor: 'text-secondary',
      animateClass: ''
    }
  };

  const currentStyle = styles[variant];

  return (
    <div className={`bg-surface-container border border-outline-variant p-6 relative overflow-hidden group transition-all duration-300 ${currentStyle.groupHoverBorder} ${currentStyle.animateClass}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className={`material-symbols-outlined text-6xl ${currentStyle.iconColor}`}>{icon}</span>
      </div>
      <p className="text-on-surface-variant font-data-mono text-xs uppercase tracking-widest mb-1">{title}</p>
      <h2 className={`text-display-lg font-display-lg ${currentStyle.valueColor}`}>{value}</h2>
      <div className={`flex items-center gap-2 mt-2 ${currentStyle.trendColor}`}>
        <span className="material-symbols-outlined text-sm">{trendIcon}</span>
        <span className="text-label-sm font-data-mono">{trendText}</span>
      </div>
    </div>
  );
}
