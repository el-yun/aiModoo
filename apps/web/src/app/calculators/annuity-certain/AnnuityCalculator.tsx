'use client';

import React from 'react';
import { type AnnuityCertainRequest, calculateAnnuityCertain, type CalcResult } from '@aimodoo/shared';
import { AnnuityForm } from './AnnuityForm';
import { AnnuityResult } from './AnnuityResult';
import styles from './AnnuityCalculator.module.css';

interface CalcState {
  result: CalcResult;
  input: AnnuityCertainRequest;
}

export function AnnuityCalculator() {
  const [calcState, setCalcState] = React.useState<CalcState | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = React.useCallback((data: AnnuityCertainRequest) => {
    setIsLoading(true);
    // 클라이언트 사이드 계산 (shared 패키지 순수 함수)
    try {
      const result = calculateAnnuityCertain({
        monthlyPayment: data.monthlyPayment,
        periodYears: data.periodYears,
        periodMonths: data.periodMonths,
        annualRate: data.annualRate,
        paymentTiming: data.paymentTiming,
      });
      setCalcState({ result, input: data });
      // 결과로 스크롤
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className={styles.container}>
      <section aria-label="계산 입력">
        <AnnuityForm onSubmit={handleSubmit} isLoading={isLoading} />
      </section>

      {calcState && (
        <section ref={resultRef} aria-label="계산 결과" aria-live="polite">
          <AnnuityResult
            result={calcState.result}
            monthlyPayment={calcState.input.monthlyPayment}
            annualRate={calcState.input.annualRate}
            paymentTiming={calcState.input.paymentTiming}
          />
        </section>
      )}
    </div>
  );
}
