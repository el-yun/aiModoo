'use client';

import React from 'react';
import { type CalcScheduleItem } from '@aimodoo/shared';
import { formatKRW } from '@aimodoo/shared';
import { Card } from '@/components/tds';
import styles from './AnnuityScheduleTable.module.css';

interface AnnuityScheduleTableProps {
  schedule: CalcScheduleItem[];
}

export function AnnuityScheduleTable({ schedule }: AnnuityScheduleTableProps) {
  const [expanded, setExpanded] = React.useState(false);
  const visibleRows = expanded ? schedule : schedule.slice(0, 12);

  return (
    <Card padding="sm">
      <div className={styles.header}>
        <h2 className={styles.title}>기간별 현재가치</h2>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? '접기 ▲' : `전체 보기 (${schedule.length}개월) ▼`}
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>기간</th>
              <th>할인계수</th>
              <th>현재가치</th>
              <th>누적 현재가치</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.period}>
                <td>{row.period}월</td>
                <td>{Number(row.discountFactor).toFixed(6)}</td>
                <td>{formatKRW(row.pv)}</td>
                <td>{formatKRW(row.cumulativePv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!expanded && schedule.length > 12 && (
        <p className={styles.hint}>
          처음 12개월만 표시 중입니다.{' '}
          <button type="button" className={styles.hintBtn} onClick={() => setExpanded(true)}>
            전체 보기
          </button>
        </p>
      )}
    </Card>
  );
}
