import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, Min, Max, IsInt } from 'class-validator';

export type PaymentTiming = 'beginning' | 'end';

export class AnnuityCertainRequestDto {
  @ApiProperty({ description: '월 지급액 (원)', example: 1000000 })
  @IsNumber()
  @Min(1)
  @Max(1_000_000_000)
  monthlyPayment!: number;

  @ApiProperty({ description: '지급 기간 (년)', example: 10 })
  @IsInt()
  @Min(0)
  @Max(100)
  periodYears!: number;

  @ApiProperty({ description: '지급 기간 (월)', example: 0 })
  @IsInt()
  @Min(0)
  @Max(11)
  periodMonths!: number;

  @ApiProperty({ description: '연이율 (%)', example: 5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  annualRate!: number;

  @ApiPropertyOptional({ enum: ['beginning', 'end'], default: 'end' })
  @IsEnum(['beginning', 'end'])
  @IsOptional()
  paymentTiming: PaymentTiming = 'end';
}

export interface ScheduleItemDto {
  period: number;
  discountFactor: string;
  pv: string;
  cumulativePv: string;
}

export interface AnnuityCertainResponseDto {
  success: true;
  data: {
    totalPv: string;
    monthlyPayment: string;
    totalPeriods: number;
    annualRate: string;
    monthlyRate: string;
    paymentTiming: PaymentTiming;
    schedule: ScheduleItemDto[];
  };
  error: null;
}
