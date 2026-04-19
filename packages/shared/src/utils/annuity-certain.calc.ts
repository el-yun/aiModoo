/**
 * 유기정기금 현재가치 계산 순수 함수
 * Decimal.js 없이 number로 계산 (FE 클라이언트 사이드용)
 * 백엔드는 Decimal.js 사용
 */

export interface CalcInput {
  monthlyPayment: number;
  periodYears: number;
  periodMonths: number;
  annualRate: number;
  paymentTiming: 'beginning' | 'end';
}

export interface CalcScheduleItem {
  period: number;
  discountFactor: number;
  pv: number;
  cumulativePv: number;
}

export interface CalcResult {
  totalPv: number;
  totalPeriods: number;
  monthlyRate: number;
  schedule: CalcScheduleItem[];
}

/**
 * 유기정기금 현재가치 계산
 *
 * 기말: PV = PMT * ((1 - (1+r)^-n) / r)
 * 기초: PV = PMT * ((1 - (1+r)^-n) / r) * (1+r)
 *
 * r = 월할인율 (연이율 / 12)
 * n = 총 개월수
 */
export function calculateAnnuityCertain(input: CalcInput): CalcResult {
  const { monthlyPayment, periodYears, periodMonths, annualRate, paymentTiming } = input;
  const totalPeriods = periodYears * 12 + periodMonths;
  const monthlyRate = annualRate / 100 / 12;

  const schedule: CalcScheduleItem[] = [];
  let cumulativePv = 0;

  for (let t = 1; t <= totalPeriods; t++) {
    let discountFactor: number;
    if (monthlyRate === 0) {
      discountFactor = 1;
    } else if (paymentTiming === 'beginning') {
      discountFactor = Math.pow(1 + monthlyRate, -(t - 1));
    } else {
      discountFactor = Math.pow(1 + monthlyRate, -t);
    }
    const pv = monthlyPayment * discountFactor;
    cumulativePv += pv;

    schedule.push({
      period: t,
      discountFactor,
      pv,
      cumulativePv,
    });
  }

  return {
    totalPv: cumulativePv,
    totalPeriods,
    monthlyRate,
    schedule,
  };
}

/**
 * 숫자를 천단위 콤마 포맷으로 변환
 */
export function formatKRW(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * 콤마 제거 후 숫자로 파싱
 */
export function parseKRW(value: string): number {
  const cleaned = value.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
