# 클래식 랜딩 디자인 테마 (디자인 토큰)

`classic-landing0618.html` 은 색·그라데이션을 **CSS 변수(디자인 토큰)** 로 관리한다.
컨테이너 `#soms-v3` 의 `data-soms-theme` 값 하나로 전체 디자인이 바뀐다.
레이아웃·카피·섹션 구성은 공유하고, **색 토큰만 테마별로 스왑**된다.

## 적용(선택)하기
임베드 파일에서 이 한 줄의 값만 바꾼다:

```html
<div id="soms-v3" data-soms-theme="cool-violet" ...>
```

| 테마 키 | 무드 | 다크 | 강조/그라데이션 |
|---|---|---|---|
| `cool-violet` (기본) | 차분·고급, 쿨 | 쿨 뉴트럴 `#0e0e12` | 마젠타 `#d94fd5` → 바이올렛 `#8a3df0` |
| `ad-warm` | 광고 소재 그대로 | 웜 다크 `#15120f` | 네온 마젠타 `#ff3bff` → 옐로 `#ffba2a` |
| `neon-magenta` | 고채도 임팩트 | 쿨 다크 `#0e0e12` | 네온 마젠타 `#ff3bff` → 딥마젠타 `#c400c4` |

## 미리보기
로컬 미리보기 래퍼 `_preview-landing0618.html` 에는 우상단 **테마 전환 버튼**과
`?theme=ad-warm` 쿼리 지원이 있다(임베드 본 파일엔 없음 — 아임웹엔 본 파일만 사용).

## 새 디자인(테마) 추가하기
`<style>` 상단 테마 블록 영역에 아래 형식으로 1개 추가하면 끝. 색은 `R G B`(공백구분)
형식이라 Tailwind 투명도(`/50` 등)와 호환된다.

```css
#soms-v3[data-soms-theme="이름"] {
  --c-accent: 217 79 213;   /* 메인 강조(마젠타 자리) */
  --c-accent2: 138 61 240;  /* 그라데이션 상대색 */
  --c-yellow: 255 212 0;    /* 최소 포인트 옐로 */
  --c-dark: 14 14 18;       /* 다크 섹션 배경 */
  --c-charcoal: 26 26 31;   /* 다크 카드 */
  --c-ink: 19 19 24;        /* 라이트 위 본문/다크 알약 */
  --c-light: 244 244 246;   /* 라이트 섹션 배경 */
  --grad-cta: linear-gradient(120deg, #d94fd5, #8a3df0);   /* 버튼·배지·잔여석 */
  --grad-final: linear-gradient(125deg, #d94fd5, #7a34e0); /* 최종 CTA 섹션 */
  --bg-hero: /* 히어로 전체 배경(라디얼 글로우 + 베이스) */ ... ;
  --glow-dark: /* 다크 섹션 위 라디얼 글로우 오버레이 */ ... ;
  --grad-light: linear-gradient(180deg, #ffffff, #f1f1f4); /* 라이트 섹션 배경 */
}
```

그리고 표/이 문서에 한 줄 추가. 본문 마크업은 전혀 손대지 않아도 된다.

## 토큰이 적용되는 곳 (참고)
- `--c-accent` → 모든 마젠타 텍스트·보더·점 (Tailwind `brandMagenta`)
- `--grad-cta` → `.grad-magenta`(히어로/가격/수강신청 버튼·HOT 배지·잔여석 펄), 공지바 펄
- `--grad-final` → `.final-bg`(최종 CTA 섹션)
- `--bg-hero` → `.hero-bg`(히어로), `--glow-dark` → `.bg-dark-grad`(다크 섹션), `--grad-light` → `.bg-light-grad`(라이트 섹션)
- `--c-dark/charcoal/ink/light/yellow` → Tailwind `brandDark/brandCharcoal/brandInk/brandCream/brandYellow`
- 예외(테마 비적용): 카카오 버튼 `#FEE500`(브랜드 고정색)
