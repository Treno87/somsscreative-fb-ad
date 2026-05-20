# {코스명} {기수} 영상 광고 — 씬 기획

> 사용법: 동영상 광고의 씬 구분·카피·자산·효과를 **사람이 검토할 수 있게** 정리하는 문서.
> 광고 제안서 `courses/{course}/campaigns/{기수}.md`의 앵글·카피를 영상 내러티브로
> 재구성한다. **이 문서를 사람이 승인한 뒤** STEP 6에서
> `remotion/data/{course}-{기수}-story.json`으로 1:1 변환한다.
> 전체 프로세스: `docs/video-ad-process.md`.

## 메타

- 코스 / 기수: {course} / {기수}
- accent (강조색): {HEX — `courses/{course}/design_token.css`}
- 배경음악: {트랙명 또는 미정}
- 총 길이: ~{N}초 · {M}씬
- 데이터 피드 출력: `remotion/data/{course}-{기수}-story.json`
- 작성일: {YYYY-MM-DD}

---

## 씬 흐름 (한눈에)

스토리 아크(hook→problem→turn→proof→cta)가 설득력 있는지 이 표로 먼저 판단한다.

| # | kind | 헤드라인 (요약) | 길이 | 자산 |
|---|------|----------------|------|------|
| 1 | hook | {한 줄} | 3초 | 이미지 |
| 2 | problem | | 5초 | 이미지 |
| 3 | turn | | 5초 | 이미지 |
| 4 | proof | | 6초 | 영상 |
| 5 | cta | | 5초 | 영상 |

---

## 씬별 상세

씬 하나 = JSON 씬 객체 하나. STEP 6에서 그대로 변환된다.
헤드라인 줄바꿈은 `/`로 표기한다 (JSON 변환 시 `\n`).

### 씬 1 — hook

- **eyebrow**: {상단 작은 라벨 · 10~15자}
- **headline**: {핵심 메시지 · 2~3줄, 줄바꿈 `/`}
- **body**: {보조 한 줄 · 25~35자 / 후킹 씬은 보통 비움}
- **cta**: — (`kind: cta` 씬에서만)
- **자산 종류**: 이미지 / 영상
- **자산 brief**: {장면 묘사 — image-prompt-brand 입력용}
- **textPosition**: center / bottom
- **headlineAnim**: {preset}·{unit} (예: pop·word)
- **길이**: 3초

### 씬 2 — problem

- **eyebrow**:
- **headline**:
- **body**:
- **cta**: —
- **자산 종류**:
- **자산 brief**:
- **textPosition**: center
- **headlineAnim**: ·
- **길이**: 5초

### 씬 3 — turn

- **eyebrow**:
- **headline**:
- **body**:
- **cta**: —
- **자산 종류**:
- **자산 brief**:
- **textPosition**: center
- **headlineAnim**: ·
- **길이**: 5초

### 씬 4 — proof

- **eyebrow**:
- **headline**:
- **body**:
- **cta**: —
- **자산 종류**:
- **자산 brief**:
- **textPosition**: center
- **headlineAnim**: ·
- **길이**: 6초

### 씬 5 — cta

- **eyebrow**:
- **headline**:
- **body**:
- **cta**: {버튼 문구 · ~10자}
- **자산 종류**:
- **자산 brief**:
- **textPosition**: center
- **headlineAnim**: ·
- **길이**: 5초

---

## 승인 체크리스트

- [ ] 스토리 아크(hook→problem→turn→proof→cta)가 자연스럽게 이어지는가
- [ ] 각 씬 헤드라인이 한 가지 메시지만 담는가
- [ ] 헤드라인 길이가 영상 자막에 적절한가 (2~3줄)
- [ ] 자산 brief가 image-prompt-brand에 그대로 넘길 수준인가
- [ ] 텍스트 효과(preset·unit)가 씬마다 달라 단조롭지 않은가
- [ ] 총 길이가 30초 이하인가

✅ 승인 → STEP 6 (`story.json` 변환) / ❌ 수정 → 이 문서 갱신 후 재검토
