'use client';

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: string;
  prefix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, suffix, prefix, id, className, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(error);

    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={[styles.inputWrap, hasError ? styles.errorBorder : ''].filter(Boolean).join(' ')}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>
        {hasError && (
          <p id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
        {!hasError && hint && (
          <p id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
