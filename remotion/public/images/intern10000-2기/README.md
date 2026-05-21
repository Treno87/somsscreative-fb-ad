# intern10000 2기 영상 광고 — 자산 폴더

`remotion/data/intern10000-2기-story.json`이 참조하는 씬별 자산.
씬 기획: `courses/intern10000/campaigns/2기-story-plan.md`

## 입고된 파일

| 파일명 | 씬 | 내용 | 비고 |
|--------|----|------|------|
| `01-hook.png` | 1 hook | 첫 고객 앞의 긴장한 초급 디자이너 일러스트 | 1000×1000 |
| `03-curriculum01.mp4` | 3 proof | 교육생 커트 실습 클립 ① | 720×1280 · 30fps |
| `03-curriculum02.mp4` | 3 proof | 교육생 커트 실습 클립 ② | 1080×1920 · 30fps |
| `03-curriculum03.mp4` | 3 proof | 교육생 커트 실습 클립 ③ | 1080×1920 · 30fps |
| `04-instructor01.mp4` | 4 proof | 심일보 강사 수업/커트 영상 | 1080×1350 · 24fps |
| `05-result.JPG` | 5 proof | 수료 디자이너가 자신 있게 커트하는 모습 | 정지 이미지 |

- 씬3은 클립 3개를 story.json `media`에 **배열**로 지정 — Remotion이 각 ~2초 재생 후 0.4초 크로스페이드로 한 씬에 합성한다(사전 합본 불필요).
- 씬2·6은 솔리드 카드 — 파일 없음. story.json `media`에 `#faf8f6`.
- 배경음악: `remotion/public/audio/dance-playful-night-intern10000bgm.mp3`.
- 영상 끝 로고 아웃트로는 공용 브랜드 자산 `remotion/public/brand/somss-outro.mp4`를 쓴다 (이 폴더엔 없음).

## 주의

- 영상 클립은 **자막·로고가 박히지 않은 깨끗한 클립**을 쓴다 — 우리 텍스트와 충돌한다.
- 자산의 **밝기·색감 톤을 통일**한다 — 톤이 갈리면 영상이 둘로 갈라져 보인다.
- 비주얼 톤 레퍼런스: 소옴크리에이티브 인스타그램.
- 모든 영상·이미지는 `objectFit: cover`로 9:16에 채워진다 — 피사체를 가급적 가운데 둔다.
