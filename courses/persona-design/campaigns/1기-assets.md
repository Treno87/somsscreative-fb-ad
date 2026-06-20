# persona-design 1기 — 광고 소재 인덱스

> 이 캠페인의 모든 소재 소스·출력 위치. 규약: `docs/ad-asset-organization.md`

## 출력 (배달 트리 · gitignored)

`public/ads/persona-design/1기/v01/`
- `video/` — `persona-design-1기-story-{reels,1x1,4x5}-v01.mp4` (Hyperframe 30s)
- `image/` — `persona-design-1기-{hook,system,offer,instructor}-{1x1,4x5}-v01.png`
- `carousel/face9/` — `01-v01.png … 08-v01.png` (9가지 페이스 타입 교육형)

## 소스

| 포맷 | 위치 |
|---|---|
| Hyperframe 동영상 | `ad-projects/persona-design-1기-hf/` (index.html · build-final*.sh) |
| Remotion 동영상 주문서 | `remotion/data/persona-design-1기-story.json` (+ 자산 `remotion/public/images/persona-design-1기/`) |
| 정적 카드(HTML/CSS) | `courses/persona-design/ads/1기/` (singles.html · carousel-b.html · ad-tokens.css) |
| 카드용 원본 이미지 | `courses/persona-design/` (framework-face-matrix.png · 원용중프로필1.png 등) |
| 기획 | `courses/persona-design/campaigns/1기-story-plan.md` · `1기-story-new-plan.md` |

## 버전 이력
- **v01** (2026-06): 단일 4종 + 캐러셀(face9) 8장 1차 생성. 동영상 30s 세트.
