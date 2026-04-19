import { calculateAnnuityCertain, formatKRW, parseKRW } from '../utils/annuity-certain.calc';

describe('calculateAnnuityCertain', () => {
  describe('기본 계산 (기말 지급)', () => {
    it('연이율 0%일 때 totalPv는 monthlyPayment * totalPeriods', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 1,
        periodMonths: 0,
        annualRate: 0,
        paymentTiming: 'end',
      });
      expect(result.totalPeriods).toBe(12);
      expect(result.totalPv).toBeCloseTo(1_200_000, 0);
    });

    it('연이율 0%일 때 할인계수는 모두 1', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 1,
        periodMonths: 0,
        annualRate: 0,
        paymentTiming: 'end',
      });
      result.schedule.forEach((item) => {
        expect(item.discountFactor).toBe(1);
      });
    });

    it('연이율 12% 기말 1년: PV = PMT * ((1-(1+r)^-n)/r)', () => {
      const monthlyPayment = 100_000;
      const annualRate = 12;
      const r = annualRate / 100 / 12; // 0.01
      const n = 12;
      const expectedPv = monthlyPayment * ((1 - Math.pow(1 + r, -n)) / r);

      const result = calculateAnnuityCertain({
        monthlyPayment,
        periodYears: 1,
        periodMonths: 0,
        annualRate,
        paymentTiming: 'end',
      });

      expect(result.totalPv).toBeCloseTo(expectedPv, 4);
    });

    it('기말 지급 시 t=1의 할인계수는 (1+r)^-1', () => {
      const annualRate = 12;
      const r = annualRate / 100 / 12;

      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 1,
        periodMonths: 0,
        annualRate,
        paymentTiming: 'end',
      });

      const firstItem = result.schedule[0];
      expect(firstItem).toBeDefined();
      expect(firstItem!.discountFactor).toBeCloseTo(Math.pow(1 + r, -1), 10);
    });
  });

  describe('기초 지급 (annuity-due)', () => {
    it('기초 지급 시 t=1의 할인계수는 1 (기간 시작 시 지급)', () => {
      const annualRate = 12;

      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 1,
        periodMonths: 0,
        annualRate,
        paymentTiming: 'beginning',
      });

      const firstItem = result.schedule[0];
      expect(firstItem).toBeDefined();
      expect(firstItem!.discountFactor).toBeCloseTo(1, 10);
    });

    it('기초 지급 PV는 기말 지급 PV * (1+r)', () => {
      const input = {
        monthlyPayment: 100_000,
        periodYears: 2,
        periodMonths: 0,
        annualRate: 6,
      };
      const r = input.annualRate / 100 / 12;

      const endResult = calculateAnnuityCertain({ ...input, paymentTiming: 'end' });
      const beginResult = calculateAnnuityCertain({ ...input, paymentTiming: 'beginning' });

      expect(beginResult.totalPv).toBeCloseTo(endResult.totalPv * (1 + r), 4);
    });
  });

  describe('기간 계산', () => {
    it('periodYears=1, periodMonths=6이면 totalPeriods=18', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 1,
        periodMonths: 6,
        annualRate: 5,
        paymentTiming: 'end',
      });
      expect(result.totalPeriods).toBe(18);
      expect(result.schedule).toHaveLength(18);
    });

    it('schedule의 period는 1부터 시작하여 순서대로 증가', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 50_000,
        periodYears: 0,
        periodMonths: 6,
        annualRate: 3,
        paymentTiming: 'end',
      });
      result.schedule.forEach((item, idx) => {
        expect(item.period).toBe(idx + 1);
      });
    });

    it('cumulativePv는 단조 증가', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 2,
        periodMonths: 0,
        annualRate: 5,
        paymentTiming: 'end',
      });
      for (let i = 1; i < result.schedule.length; i++) {
        const current = result.schedule[i]!;
        const prev = result.schedule[i - 1]!;
        expect(current.cumulativePv).toBeGreaterThan(prev.cumulativePv);
      }
    });

    it('마지막 schedule의 cumulativePv는 totalPv와 동일', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 200_000,
        periodYears: 3,
        periodMonths: 0,
        annualRate: 8,
        paymentTiming: 'end',
      });
      const last = result.schedule[result.schedule.length - 1];
      expect(last).toBeDefined();
      expect(last!.cumulativePv).toBeCloseTo(result.totalPv, 8);
    });
  });

  describe('monthlyRate 반환', () => {
    it('연이율 12%면 monthlyRate = 0.01', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 1,
        periodMonths: 0,
        annualRate: 12,
        paymentTiming: 'end',
      });
      expect(result.monthlyRate).toBeCloseTo(0.01, 10);
    });

    it('연이율 0%면 monthlyRate = 0', () => {
      const result = calculateAnnuityCertain({
        monthlyPayment: 100_000,
        periodYears: 1,
        periodMonths: 0,
        annualRate: 0,
        paymentTiming: 'end',
      });
      expect(result.monthlyRate).toBe(0);
    });
  });
});

describe('formatKRW', () => {
  it('1000000을 "1,000,000"으로 포맷', () => {
    expect(formatKRW(1_000_000)).toBe('1,000,000');
  });

  it('0을 "0"으로 포맷', () => {
    expect(formatKRW(0)).toBe('0');
  });

  it('fractionDigits=2일 때 소수점 2자리 표시', () => {
    expect(formatKRW(1234.5, 2)).toBe('1,234.50');
  });

  it('음수도 올바르게 포맷', () => {
    expect(formatKRW(-500_000)).toBe('-500,000');
  });
});

describe('parseKRW', () => {
  it('"1,000,000"을 1000000으로 파싱', () => {
    expect(parseKRW('1,000,000')).toBe(1_000_000);
  });

  it('콤마 없는 숫자 문자열도 파싱', () => {
    expect(parseKRW('12345')).toBe(12345);
  });

  it('숫자가 아닌 문자열은 0 반환', () => {
    expect(parseKRW('abc')).toBe(0);
  });

  it('빈 문자열은 0 반환', () => {
    expect(parseKRW('')).toBe(0);
  });
});
