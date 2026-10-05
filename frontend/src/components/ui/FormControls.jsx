import React from 'react';

export function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helper,
  disabled = false,
  className = '',
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-control ${error ? 'has-error' : ''}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {!error && helper && <span className="form-helper">{helper}</span>}
    </div>
  );
}

export function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helper,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) {
  const selectId = id || name;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-control ${error ? 'has-error' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label || opt.value}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
      {!error && helper && <span className="form-helper">{helper}</span>}
    </div>
  );
}

export function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helper,
  rows = 4,
  disabled = false,
  className = '',
  ...props
}) {
  const textareaId = id || name;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`form-control ${error ? 'has-error' : ''}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {!error && helper && <span className="form-helper">{helper}</span>}
    </div>
  );
}

export function FormCheckbox({
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  ...props
}) {
  const checkId = id || name;

  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '1rem' }}>
      <label htmlFor={checkId} className="checkbox-label">
        <input
          id={checkId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <span className="form-error" style={{ marginLeft: '1.6rem' }}>{error}</span>}
    </div>
  );
}
