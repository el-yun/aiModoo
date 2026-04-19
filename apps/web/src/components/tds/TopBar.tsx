import React from 'react';
import styles from './TopBar.module.css';

interface TopBarProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function TopBar({ title, subtitle, className }: TopBarProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        <p className={styles.appName}>{title}</p>
        {subtitle && <h1 className={styles.subtitle}>{subtitle}</h1>}
      </div>
    </header>
  );
}
