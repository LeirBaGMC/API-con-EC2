import React from 'react';

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  disabled = false,
  className = '',
  required = false,
  name,
  id,
  rows,
  ...props
}) => {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className="relative w-full">
      {Icon && !isTextarea && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <Component
        id={id || name}
        name={name}
        type={isTextarea ? undefined : type}
        rows={isTextarea ? (rows || 3) : undefined}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
          Icon && !isTextarea ? 'pl-10' : 'pl-3.5'
        } pr-3.5 ${isTextarea ? 'py-2.5' : 'py-2'} ${
          error ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 hover:border-slate-700'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
};
