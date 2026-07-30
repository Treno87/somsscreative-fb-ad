# classic 65기 — 광고 소재 인덱스

> 규약: `docs/ad-asset-organization.md` · 제작 경로: Hyperframe (`docs/video-hyperframe.md`)

## 출력 (배달 트리 · gitignored)

`public/ads/classic/65기/v02/`
- `video/` — `classic-65기-story-{reels,4x5,1x1}-v02.mp4`

> 현재 최신 버전 = **v02**.
> 3종 모두 43.46초 (본편 34.5s + 로고 아웃트로 8.96s), 30fps, H.264, BGM 포함.

| 비율 | 해상도 | 파일 | 용도 |
|---|---|---|---|
| 9:16 | 1080×1920 | `classic-65기-story-reels-v02.mp4` | 릴스·스토리 |
| 4:5 | 1080×1350 | `classic-65기-story-4x5-v02.mp4` | 피드(세로) |
| 1:1 | 1080×1080 | `classic-65기-story-1x1-v02.mp4` | 피드(정사각) |

- **1.91:1(가로)은 제작하지 않음** — 리드 광고에서 성과가 낮은 지면(우측 칼럼·오디언스 네트워크)이고, 자동 노출 위치가 1:1로 대체 노출한다. 필요해지면 1:1과 같이 전용 레이아웃으로 별도 제작할 것(중앙 크롭 금지).
- **4:5는 하단 워터마크가 크롭된다** — 워터마크(bottom 96px)가 크롭 안전영역(y 285~1635) 밖이다. 살리려면 9:16 정본에서 워터마크를 안전영역 안으로 올릴 것.

## 소스

| 포맷 | 위치 |
|---|---|
| Hyperframe 프로젝트 | `ad-projects/classic-65기-hf/` |
| 9:16 컴포지션(정본) | `ad-projects/classic-65기-hf/index.html` |
| 1:1 전용 레이아웃 | `ad-projects/classic-65기-hf/compositions/index-1x1.html` |
| 후처리(아웃트로+BGM) | `build-final.sh` (9:16) · `build-final-1x1.sh` (1:1) · `make-feed-sizes.sh` (4:5 파생) |
| BGM | `remotion/public/audio/paulyudin-background-background-music-574010.mp3` |
| 아웃트로 | `remotion/public/brand/somss-outro-1080.mp4` |
| 실사 클립 (작업본) | `ad-projects/classic-65기-hf/video/` — s2-student-a · s3-instructor · clip3 · s4-student-b |
| 실사 원본 (raw) | `assets/raw/classic-65기/` — git 미추적. 클립 재생성은 `./make-clips.sh` |
| 기획 | `courses/classic/campaigns/65기-story-plan.md` |
| 제안서 | `courses/classic/campaigns/65기.md` |

## 재현 순서

```bash
cd ad-projects/classic-65기-hf
./make-clips.sh                                                       # 원본(assets/raw) → 경량 클립(video/)
npx hyperframes render -o renders/draft-vNN.mp4                       # 9:16 본편(무음)
./build-final.sh renders/draft-vNN.mp4                                # + 아웃트로 + BGM
./make-feed-sizes.sh                                                  # 4:5 파생
npx hyperframes render -c compositions/index-1x1.html -o renders/1x1-main.mp4
./build-final-1x1.sh renders/1x1-main.mp4                             # 1:1 최종
```

## 버전 이력

- **v02** (2026-07-30): `creative-critic` 채점 FAIL 1건 해소 — S3 금지어 「스타일」 단독 사용 → **「헤어스타일」**로 교체 (`brand-context.md` 지정 대체어. 취소선 연출은 유지, 글자가 늘어 선이 더 길게 그어진다). 9:16·1:1 컴포지션 양쪽 반영. 이 판이 게재 대상.
  - 남은 WARN 3건은 광고주 판단으로 현행 유지: S5 오퍼 헤드라인의 일반성 · 9:16 S5 3행 어절 간격 · 같은 씬 「원리」 2회.
- **v01** (2026-07-30): 6씬 34.5초. 씬별 텍스트 연출 다양화(S2 단어 waterfall · S3 블러→초점 · S4 글자 조립) + 신호어 강조 모션 6곳(「왜」「제자리인 느낌」「스타일」취소선·「원리」밑줄·「분해됩니다」·「다릅니다」). 강사 씬 대사체 훅 `"가르칠수록 기본만 남더군요"` 신규(카피라이터 후보 중 확정, 「기본」에 신호색). BGM = paulyudin 트랙. 1:1 전용 레이아웃 신규 제작.
  - 드래프트 이력: `renders/draft-v2`~`v9` (v9 = 최종 본편), `renders/1x1-main.mp4`.
