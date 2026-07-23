# 소옴 클래식과정 65기 — 영상 광고 씬 기획 (Hyperframe)

> 동영상 광고의 씬 구분·카피·자산·효과를 사람이 검토할 수 있게 정리한 문서.
> **이 문서를 승인한 뒤** `ad-projects/classic-65기-hf/`(HTML+GSAP)로 제작한다.
> 제작 방식: Hyperframe(HTML) — 참고 템플릿 `ad-projects/persona-design-1기-hf/`.
> 근거(Source of truth): `courses/classic/imweb.html` · `courses/classic/USP.md`. (course.md는 존재하지 않음. 두 파일 밖의 사실은 넣지 않는다.)

## 메타 정보

- 코스 / 기수: 소옴크리에이티브 클래식과정 / **65기**
- 개강 / 기간: **2026년 8월 17일(월) 개강** · 2026.8.17 ~ 10.5 · **8주 / 총 8회**
- 수업: **매주 월요일 16:00 – 19:00 (3시간)**
- 정원 / 잔여: 선착순 **7명** 한정 · **잔여 3자리**
- accent: 마젠타 `#d94fd5` (신호색) · 옐로 `#ffd400` (약속 포인트) · 다크 `#0e0e12` · 폰트 Pretendard
- 톤: Minimal / Luxury / Editorial (Apple · Aesop · Dyson) — 흰 텍스트 on 블랙, 대형 타이포, 절제된 전환
- 총 길이: **30초 · 6씬** · 9:16 · 1080×1920
- 제작물 위치: `ad-projects/classic-65기-hf/` (index.html + hyperframes.json + GSAP 타임라인 + 빌드 스크립트)
- 재사용성: `hook-title` / `info-card` / `badge` / `cta-card` 컴포넌트 — 66·67기는 텍스트·자산만 교체

### 강사 정보 (검증됨 · imweb.html 450–508행)
- **심일보** 수석강사 (Head Instructor) · 현 소옴크리에이티브 수석강사
- 런던 비달사순 TTC(Technical Training Course) 수료 · 비달사순 커트콘테스트 2위
- 교육경력 16년 · 서울패션위크 헤어디렉터 다수 참여 · **현재까지 클래식 과정 64기 배출**

## 씬 흐름 (한눈에)

| # | kind | 카피 요약 | 길이 | 자산 | anim |
|---|------|-----------|------|------|------|
| 1 | hook | 커트는 기술이 아닙니다 | 0–4s | 블랙 솔리드 | letter-spacing expand → blur-fade |
| 2 | reframe | 원리를 이해하는 일입니다 | 4–8s | 커트 클로즈업 영상 | blur crossfade |
| 3 | proof | 원리·구조·재현·분석 + 비달사순 배지 | 8–16s | 시술 과정 몽타주 | push slide (medium) |
| 4 | detail | 클래식과정 65기 — 8주간 처음부터 | 16–22s | info-card 재사용 | fade+slide |
| 5 | philosophy | 기술이 아니라 기준을 세운다 | 22–26s | 블랙 솔리드 | slow scale-in |
| 6 | cta | 65기 모집 · 8/17 개강 · 잔여 3자리 | 26–30s | 로고 + 링크 | fade in → hold |

## 씬별 대본 (타임스탬프 · 화면 자막 · 연출)

### S1 · HOOK (00:00–00:04) · 블랙 · letter-spacing → blur-fade
- **자막**: **"커트는 기술이 아닙니다."** (대형 에디토리얼)
- **연출**: 블랙 배경, 자간(letter-spacing)이 확장되며 등장 → hold → blur로 fade-out.
- **근거**: USP.md — "10번 배워서 10가지 할 수 있다면, 그건 기술입니다."

### S2 · REFRAME (00:04–00:08) · 커트 클로즈업 영상 · blur crossfade
- **자막**: **"원리를 이해하는 일입니다."** (에디토리얼 오버레이)
- **연출**: 커트 클로즈업 영상 위 타이포, blur 크로스페이드로 S1→S2 전환.
- **근거**: USP.md — "커트의 원리와 구조를 처음부터 가르칩니다."

### S3 · PROOF (00:08–00:16) · 시술 과정 몽타주 · push slide
- **오버레이 단어** (corporate caption, fade+slide, 56–72px): **원리 / 구조 / 재현 / 분석**
- **몽타주**: 상담(Consultation) → 섹셔닝 → 커팅 → 드라이 → 피니시 (절제된 속도)
- **배지**: **"런던 비달사순 TTC 수료 · 커트콘테스트 2위"**
- **근거**: imweb.html 483·489행. (프롬프트 원본의 "36년 파트너십"은 근거 없어 제외)

### S4 · DETAIL (00:16–00:22) · info-card 재사용 · fade+slide
- **메인**: **"클래식과정 65기 — 커트의 원리와 구조를 8주간 처음부터"**
- **서브**: "매주 월요일 오후 4시 (3시간) · 2026.8.17~10.5 · 선착순 7명"
- **신뢰 라인**: "심일보 수석강사 · 교육경력 16년 · 클래식 과정 64기 배출"
- **근거**: imweb.html 463·470·483·495·507·528·705·709·713·717행

### S5 · PHILOSOPHY (00:22–00:26) · 블랙 · slow scale-in
- **자막**: **"기술을 배우는 것이 아니라, 기준을 세운다."** (대형)
- **연출**: 블랙 배경, 느린 scale-in, 시네마틱 hold.
- **근거**: USP.md — "한 번 이해한 원리는 어떤 커트에도 적용됩니다."

### S6 · CTA (00:26–00:30) · 로고 + 링크 · fade in → hold
- **자막**: SOMSSCREATIVE 로고 + **"클래식과정 65기 모집 · 8월 17일 개강 · 잔여 3자리"**
- **링크**: 소옴 웹사이트 / 신청 링크
- **연출**: fade in, 마지막 프레임 hold.

---

## 제작용 Hyperframe 프롬프트 (교정 완료본)

> 아래 프롬프트를 `ad-projects/classic-65기-hf/` 제작 시 그대로 사용한다.
> 원본(사용자 제공) 대비 교정: 62기→65기 · "36년 파트너십"→"비달사순 TTC 수료" · course.md→imweb.html+USP.md · 커리큘럼·일정·강사이력 사실 반영.

```
Create a premium luxury education advertisement for SOMSSCREATIVE
클래식과정 65기 모집.

Duration: 30 seconds
Aspect ratio: 9:16
Resolution: 1080x1920

Source of truth (반드시 이 두 파일의 사실만 사용, 밖의 사실 금지):
- courses/classic/imweb.html   (강사 이력·커리큘럼·개강·정원)
- courses/classic/USP.md       (핵심 메시지·카피·후기)

Style: Minimal, Luxury, Editorial (Apple, Aesop, Dyson).
White text on black. Large typography, elegant transitions. Font: Pretendard.

Typography: Large editorial type for hooks/philosophy; smaller clean sans-serif
for curriculum/detail; letter-spacing animation on key words.

Animation: GSAP timeline, slow cinematic movement. Fade/blur/scale — no flashy
effects. slow = 0.6–1s on hero beats, medium = 0.4s on info beats.

Scenes
1. Hook (0-4s)  블랙, 대형 "커트는 기술이 아닙니다." → letter-spacing expand, hold, blur-fade
2. Reframe (4-8s)  커트 클로즈업 영상 + "원리를 이해하는 일입니다." → blur crossfade
3. Curriculum proof (8-16s)  Consultation/Sectioning/Cutting/Dry/Finish 몽타주
   Overlay words: 원리 / 구조 / 재현 / 분석 (corporate caption, fade+slide)
   Badge: "런던 비달사순 TTC 수료 · 커트콘테스트 2위" → push slide (medium)
4. Curriculum detail (16-22s)  info-card 재사용
   "클래식과정 65기 — 커트의 원리와 구조를 8주간 처음부터"
   Sub: "매주 월요일 오후 4시 (3시간) · 2026.8.17~10.5 · 선착순 7명"
   Credibility: "심일보 수석강사 · 교육경력 16년 · 클래식 과정 64기 배출"
5. Philosophy close (22-26s)  블랙, 대형 "기술을 배우는 것이 아니라, 기준을 세운다." → slow scale-in, hold
6. CTA (26-30s)  SOMSSCREATIVE 로고 + "클래식과정 65기 모집 · 8월 17일 개강 · 잔여 3자리"
   + 소옴 웹사이트/신청 링크 → fade in, hold last frame

Requirements
- Everything editable in plain HTML with data-* attributes
- Reusable components: hook-title, info-card, badge, cta-card (66·67기는 텍스트/자산만 교체)
- Transitions between every scene (no jump cuts)
- Captions: corporate tone, 56-72px, fade+slide
- Register all timelines on window.__timelines
- No Math.random() — determinism required
- Copy aligned with imweb.html + USP.md as source of truth
- 근거 없는 주장(예: "36년 파트너십") 금지
```

## 작성 이력
- 2026-07-18 최초 작성 — 사용자 제공 Hyperframe 프롬프트를 imweb.html·USP.md 근거로 교정하여 표준 파일명(`65기-story-plan.md`)으로 저장.
