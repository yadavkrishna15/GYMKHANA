import React from 'react';

export default function Card({ children, className = '', interactive = false, onClick, ...props }) {
  return (
    <div
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
