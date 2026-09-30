import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'interactive-lift inline-flex items-center justify-center font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05070f] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98 select-none';

  const variants = {
    primary: 'border border-[#bcd3ff]/70 bg-[#f4f8ff] text-[#0d1320] shadow-[0_12px_34px_rgba(122,167,255,0.18)] hover:bg-[#ffffff] focus:ring-[#7aa7ff]/60',
    secondary: 'border border-[#7aa7ff]/20 bg-[#101827] text-[#f8fbff] hover:border-[#7aa7ff]/35 hover:bg-[#1a2942] focus:ring-[#7aa7ff]/35',
    danger: 'border border-red-400/20 bg-red-500/12 text-red-200 hover:bg-red-500/18 focus:ring-red-400/45',
    ghost: 'bg-transparent text-[#c7ced8] hover:bg-[#18202d] hover:text-[#f8fbff] focus:ring-[#7aa7ff]/35',
    outline: 'border border-[#7aa7ff]/25 text-[#dbe7ff] hover:border-[#7aa7ff]/45 hover:bg-[#111a2b] focus:ring-[#7aa7ff]/35',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
