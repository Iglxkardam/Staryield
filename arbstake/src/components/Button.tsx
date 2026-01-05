import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'blue' | 'skyblue' | 'white' | 'social';
  size?: 'normal' | 'default';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'blue', 
  size = 'default',
  children, 
  className = '',
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'normal' ? 'normal' : '';
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
