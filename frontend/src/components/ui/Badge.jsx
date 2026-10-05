import React from 'react';

export default function Badge({ type = 'difficulty', value = '', label, className = '' }) {
  const displayLabel = label || value;
  const valLower = String(value).toLowerCase();

  let badgeClass = 'badge-role-member';

  if (type === 'difficulty') {
    if (valLower === 'beginner') badgeClass = 'badge-beginner';
    else if (valLower === 'intermediate') badgeClass = 'badge-intermediate';
    else if (valLower === 'advanced') badgeClass = 'badge-advanced';
  } else if (type === 'role') {
    if (valLower === 'admin') badgeClass = 'badge-role-admin';
    else if (valLower === 'trainer') badgeClass = 'badge-role-trainer';
    else badgeClass = 'badge-role-member';
  } else if (type === 'status') {
    if (valLower === 'active' || valLower === 'available' || valLower === 'present') badgeClass = 'badge-status-active';
    else if (valLower === 'inactive' || valLower === 'unavailable' || valLower === 'absent') badgeClass = 'badge-status-inactive';
    else badgeClass = 'badge-status-pending';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {displayLabel}
    </span>
  );
}
