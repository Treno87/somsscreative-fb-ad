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
├── _templates/       → USP / content / campaigns / story-plan 템플릿
└── {course}/
    ├── USP.md
    ├── content.md
    ├── visual-brief.md
    ├── imweb.html        → 아임웹 코드블록 랜딩 (단일 정본 · 항상 이 경로)
    ├── landing/          → 랜딩 부속 (디자인 변형·미리보기·빌드 스크립트·thankyou·THEMES)
    ├── ads/{기수}/        → 단일·캐러셀 광고 카드 소스 (HTML/CSS)
    └── campaigns/
        ├── {기수}.md            → Meta 광고 제안서
        ├── {기수}-story-plan.md  → 동영상 광고 씬 기획
        └── {기수}-assets.md      → 캠페인 소재 인덱스 (소스·출력 경로 매니페스트)

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
└── ads/{course}/{기수}/v{NN}/{video|image|carousel}/ → 광고 소재 배달 트리 (전 포맷·버전)

ad-projects/{course}-{기수}-hf/ → Hyperframe(HTML) 동영상 작업 프로젝트 (self-contained)

reference/imweb-samples/ → 아임웹 샘플 HTML·Pixel 가이드
.claude/agents/       → Claude 서브에이전트 정의
.claude/brand-context.md → 브랜드 컨텍스트
docs/PROCESS.md       → 7단계 워크플로우 마스터 문서
docs/video-ad-process.md → 광고 동영상 생성 프로세스 (Remotion · 영상 작업 시 반드시 참고)
docs/ad-asset-organization.md → 광고 소재 폴더·네이밍·버전 규약 (소재 생성·저장 시 반드시 참고)
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
| `landing-builder` | 아임웹 코드블록 랜딩페이지 생성 (`courses/{course}/imweb.html` 단일 정본) |
| `ad-proposal` | 랜딩페이지 기반 Meta 광고 제안서 작성 |

---

## 트리거 키워드

- **`ship`** (또는 `/ship`) → 테스트를 돌리고 **전부 통과하면** 한 번에 `git add` + `commit` + `push` 한다.
  - 사용자가 채팅에 `ship` 이라고만 입력해도 `.claude/commands/ship.md` 플로우를 그대로 실행한다.
  - 커밋 제목을 함께 주려면: `ship USP 카피 변형 추가` 처럼 키워드 뒤에 붙인다.
  - `npm test` 가 하나라도 실패하면 commit·push 하지 않고 중단한다.

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

# Meta Marketing API 자동 수집 (docs/meta-api-sync.md 참고)
META_ACCESS_TOKEN=      # 시스템 유저 장기 토큰 (ads_read)
META_AD_ACCOUNT_ID=     # act_XXXX
META_API_VERSION=       # 선택, 기본 v23.0
META_CURRENCY_OFFSET=1  # 선택, KRW=1
CRON_SECRET=            # /api/meta/cron 보호용
```

## Meta API 자동 동기화

CSV 수동 업로드 대신 광고 계정에서 직접 성과를 가져온다. (`lib/dashboard/meta/`)

- **수동**: `/dashboard/upload` → "Meta에서 동기화" 버튼 → `POST /api/meta/sync`
- **자동(cron)**: `GET /api/meta/cron` (CRON_SECRET 보호) → 직전 ISO 주차 수집 → `analytics/store/dashboard.json` 영구 저장. `scripts/meta-sync.mjs` 를 crontab 에 등록.
- 매퍼는 순수 함수라 목 데이터로 단위 테스트됨 (`__tests__/dashboard/metaMappers.test.ts`, `metaSync.test.ts`).

---

## 개발 서버

```bash
npm run dev      # http://localhost:3000
npm test         # Jest 단위 테스트
```
