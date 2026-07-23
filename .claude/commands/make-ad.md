---
description: 팩트 입력 → 광고 카피·소재 자동 생성, 각 단계는 크리틱 채점 후 사람이 컨펌
argument-hint: {course} {기수}  예: classic 65기
---

`$ARGUMENTS` 로 지정된 **{course} {기수}** 광고를 파이프라인(PROCESS.md Phase 4~5)대로 만든다.
사용자의 역할은 **팩트 입력 + 각 게이트 컨펌**이다. 품질 판정은 사용자 눈이 아니라
`creative-critic`(채점표 `.claude/creative-rubric.md`)이 먼저 한다.

> `$ARGUMENTS` 가 비어 있으면 코스와 기수부터 묻는다. 인자가 course/기수 형식이 아니면 확인한다.

---

## 0. 사전 점검 (셋업이 있어야 루프가 돈다)

- `courses/{course}/content.md` 와 `courses/{course}/imweb.html` 가 있는지 확인.
- 없으면 → **여기서 멈추고** 안내한다: "코스 셋업(Phase 0~2)이 먼저다. `content-writer`·`landing-builder`로 개요를 확정한 뒤 다시 `/make-ad` 하라." (PROCESS.md의 두 케이던스 참조 — 개요는 코스당 1회.)
- 성과 데이터(`analytics/output/report.json`)가 있으면 경로를 기억해 둔다(크리틱·제안서가 승자/패자 앵글에 참고).

## 1. 팩트 수집

`ad-proposal` 실행에 필요한 값을 확인한다. 사용자가 이미 줬으면 그대로, 없으면 **한 번에 모아서** 묻는다:

- 랜딩페이지 URL
- 목표 CPL (원)
- 총 예산 · 캠페인 기간
- 영상 소재 필요 여부 (Y/N) — 필요하면 6단계에서 경로 분기

## 2. 카피·제안서 생성 — `ad-proposal`

- `ad-proposal` 에이전트를 실행한다 → `courses/{course}/campaigns/{기수}.md` (+ 영상 데이터 피드 JSON).
- 성과 데이터가 있으면 반복 제안 모드(승자 앵글 확장·패자 회피)로 돈다.

## 3. ⛳ 크리틱 게이트 — 카피

- `creative-critic` 에이전트로 방금 만든 카피(제안서의 헤드라인·본문·CTA·소재 3안)를 채점한다.
- **FAIL 이 있으면**: 크리틱의 리라이트안을 제안서에 반영하고 **다시 채점**. FAIL 0건이 될 때까지 반복(최대 2회, 그래도 남으면 사용자에게 이유와 함께 보고).
- 채점 표 + 리라이트 결과를 사용자에게 보여준다.

## 4. ⏸ 사람 컨펌 — 카피

- 사용자에게 카피·예산·오디언스 컨펌을 요청한다. **컨펌 전까지 다음으로 넘어가지 않는다.**
- 수정 요청이 오면 반영 후 3번(크리틱)부터 다시.

## 5. 소재 생성

- **정지 이미지**: `image-prompt-brand` 로 소재별 프롬프트 → 사용자가 외부 도구로 생성 → `public/ads/{course}/{기수}/v{NN}/...` (규약: `docs/ad-asset-organization.md`).
- **영상**(1번에서 Y): `docs/video-ad-process.md` 관문으로 경로 선택.
  - Hyperframe이면 `ad-projects/_template-hf/` 복사 + `ad-projects/_presets/{name}` 프리셋 선택(showcase로 룩 먼저 확정) → story-plan 씬대로 제작.
  - Remotion이면 JSON 주문서 → `remotion/` 렌더.

## 6. ⛳ 크리틱 게이트 — 소재

- `creative-critic` 으로 소재(디자인/영상)를 채점한다 — 색=신호·구조·차별점·증거 차원.
- FAIL 이 있으면 3번과 같은 방식으로 반영·재채점.

## 7. ⏸ 사람 컨펌 — 소재 → 배달

- 소재 컨펌을 요청한다. 컨펌되면 배달 트리(`public/ads/...` 또는 `ad-projects/*-hf/renders/`)를 정리하고 경로를 보고한다.
- 다음 단계 안내: Phase 6(Meta Ads Manager 수동 생성). 운영 후 CPL/CTR로 크리틱 판정을 재검증(시장이 최종 판정자).

---

## 원칙

- **각 ⏸ 게이트에서 반드시 멈춘다.** 사용자 컨펌 없이 다음 단계로 진행하지 않는다.
- **되돌리기 어려운 것**(파일 대량 생성·외부 전송)은 실행 전에 알린다.
- 크리틱이 못 잡는 건 사용자도 못 잡는 게 아니라, **운영 성과 데이터**가 최종 심판이다 — 그래서 Phase 7 재검증을 항상 안내한다.
- 지어낸 수치·미검증 후기(예: content.md에서 "확인 필요" 표시된 것)는 컨펌 없이 광고에 넣지 않는다.
