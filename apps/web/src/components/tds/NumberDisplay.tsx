import React from 'react';
import styles from './NumberDisplay.module.css';

interface NumberDisplayProps {
  value: number | null;
  label?: string;
  unit?: string;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

export function NumberDisplay({ value, label, unit = '원', size = 'xl', className }: NumberDisplayProps) {
  const formatted =
    value === null
      ? '—'
      : new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(Math.round(value));

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.valueRow}>
        <span className={[styles.value, styles[size]].join(' ')}>{formatted}</span>
        {value !== null && <span className={styles.unit}>{unit}</span>}
      </div>
    </div>
  );
}
