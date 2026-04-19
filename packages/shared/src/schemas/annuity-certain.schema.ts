import { z } from 'zod';

export const AnnuityCertainRequestSchema = z.object({
  monthlyPayment: z
    .number({ required_error: '월 지급액은 필수입니다' })
    .positive('월 지급액은 양수여야 합니다')
    .max(1_000_000_000, '월 지급액은 10억 이하여야 합니다'),

  periodYears: z
    .number()
    .int('년수는 정수여야 합니다')
    .min(0, '년수는 0 이상이어야 합니다')
    .max(100, '년수는 100 이하여야 합니다'),

  periodMonths: z
    .number()
    .int('월수는 정수여야 합니다')
    .min(0, '월수는 0 이상이어야 합니다')
    .max(11, '월수는 11 이하여야 합니다'),

  annualRate: z
    .number({ required_error: '연이율은 필수입니다' })
    .min(0, '연이율은 0% 이상이어야 합니다')
    .max(100, '연이율은 100% 이하여야 합니다'),

  paymentTiming: z.enum(['beginning', 'end']).default('end'),
}).refine(
  (data) => data.periodYears * 12 + data.periodMonths > 0,
  { message: '지급 기간은 1개월 이상이어야 합니다', path: ['periodMonths'] },
);

export type AnnuityCertainRequest = z.infer<typeof AnnuityCertainRequestSchema>;

export interface ScheduleItem {
  period: number;
  discountFactor: string;
  pv: string;
  cumulativePv: string;
}

export interface AnnuityCertainResponse {
  totalPv: string;
  monthlyPayment: string;
  totalPeriods: number;
  annualRate: string;
  monthlyRate: string;
  paymentTiming: 'beginning' | 'end';
  schedule: ScheduleItem[];
}
