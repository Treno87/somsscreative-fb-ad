# somsscreative-fb-ad

소옴크리에이티브 **Meta 광고 운영 도구**.
Facebook/Instagram 광고 성과를 주차별로 추적하고, 랜딩페이지를 관리하며, Claude가 AI 진단 보고서를 생성하는 통합 워크스페이스.

---

## 프로젝트 구조

```
app/                  → Next.js 라우팅
├── dashboard/
│   ├── overview/     → 광고 성과 개요 (KPI + 캠페인/광고세트/광고 계층)
│   ├── trends/       → 주차별 CPL·CTR·지출 트렌드
│   ├── ab-test/      → A/B 소재 비교 분석
│   ├── fatigue/      → 소재 피로도 감지
│   └── upload/       → Meta CSV 업로드 (캠페인·광고세트·광고 3종)
├── classic/          → 클래식 코스 랜딩페이지
└── layout.tsx        → 공통 Meta Pixel

courses/              → 코스별 자료 (USP·콘텐츠·아임웹·광고 제안서)
├── _templates/       → USP / content / campaigns 템플릿
└── {course}/
    ├── USP.md
    ├── content.md
    ├── visual-brief.md
    ├── imweb/
    └── campaigns/{기수}.md

lib/dashboard/
├── analytics.ts      → KPI 계산, 인사이트 생성, A/B 감지
├── csvParser.ts      → Meta CSV 파싱
├── storage.ts        → localStorage 기반 주차별 데이터 저장
└── types.ts          → CampaignRow, AdSetRow, AdRow 등 타입 정의

analytics/            → 광고 성과 분석 워크스페이스
├── input/            → Meta CSV 원본 파일 보관
└── output/           → AI 분석 보고서 출력

public/
├── courses/{course}/ → 랜딩 이미지
└── ads/{course}-{기수}/ → 광고 소재 이미지

reference/imweb-samples/ → 아임웹 샘플 HTML·Pixel 가이드
.claude/agents/       → Claude 서브에이전트 정의
.claude/brand-context.md → 브랜드 컨텍스트
docs/PROCESS.md       → 7단계 워크플로우 마스터 문서
```

---

## 일상 워크플로우

1. **데이터 업로드**: Meta 광고 관리자 → CSV 3종 다운로드 → `/dashboard/upload`
2. **성과 확인**: `/dashboard/overview` → 캠페인·광고세트·광고 계층 탐색
3. **트렌드 분석**: `/dashboard/trends` → 주차별 CPL 추이
4. **AI 진단**: Claude에게 `"분석해줘"` → `fb-ad-audit` 에이전트 실행 → 보고서 생성

---

## Claude 에이전트

| 에이전트 | 용도 |
|----------|------|
| `fb-ad-audit` | analytics/input 파일 분석 → AI 진단 보고서 |
| `dashboard-analyst` | CLI에서 빠른 성과 분석 |
| `landing-optimizer` | 성과 데이터 기반 랜딩페이지 개선 제안 |
| `content-writer` | 코스 랜딩페이지 콘텐츠 초안 작성 |
| `landing-builder` | Next.js 랜딩페이지 + 아임웹 HTML 생성 |
| `ad-proposal` | 랜딩페이지 기반 Meta 광고 제안서 작성 |

---

## 코드 규칙

- `any` 타입 금지 — 명시적 타입 정의 (`lib/dashboard/types.ts` 참조)
- 인라인 스타일 금지 — Tailwind 클래스 사용
- `console.log` 프로덕션 코드에 방치 금지
- `"use client"` 남발 금지 — 서버 컴포넌트 최대 활용

---

## 환경변수

```bash
# .env.local
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_GA4_ID=
```

---

## 개발 서버

```bash
npm run dev      # http://localhost:3000
npm test         # Jest 단위 테스트
```
