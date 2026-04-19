import type { Metadata } from 'next';
import { TopBar } from '@/components/tds';
import { AnnuityCalculator } from './AnnuityCalculator';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '유기정기금 평가 계산기 | AI모두 계산기',
  description: '유기정기금(확정연금)의 현재가치를 기초/기말 방식으로 계산합니다.',
};

export default function AnnuityCertainPage() {
  return (
    <>
      <TopBar title="AI모두 계산기" subtitle="유기정기금 평가 계산기" />
      <main className={styles.main}>
        <AnnuityCalculator />
      </main>
    </>
  );
}
