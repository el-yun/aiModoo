# AI모두 계산기

금융·법률·부동산 계산기 모음 서비스.

## 프로젝트 구조

```
aiModoo/
├── apps/
│   ├── web/          # Next.js 15 App Router (Vercel)
│   └── api/          # NestJS REST API (Railway)
├── packages/
│   ├── shared/       # zod 스키마 + 순수 계산 함수
│   └── tsconfig/     # 공통 TypeScript 설정
└── pnpm-workspace.yaml
```

## 계산기 목록

| 계산기 | 경로 | 설명 |
|--------|------|------|
| 유기정기금 평가 | `/calculators/annuity-certain` | 확정연금(기초/기말) 현재가치 계산 |

## 개발 시작

```bash
pnpm install
pnpm dev          # apps/web + apps/api 동시 실행
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

## 유기정기금 계산 공식

**기말 지급 (Ordinary Annuity)**
```
PV = PMT × ((1 - (1+r)^-n) / r)
```

**기초 지급 (Annuity Due)**
```
PV = PMT × ((1 - (1+r)^-n) / r) × (1+r)
```

- `PMT`: 월 지급액
- `r`: 월할인율 = 연이율 / 12
- `n`: 총 개월수

## API

```http
POST /calculators/annuity
Content-Type: application/json

{
  "monthlyPayment": 1000000,
  "periodYears": 10,
  "periodMonths": 0,
  "annualRate": 5,
  "paymentTiming": "end"
}
```

## 배포

- **Frontend**: Vercel (자동 배포, `main` 브랜치)
- **Backend**: Railway (Dockerfile 기반)

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, CSS Modules
- **Backend**: NestJS 10, Decimal.js, Swagger
- **공유**: zod (스키마 검증)
- **모노레포**: pnpm workspaces
