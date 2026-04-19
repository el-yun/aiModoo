'use client';

import React from 'react';
import { type CalcResult } from '@aimodoo/shared';
import { formatKRW } from '@aimodoo/shared';
import { Card, NumberDisplay, Divider, Badge } from '@/components/tds';
import { AnnuityScheduleTable } from './AnnuityScheduleTable';
import styles from './AnnuityResult.module.css';

interface AnnuityResultProps {
  result: CalcResult;
  monthlyPayment: number;
  annualRate: number;
  paymentTiming: 'beginning' | 'end';
}

export function AnnuityResult({
  result,
  monthlyPayment,
  annualRate,
  paymentTiming,
}: AnnuityResultProps) {
  const monthlyRatePct = (result.monthlyRate * 100).toFixed(4);
  const timingLabel = paymentTiming === 'beginning' ? '기초' : '기말';

  return (
    <div className={styles.wrapper}>
      {/* 메인 결과 카드 */}
      <Card>
        <NumberDisplay
          label="유기정기금 현재가치 총합"
          value={result.totalPv}
          size="xl"
        />
        <Divider spacing="md" />
        <dl className={styles.summary}>
          <div className={styles.summaryRow}>
            <dt>월 지급액</dt>
            <dd>{formatKRW(monthlyPayment)} 원</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>지급 기간</dt>
            <dd>{result.totalPeriods}개월</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>연이율</dt>
            <dd>{annualRate}%</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>월할인율</dt>
            <dd>{monthlyRatePct}%</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>지급 시점</dt>
            <dd>
              <Badge variant="primary">{timingLabel}</Badge>
            </dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>총 지급액 (명목)</dt>
            <dd>{formatKRW(monthlyPayment * result.totalPeriods)} 원</dd>
          </div>
        </dl>
      </Card>

      {/* 기간별 테이블 */}
      <AnnuityScheduleTable schedule={result.schedule} />
    </div>
  );
}
