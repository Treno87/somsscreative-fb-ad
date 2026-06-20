# 워크플로우 마스터 — USP → 랜딩 → FB 광고 콘텐츠

> 새 코스 또는 새 기수의 광고 캠페인을 시작할 때 따르는 7단계 표준 프로세스.
> 각 단계는 **stop & review** 게이트가 있고, 사용자 검토 후 다음 단계로 진행한다.

---

## 두 가지 케이던스 — 셋업 vs 캠페인 루프

이 7단계는 매번 0번부터 다 도는 게 아니다. **코스 개요는 고정값**이고, 그 위에서 **광고 산출물(카피·소재)만 변형·반복**된다. 따라서 파이프라인은 빈도가 다른 두 레이어로 나뉜다.

| 레이어 | 단계 | 빈도 | 변형 |
|--------|------|------|------|
| **코스 셋업 (고정)** | Phase 0~2 (USP → content → 랜딩) | 코스당 1회. 개요·포지셔닝·커리큘럼이 바뀔 때만 | ❌ 개요는 고정 |
| **캠페인 루프 (반복)** | Phase 4~7 (광고안 → 소재 → 운영 → 분석) | 기수·캠페인마다 반복 | ✅ 카피·소재는 A/B 변형 |

- **Phase 0~2 (셋업)** — `usp-curator`·`content-writer`·`landing-builder`는 *신규 코스* 또는 *개요 변경* 시에만 실행하는 셋업 도구다. 매 캠페인마다 재실행하지 않는다.
- **Phase 4~7 (루프)** — 실제로 자주 도는 부분. 변형이 필요한 카피·소재는 `ad-proposal`·`image-prompt-brand`가 **한 번에 다중 출력**으로 생성한다 (변형마다 에이전트를 병렬로 쪼개지 않는다 — 한 에이전트가 전체 맥락을 보고 의도적으로 다른 각도로 분산시켜야 진짜 다른 변형이 나온다).

**재진입 규칙**

- 개요 변경 없이 새 기수·새 캠페인만 돌릴 때 → **Phase 4부터 재진입** (랜딩 URL·기존 성과 CSV 입력).
- Phase 7 분석에서 랜딩 자체 문제가 드러날 때만 → Phase 2(빌드) 또는 Phase 1(카피)로 회귀.
- USP·커리큘럼 등 개요가 실제로 바뀔 때만 → Phase 0부터.

---

## 단계 요약

| Phase | 입력 | 도구 | 출력 | 검토 항목 |
|------|------|------|------|----------|
| 0 | USP 정보 (정형/자유형) | `usp-curator` 또는 직접 작성 | `courses/{course}/USP.md` | USP 한 줄, 타겟, 경쟁 구도 |
| 1 | USP + `.claude/brand-context.md` | `content-writer` | `courses/{course}/content.md` | Hero·후기·가격·CTA 변형 |
| 2 | content.md | `landing-builder` | `courses/{course}/imweb.html` (단일 정본) + `imweb-preview.html` + `visual-brief.md` | `imweb-preview.html`로 브라우저 확인 |
| 3 | visual-brief.md | `image-prompt-brand` + 외부 도구 (Midjourney/Sora) | `public/courses/{course}/*.jpg` | 페이지에 이미지 반영 확인 |
| 4 | content.md + 랜딩 URL + (선택) `analytics/output/*` | `ad-proposal` | `courses/{course}/campaigns/{기수}.md` | 예산·기간·오디언스·소재 카피 |
| 5 | 제안서의 소재별 시각 디렉션 | `image-prompt-brand` + 외부 도구 | `public/ads/{course}/{기수}/v{NN}/...` (규약: `docs/ad-asset-organization.md`) | Meta 광고 미리보기 |
| 6 | 모든 산출물 | Meta Ads Manager (수동) | 운영 중인 캠페인 | — |
| 7 | 운영 후 CSV | `fb-ad-audit` / `dashboard-analyst` / `landing-optimizer` | 진단 보고서 + 페이지 개선 PR | Phase 0~2로 회귀 |

---

## Phase 0 — USP 정의

**목표:** 코스의 핵심 USP·타겟 페르소나·경쟁 구도를 한 문서로 확정.

### 입력

- 강사 정보, 후기, 가격, 기수별 데이터 등 사실 정보
- 형식은 둘 중 하나:
  - **A) 정형 템플릿** — `courses/_templates/USP.template.md` 복사해서 직접 채움
  - **B) 자유형 노트** — 한 줄짜리 핵심 USP + 메모 → `usp-curator` 에이전트가 템플릿 형식으로 정규화

### 실행

```
# Option A: 직접 작성
cp courses/_templates/USP.template.md courses/{course}/USP.md
# 편집

# Option B: 에이전트에게 위임
"usp-curator 에이전트를 사용해서 {course} USP를 정리해줘.
 자유형 노트는 아래와 같아: ..."
```

### 검토 게이트

- [ ] USP 한 줄 (30자 이내)이 타겟의 언어로 쓰였는가?
- [ ] 경쟁 구도가 명확히 차별화되는가?
- [ ] 후기에 구체적 수치가 있는가? (예: "단골 3명 → 11명")
- [ ] 금지·권장 표현이 명시되어 있는가?

✅ 통과 → Phase 1 / ❌ 미흡 → 수정 후 재검토

---

## Phase 1 — 콘텐츠 초안 작성

**목표:** USP를 기반으로 랜딩페이지 전체 카피를 작성. **전환율 최대화 관점에서 CRO 체크리스트 통과 필수.**

### 실행

```
"content-writer 에이전트로 {course} {기수} 콘텐츠 작성해줘"
```

에이전트가 `.claude/brand-context.md`와 `courses/{course}/USP.md`를 읽고 다음을 생성:

### 산출물: `courses/{course}/content.md`

- 메타 정보 (코스명·기수·기간·가격·정원·개강일·타겟·작성일)
- Hero 헤드라인·서브 헤드라인·CTA 2종 (각 3개 변형)
- 고통 포인트 3~5개 (고객의 언어 그대로)
- 강사 소개 (이름·경력·증명 포인트·사진 가이드)
- 커리큘럼 (회차별 표)
- 수강생 후기 3개 (이름·기수·직업·구체 수치)
- 수강 성과 (수치 기반)
- 가격/등록 (정가·할인·분납·보너스·잔여)
- FAQ 6~8개

### CRO 체크리스트 (Phase 1 검토)

- [ ] Hero 헤드라인 변형 **3개** 제시되었는가?
- [ ] CTA 버튼 텍스트 **2종** (상담 / 등록)가 있는가?
- [ ] 고통 포인트 **3~5개**가 페르소나의 실제 언어로 작성됐는가?
- [ ] 후기 **3개**가 각각 수치를 포함하는가?
- [ ] 희소성 요소(카운트다운 / 잔여 자리)가 명시됐는가?
- [ ] FAQ가 **6~8개**, brand-context.md의 Objections를 다 다루는가?
- [ ] 금지 표현("최고", "최강", "이론" 단독)이 없는가?

✅ 통과 → Phase 2 / ❌ 미흡 → 수정 또는 content-writer 재실행

---

## Phase 2 — 랜딩 빌드 (아임웹 코드블록 단일 정본)

**목표:** 확정된 콘텐츠를 **아임웹 코드블록 조각 하나**로 만든다. 이 조각이 곧 배포본이다 — 별도 Next.js 페이지를 만들지 않는다. 이미지는 placeholder 경로로 두고 시각 디렉션을 별도 산출.

> **왜 정본을 하나로?** 과거에는 Next.js 페이지와 아임웹 HTML을 따로 두어, 코드 기준으로 감사한 페이지가 실제 배포본(아임웹)과 달라지는 문제가 있었다. 코스별 정본을 `courses/{course}/imweb.html` 하나로 줄여 그 드리프트를 구조적으로 없앤다.

### 실행

```
"landing-builder 에이전트로 {course} 랜딩페이지 빌드해줘"
```

### 산출물 (3종)

1. `courses/{course}/imweb.html` — **아임웹 코드블록 조각 (정본)**. vanilla HTML + CDN Tailwind + Google Fonts, 양 끝에 `<!-- hallmark:start ... -->` / `<!-- hallmark:end -->` sentinel 마커.
2. `courses/{course}/imweb-preview.html` — 로컬 미리보기 하네스 (검토용·비정본·일회용).
3. `courses/{course}/visual-brief.md` — 섹션별 이미지 가이드 (Phase 3 입력).

### 검토 게이트

`courses/{course}/imweb-preview.html`을 브라우저로 열어 확인:

- [ ] 모바일 375px에서 레이아웃 깨짐 없음
- [ ] `<h1>` 1개만
- [ ] 모든 CTA가 아임웹 폼 위젯 앵커로 점프 (카카오 버튼 제외)
- [ ] 수치·후기가 `content.md`에 있는 것만 — 지어낸 것 없음
- [ ] AI 슬롭 없음 (보라 그라데이션 히어로·3단 아이콘 카드·가짜 크롬 등). Hallmark 설치 시 `hallmark audit`
- [ ] sentinel 마커가 조각 첫 줄·끝 줄에 있음
- [ ] visual-brief.md에 섹션별 이미지 요건 명시됨

**배포 시:** `imweb.html` 전체(마커 포함)를 아임웹 코드블록에 붙여넣는다. **이후 아임웹 에디터에서 코드블록을 손대지 않는다** — 수정은 항상 `imweb.html`을 고쳐 다시 붙여넣는다.

✅ 통과 → Phase 3 / ❌ 미흡 → 수정

---

## Phase 3 — 랜딩 이미지 생성

**목표:** visual-brief.md를 토대로 실제 이미지를 외부 도구로 생성하고 `public/courses/{course}/`에 저장.

### 실행

```
"image-prompt-brand 에이전트로 visual-brief.md 기반 이미지 프롬프트 만들어줘"
```

에이전트가 섹션별·도구별(Midjourney v6, Sora, Canva 등) 프롬프트를 생성. 사용자가 외부 도구로 이미지 생성 후 다음 경로에 저장:

```
public/courses/{course}/
├── hero.jpg            # 1920×1080
├── instructor.jpg      # 600×800
├── class-1.jpg         # 1200×800
├── og-image.jpg        # 1200×630 (OpenGraph)
└── ...
```

### 검토 게이트

- [ ] 페이지 새로고침 시 모든 이미지가 정상 표시됨
- [ ] 브랜드 톤(진지·직접적·과장 없음)에 맞는가?
- [ ] OG 이미지가 카카오/페북 공유 미리보기에서 정상 노출되는가?

✅ 통과 → Phase 4 / ❌ 미흡 → 프롬프트 수정 후 재생성

---

## Phase 4 — FB 광고 제안서

**목표:** 랜딩 URL과 기존 성과 데이터(있을 경우)를 입력으로 받아 Meta 광고 전체 캠페인 제안서 작성.

### 실행

```
"ad-proposal 에이전트로 {course} {기수} 광고 제안서 작성해줘.
 랜딩 URL: https://..., 목표 CPL: 30000, 예산: 200만원, 기간: 2주"
```

### 산출물: `courses/{course}/campaigns/{기수}.md`

- 캠페인 구조 (전환 캠페인 1개, 광고세트 A/B/C)
  - A) 따뜻한 오디언스 (팔로워+인게이지먼트)
  - B) 유사 오디언스 (1~3% LAL)
  - C) 리타겟팅 (30일 미전환 방문자)
- 광고 소재 3종 (고통 / 후기 / 직접 혜택 어프로치)
  - 헤드라인(40자) · 메인 텍스트(125자) · 설명(30자) · CTA · 이미지 가이드
- A/B 테스트 설계
- UTM 파라미터 표준
- KPI 목표표
- 예산 배분표
- 운영 가이드 (학습 단계, 중단 기준)

### 검토 게이트

- [ ] 목표 CPL이 현실적인가? (기존 audit 데이터 있으면 ±20% 이내)
- [ ] 오디언스 크기가 광고세트당 일 예산 ÷ 평균 도달 단가에 맞는가?
- [ ] 헤드라인이 USP 카피 변형 중 하나와 일치하는가?
- [ ] UTM `utm_campaign`이 `{course}-{기수}` 패턴인가?

✅ 통과 → Phase 5 / ❌ 미흡 → 수정

---

## Phase 5 — 광고 소재 이미지 생성

**목표:** ad-proposal의 소재별 시각 디렉션을 토대로 광고 이미지/영상 생성.

### 실행

```
"image-prompt-brand 에이전트로 광고 소재 1~3번 이미지 프롬프트 만들어줘"
```

### 저장 경로

> 전체 규약은 `docs/ad-asset-organization.md` 참조 (포맷·버전 네이밍 포함).

```
public/ads/{course}/{기수}/v{NN}/
├── image/     {course}-{기수}-{variant}-{ratio}-v{NN}.png   # 1x1·4x5
├── video/     {course}-{기수}-{variant}-{ratio}-v{NN}.mp4   # reels·1x1·191
└── carousel/{set}/  {II}-v{NN}.png
```

### 검토 게이트

- [ ] Meta 광고 관리자 미리보기에서 정상 노출되는가?
- [ ] 텍스트 비율이 20% 이하인가? (Meta 권장)
- [ ] 브랜드 톤 일관성 (랜딩 이미지와 비교)

✅ 통과 → Phase 6

> **영상 소재가 필요할 때 →** Phase 5는 정지 이미지 소재까지만 다룬다. 릴스·스토리용
> **동영상 광고**(씬 구분·카피·이미지/영상·배경음악·텍스트 효과)를 만들 때는
> `docs/video-ad-process.md`(클로드 참고용) / `docs/video-ad-process.html`(사람용)을
> 따른다 — Remotion `remotion/` 시스템으로 `data/{course}-{기수}-story.json` 한 파일에서
> 영상을 생성한다.

---

## Phase 6 — Meta Ads Manager 캠페인 생성 (수동)

**목표:** 모든 산출물(제안서·랜딩·이미지)을 Meta Ads Manager에 입력하여 캠페인 실행.

### 체크리스트

- [ ] Pixel ID가 `.env.local`에 설정되어 있고 랜딩에서 `PageView` 이벤트 발화 확인
- [ ] 폼 제출 시 `Lead` 이벤트 발화 확인
- [ ] UTM 파라미터가 광고 URL에 정확히 들어갔는가?
- [ ] 일 예산이 제안서와 동일한가?
- [ ] A/B 테스트 설정이 제안서와 동일한가?

캠페인 시작 후 **3일간 학습 단계** — 수정 최소화.

---

## Phase 7 — 성과 피드백 루프 (반복)

**목표:** 운영 데이터를 토대로 랜딩·소재·USP 개선.

### CSV 다운로드

Meta Ads Manager → 보고서 → 캠페인·광고세트·광고 각각 CSV (한국어).

### 두 가지 분석 경로

**A) 빠른 점검 — 대시보드**
- `/dashboard/upload` 에 CSV 3종 업로드 + 주차 태그 입력
- `/dashboard/overview` → KPI, `/dashboard/trends` → 주차별, `/dashboard/ab-test` → A/B, `/dashboard/fatigue` → 피로도

**B) 깊은 분석 — 에이전트**
- CSV를 `analytics/input/`에 저장
- `"fb-ad-audit 에이전트로 분석해줘"` → 14항목 진단 `analytics/output/report.json`
- 또는 `"dashboard-analyst 에이전트로 빠른 분석해줘"` → 마크다운 리포트
- 필요 시 `"landing-optimizer 에이전트로 페이지 개선 제안해줘"` → Phase 2 회귀

### 랜딩 감사 — 2층 구조

랜딩 감사는 서로 다른 두 질문이며 섞지 않는다:

- **디자인 감사** — `courses/{course}/imweb.html` 정본 대상. AI 슬롭·안티패턴·구조. Hallmark `audit` 또는 안티패턴 체크리스트.
- **행동 감사 (배포 後)** — Clarity 데이터 + 라이브 iMweb DOM. 전환·이탈·폼/CTA 동작. `landing-optimizer`가 담당.

**드리프트 체크 (배포본을 디자인 감사하기 전 필수).** 라이브 페이지를 fetch해 sentinel 마커(`hallmark:start`~`hallmark:end`) 사이를 잘라 `courses/{course}/imweb.html`과 diff한다:

```bash
node scripts/landing-drift-check.mjs {course} {live-url}
```

- 일치(exit 0) → 정본을 감사해도 그것이 곧 배포본이다.
- 불일치(exit 1) → 아임웹 코드블록을 누가 손댄 것. 먼저 정본과 동기화한 뒤 감사한다.

### 다음 기수 준비 (재진입)

코스 개요는 고정이므로 0번부터 다시 돌지 않는다. 변경 범위에 맞는 단계로만 재진입한다 (위 "두 가지 케이던스" 참조):

- **기본 (개요 불변)** → **Phase 4부터** 재진입. 새 기수 광고 제안서 작성 시 운영 인사이트(후기·VoC·CPL 실적)를 입력으로 반영.
- **랜딩/카피 문제 발견** → Phase 2 또는 Phase 1로 회귀.
- **USP·커리큘럼 등 개요 변경** → Phase 0부터.
- 어느 경우든 새로 확보한 후기·VoC·가격 변경은 `courses/{course}/USP.md`에 누적 기록해 다음 캠페인의 자산으로 둔다.

---

## 부록: 에이전트 빠른 참조

| 에이전트 | 단계 | 입력 | 출력 |
|----------|-----|------|------|
| `usp-curator` | 0 | 자유형 노트 | `courses/{course}/USP.md` |
| `content-writer` | 1 | USP.md | `courses/{course}/content.md` |
| `landing-builder` | 2 | content.md | imweb.html (정본) + imweb-preview.html + visual-brief.md |
| `image-prompt-brand` | 3, 5 | visual-brief.md or 제안서 | 이미지 프롬프트 |
| `ad-proposal` | 4 | content.md + 랜딩 URL | `campaigns/{기수}.md` |
| `fb-ad-audit` | 7 | analytics/input/ CSV | `analytics/output/report.json` |
| `dashboard-analyst` | 7 | analytics/input/ CSV | `analytics/output/analysis_*.md` |
| `landing-optimizer` | 7 | Clarity + 라이브 iMweb DOM + 광고 성과 | 아임웹 적용용 개선 제안 |

---

## 신규 코스 시작 체크리스트

```bash
COURSE=foundation   # 예시
mkdir -p courses/$COURSE/campaigns public/courses/$COURSE
cp courses/_templates/USP.template.md courses/$COURSE/USP.md
# 편집 → Phase 0 검토 → Phase 1 진행
# 랜딩 정본은 Phase 2에서 courses/$COURSE/imweb.html 로 생성된다
```
