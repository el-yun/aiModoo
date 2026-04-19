import { AnnuityCertainService } from './annuity-certain.service';
import { BadRequestException } from '@nestjs/common';

describe('AnnuityCertainService', () => {
  let service: AnnuityCertainService;

  beforeEach(() => {
    service = new AnnuityCertainService();
  });

  describe('기말 지급 (end)', () => {
    it('월 100만원, 10년, 연 5%, 기말 → 약 94,281,350원', () => {
      const result = service.calculate({
        monthlyPayment: 1_000_000,
        periodYears: 10,
        periodMonths: 0,
        annualRate: 5,
        paymentTiming: 'end',
      });
      const totalPv = parseFloat(result.data.totalPv);
      expect(totalPv).toBeGreaterThan(94_200_000);
      expect(totalPv).toBeLessThan(94_400_000);
    });

    it('월 50만원, 5년, 연 0%, 기말 → 30,000,000원', () => {
      const result = service.calculate({
        monthlyPayment: 500_000,
        periodYears: 5,
        periodMonths: 0,
        annualRate: 0,
        paymentTiming: 'end',
      });
      const totalPv = parseFloat(result.data.totalPv);
      expect(totalPv).toBeCloseTo(30_000_000, -1);
    });

    it('스케줄 항목 수 = 총 개월수', () => {
      const result = service.calculate({
        monthlyPayment: 100_000,
        periodYears: 2,
        periodMonths: 6,
        annualRate: 3,
        paymentTiming: 'end',
      });
      expect(result.data.schedule).toHaveLength(30);
      expect(result.data.totalPeriods).toBe(30);
    });
  });

  describe('기초 지급 (beginning)', () => {
    it('월 100만원, 10년, 연 5%, 기초 → 기말보다 커야 함', () => {
      const end = service.calculate({
        monthlyPayment: 1_000_000,
        periodYears: 10,
        periodMonths: 0,
        annualRate: 5,
        paymentTiming: 'end',
      });
      const beg = service.calculate({
        monthlyPayment: 1_000_000,
        periodYears: 10,
        periodMonths: 0,
        annualRate: 5,
        paymentTiming: 'beginning',
      });
      expect(parseFloat(beg.data.totalPv)).toBeGreaterThan(parseFloat(end.data.totalPv));
    });

    it('월 100만원, 10년, 연 5%, 기초 → 약 94,674,023원', () => {
      const result = service.calculate({
        monthlyPayment: 1_000_000,
        periodYears: 10,
        periodMonths: 0,
        annualRate: 5,
        paymentTiming: 'beginning',
      });
      const totalPv = parseFloat(result.data.totalPv);
      expect(totalPv).toBeGreaterThan(94_600_000);
      expect(totalPv).toBeLessThan(94_800_000);
    });
  });

  describe('경계값 및 검증', () => {
    it('지급기간 0년 0월 → BadRequestException', () => {
      expect(() =>
        service.calculate({
          monthlyPayment: 1_000_000,
          periodYears: 0,
          periodMonths: 0,
          annualRate: 5,
          paymentTiming: 'end',
        }),
      ).toThrow(BadRequestException);
    });

    it('100년 장기 계산도 정상 완료', () => {
      const result = service.calculate({
        monthlyPayment: 1_000_000,
        periodYears: 100,
        periodMonths: 0,
        annualRate: 3,
        paymentTiming: 'end',
      });
      expect(result.data.schedule).toHaveLength(1200);
      expect(parseFloat(result.data.totalPv)).toBeGreaterThan(0);
    });

    it('success: true 응답 형식 확인', () => {
      const result = service.calculate({
        monthlyPayment: 500_000,
        periodYears: 1,
        periodMonths: 0,
        annualRate: 2,
        paymentTiming: 'end',
      });
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data.schedule[0]).toMatchObject({
        period: 1,
        discountFactor: expect.any(String),
        pv: expect.any(String),
        cumulativePv: expect.any(String),
      });
    });
  });
});
