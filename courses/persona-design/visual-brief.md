# 페르소나 디자인 — 얼굴파츠분석 과정 1기 시각 디렉션

> Phase 3 입력. `image-prompt-brand` 에이전트가 이 문서를 받아 Midjourney·Sora·Canva 등 도구별 프롬프트를 생성한다. 생성된 이미지는 `public/courses/persona-design/`에 저장하고, 아임웹 업로드 후 `imweb.html`의 placeholder를 실제 URL로 교체한다.

---

## 톤 일관성 — '분석가의 책상' 무드

- **컬러 기준 (랜딩 토큰):** 잉크 블랙 `#14161a` · 페이퍼 화이트 `#ffffff` · 옅은 진단지 톤 `#f7f6f2` · 모눈/시트 강조 `#efece4` · 액센트 인디고 `#2f3e8c` · 서브 마커 `#b04a2a`
- **무드:** 차분한 스튜디오 조명, 자연광, 진지·집중. 데이터·공식·근거 기반의 신뢰감.
- **NO:** 화려한 미용실 시술 컷, 과장된 미소, 스톡 사진 같은 활기, 네온·인공조명, 보라 그라데이션, 이모지 아이콘 톤.
- **YES:** 진단표·자·줄자·펜·노트·골격 도식 위주의 '컨설팅 데스크' 클로즈업. 사람이 등장할 경우 측면·3/4 앵글과 낮은 채도, 정면 응시는 최소화.
- 헤어 디자이너가 아닌 '진단 전문가'의 책상 무드를 일관되게 유지 — `.claude/brand-context.md`의 시각 정체성을 데이터 분석 톤으로 재해석한다.

---

## 이미지 목록

### hero.jpg (1600×2000 세로형 4:5, ★★★ LCP)
- 위치: Hero 섹션 우측 비주얼 슬롯 (`.hero__visual`)
- 분위기: 자연광, 진지, 진단지 위 펜·자·줄자가 정돈된 컨설팅 데스크 클로즈업
- 주제: 펼쳐진 진단 시트(얼굴 비율 그리드·9가지 좌표 매트릭스 흔적), 옆에 자·줄자·필기구, 한쪽에 손이 살짝 진단표 위에 놓여 있는 클로즈업
- 핵심 메시지 연결: "감으로 자르던 머리, 이제 데이터로 설계합니다" — 도구가 곧 분석 도구임을 시각적으로 표현
- 텍스트 오버레이: 없음 (헤드라인은 랜딩 HTML에서 처리)
- 우선순위: ★★★ (LCP)

### instructor.jpg (1200×1500 세로형 4:5, ★★)
- 위치: Instructor 섹션 (`.instructor__photo`)
- 분위기: 진단표·분석 시트를 펼친 상태로 고객(또는 모델)과 마주 앉아 설명하는 컨설팅 장면. 차분한 스튜디오 배경.
- 주제: 강사 — 단정한 복장(다크 톤), 측면 또는 3/4 앵글. 손에 펜·진단 시트. 미용실 시술 컷이 아닌 '진단 전문가'의 책상.
- 텍스트 오버레이: 없음
- 비고: 강사 본인 실사 촬영 권장 (TBD — 강사 확정 후 진행)
- 우선순위: ★★

### diagnostic-sheet.jpg (1600×1067 가로형 3:2, ★★)
- 위치: Framework 섹션 또는 Curriculum 섹션 보조 이미지로 향후 추가 가능 (현 랜딩에는 아직 슬롯 없음 — 추후 삽입 검토)
- 분위기: 실제 진단 시트의 클로즈업 — 골든 밸런스 그리드, 상·하심안 표시, Curvy/Neutral/Sharp 항목, 9가지 페이스 타입 좌표축
- 주제: 종이 위에 그려진 분석 양식 + 펜으로 짚어가는 손가락 (좌표를 찍는 순간)
- 텍스트 오버레이: 없음 (라벨이 있다면 시트 안의 손글씨로 자연스럽게)
- 우선순위: ★★

### case-1.jpg (1200×1500 세로형 4:5, ★)
- 위치: Testimonials 섹션 보조 (현재 랜딩에는 슬롯 미배치 — 추후 카드형 배치 시 사용)
- 분위기: '상심안 / 하심안' 같은 구조 차이를 보여주는 비교 컷 — 추상화된 실루엣 또는 진단 시트 위 마킹의 클로즈업
- 주제: 데이터가 어떻게 시술 선택으로 이어지는지 1장으로 압축
- 텍스트 오버레이: 없음
- 우선순위: ★

### face9-matrix.jpg (1600×1067 가로형 3:2, ★)
- 위치: Framework 섹션의 `.face9` 매트릭스 보조 (현재는 텍스트 셀만 표시 — 시각적 강화가 필요하면 배경 또는 인접 이미지로 사용)
- 분위기: 9분할 격자 위에 9가지 무드 키워드와 작은 톤·실루엣 샘플이 좌표화된 추상 인포그래픽
- 주제: 'Face 9 Types' 좌표 매트릭스의 시각화 — 컬러는 인디고·블랙·아이보리만 사용 (브랜드 톤 유지)
- 텍스트 오버레이: 9가지 무드 라벨 (이미지에 포함 OK)
- 우선순위: ★

### og-image.jpg (1200×630, ★★★ OG)
- 위치: OpenGraph (페북·카톡 공유 미리보기)
- 분위기: Hero와 동일한 톤 + 텍스트 오버레이
- 주제: 어두운 잉크 블랙 배경에 진단 시트·펜·자가 측면 조명으로 배치된 정물 컷. 오른쪽 하단에 USP 한 줄.
- 텍스트 오버레이 (이미지에 포함 OK):
  - 메인: `감으로 자르던 머리, 이제 데이터로 설계합니다`
  - 서브: `페르소나 디자인 매트릭스 · 국내 도입 초기 1기 모집`
- 모바일 가독성 확보 (큰 폰트, 콘트라스트 강) 필요
- 우선순위: ★★★

### favicon / 모바일 홈 아이콘 (선택)
- 정사각 — 'PD' 이니셜 또는 9분할 매트릭스의 미니 아이콘
- 잉크 블랙 배경 + 인디고 액센트

---

## 도구 선택 가이드

| 이미지 | 추천 도구 | 비고 |
|--------|----------|------|
| hero.jpg | Midjourney v6 (style raw) | 진단지·도구 디테일, 자연광 |
| instructor.jpg | 실사 촬영 권장 | 강사 본인 사진이 가장 신뢰감 (TBD) |
| diagnostic-sheet.jpg | Midjourney + 손글씨 합성(Canva) | 도해 시트의 톤 일관성 |
| case-1.jpg | Midjourney v6 | 추상화된 비교 컷 |
| face9-matrix.jpg | Figma/Canva 인포그래픽 | 라벨 정확도 필요 — Midjourney 부적합 |
| og-image.jpg | Midjourney → Canva 텍스트 합성 | 텍스트는 합성 단계 |

---

## Midjourney 공통 부정 프롬프트

```
--no smile, stock photo, neon, oversaturated, cartoon, anime, 3d render, plastic, salon scissors flying, gradient purple, beauty influencer, fashion magazine cover
```

## Midjourney 공통 긍정 키워드

```
editorial photography, natural daylight, ink-black and ivory palette, paper texture, analytical desk, anthropometric chart, ruler and pencil, muted, professional, documentary, soft shadows, 35mm film grain
```

---

## 검수 체크리스트 (이미지 생성 후)

- [ ] 톤이 잉크 블랙 + 페이퍼 톤 기조인가? (브랜드 토큰과 어울리는가)
- [ ] 진단지·도구·도해도 같은 '분석가' 시각 요소가 핵심에 있는가?
- [ ] 인물 표정이 과장되지 않은가? (정면 응시·과장된 미소 최소화)
- [ ] 미용실 시술 사진 톤이 섞이지 않았는가?
- [ ] 텍스트 오버레이는 광고용 20% 이하인가? (OG는 예외)
- [ ] OG 이미지: 카톡·페북 미리보기에서 모바일 가독성 확보되는가?
- [ ] 인종·연령이 타겟 페르소나(30대 초중반 디자이너·컨설턴트)에 맞는가?
- [ ] 일본 ICPA 사례에 묶이지 않는 '한국 1기' 무드인가? (지나치게 일본적 그래픽 톤 회피)

---

## 저장 경로

```
public/courses/persona-design/
├── hero.jpg
├── instructor.jpg
├── diagnostic-sheet.jpg
├── case-1.jpg
├── face9-matrix.jpg
└── og-image.jpg
```

아임웹 업로드 후 `imweb.html`의 `{이미지URL}` placeholder를 실제 아임웹 CDN URL로 교체.

---

## 다음 단계

1. `image-prompt-brand` 에이전트로 본 문서 입력 → 도구별 프롬프트 산출
2. 외부 도구(Midjourney/실사 촬영/Canva)로 이미지 생성
3. `public/courses/persona-design/`에 저장 + 아임웹 업로드
4. `imweb.html`의 placeholder를 실 URL로 교체 → 재배포
5. 검수 체크리스트 통과 → Phase 4 (광고 제안서) 진행
