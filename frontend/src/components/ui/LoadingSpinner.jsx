import React from 'react';

export function LoadingSpinner({ size = 'md', className = '', label = 'Loading...' }) {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '2rem' }}>
      <span className={`spinner ${sizeClass} ${className}`} aria-hidden="true"></span>
      {label && <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>{label}</span>}
    </div>
  );
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}
