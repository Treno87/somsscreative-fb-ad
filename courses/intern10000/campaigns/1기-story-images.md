# 인턴10000 1기 — 스토리텔링 영상 배경 이미지 프롬프트

> 이미지 구동 스토리텔링 영상(9:16 세로, 22초)의 5개 씬 배경용 정지 이미지.
> 원본 디렉션: `courses/intern10000/visual-brief.md` + `remotion/data/intern10000-1기-story.json`
> 생성 후 저장 경로: `remotion/public/images/intern10000/`

---

## 영상 세트 공통 규칙 (5장 전체 적용)

5장은 하나의 영상 세트로, 톤·조명·색감이 반드시 일관돼야 한다. 모든 프롬프트에 아래 공통 조건을 동일하게 적용했다.

- **비율**: 9:16 세로 (1080×1920), 영상 풀블리드 배경
- **하단 1/3 비우기**: 영상 텍스트가 하단 1/3을 덮는다. 피사체·핵심 디테일은 **상단~중앙**에 배치하고, 하단 1/3은 단순한 면 또는 어두운 그림자로 자연스럽게 떨어지도록 한다.
- **톤 기조**: 다크 차콜(#1e1e1e) 기반, 어두운 자연광. 측면에서 들어오는 부드러운 창광(soft window light). 형광·네온 금지.
- **색감**: 따뜻한 우드 톤 + 차분한 무채색. 채도 낮게. 골드/앰버 액센트만 미세하게 허용.
- **인물**: 한국인, 20대~30대 초반. 자연스러운 집중·진지한 표정. 과장된 미소 금지. 카메라 정면 응시 최소화.
- **느낌**: 다큐멘터리적, 시네마틱. 스톡 사진 느낌 금지.

### Midjourney 공통 부정 프롬프트 (모든 컷에 붙일 것)
```
--no smile, stock photo, neon, oversaturated, cartoon, anime, 3d render, plastic, lens flare, text, watermark, logo
```

### Midjourney 공통 파라미터
```
--ar 9:16 --style raw --stylize 100 --v 6
```

---

## 01-hook.jpg (1080×1920)

목적: 후킹 — "영상 볼 땐 알겠는데 손이 멈춥니다". 동작이 멈춘 듯 정적인 순간.
분위기: 진지·정적·어두운 자연광. 망설임이 느껴지는 정지된 손.
주제: 가위를 든 인턴의 손 클로즈업. 자르려다 멈춘 듯한 정적인 동작.

### Midjourney v6
```
Extreme close-up of a young Korean hairstylist intern's hands holding professional hair-cutting scissors and a comb, frozen mid-motion as if hesitating before a cut, fingers slightly tense, dark charcoal salon interior, soft directional natural window light falling from the upper left onto the hands and steel scissors, warm wood tones in the background, low saturation muted color grade, hands and scissors positioned in the upper-center of the frame, lower third fading into soft shadow and empty negative space, documentary photography, cinematic still, serious and quiet mood, shallow depth of field, shot on 50mm lens
--ar 9:16 --style raw --stylize 100 --v 6
--no smile, stock photo, neon, oversaturated, cartoon, anime, 3d render, plastic, lens flare, text, watermark, logo
```

### Sora (정지 클립으로 활용 시)
```
어두운 살롱 안, 한국 20대 헤어 인턴의 손 클로즈업. 가위와 빗을 든 채 자르려다 멈춘 듯 정지. 손가락에 미세한 긴장감. 카메라는 거의 고정, 손끝만 아주 미세하게 떨림. 왼쪽 위 창에서 부드러운 자연광. 어두운 차콜 톤, 낮은 채도. 화면 하단 1/3은 그림자로 비워둘 것. 5초.
```

### Canva (Magic Media)
```
어두운 살롱에서 가위와 빗을 든 헤어 인턴의 손 클로즈업, 자르려다 멈춘 정적인 순간
- 스타일: 시네마틱, 다큐멘터리적, 어두운 톤
- 조명: 측면 자연광
- 구도: 손은 상단~중앙, 하단 1/3은 어둡게 비움
- 텍스트 추가: 없음
```

### 검수 체크리스트
- [ ] 손동작이 "멈춘 듯" 정적으로 보이는가? (역동적 액션 금지)
- [ ] 톤이 어두운 기조인가?
- [ ] 손·가위가 상단~중앙에 있고 하단 1/3이 비었는가?
- [ ] 인물 일부(손)만 보이며 얼굴/미소가 없는가?

---

## 02-problem.jpg (1080×1920)

목적: 문제 — "어깨너머로 배운 기술은 실력이 되지 않습니다". 막막함의 시각화.
분위기: 적막·막막함. 사람 없는 빈 작업 공간.
주제: 어두운 살롱 작업 환경, 빈 시술 의자와 도구들.

### Midjourney v6
```
A dimly lit empty hair salon workstation at the end of the day, one empty styling chair facing a large mirror, cutting tools resting on the counter, dark charcoal walls and warm wood furniture, soft fading natural light from a side window casting long quiet shadows, no people, sense of stillness and uncertainty, low saturation muted color grade, the chair and mirror placed in the upper-center of the frame, lower third dissolving into deep shadow and empty floor space, documentary photography, cinematic still, melancholic and serious mood, shot on 35mm lens
--ar 9:16 --style raw --stylize 100 --v 6
--no smile, stock photo, neon, oversaturated, cartoon, anime, 3d render, plastic, lens flare, text, watermark, logo
```

### Sora (정지 클립으로 활용 시)
```
하루가 끝난 어두운 살롱. 거울 앞 빈 시술 의자 하나, 카운터에 놓인 가위와 빗. 사람은 없다. 측면 창에서 점점 사그라드는 자연광, 긴 그림자. 카메라 거의 정지, 먼지가 빛 속에서 아주 느리게 떠다님. 차콜 톤, 적막함. 하단 1/3은 어두운 바닥. 5초.
```

### Canva (Magic Media)
```
사람 없는 어두운 살롱, 거울 앞 빈 시술 의자와 카운터 위 커트 도구들
- 스타일: 시네마틱, 다큐멘터리적, 어두운 톤, 적막함
- 조명: 사그라드는 측면 자연광, 긴 그림자
- 구도: 의자/거울은 상단~중앙, 하단 1/3은 어두운 바닥
- 텍스트 추가: 없음
```

### 검수 체크리스트
- [ ] 인물이 없고 "막막함"이 느껴지는가?
- [ ] 01-hook과 톤·색감이 이어지는가?
- [ ] 빈 의자·도구가 상단~중앙, 하단 1/3이 비었는가?

---

## 03-turn.jpg (1080×1920)

목적: 전환 — "형태가 아니라 커트의 구조를 훈련합니다". 구조/도해도의 등장.
분위기: 차분한 집중. "어깨너머"에서 "구조 이해"로의 전환점.
주제: 종이에 손으로 그린 커트 단면 도해도(LINE·GRADUATION·LAYER 라벨)와 그 옆 마네킹 두상.

### Midjourney v6
```
A hand-drawn hair-cutting cross-section diagram on textured paper, clean pencil and ink line work showing head shape sections with handwritten labels "LINE", "GRADUATION", "LAYER", placed on a dark wooden worktable beside a practice mannequin head with neatly sectioned hair, dark charcoal studio interior, soft directional natural light from the side highlighting the paper and the mannequin, low saturation muted color grade with subtle warm amber accent, diagram and mannequin arranged in the upper-center of the frame, lower third fading into the dark wood surface, documentary photography, cinematic still, calm focused and instructional mood, shallow depth of field, shot on 50mm lens
--ar 9:16 --style raw --stylize 100 --v 6
--no smile, stock photo, neon, oversaturated, cartoon, anime, 3d render, plastic, lens flare, text, watermark, logo
```

> 주의: Midjourney는 정확한 영문 텍스트("LINE"·"GRADUATION"·"LAYER")를 깨끗하게 렌더링하지 못할 수 있다. 라벨이 흐리게 나오면 도해도만 깨끗하게 생성한 뒤, **Canva에서 손글씨 톤 폰트로 라벨을 별도 합성**할 것 (visual-brief.md의 diagram.jpg 가이드와 동일).

### Sora (정지 클립으로 활용 시)
```
어두운 우드 작업대 위, 종이에 연필로 그린 커트 단면 도해도(머리 단면과 섹션 선)와 그 옆 섹션이 정리된 마네킹 두상. 측면 자연광이 종이와 마네킹에 떨어짐. 카메라 거의 정지, 아주 느린 푸시 인. 차콜 톤, 차분한 집중감. 하단 1/3은 어두운 작업대 면. 5초.
```

### Canva (Magic Media)
```
어두운 우드 작업대 위, 손으로 그린 커트 단면 구조도와 섹션이 정리된 마네킹 두상
- 스타일: 시네마틱, 다큐멘터리적, 어두운 톤, 차분한 집중
- 조명: 측면 자연광
- 구도: 도해도/마네킹은 상단~중앙, 하단 1/3은 어두운 작업대
- 텍스트 추가: 도해도 라벨 "LINE / GRADUATION / LAYER"를 손글씨 톤 폰트로 합성 (Midjourney 텍스트가 깨질 경우)
```

### 검수 체크리스트
- [ ] 도해도와 마네킹이 함께 보이는가? (구조 시각화)
- [ ] 라벨 텍스트가 깨끗한가? (아니면 Canva 합성 처리했는가)
- [ ] 추상적 그래픽이 아니라 손으로 그린 실제 종이 도해도인가?
- [ ] 도해도/마네킹이 상단~중앙, 하단 1/3이 비었는가?

---

## 04-proof.jpg (1080×1920)

목적: 증명 — "런던 사순 강사코스 수료, 300명+ 배출". 강사 신뢰감.
분위기: 진지·전문적. 도해도 앞에서 설명하는 강사.
주제: 심일보 강사가 도해도 앞에서 설명하는 모습, 자연광, 3/4 앵글.

> **실사 촬영 권장.** 강사 인물 컷은 본인 실제 사진이 가장 신뢰감이 높다 (visual-brief.md instructor.jpg 가이드와 동일). 아래 촬영 디렉션을 우선 적용하고, 실사 확보가 어려울 때만 생성 프롬프트를 대체 수단으로 사용한다.

### 실사 촬영 디렉션 (우선)
```
- 인물: 심일보 강사, 어두운 셔츠 또는 작업복
- 앵글: 3/4 측면 (카메라 정면 응시 X, 도해도 쪽을 향함)
- 배경: 종이 도해도 또는 화이트보드 도해 앞
- 조명: 측면 자연광 (창광). 스튜디오 조명 셋업 금지
- 동작: 도해도의 한 부분을 손이나 펜으로 짚으며 설명하는 순간
- 표정: 진지한 집중. 과장된 미소 금지
- 구도: 9:16 세로. 강사 상반신을 상단~중앙에 배치, 하단 1/3은 어두운 배경으로 비움
- 색감: 5장 세트와 일관되게 어두운 차콜 톤, 낮은 채도로 후보정
```

### Midjourney v6 (실사 확보 불가 시 대체)
```
A serious experienced Korean male hair instructor in his fifties wearing a dark shirt, standing at a three-quarter angle, pointing with a pen at a hand-drawn hair-cutting cross-section diagram on the wall, explaining with focused concentration, dark charcoal studio interior, soft directional natural window light from the side illuminating his face and the diagram, low saturation muted color grade, the instructor's upper body framed in the upper-center, lower third fading into dark background, documentary portrait photography, cinematic still, professional and trustworthy mood, shallow depth of field, shot on 50mm lens
--ar 9:16 --style raw --stylize 100 --v 6
--no smile, stock photo, neon, oversaturated, cartoon, anime, 3d render, plastic, lens flare, text, watermark, logo
```

> 주의: 강사 외모(나이대·인상)는 임의 지정 위험이 있다. 위 프롬프트의 "in his fifties" 등 디테일은 **반드시 실제 심일보 강사 모습에 맞게 사용자가 확인·수정**한 후 사용할 것.

### Sora (정지 클립으로 활용 시)
```
어두운 스튜디오, 한국인 헤어 강사가 벽의 커트 도해도를 펜으로 짚으며 설명하는 3/4 앵글. 측면 창광이 얼굴과 도해도에 떨어짐. 카메라 거의 정지, 강사 손만 도해도 위를 천천히 움직임. 차콜 톤, 진지하고 전문적인 분위기. 하단 1/3은 어두운 배경. 6초.
```

### Canva (Magic Media)
```
어두운 스튜디오에서 커트 도해도를 손으로 짚으며 설명하는 한국인 헤어 강사, 3/4 측면 앵글
- 스타일: 시네마틱, 다큐멘터리 인물 사진, 어두운 톤
- 조명: 측면 자연광
- 구도: 강사 상반신은 상단~중앙, 하단 1/3은 어두운 배경
- 텍스트 추가: 없음
```

### 검수 체크리스트
- [ ] (우선) 실사 촬영본을 확보했는가?
- [ ] 강사 외모 디테일을 실제 인물에 맞게 확인했는가?
- [ ] 3/4 앵글이며 과장된 미소가 없는가?
- [ ] 강사가 상단~중앙, 하단 1/3이 비었는가?
- [ ] 5장 세트와 색감이 일관되는가?

---

## 05-cta.jpg (1080×1920)

목적: CTA — "14회차 42시간 베이직을 완성합니다 / 무료 상담 신청". 소수정예 수업 현장.
분위기: 집중·과정 중심. 7명 소수정예의 인상, 어둡게 톤다운.
주제: 7명 소수정예 수업 현장 — 작업 중인 손과 마네킹.

### Midjourney v6
```
A small intimate hair-cutting class with a few young Korean students working at their stations, hands cutting and sectioning hair on practice mannequin heads, dark charcoal studio interior, soft directional natural light from large side windows, focus on working hands and mannequins rather than faces, students seen from behind or in profile, low saturation muted color grade, deliberately darkened and toned down, the working scene composed in the upper-center of the frame, lower third fading into deep shadow, documentary photography, cinematic still, focused and serious atmosphere, shallow depth of field, shot on 35mm lens
--ar 9:16 --style raw --stylize 100 --v 6
--no smile, stock photo, neon, oversaturated, cartoon, anime, 3d render, plastic, lens flare, text, watermark, logo
```

### Sora (정지 클립으로 활용 시)
```
어두운 스튜디오, 한국 20대 수강생 몇 명이 각자 자리에서 마네킹을 커트하는 소수정예 수업. 얼굴보다 작업 중인 손과 마네킹에 초점, 학생들은 뒷모습/측면. 측면 창에서 자연광. 카메라 거의 정지, 손동작만 아주 느리게. 차콜 톤, 어둡게 톤다운, 집중된 분위기. 하단 1/3은 그림자. 5초.
```

### Canva (Magic Media)
```
어두운 스튜디오에서 마네킹을 커트하는 소수정예 수강생들의 작업 현장, 손과 마네킹 중심
- 스타일: 시네마틱, 다큐멘터리적, 어두운 톤, 톤다운
- 조명: 측면 자연광
- 구도: 작업 장면은 상단~중앙, 하단 1/3은 어둡게 비움
- 텍스트 추가: 없음 (CTA 문구는 영상에서 별도 처리)
```

### 검수 체크리스트
- [ ] 결과물보다 "작업 중인 과정"이 보이는가?
- [ ] 소수정예 인상(소규모)이며 얼굴/미소가 부각되지 않는가?
- [ ] 어둡게 톤다운되어 있는가?
- [ ] 작업 장면이 상단~중앙, 하단 1/3이 비었는가?

---

## 다음 단계

1. Midjourney v6에서 01·02·03·05 생성 (style raw, --ar 9:16)
2. 04-proof는 심일보 강사 실사 촬영 우선 — 불가 시 생성 프롬프트 사용, 외모 디테일 사용자 확인 필수
3. 03-turn의 도해도 라벨이 깨지면 Canva에서 손글씨 톤으로 별도 합성
4. 5장 모두 동일한 어두운 차콜 톤·낮은 채도로 후보정해 세트 통일감 확보
5. `remotion/public/images/intern10000/`에 `01-hook.jpg` ~ `05-cta.jpg`로 저장
6. Remotion 영상 미리보기에서 하단 1/3 텍스트 가독성 확인 → 검수 체크리스트 통과
