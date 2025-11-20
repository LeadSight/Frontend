import React from 'react';

const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  default: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  outline: 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50',
};

const sizes = {
  sm: 'px-2.5 py-1.5',
  md: 'px-3 py-2',
  lg: 'px-4 py-2.5',
};

export const Button = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const v = variants[variant] ?? variants.default;
  const s = sizes[size] ?? sizes.md;
  return (
    <button className={`${base} ${v} ${s} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
