import React from 'react';
import { FolderOpen, AlertOctagon } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  icon: Icon = FolderOpen,
  actionText,
  onAction,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`}>
      <Icon className="empty-state-icon" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this data.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`} style={{ borderColor: 'var(--color-error-border)' }}>
      <AlertOctagon className="empty-state-icon" style={{ color: 'var(--color-error)' }} aria-hidden="true" />
      <h3 style={{ color: '#FCA5A5' }}>{title}</h3>
      <p>{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
