import React from 'react';

export const Avatar = ({
  name = '',
  size = 'md',
  className = '',
}) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl font-bold',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center font-semibold rounded-full border border-[#7aa7ff]/25 bg-[#141d2e] text-[#bcd3ff] select-none ring-2 ring-[#05070f] ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
