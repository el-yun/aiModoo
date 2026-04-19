import { Injectable, BadRequestException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { type AnnuityCertainRequestDto, type AnnuityCertainResponseDto, type ScheduleItemDto } from './annuity-certain.dto';

// Decimal.js 설정 — 정밀도 30자리
Decimal.set({ precision: 30, rounding: Decimal.ROUND_HALF_UP });

@Injectable()
export class AnnuityCertainService {
  calculate(dto: AnnuityCertainRequestDto): AnnuityCertainResponseDto {
    const { monthlyPayment, periodYears, periodMonths, annualRate, paymentTiming } = dto;
    const totalPeriods = periodYears * 12 + periodMonths;

    if (totalPeriods <= 0) {
      throw new BadRequestException('지급 기간은 1개월 이상이어야 합니다');
    }

    const pmt = new Decimal(monthlyPayment);
    const monthlyRate = new Decimal(annualRate).div(100).div(12);

    const schedule: ScheduleItemDto[] = [];
    let cumulativePv = new Decimal(0);

    for (let t = 1; t <= totalPeriods; t++) {
      let discountFactor: Decimal;

      if (monthlyRate.isZero()) {
        discountFactor = new Decimal(1);
      } else if (paymentTiming === 'beginning') {
        // 기초: 할인계수 = (1+r)^-(t-1)
        discountFactor = new Decimal(1).plus(monthlyRate).pow(-(t - 1));
      } else {
        // 기말: 할인계수 = (1+r)^-t
        discountFactor = new Decimal(1).plus(monthlyRate).pow(-t);
      }

      const pv = pmt.mul(discountFactor);
      cumulativePv = cumulativePv.plus(pv);

      schedule.push({
        period: t,
        discountFactor: discountFactor.toFixed(10),
        pv: pv.toFixed(4),
        cumulativePv: cumulativePv.toFixed(4),
      });
    }

    return {
      success: true,
      data: {
        totalPv: cumulativePv.toFixed(4),
        monthlyPayment: pmt.toFixed(0),
        totalPeriods,
        annualRate: new Decimal(annualRate).toFixed(4),
        monthlyRate: monthlyRate.toFixed(10),
        paymentTiming,
        schedule,
      },
      error: null,
    };
  }
}
