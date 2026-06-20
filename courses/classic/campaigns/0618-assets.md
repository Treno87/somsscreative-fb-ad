# classic 0618 배치 — 광고 소재 인덱스

> classic은 기수가 아닌 **날짜 배치(0618)**를 캠페인 키로 쓴다. 규약: `docs/ad-asset-organization.md`

## 출력 (배달 트리 · gitignored)

`public/ads/classic/0618/v01/`
- `image/` — `classic-0618-{noir,ivory,magenta}-4x5-v01.png` (단일 이미지 3종)
- `video/` — `classic-0618-split-{reels,1x1,191}-v01.mp4` (before/after split 애니메이션)

## 소스

| 포맷 | 위치 |
|---|---|
| 정적 카드(HTML) + 렌더 스크립트 | `courses/classic/ads/0618/` (A-noir·B-ivory·C-magenta·D-split·D03 .html · render.mjs · PHILOSOPHY.md) |
| split 입력 이미지 | `courses/classic/ads/0618/classic0618-D-split01·02.png` |
| Remotion split 동영상 주문서 | `remotion/data/classic-ads.json` (ClassicSplitAd 컴포지션) |

> `render.mjs` 실행 시 png는 자동으로 배달 트리(`public/ads/classic/0618/v01/image/`)로 출력된다.

## 버전 이력
- **v01** (2026-06-18): noir·ivory·magenta 단일 + split 동영상 3비율.
