import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const variants = {
    default: 'bg-[#111a2b]/85 text-[#c7ced8] border border-[#7aa7ff]/15',
    primary: 'bg-[#f4f8ff] text-[#0d1320] border border-[#bcd3ff]/70',
    success: 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/20',
    warning: 'bg-[#7aa7ff]/12 text-[#bcd3ff] border border-[#7aa7ff]/25',
    accent: 'bg-[#111a2b]/85 text-[#dbe7ff] border border-[#7aa7ff]/18',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full backdrop-blur-sm ${
        variants[variant] || variants.default
      } ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};
