import React from 'react';
import { Input } from '../atoms/Input';

export const FormField = ({
  label,
  required = false,
  error,
  helpText,
  className = '',
  ...inputProps
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#c7ced8] flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-[#bcd3ff] ml-1">*</span>}
          </span>
        </label>
      )}
      <Input error={error} required={required} {...inputProps} />
      {helpText && !error && (
        <p className="text-[11px] text-[#778295]">{helpText}</p>
      )}
    </div>
  );
};
