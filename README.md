# somsscreative-fb-ad

소옴크리에이티브 Meta 광고 운영 대시보드.

Facebook/Instagram 광고 성과를 주차별로 추적하고, 소재 피로도와 A/B 테스트를 분석하며, Claude AI가 진단 보고서를 자동 생성합니다.

---

## 주요 기능

| 경로 | 기능 |
|------|------|
| `/dashboard/overview` | 캠페인·광고세트·광고 계층별 KPI 성과표 |
| `/dashboard/trends` | 주차별 CPL·CTR·지출 트렌드 차트 |
| `/dashboard/ab-test` | 소재 A/B 비교 분석 |
| `/dashboard/fatigue` | 소재 피로도 감지 (CTR 하락률 기반) |
| `/dashboard/upload` | Meta CSV 3종 업로드 (주차별 스냅샷 저장) |
| `/classic` | 클래식 코스 랜딩페이지 |

---

## 시작하기

```bash
npm install
npm run dev
```

`http://localhost:3000/dashboard` 에서 대시보드 확인.

---

## 데이터 업로드 방법

1. **Meta 광고 관리자** → 보고서 → 캠페인·광고세트·광고 각각 CSV 다운로드
2. `/dashboard/upload` 에서 3개 파일 업로드
3. 주차 태그(예: `2026-W12`) 입력 후 저장
4. `/dashboard/overview` 에서 성과 확인

> 데이터는 브라우저 `localStorage`에 저장됩니다. 서버 DB 없음.

---

## AI 진단 보고서

CSV 파일을 `audit-workspace/input/`에 넣고 Claude에게 `"분석해줘"`라고 요청하면 `fb-ad-audit` 에이전트가 14개 항목을 평가한 보고서를 생성합니다.

---

## 환경변수

```bash
cp .env.example .env.local
# NEXT_PUBLIC_FB_PIXEL_ID, NEXT_PUBLIC_GA4_ID 입력
```

---

## 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v3
- Jest + React Testing Library
- Vercel 배포
