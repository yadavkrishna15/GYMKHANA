import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose, className = '', children }) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const IconComponent = icons[type] || Info;

  return (
    <div className={`alert alert-${type} ${className}`} role="alert">
      <IconComponent size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
      <div style={{ flex: 1 }}>{message || children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '2px',
            opacity: 0.8
          }}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
