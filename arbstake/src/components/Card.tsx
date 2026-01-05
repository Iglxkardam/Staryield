import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'point-1' | 'current-level';
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const variantClass = variant !== 'default' ? variant : '';
  
  return (
    <div className={`card-box ${variantClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="card-box-title d-flex align-items-center justify-content-between">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};

export default Card;
