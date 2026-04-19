'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnnuityCertainRequestSchema, type AnnuityCertainRequest } from '@aimodoo/shared';
import { Button, Input, Switch, Card, Divider } from '@/components/tds';
import { parseKRW, formatKRW } from '@aimodoo/shared';
import styles from './AnnuityForm.module.css';

interface AnnuityFormProps {
  onSubmit: (data: AnnuityCertainRequest) => void;
  isLoading?: boolean;
}

const TIMING_OPTIONS: [{ value: string; label: string }, { value: string; label: string }] = [
  { value: 'end', label: '기말' },
  { value: 'beginning', label: '기초' },
];

export function AnnuityForm({ onSubmit, isLoading = false }: AnnuityFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnnuityCertainRequest>({
    resolver: zodResolver(AnnuityCertainRequestSchema),
    defaultValues: {
      monthlyPayment: undefined,
      periodYears: 10,
      periodMonths: 0,
      annualRate: 5,
      paymentTiming: 'end',
    },
  });

  // 월 지급액 — 천단위 콤마 처리
  const [displayPayment, setDisplayPayment] = React.useState('');

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = raw === '' ? 0 : parseInt(raw, 10);
    setDisplayPayment(raw === '' ? '' : formatKRW(num));
    setValue('monthlyPayment', num, { shouldValidate: true });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.fields}>
          {/* 월 지급액 */}
          <Input
            label="월 지급액"
            type="text"
            inputMode="numeric"
            placeholder="1,000,000"
            suffix="원"
            value={displayPayment}
            onChange={handlePaymentChange}
            error={errors.monthlyPayment?.message}
          />

          {/* 지급 기간 */}
          <div className={styles.periodRow}>
            <Input
              label="지급 기간"
              type="number"
              inputMode="numeric"
              placeholder="10"
              suffix="년"
              min={0}
              max={100}
              error={errors.periodYears?.message}
              {...register('periodYears', { valueAsNumber: true })}
            />
            <Input
              label=" "
              type="number"
              inputMode="numeric"
              placeholder="0"
              suffix="개월"
              min={0}
              max={11}
              error={errors.periodMonths?.message}
              {...register('periodMonths', { valueAsNumber: true })}
            />
          </div>

          {/* 연이율 */}
          <Input
            label="할인율 (연이율)"
            type="number"
            inputMode="decimal"
            placeholder="5.00"
            suffix="%"
            step={0.01}
            min={0}
            max={100}
            error={errors.annualRate?.message}
            {...register('annualRate', { valueAsNumber: true })}
          />

          <Divider spacing="sm" />

          {/* 지급 시점 */}
          <Controller
            name="paymentTiming"
            control={control}
            render={({ field }) => (
              <Switch
                label="지급 시점"
                value={field.value}
                onChange={(v) => field.onChange(v)}
                options={TIMING_OPTIONS}
              />
            )}
          />
        </div>

        <div className={styles.submitRow}>
          <Button type="submit" size="lg" fullWidth loading={isLoading}>
            현재가치 계산하기
          </Button>
        </div>
      </form>
    </Card>
  );
}
