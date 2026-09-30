import React from 'react';

export const IconButton = ({
  icon: Icon,
  label,
  active = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`interactive-lift inline-flex h-10 w-10 items-center justify-center rounded-full border focus:outline-none focus:ring-2 focus:ring-[#7aa7ff]/45 ${
        active
          ? 'border-[#bcd3ff]/70 bg-[#f4f8ff] text-[#0d1320]'
          : 'border-[#7aa7ff]/15 bg-[#0d1320] text-[#d8dee8] hover:border-[#7aa7ff]/30 hover:bg-[#17243a] hover:text-[#f8fbff]'
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5" />}
    </button>
  );
};
