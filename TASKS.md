# TASKS.md — 소옴크리에이티브 광고 운영 시스템

> 플랜 기반 세부 작업 목록. 각 태스크는 단일 커밋 단위.
> 상태: ⬜ 미시작 / 🔄 진행중 / ✅ 완료 / ⏸ 보류

---

## Phase 0: 프로젝트 인프라 설정

### 0-1. 테스트 환경
- ✅ Jest + React Testing Library 설치
- ✅ `jest.config.js` 작성
- ✅ `jest.setup.ts` 작성
- ✅ `tsconfig.json`에 jest types 추가
- ✅ `package.json` scripts에 `test` 추가
- ✅ Playwright 설치 (`@playwright/test`)
- ✅ `playwright.config.ts` 작성
- ✅ Lighthouse CI 설치 (`@lhci/cli`)
- ✅ `.lighthouserc.json` 작성

### 0-2. 신규 라이브러리
- ✅ `papaparse` + `@types/papaparse` 설치
- ✅ `recharts` 설치
- ⬜ `shadcn/ui` 초기화 (`npx shadcn@latest init`)
- ⬜ shadcn 컴포넌트 추가: `accordion`, `form`, `input`, `button`, `card`, `badge`, `table`

### 0-3. 환경 설정
- ⬜ `.env.local` 생성 (`NEXT_PUBLIC_FB_PIXEL_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_COUNTDOWN_TARGET`)
- ✅ `.env.example` 생성
- ✅ `.gitignore`에 `.env.local` 포함
- ✅ `app/globals.css` `@theme` 블록에 dashboard 색상 토큰 추가

---

## Phase 1: docs/courses/ 과정별 USP 문서

> 사람이 직접 작성/검토. 기수마다 업데이트. 에이전트(content-writer)가 참조.

- ✅ `docs/courses/클래식_USP.md` — 클래식코스 카피 전략, 헤드라인 라이브러리, 후기 강화 버전
- ⬜ `docs/courses/파운데이션_USP.md` — 파운데이션코스 USP (코스 개설 시 작성)
- ⬜ `docs/courses/인턴_USP.md` — 인턴코스 USP (코스 개설 시 작성)

---

## Phase 2: workflow/ 템플릿 작성

- ⬜ `workflow/content/_template.md` 작성 — 랜딩페이지 콘텐츠 작성 양식
  - 메타 정보 섹션 (코스명, 타겟, 기간, 가격, 작성일)
  - 히어로 섹션 (메인 헤드라인, 서브 헤드라인, CTA 버튼 텍스트 2개)
  - 고통 포인트 섹션 (3~5개 항목)
  - 강사 소개 섹션 (이름, 경력, 사진 가이드)
  - 커리큘럼 섹션 (회차별 주제, 학습 목표)
  - 수강생 후기 섹션 (후기 텍스트, 이름, 직업)
  - 수강 성과 섹션 (수치 기반 결과)
  - 가격/등록 섹션 (가격, 할인 조건, 보너스)
  - FAQ 섹션 (질문 6~8개)

- ⬜ `workflow/campaigns/_template.md` 작성 — FB 광고 제안서 양식
  - 제안 배경 (랜딩페이지 링크, 목표 CPL, 기간)
  - 캠페인 구조 요약 (목표, 총 예산, 기간)
  - 광고세트 A (오디언스 정의, 일일 예산, 기간)
  - 광고세트 B (오디언스 정의, 일일 예산, 기간)
  - 광고 소재 안 (헤드라인, 메인 텍스트, CTA, 이미지/영상 가이드)
  - A/B 테스트 설계 (테스트 변수, 측정 지표, 판단 기준)
  - KPI 목표 (목표 리드수, 목표 CPL, 예산 소진율)

- ✅ `workflow/content/.gitkeep` 생성 (빈 폴더 유지)
- ✅ `workflow/imweb/.gitkeep` 생성 (빈 폴더 유지)
- ✅ `workflow/campaigns/.gitkeep` 생성 (빈 폴더 유지)
- ⬜ `.gitignore`에 워크플로우 산출물 규칙 추가 여부 결정

---

## Phase 3: lib/dashboard/types.ts

- ✅ `lib/dashboard/types.ts` 작성

---

## Phase 4: lib/dashboard/constants.ts

- ✅ `lib/dashboard/constants.ts` 작성

---

## Phase 5: lib/dashboard/csvParser.ts (TDD)

### 5-1. 테스트 작성 (RED)
- ✅ `__tests__/dashboard/csvParser.test.ts` 작성 (28 tests)

### 5-2. 구현 (GREEN)
- ✅ `lib/dashboard/csvParser.ts` 구현

### 5-3. 리팩토링 (REFACTOR)
- ✅ 공통 파싱 로직 추상화 (`parseCsv` 제네릭 함수)

---

## Phase 6: lib/dashboard/analytics.ts (TDD)

### 6-1. 테스트 작성 (RED)
- ✅ `__tests__/dashboard/analytics.test.ts` 작성 (25 tests)

### 6-2. 구현 (GREEN)
- ✅ `lib/dashboard/analytics.ts` 구현

### 6-3. 리팩토링 (REFACTOR)
- ✅ 순수 함수, 사이드이펙트 없음 확인

---

## Phase 7: lib/dashboard/storage.ts (TDD)

### 7-1. 테스트 작성 (RED)
- ✅ `__tests__/dashboard/storage.test.ts` 작성 (11 tests)

### 7-2. 구현 (GREEN)
- ✅ `lib/dashboard/storage.ts` 구현
- ⬜ `useDashboardStore()` custom hook — 미구현 (페이지에서 직접 storage 호출 중)

### 7-3. 리팩토링 (REFACTOR)
- ✅ JSON.parse 실패 오류 처리 구현 (try/catch)

---

## Phase 8: components/dashboard/ (TDD)

### 8-1. KpiCard.tsx
- ✅ `__tests__/dashboard/KpiCard.test.tsx` 작성
- ✅ `components/dashboard/KpiCard.tsx` 구현

### 8-2. FileDropZone.tsx
- ✅ `__tests__/dashboard/FileDropZone.test.tsx` 작성
- ✅ `components/dashboard/FileDropZone.tsx` 구현

### 8-3. WeekPicker.tsx
- ⬜ `components/dashboard/WeekPicker.tsx` 미구현 (upload/page.tsx에 인라인 처리 중)

### 8-4. DashboardNav.tsx
- ✅ `components/dashboard/DashboardNav.tsx` 구현

### 8-5. TrendChart.tsx
- ⬜ `components/dashboard/TrendChart.tsx` 미구현 (trends/page.tsx에 인라인 처리 중)

### 8-6. AbTestTable.tsx
- ⬜ `components/dashboard/AbTestTable.tsx` 미구현 (ab-test/page.tsx에 인라인 처리 중)

### 8-7. FatigueRow.tsx
- ⬜ `components/dashboard/FatigueRow.tsx` 미구현 (fatigue/page.tsx에 인라인 처리 중)

### 8-8. InsightBanner.tsx
- ✅ `components/dashboard/InsightBanner.tsx` 구현

### 8-9. AuditReport.tsx (추가 구현)
- ✅ `__tests__/dashboard/AuditReport.test.tsx` 작성
- ✅ `components/dashboard/AuditReport.tsx` 구현

---

## Phase 9: app/dashboard/ 페이지

### 9-1. layout.tsx
- ✅ `app/dashboard/layout.tsx` 작성

### 9-2. page.tsx (루트 리다이렉트)
- ✅ `app/dashboard/page.tsx` 작성 (`redirect('/dashboard/upload')`)

### 9-3. upload/page.tsx
- ⬜ `__tests__/dashboard/upload-page.test.tsx` 미작성
- ✅ `app/dashboard/upload/page.tsx` 구현

### 9-4. overview/page.tsx
- ⬜ `__tests__/dashboard/overview-page.test.tsx` 미작성
- ✅ `app/dashboard/overview/page.tsx` 구현

### 9-5. trends/page.tsx
- ✅ `app/dashboard/trends/page.tsx` 구현

### 9-6. ab-test/page.tsx
- ✅ `app/dashboard/ab-test/page.tsx` 구현

### 9-7. fatigue/page.tsx
- ✅ `app/dashboard/fatigue/page.tsx` 구현

---

## Phase 10: E2E 테스트 (Playwright)

- ⬜ `e2e/fixtures/` 폴더에 테스트용 CSV 3종 생성 (실제 FB 컬럼 형식)
- ⬜ `e2e/dashboard-upload.spec.ts` 작성
  - `/dashboard` 접속 → `/dashboard/upload` 리다이렉트 확인
  - 3개 CSV 업로드 → "분석 시작" 버튼 활성화 확인
  - "분석 시작" 클릭 → `/dashboard/overview` 이동 확인
  - 잘못된 CSV 업로드 → 에러 메시지 표시 확인
- ⬜ `e2e/dashboard-overview.spec.ts` 작성
  - KPI 카드 6개 표시 확인
  - 각 카드에 숫자 값 표시 확인
- ⬜ `e2e/dashboard-fatigue.spec.ts` 작성
  - CTR 30% 이상 하락 광고 → 빨간 뱃지 표시 확인
- ⬜ `e2e/dashboard-mobile.spec.ts` 작성
  - 375px 뷰포트 설정
  - 레이아웃 overflow 없음 확인
  - 하단 탭 바 표시 확인
  - 전체 페이지 스크롤 가능 확인

---

## Phase 11: 기존 classic 랜딩페이지 개선

### 11-1. ConsultForm.tsx 개선
- ⬜ shadcn/ui `Form` + `Input` + `Textarea`로 교체
- ⬜ 필드 유효성 검사 추가 (이름: 필수, 전화번호: 형식 검사)
- ⬜ Meta Pixel `Lead` 이벤트 발화 구현 (`NEXT_PUBLIC_FB_PIXEL_ID` 사용)
- ⬜ UTM 파라미터 hidden 필드로 폼 전송 추가

### 11-2. UTM 캡처 구현
- ⬜ `lib/utm.ts` 작성
  - `captureUtmParams()`: URL에서 utm_* 파라미터 추출 → sessionStorage 저장
  - `getUtmParams()`: sessionStorage에서 UTM 파라미터 읽기
- ⬜ `app/classic/page.tsx`에 UTM 캡처 스크립트 추가 (클라이언트 사이드)

### 11-3. CountdownTimer.tsx 개선
- ⬜ 하드코딩된 날짜 → `NEXT_PUBLIC_COUNTDOWN_TARGET` 환경변수로 교체
- ⬜ 환경변수 없을 시 fallback 처리

### 11-4. FaqAccordion.tsx 개선
- ⬜ shadcn/ui `Accordion`으로 교체 (접근성 개선)

### 11-5. SEO 개선
- ⬜ `app/classic/page.tsx`에 `generateMetadata()` 함수 구현 (title, description, openGraph)
- ⬜ `app/robots.ts` 생성 (Next.js 내장 robots.txt 자동 생성)
- ⬜ `app/sitemap.ts` 생성 (Next.js 내장 sitemap.xml 자동 생성)

### 11-6. Meta Pixel 전역 설정
- ⬜ `app/layout.tsx`에 Meta Pixel 스크립트 추가 (`next/script` Strategy: afterInteractive)
- ⬜ `fbq('track', 'PageView')` 라우트 변경 시 자동 발화 구현

---

## Phase 12: 나머지 코스 페이지 (foundation, intern)

> Agent 2 도구 완성 후 실행

- ⬜ `workflow/content/` foundation 코스 콘텐츠 생성 (Agent 1 실행)
- ⬜ `app/foundation/page.tsx` 생성 (Agent 2 실행)
- ⬜ `workflow/imweb/` foundation 아임웹 HTML 생성 (Agent 2 실행)
- ⬜ `workflow/content/` intern 코스 콘텐츠 생성 (Agent 1 실행)
- ⬜ `app/intern/page.tsx` 생성 (Agent 2 실행)
- ⬜ `workflow/imweb/` intern 아임웹 HTML 생성 (Agent 2 실행)

---

## Phase 13: 성능 및 품질 검증

- ⬜ `npx lhci autorun` 실행 → classic 페이지 Performance ≥ 90 확인
- ⬜ LCP ≤ 2.5초 확인 (next/image 최적화 확인)
- ⬜ CLS ≤ 0.1 확인
- ⬜ `npm test -- --coverage` → 커버리지 리포트 확인
- ⬜ `npx playwright test` → 전체 E2E 통과 확인
- ⬜ Vercel preview 배포 → `/classic`, `/dashboard` 접근 확인

---

## 빠른 시작 순서 (권장)

```
Phase 0 (인프라) → Phase 3~7 (lib/dashboard, TDD) → Phase 8~9 (컴포넌트, 페이지)
→ Phase 10 (E2E) → Phase 1~2 (문서) → Phase 11 (classic 개선) → Phase 13 (검증)
```

---

> 마지막 업데이트: 2026-03-24
