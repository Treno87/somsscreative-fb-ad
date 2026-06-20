# 광고 소재 폴더·네이밍 규약

소옴크리에이티브 광고 소재는 코스·기수마다 **포맷 4종**으로 생성된다:
Remotion 동영상 · Hyperframe(HTML) 동영상 · 단일 이미지 · 캐러셀.
한 캠페인의 소재가 여러 곳에 흩어지고 버전 구분이 안 되던 문제를 막기 위한 단일 규약 문서다.

> 기준일 2026-06-20. 이 문서가 광고 소재 위치·네이밍의 정본이다.

---

## 0. 대원칙

1. **소스와 출력을 분리한다.** 소스(편집·렌더 입력)는 도구가 요구하는 곳에 두고, 출력(렌더 결과 배달본)은 `public/ads/` 한 트리로 모은다.
2. **출력은 코스 → 기수 → 버전 → 포맷** 4계층으로 내려간다. "이 코스 이 기수 광고 어디 있지?"가 항상 같은 경로로 해결된다.
3. **버전은 폴더와 파일명에 이중 표기**한다(`v01/` 폴더 + `-v01` 접미사). 파일을 폴더 밖으로 꺼내도 버전이 식별된다.
4. **버전은 zero-pad 2자리**(`v01`…`v10`). 사전식 정렬이 곧 시간순이 된다.
5. 출력 바이너리(mp4·png·jpg)는 **git 추적하지 않는다**(`.gitignore`). 소스만 추적한다.

---

## 1. 출력 배달 트리 (정본 — 모든 포맷 공통)

```
public/ads/{course}/{기수}/v{NN}/
├── video/      ← 동영상 (Remotion·Hyperframe 구분 없이 최종본)
│     {course}-{기수}-{variant}-{ratio}-v{NN}.mp4
├── image/      ← 단일 이미지
│     {course}-{기수}-{variant}-{ratio}-v{NN}.png
└── carousel/{set}/   ← 캐러셀 (한 세트 = 한 폴더)
      {II}-v{NN}.png       (II = 카드 순번 01·02·…)
```

- `{course}` — `intern10000` · `persona-design` · `classic` …
- `{기수}` — `1기` · `2기` …. 기수 개념이 없는 코스(classic 등)는 **날짜 배치**를 쓴다: `0618`.
- `{NN}` — 버전 2자리. 1차 생성 = `v01`, 수정할 때마다 `v02`, `v03`…
  - 이미 다른 버전 번호를 쓰던 캠페인은 그 번호를 보존한다(예: intern10000 2기는 `v03`).

### 네이밍 필드

| 필드 | 값 |
|---|---|
| `variant` | 앵글·컨셉 슬러그: `story` `hook` `system` `offer` `instructor` `face9` `split` `pain` … |
| `ratio` | `reels`(9:16) · `1x1` · `4x5` · `191`(1.91:1) |
| `set` (캐러셀) | 캐러셀 주제 슬러그: `face9` … |

예시:
```
public/ads/persona-design/1기/v01/video/persona-design-1기-story-reels-v01.mp4
public/ads/persona-design/1기/v01/image/persona-design-1기-hook-1x1-v01.png
public/ads/persona-design/1기/v01/carousel/face9/01-v01.png
public/ads/intern10000/2기/v03/video/intern10000-2기-story-191-v03.mp4
```

---

## 2. 소스 위치 (도구별 — 옮기지 않는다, 네이밍만 통일)

| 포맷 | 소스 위치 | 비고 |
|---|---|---|
| Remotion 주문서(JSON) | `remotion/data/{course}-{기수}-story.json` | 파이프라인이 여기서 props를 읽는다. 파일명 유지 |
| Remotion 영상 자산 | `remotion/public/images/{course}-{기수}/` | `staticFile` 루트. 기수까지 명시 |
| Hyperframe 프로젝트 | `ad-projects/{course}-{기수}-hf/` | self-contained 디렉터리. CLI가 그 안에서 동작 |
| 정적 카드 소스(HTML/CSS) | `courses/{course}/ads/{기수}/` | 카드 디자인 소스. 렌더 결과 png는 출력 트리로 |
| 광고 기획·제안서 | `courses/{course}/campaigns/{기수}*.md` | story-plan·제안서. 현행 유지 |
| **캠페인 인덱스** | `courses/{course}/campaigns/{기수}-assets.md` | 그 캠페인의 소스·출력 경로를 한 장에 모은 매니페스트 |

### 렌더 스크래치 디렉터리

`remotion/out/` 와 `ad-projects/*/renders/` 는 **작업용 스크래치**다(gitignored).
렌더 직후 산출물을 검수한 뒤, **확정본만** `public/ads/...` 배달 트리로 버전 네이밍해 복사한다.

---

## 3. 새 캠페인 체크리스트

1. 소스를 도구별 표준 위치에 둔다(§2).
2. 렌더 → 스크래치에서 자가검수.
3. 확정본을 `public/ads/{course}/{기수}/v01/{format}/` 에 §1 네이밍으로 복사.
4. `courses/{course}/campaigns/{기수}-assets.md` 매니페스트 갱신.
5. 수정 발생 시 → `v02/` 폴더 신설, 파일명 `-v02`. 매니페스트에 변경 사유 1줄.

---

*소옴크리에이티브 · 광고 소재 폴더 규약 · 2026-06-20*
