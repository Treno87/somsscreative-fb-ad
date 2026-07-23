# 영상 프리셋 (Hyperframe 디자인 룩)

Hyperframe 광고 영상의 **디자인 룩(색·타이포·컴포넌트·연출 톤)을 재사용 단위**로 모아둔 곳.
"디자인을 매번 새로 만들거나, 기존 프리셋을 재사용" — 이 폴더가 그 재사용 축이다.

> 배경 철학: `courses/classic/ads/0618/PHILOSOPHY.md`("Disciplined Edge", 색=신호).
> 파이프라인 위치: `docs/video-hyperframe.md`의 프리셋 워크플로우.

## 구조

프리셋 하나 = 폴더 하나, 2파일:

| 파일 | 역할 |
|------|------|
| `FRAME.md` | **디자인 토큰 스펙(brand truth)** — YAML 프론트매터에 색·타이포·간격·컴포넌트. 이 값이 규범. |
| `showcase.html` | **브라우저 미리보기** — 그 토큰을 샘플 프레임에 입힌 정지 1컷. 만들기 전에 룩을 눈으로 확인. |

## 현재 프리셋 (4종 · 출처 = classic 광고 4방향)

| 프리셋 | 룩 | 언제 |
|--------|-----|------|
| `editorial-dark` | 다크 위 아이보리 · 대형 타이포 · 여백 (Noir) | 프리미엄·진지. **기본 추천** |
| `ivory-premium` | 아이보리 라이트 럭셔리 · 골드 악센트 | 밝고 우아한 톤 |
| `magenta-block` | 마젠타가 지배하는 컬러-포워드 · 색면 블록 | 대담·강한 주목 (리타겟·프로모션) |
| `split-bold` | Before/After 화면 분할 · 웜다크+마젠타/옐로 | 변화 서사가 핵심일 때 |

## 쓰는 법

1. `showcase.html`들을 브라우저로 열어 **룩을 눈으로 고른다** (showcase-first).
2. `ad-projects/_template-hf/`를 새 프로젝트로 복사한다 (`docs/video-hyperframe.md` 참고).
3. 고른 프리셋 `FRAME.md`의 `colors`·`typography` 값을 새 프로젝트 `index.html`의 `:root`에 붙여넣는다.
4. story-plan의 씬대로 레이아웃을 짠다 — 컴포넌트(`.eyebrow`·`.badge`·`.card`·`.cta`)는 스타터에 이미 있다.

## 색 = 신호 (전 프리셋 공통 규칙)

- **마젠타 `#ff3bff`** = 고통의 지점. **옐로/골드** = 약속의 지점·CTA.
- 색을 남발하면 신호가 죽는다. 강조색은 카피의 강조와 1:1로 맞춘다.
- (magenta-block은 마젠타가 배경이라, 옐로만 신호색으로 쓰는 변주.)

---

## 새 프리셋 추가하기 (~10분)

프리셋은 언제든 늘릴 수 있다. 절차:

1. `ad-projects/_presets/{새이름}/` 폴더를 만든다.
2. 기존 `FRAME.md` 하나를 복사해 `colors`·`typography`·`components`를 새 룩으로 고친다.
   - 색은 실제 브랜드 값에서 가져온다 (`courses/classic/ads/0618/*.html`, `remotion/src/ClassicSplitAd.tsx`, `courses/classic/imweb.html`의 테마 토큰).
   - **색=신호 규칙**을 반드시 지킨다 (마젠타=고통, 옐로/골드=약속).
3. 기존 `showcase.html` 하나를 복사해 `:root` 토큰만 새 값으로 바꾼다 (샘플 카피·레이아웃은 그대로 두면 룩만 비교됨).
4. 브라우저로 열어 확인하고, 이 README의 프리셋 표에 한 줄 추가한다.

> **팔레트 분리 확장(선택)** — 지금은 색을 각 `FRAME.md`의 `colors`에 둔다. 나중에 같은 레이아웃을
> 여러 색으로 돌리고 싶어지면, `ad-projects/_palettes/{name}.md`로 색 블록만 빼서 프리셋과 조합하면 된다.
> (OpenMontage의 palettes 방식. 현재는 4종이 브랜드 색을 공유해 분리 실익이 적어 미도입.)
