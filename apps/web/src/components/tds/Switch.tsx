'use client';

import React from 'react';
import styles from './Switch.module.css';

interface SwitchOption {
  value: string;
  label: string;
}

interface SwitchProps {
  value: string;
  onChange: (value: string) => void;
  options: [SwitchOption, SwitchOption];
  label?: string;
  className?: string;
}

export function Switch({ value, onChange, options, label, className }: SwitchProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.track} role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            className={[styles.option, value === opt.value ? styles.active : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
