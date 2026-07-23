# 광고 동영상 생성 프로세스 — 공통 관문

광고 영상 소재를 만드는 **두 제작 경로(Remotion · Hyperframe)의 진입점**이다. 경로를 어떻게 고르고, 어느 경로로 가든 공통으로 지키는 입력·출력·마감을 정한다.

> 기준일 2026-05-20 (개정 2026-07-23) · 상위 워크플로우: `docs/PROCESS.md` Phase 5(광고 소재)의 영상 가지

---

## 0. 개요

영상 소재는 **두 경로 중 하나**로 만든다. 어느 쪽이든 **앞(씬 기획 승인)과 뒤(배달·마감)는 동일**하고, 가운데 제작 방식만 갈린다.

```
Phase 4 광고 제안서 (campaigns/{기수}.md)
        ▼
① 씬 기획 승인      campaigns/{기수}-story-plan.md 작성 → 사람 검토·승인   (공통 입력)
        │
   ┌────┴──────────────────┐
   ▼ (A) Remotion            ▼ (B) Hyperframe
② JSON 주문서 렌더        ② HTML+GSAP 자유 제작
   docs/video-remotion.md      docs/video-hyperframe.md
   → remotion/out/ (스크래치)   → renders/ (스크래치)
   └────┬──────────────────┘
        ▼
③ 검수 → 배달       확정본만 public/ads/{course}/{기수}/v{NN}/video/       (공통 출력)
        ▼
④ 마감              campaigns/{기수}-assets.md 매니페스트 갱신             (공통 마감)
```

**핵심 원리 — 어느 경로로 가든 파이프라인은 벗어나지 않는다.** 씬 기획 승인이 공통 관문이고, 배달 규약·매니페스트 갱신이 공통 마감이다. 제작 방식(Remotion/Hyperframe)은 그 사이에서만 갈린다.

결과물 규격(공통): **9:16 · 1:1 · 4:5 (Meta 게재 위치 3종) · 1080px 폭 · 30fps · H.264 MP4**. 본편 ~20–30초 권장, 끝에 로고 아웃트로(옵션).

---

## 1. 경로 선택 기준

씬 기획을 승인하기 전에 **어느 경로로 만들지 먼저 정한다.** story-plan 문서의 `제작 경로` 필드에 명시한다.

| 기준 | **Remotion** (`docs/video-remotion.md`) | **Hyperframe** (`docs/video-hyperframe.md`) |
|---|---|---|
| 제작 방식 | JSON 주문서 → 고정 템플릿(StorytellingAd) | HTML+GSAP 자유 제작 |
| **맞는 경우** | 표준 5씬 스토리 아크 · 카피/자산 교체 반복 · 데이터 주도 다변형 | 원오프 아트디렉션 · 템플릿에 없는 연출(타이포·레이아웃 자유) |
| 비율 파생 | 컴포지션이 전 비율 자동 (한 JSON으로 3~4종) | 9:16 원본 → ffmpeg 크롭(4:5) · 1:1은 전용 레이아웃 별도 제작 |
| BGM/아웃트로 | 템플릿 내장 (JSON 필드) | `build-final.sh` ffmpeg 후처리 |
| 수정 비용 | 낮음 (JSON 편집 → 재렌더) | 높음 (HTML 편집 + 후처리 재실행) |
| **기본값** | **미지정 시 Remotion** | story-plan에 명시 선택 시만 |

> **한 줄 판단** — "이 템플릿(StorytellingAd)에 카피·자산만 갈아끼우면 되는가?"면 Remotion, "템플릿으로 안 되는 연출이 필요한가?"면 Hyperframe.

기존 사례: intern10000(1·2기) = Remotion / persona-design 1기·classic 65기 = Hyperframe.

---

## 2. 공통 입력 — 씬 기획 승인 게이트

두 경로 모두 **승인된 씬 기획 문서**에서 출발한다. 이것이 파이프라인의 stop & review 관문이다.

`courses/{course}/campaigns/{기수}-story-plan.md` — 광고 제안서 `{기수}.md` 옆에 둔다. 양식은 `courses/_templates/story-plan.template.md`.

- **씬 흐름 표** — `# / kind / 헤드라인 / 길이 / 자산` 한 줄 표. 스토리 아크(hook→problem→turn→proof→cta)가 설득력 있는지 한눈에 판단.
- **씬별 상세** — 씬마다 카피·자산 brief·효과·길이.
- **제작 경로** — 메타에 `Remotion` 또는 `Hyperframe` 명시 (§1 기준). 이 필드가 분기 신호다. (구 문서는 제목에 `(Hyperframe)`로 표기 — 하위호환 인정.)

**왜 JSON/HTML을 바로 안 쓰나** — 중괄호·태그 사이에서는 "이 스토리가 설득력 있나"를 판단하기 어렵다. 사람이 읽을 수 있는 문서로 먼저 확정·승인한 뒤에야 제작으로 넘어간다.

씬 종류·길이 기준(공통):

| kind | 역할 | 권장 길이 |
|---|---|---|
| `hook` | 첫 3초 — 스크롤을 멈추게 하는 한 방 | 3초 |
| `problem` | 공감 확장 — 왜 그 문제가 생기는지 | 5초 |
| `turn` | 전환 — 해결책·관점의 반전 | 5초 |
| `proof` | 증명 — 신뢰 근거(강사·실적·후기) | 6초 |
| `cta` | 행동 유도 — 제안 + 버튼 | 5초 |

> **길이** — 합계 ~24초, 장면 전환 겹침 빼면 ~22초. **3~6씬** 권장 — 30초 넘으면 이탈률 급증.

---

## 3. 경로별 제작

승인된 story-plan을 들고 선택한 경로 문서로 들어간다.

- **Remotion** → `docs/video-remotion.md` — story.json 주문서 작성 → `npm run render:story`로 전 비율 일괄 렌더.
- **Hyperframe** → `docs/video-hyperframe.md` — `ad-projects/_template-hf/` 복사 + **디자인 프리셋 선택**(`ad-projects/_presets/` showcase-first) → HTML 제작 → `npm run render` + `build-final.sh` 후처리.

두 경로 모두 결과물은 **스크래치**(`remotion/out/` · `ad-projects/*/renders/`)에 나온다 — 아직 배달본이 아니다.

---

## 4. 공통 출력 — 배달

렌더 결과를 검수한 뒤, **확정본만** 배달 트리로 버전 네이밍해 복사한다. 스크래치 폴더는 gitignore 대상이라 그대로 두면 배달된 게 아니다.

```
public/ads/{course}/{기수}/v{NN}/video/{course}-{기수}-{variant}-{ratio}-v{NN}.mp4
```

- `ratio` 슬러그: `reels`(9:16) · `1x1` · `4x5` · `191`(1.91:1).
- 버전은 폴더(`v01/`)와 파일명(`-v01`) 이중 표기, 2자리 zero-pad. 수정 시 `v02/` 신설.
- **전체 규약은 `docs/ad-asset-organization.md`가 정본.** (Remotion `render:story --deliver=v{NN}`이 이 복사를 자동화한다.)

기수 없는 코스는 날짜 배치 키(예 `0618`)를 쓴다 — ad-asset-organization.md 참조.

---

## 5. 공통 마감 — 소재 매니페스트

배달 후 캠페인 소재 인덱스를 갱신해 "무엇을 어디에 배달했는지" 추적 가능하게 한다.

`courses/{course}/campaigns/{기수}-assets.md` — 소스 위치(story.json 또는 hf 프로젝트)·출력 경로·버전 이력을 기록한다. 양식 예시: `courses/persona-design/campaigns/1기-assets.md`(Hyperframe 경로 매니페스트 실례).

---

## 6. 수정·검수 공통 표준

영상은 한 번에 끝나지 않는다 — 초안을 보고 고치는 **수정 사이클**이 반복된다. 아래 5가지는 두 경로 공통 고정 절차이며, 어느 하나도 건너뛰지 않는다.

1. **손대기 전에 확정한다** — 수정 요청을 코드부터 고치지 않는다. 씬·요소 단위로 해석해 "무엇을 어떻게 바꿀지"를 정리하고 사람에게 확정받은 뒤 일괄 구현한다. 선택이 갈리면 추천안을 먼저 제시하고 묻는다. 위계가 어긋나 보이면 증상만 손대지 말고 근본 원인을 짚는다.
2. **게재 위치 전 비율을 렌더한다** — 표준 3종(9:16·1:1·4:5)을 전부. 하나만 뽑고 끝내지 않는다.
3. **렌더 후 스틸로 자가 검수한다** — 렌더 exit 0은 "인코딩 완료"일 뿐 "의도대로 나왔다"가 아니다. 변경된 씬의 핵심 프레임을 눈으로 확인한 뒤 완료를 보고한다. (Remotion은 `npx remotion still`, Hyperframe은 재생기로.)
4. **품질 문제는 그 자리에서 처리한다** — 화질 저하·가시성 부족·잘림·톤 불일치를 발견하면 그대로 보고하지 않는다. 고치거나, 판단이 필요하면 묻는다.
5. **기획 문서를 동기화한다** — 제작물을 바꿨으면 `{기수}-story-plan.md`도 같은 내용으로 갱신해 어긋나지 않게 한다.

---

## 7. 부록 — 레거시 (신규 제작에 사용하지 않음)

`remotion/`에는 초기 실험 컴포지션이 남아 있다. **신규 영상은 위 두 경로로만 만든다.**

- **ClassicSplitAd** — Before/After 스플릿 애니메이션. 문구가 `classicSplitDefaults`에 하드코딩돼 있고(예: `cohort: "클래식과정 64기"`) story.json 피드를 읽지 않는다 — **동결**. 새 기수 영상에 쓰지 않는다.
- **KineticHeadlineAd** (+ `scripts/render-all.mjs`) — 배열 피드로 키네틱 헤드라인 카드를 다건 렌더하는 초기 도구. 레거시 배치용으로만 남겨둔다.

---

*소옴크리에이티브 · 광고 동영상 공통 관문 · 기준일 2026-05-20 · 개정 2026-07-23*
*경로 세부: `docs/video-remotion.md` · `docs/video-hyperframe.md` · 배달 규약: `docs/ad-asset-organization.md` · 상위: `docs/PROCESS.md`*
