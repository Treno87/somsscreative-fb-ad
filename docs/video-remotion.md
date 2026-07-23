# Remotion 제작 세부 — 광고 동영상 (StorytellingAd)

씬 구분 · 카피 · 이미지/영상 · 배경음악 · 텍스트 효과를 어떻게 지정해서 원하는 광고 영상을 만드는지에 대한 **Remotion 경로** 표준.

> **진입점** — 공통 관문 `docs/video-ad-process.md`에서 경로 선택 후 들어온다. 승인된
> 씬 기획 `courses/{course}/campaigns/{기수}-story-plan.md`를 전제로 한다.
>
> 기준일 2026-05-20 (개정 2026-07-23) · 러닝 예시: intern10000 스토리텔링 영상 · 대상 시스템: `remotion/` (Remotion 4)

---

## 0. 개요

이 시스템은 **코드로 광고 영상을 생성**한다. 영상 편집기를 쓰지 않고, **데이터 피드 JSON 파일 한 개**로 영상 전체를 정의한다.

```
입력(데이터 피드 JSON + 이미지·영상·음악)
  → Remotion 렌더(StorytellingAd 템플릿)
  → 출력(9:16 MP4, 릴스·스토리·피드용)
```

**핵심 원리 — JSON이 곧 "영상 주문서"다.** `remotion/data/{course}-{기수}-story.json` 한 파일에 씬 순서·카피·자산 경로·텍스트 효과·음악이 모두 들어간다. 이 문서의 목적은 *그 주문서를 어떻게 채우는가*를 단계별로 설명하는 것이다.

> **이 문서의 위치** — 영상 소재 공통 관문은 `docs/video-ad-process.md`다. 경로 선택(Remotion vs Hyperframe)·씬 기획 승인·배달·마감은 관문 문서가 다루고, 이 문서는 **Remotion 제작 세부**만 다룬다.

결과물 규격: **9:16 · 1:1 · 4:5 (Meta 게재 위치 3종) · 1080px 폭 · 30fps · H.264 MP4**. 본편 ~20–30초 권장, 끝에 로고 아웃트로(옵션)를 붙일 수 있다.

---

## 1. 전체 흐름

영상 한 편은 다음 6단계로 만든다.

```
① 광고 기획        ad-proposal 에이전트 — 앵글·카피
② 씬 기획 문서      {기수}-story-plan.md 작성 → 사람 검토·승인   (STEP 1~5)
③ 데이터 피드       승인된 문서를 story.json으로 변환            (STEP 6)
④ 자산 준비         이미지·영상·음악 → remotion/public/
⑤ 렌더             9:16·1:1·4:5 3종 렌더                       (STEP 7)
⑥ 검수             스틸 자가검수 · Windows 플레이어 · QA        (STEP 7)
```

**②가 핵심 검토 관문이다.** 씬 흐름·카피·자산·효과를 사람이 읽을 수 있는 문서로 먼저 확정·승인한 뒤에야 ③ 데이터 피드(JSON) 변환으로 넘어간다. JSON을 바로 쓰지 않는 이유 — 중괄호·따옴표 사이에서는 "이 스토리가 설득력 있나"를 판단하기 어렵기 때문이다.

③ 데이터 피드와 ④ 자산 준비는 순서가 바뀌어도 된다 — 자산이 아직 없어도 데이터 피드만 있으면 **플레이스홀더로 렌더**되어 구조를 먼저 확인할 수 있다(STEP 3 참고).

---

## 2. STEP 1 — 씬 구분

스토리텔링 광고는 **여러 장면이 이어지는 내러티브**다. 후킹 하나로 끝나지 않고, "스크롤을 멈추게 → 설득 → 행동"까지 데려간다. 표준은 **5씬**이며 각 씬은 `kind` 값을 가진다.

| kind | 역할 | 권장 길이 | intern10000 예시 |
|---|---|---|---|
| `hook` | 첫 3초 — 스크롤을 멈추게 하는 한 방. 고통·호기심. | 3초 | "영상 볼 땐 알겠는데 / 손이 멈춥니다" |
| `problem` | 공감 확장 — 왜 그 문제가 생기는지. | 5초 | "어깨너머로 배운 기술은 / 실력이 되지 않습니다" |
| `turn` | 전환 — 해결책·관점의 반전. | 5초 | "형태가 아니라 / 커트의 구조를 훈련합니다" |
| `proof` | 증명 — 신뢰 근거(강사·실적·후기). | 6초 | "런던 사순 강사코스 수료 / 300명+ 배출" |
| `cta` | 행동 유도 — 제안 + 버튼. | 5초 | "14회차 42시간 / 베이직을 완성합니다" + 버튼 |

> **길이 기준** — 합계 ~24초, 장면 전환(0.5초씩 겹침)을 빼면 최종 **~22초**. 씬 수는 가변이지만 **3~6씬**을 권장 — 30초를 넘으면 이탈률이 급격히 오른다. 각 씬 길이는 `durationInSeconds`로 지정한다.

### 산출물 — 씬 기획 문서

STEP 1의 씬 골격은 곧바로 JSON으로 가지 않는다. 먼저 사람이 검토할 수 있는 **씬 기획 문서**로 정리한다:

`courses/{course}/campaigns/{기수}-story-plan.md` — 광고 제안서 `{기수}.md` 옆에 둔다. 양식은 `courses/_templates/story-plan.template.md`.

이 문서는 STEP 1의 씬 흐름 표로 시작해, STEP 2~5에서 카피·자산·음악·효과를 채워 완성된다. 두 부분으로 구성된다:

1. **씬 흐름 표** — `# / kind / 헤드라인 / 길이 / 자산` 한 줄 표. 스토리 아크(hook→problem→turn→proof→cta)가 설득력 있는지 한눈에 판단한다.
2. **씬별 상세** — 씬마다 모든 필드(eyebrow·headline·body·cta·자산 brief·textPosition·headlineAnim·길이)를 적는다. STEP 2~5에서 채운다.

사람이 이 문서를 **검토·승인**한 뒤에야 STEP 6(JSON 변환)으로 넘어간다.

---

## 3. STEP 2 — 씬별 카피·문구

각 씬에는 텍스트 **4종**이 들어간다. 헤드라인이 주인공이고 나머지는 보조다.

| 필드 | 역할 | 길이 가이드 | 비고 |
|---|---|---|---|
| `eyebrow` | 헤드라인 위 작은 라벨 — 대상·맥락 | 10~15자 | 액센트 색, 대문자 처리 |
| `headline` | 씬의 핵심 메시지 | 2~3줄, `\n`으로 줄바꿈 | 가장 큰 텍스트. 한 씬 = 한 메시지 |
| `body` | 헤드라인 보조 한 줄 | 25~35자 | 후킹 씬은 보통 비움(`""`) |
| `cta` | CTA 캡슐 버튼 문구 | ~10자 | `kind:"cta"` 씬에서만. 그 외엔 `""` |

**누가 쓰나** — 카피는 `ad-proposal` 에이전트가 코스의 `content.md`·`brand-context.md`를 근거로 생성한다(앵글·헤드라인·CTA). 영상용으로는 그 카피를 **짧게 압축**해 데이터 피드에 옮긴다 — Meta 메인 텍스트(125자)는 영상 자막에 너무 길다. 직접 작성해도 되며, 브랜드 보이스(진지·직접적·수치 기반)를 따른다.

> **예시 — intern10000 1기** — 후킹 씬: `eyebrow` "인턴 · 초급 디자이너" / `headline` "영상 볼 땐 알겠는데\n손이 멈춥니다" / `body` "" (후킹은 보조문 생략) / `cta` "".

---

## 4. STEP 3 — 이미지·영상 자산

각 씬은 배경 자산 **1개**를 가진다 — 정지 이미지 또는 영상 클립. 두 필드로 지정한다.

| 필드 | 내용 |
|---|---|
| `media` | 자산 파일 경로. 이미지(`.png`/`.jpg`) 또는 영상(`.mp4`/`.mov`/`.webm`). 비우면 플레이스홀더. |
| `brief` | 자산 설명문. 이미지 미준비 시 플레이스홀더 패널에 표시되고, `image-prompt-brand` 에이전트의 입력으로 쓰인다. |

**규격**

- **비율 9:16 세로** — 영상 출력은 1080×1920.
- **이미지 해상도 ≥ 1300px 폭** 권장(이상적 1620×2880). 이미지는 켄 번스 줌(최대 1.2배)으로 움직이므로, 1080×1920이면 줌 구간에서 흐려진다.
- **영상 클립**은 켄 번스를 적용하지 않는다 — 클립 자체 움직임을 사용.

**저장 경로**

```
remotion/public/images/{course}/01-hook.png
remotion/public/images/{course}/04-proof.mp4   ← 영상도 같은 폴더
```

데이터 피드의 `media`에는 `public/`을 뺀 경로를 적는다 — 예: `"images/intern10000/01-hook.png"`.

**자산 생성** — `image-prompt-brand` 에이전트가 `brief`를 받아 도구별 프롬프트(Midjourney·Sora·Canva)를 산출한다. 이미지는 Midjourney, 영상 클립은 Sora 등으로 생성하고, 강사 등 인물 컷은 **실사 촬영**을 우선한다.

> **플레이스홀더 — 자산 없이 먼저 렌더** — `media`가 비어 있으면 그 씬은 `brief` 문구가 적힌 플레이스홀더 패널로 렌더된다. 덕분에 자산 준비 전에도 영상 구조·카피·타이밍을 먼저 확인할 수 있다.

> ⚠️ **주의** — ① 영상 클립에 **자체 텍스트·로고가 박혀** 있으면 우리 텍스트와 충돌한다 — 깨끗한 클립을 쓸 것. ② 5개 자산의 **밝기·색감 톤을 통일**할 것 — 밝은 클립과 어두운 이미지가 섞이면 영상이 둘로 갈라져 보인다.

### 공용 로고 아웃트로 (브랜드 자산)

모든 광고 영상은 **끝에 소옴크리에이티브 로고 아웃트로**를 붙인다 — 코스·기수와 무관한 **공용 브랜드 자산**이다.

- 파일: `remotion/public/brand/somss-outro.mp4` (검정 배경 키네틱 로고 스팅, 8.94초)
- 데이터 피드 최상위에 `"outro": "brand/somss-outro.mp4"` · `"outroSeconds": 8.94`로 지정한다.
- 마지막 씬에서 크로스페이드로 이어지고, 자체 오디오를 유지한다 (BGM은 아웃트로 전에 페이드아웃).
- 16:9 가로 클립이라 세로 프레임에선 `StorytellingAd.tsx`의 `OUTRO_SCALE`(현재 2배)로 확대해 로고 가시성을 확보한다.
- 새로 만드는 브랜드 공용 영상 자산은 코스 폴더가 아니라 `remotion/public/brand/`에 둔다.

---

## 5. STEP 4 — 배경음악

최상위 `music` 필드에 음원 경로를 적는다. 비우면(`""`) 무음.

```
remotion/public/audio/{트랙}.mp3      ← 음원 저장 위치
"music": "audio/{트랙}.mp3"            ← 데이터 피드 필드
```

- **자동 페이드** — 앞 0.6초 페이드 인 / 끝 1.2초 페이드 아웃, 기본 볼륨 0.55.
- **영상 클립 소리는 음소거** 처리된다 — 배경음악만 들린다.

> ⚠️ **라이선스 — 필수** — 유료 광고이므로 **저작권 있는 곡은 사용 불가**. 로열티프리/라이선스 음원만: YouTube 오디오 보관함, Pixabay Music(무료) / Artlist, Epidemic Sound(유료 구독).

> **톤 매칭** — 음악 톤을 영상 내러티브 톤에 맞출 것. 진지·다큐멘터리적 내러티브에 경쾌한 댄스팝을 깔면 메시지와 부조화한다. 22초라 짧은 루프나 곡의 앞부분이면 충분하다.

---

## 6. STEP 5 — 텍스트 효과

헤드라인은 씬마다 다른 **진입 애니메이션**으로 등장한다. 효과는 *프리셋*(어떻게)과 *단위*(무엇 단위로)의 조합으로 정한다.

**프리셋 8종**

| preset | 동작 |
|---|---|
| `fade-up` | 아래에서 떠오르며 페이드인 (가장 기본) |
| `fade-down` | 위에서 내려오며 페이드인 |
| `slide-left` | 오른쪽에서 미끄러져 들어옴 |
| `slide-right` | 왼쪽에서 미끄러져 들어옴 |
| `blur-in` | 흐릿하게 시작해 선명해짐 |
| `pop` | 작게 시작해 튕기듯 확대 — 활기찬 후킹에 |
| `rise` | 아래에서 크게 솟아오름 — 강한 마무리에 |
| `expand` | 자간이 좁았다 벌어지며 등장 |

**적용 단위 3종**

| unit | 동작 |
|---|---|
| `block` | 텍스트 통째로 한 번에 |
| `line` | 줄 단위로 순차 등장 |
| `word` | 단어 단위로 순차 등장 (가장 동적) |

씬별 지정: `"headlineAnim": { "preset": "pop", "unit": "word" }`. 씬마다 다른 조합을 쓰면 영상이 단조롭지 않다. eyebrow·body는 `fade-up`, CTA 캡슐은 `pop`으로 자동 처리된다(요소별 시차 등장).

**텍스트 위치 — `textPosition`**

| 값 | 배치 | 언제 |
|---|---|---|
| `center` | 화면 세로 중앙 | 텍스트가 주인공인 강조형 (기본 권장) |
| `bottom` | 화면 하단 | 이미지 피사체를 상단에 살리고 싶을 때 |

> **예시 배정 — intern10000 1기** — hook `pop·word` / problem `slide-left·line` / turn `blur-in·word` / proof `fade-up·line` / cta `rise·word` — 전 씬 `center`.

---

## 7. STEP 6 — 데이터 피드 작성 (핵심)

**승인된 씬 기획 문서**(`{기수}-story-plan.md`)를 기계가 읽는 JSON으로 옮긴다. 씬 기획 문서의 "씬별 상세" 블록 하나가 JSON 씬 객체 하나가 된다 — 1:1 변환이다. 이 단계에서 실제 자산 파일 경로(`media`)를 채운다 (STEP 3에서 준비한 파일).

이 JSON이 영상의 완전한 명세 = **주문서**다. 위치: `remotion/data/{course}-{기수}-story.json`

**최상위 구조**

| 필드 | 설명 |
|---|---|
| `accent` | 강조색 HEX. 코스의 `design_token.css`에서 가져온다. |
| `music` | 배경음악 경로. `""`이면 무음. |
| `scenes` | 씬 객체 배열 (순서대로 재생). |

**씬(scene) 객체**

| 필드 | 설명 |
|---|---|
| `id` | 씬 식별자 — 예 `"s1-hook"` |
| `kind` | `hook`·`problem`·`turn`·`proof`·`cta` |
| `media` | 배경 자산 경로 (이미지/영상). 비면 플레이스홀더. |
| `brief` | 자산 설명문 (플레이스홀더 표시 + 프롬프트 입력용) |
| `eyebrow` | 상단 작은 라벨 |
| `headline` | 메인 헤드라인 (`\n` 줄바꿈) |
| `body` | 보조 한 줄 (없으면 `""`) |
| `cta` | CTA 버튼 문구 (cta 씬에서만, 그 외 `""`) |
| `textPosition` | `"center"` 또는 `"bottom"` |
| `headlineAnim` | `{ "preset": ..., "unit": ... }` |
| `durationInSeconds` | 씬 길이(초) |

> **필드 확장** — 위 두 표는 핵심 기본 필드다. 템플릿이 발전하며 필드가 추가됐다 — 최상위 `outro`·`outroSeconds`(로고 아웃트로), 씬의 `layout:"stack"`(텍스트→일러스트→텍스트 세로 연출)·`lead`(헤드라인 위 리드인 줄)·`bullets`(body 대신 불릿 리스트). `media`는 단일 경로 외에 **경로 배열**(영상 몽타주)·**HEX 색상**(솔리드 카드)도 받는다. 최신 전체 명세는 `remotion/src/StorytellingAd.tsx` 타입 정의와 `remotion/data/intern10000-2기-story.json` 예시를 참조한다.

**예시 — `intern10000-1기-story.json` (씬 2개 발췌)**

```json
{
  "id": "intern10000-1기-story",
  "accent": "#fc1c49",
  "music": "audio/fassounds-...-412230.mp3",
  "scenes": [
    {
      "id": "s1-hook",
      "kind": "hook",
      "media": "images/intern10000/01-hook.png",
      "brief": "가위를 든 인턴의 손 클로즈업 — 동작이 멈춘 듯 정적",
      "eyebrow": "인턴 · 초급 디자이너",
      "headline": "영상 볼 땐 알겠는데\n손이 멈춥니다",
      "body": "",
      "cta": "",
      "textPosition": "center",
      "headlineAnim": { "preset": "pop", "unit": "word" },
      "durationInSeconds": 3
    },
    {
      "id": "s5-cta",
      "kind": "cta",
      "media": "images/intern10000/05-cta.mp4",
      "brief": "7명 소수정예 수업 현장 — 작업 중인 손과 마네킹",
      "eyebrow": "1기 모집 중",
      "headline": "14회차 42시간\n베이직을 완성합니다",
      "body": "정원 7명 · 2026년 6월 개강.",
      "cta": "무료 상담 신청",
      "textPosition": "center",
      "headlineAnim": { "preset": "rise", "unit": "word" },
      "durationInSeconds": 5
    }
  ]
}
```

> **한 줄 요약** — 이 JSON을 정확히 채우면 영상이 그대로 나온다. "원하는 영상을 알려준다" = "이 파일을 채운다".

---

## 8. STEP 7 — 생성·검수

**렌더 명령 — 일괄 스크립트 (표준)**

```bash
# 최초 1회 — 의존성 설치
npm install --prefix remotion

# 표준 3비율(9:16·1:1·4:5) 일괄 렌더 → remotion/out/
npm run render:story --prefix remotion -- data/{feed}.json

# 가로 링크(1.91:1)까지 필요할 때
npm run render:story --prefix remotion -- data/{feed}.json --all-ratios

# 구조 확인용 스모크 렌더 (앞 31프레임만)
npm run render:story --prefix remotion -- data/{feed}.json --frames=0-30
```

출력 파일은 `remotion/out/`에 생성된다. 9:16은 접미사 없는 파일명(`{feed}.mp4`), 1:1·4:5는 `-1x1`·`-4x5` 접미사가 붙는다.

> **비율 정책** — 표준 3종(9:16 릴스·스토리 / 1:1 피드 / 4:5 피드)은 필수. **1.91:1(가로 링크)은 옵션** — 해당 게재 위치를 쓸 때만 `--all-ratios`로 추가한다.

**수동 렌더 (참고)** — 비율 하나만 다시 뽑을 때:

```bash
cd remotion
npx remotion render StorytellingAd-9x16 out/{feed}.mp4 --props=data/{feed}.json
```

**미리보기 (스튜디오)**

```bash
npm run dev --prefix remotion                                    # 기본 스토리로 열림
REMOTION_STORY=classic-65기-story npm run dev --prefix remotion   # 특정 스토리로 열기
```

스튜디오가 기본으로 보여줄 스토리는 `REMOTION_STORY` 환경변수로 전환한다 (`remotion/data/`의 파일명, `.json` 제외). defaultProps는 미리보기용 예시일 뿐, **렌더 정본은 항상 `--props`(render:story)다.** 타임라인을 끌어 재생·정지하며 확인. props 패널에서 값을 바꿔 즉시 미리보기 가능.

**영상 보기** — WSL 환경이라면 **Windows 플레이어**로 열어야 소리가 난다 — `explorer.exe`로 `remotion/out` 폴더를 열고 더블클릭. VS Code 내장 미리보기는 오디오가 재생되지 않으니 검수용으로 쓰지 말 것.

**QA 체크리스트**

- 씬별 이미지·영상이 의도대로 들어갔는가 (플레이스홀더 안 남았는가)
- 텍스트가 배경 위에서 읽히는가 (대비·그림자·eyebrow 칩)
- 텍스트·요소가 화면 밖으로 잘리지 않았는가
- 배경음악이 재생되고 톤이 맞는가 · 영상 클립의 자체 자막과 충돌 없는가
- 자산들의 밝기·색감 톤이 일관되는가
- 끝에 로고 아웃트로가 정상 연결됐는가
- 본편 길이가 적정한가 (~20–30초)
- 9:16 · 1:1 · 4:5 세 비율 모두 정상 출력됐는가

---

## 9. 수정·검수 작업 표준

경로 공통 5원칙(**확정 → 전 비율 렌더 → 스틸 자가검수 → 품질 즉시처리 → 기획문서 동기화**)은 관문 문서 `docs/video-ad-process.md`를 따른다. Remotion에서 스틸 자가검수는:

```bash
npx remotion still StorytellingAd-9x16 out/chk-<frame>.png \
  --props=data/<feed>.json --frame=<frame>
```

확인 항목 — 레이아웃 정렬 / 텍스트·요소 잘림 / 배경 위 가독성 / 자산 크기·비율 / 영상 클립 자막 충돌.

---

## 9-1. STEP 8 — 배달·마감

렌더 결과(`remotion/out/`)는 스크래치다. 검수 통과 후의 배달(`public/ads/{course}/{기수}/v{NN}/video/`)과 마감(`{기수}-assets.md` 갱신)은 **관문 문서 `docs/video-ad-process.md`의 공통 출력·마감 절차**를 따른다. `render:story`의 `--deliver=v{NN}` 플래그가 규약 파일명 복사를 대신해 준다.

---

## 10. 치트시트

- **씬 종류 (kind)** — hook · problem · turn · proof · cta
- **애니메이션 프리셋** — fade-up / fade-down / slide-left / slide-right / blur-in / pop / rise / expand
- **적용 단위 (unit)** — block(통째) / line(줄별) / word(단어별)
- **규격** — 9:16 · 1:1 · 4:5 3종 · 1080px 폭 · 30fps / 이미지 ≥ 1300px 폭 / 음원 로열티프리
- **경로** — 씬 기획 `courses/{c}/campaigns/{기}-story-plan.md` / 데이터 피드 `remotion/data/{c}-{기}-story.json` / 자산 `remotion/public/images/{c}/`·`audio/` / 브랜드 공용 `remotion/public/brand/`
- **공용 아웃트로** — `remotion/public/brand/somss-outro.mp4` — 모든 영상 끝에 붙인다
- **렌더** — `npm run render:story --prefix remotion -- data/{feed}.json` (표준 3비율 일괄 · `--all-ratios`로 1.91:1 추가 · `--deliver=v{NN}`으로 배달)
- **작업 루프** — 확정 → 3종 렌더 → 스틸 자가검수 → 품질문제 즉시처리 → 기획문서 동기화

---

## 11. 부록 — 자주 막히는 곳

| 증상 | 원인 · 대응 |
|---|---|
| 한글이 브랜드 폰트로 안 나옴 | Clash·Cabinet·Space Grotesk는 라틴 전용 — 한글은 Pretendard로 자동 폴백된다. 정상 동작이며, 숫자·영문만 브랜드 폰트가 적용된다. |
| 영상 클립 위에 엉뚱한 글자가 보임 | 클립에 자체 자막·로고가 박혀 있는 것 — 후처리로 못 지운다. 깨끗한 클립으로 교체. |
| 한 씬만 유독 밝거나 어두움 | 자산 톤 불일치 — 생성 단계에서 5개 톤을 통일하거나 밝기·채도 보정. |
| 이미지가 흐릿하게 나옴 | 켄 번스 줌(1.2배)에 비해 원본이 작음 — 폭 1300px 이상으로 업스케일. |
| 긴 렌더가 폰트 오류로 중단 | 해결됨 — 폰트는 렌더를 막지 않는 방식으로 로드된다. 극초반 몇 프레임만 폴백 가능. |
| 음악이 안 들림 | 대개 재생기 문제 — VS Code 미리보기는 오디오 미지원. Windows 플레이어로 열 것. |

---

*소옴크리에이티브 · Remotion 제작 세부 · 기준일 2026-05-20 · 개정 2026-07-23*
*공통 관문: `docs/video-ad-process.md` · 상위 워크플로우: `docs/PROCESS.md` · 대상 시스템: `remotion/`*
