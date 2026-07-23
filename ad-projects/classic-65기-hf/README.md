# 소옴 클래식과정 65기 — 광고 영상 (Hyperframe)

`courses/classic/campaigns/65기-story-plan.md`(승인된 씬 기획)를 Hyperframe(HTML+GSAP)으로 옮긴 프로젝트다.
자립형(self-contained) — 이 폴더 하나로 미리보기·렌더가 된다.

- 규격: **9:16 · 1080×1920 · 30초 · 6씬**
- 톤: 다크(#0e0e12) + 마젠타 액센트(#d94fd5) + 옐로 포인트(#ffd400), Pretendard
- 근거(Source of truth): `courses/classic/imweb.html` · `courses/classic/USP.md`
- 참고 템플릿: `ad-projects/persona-design-1기-hf/`

## 씬 구성

| # | 시간 | 내용 | 자산 |
|---|------|------|------|
| S1 HOOK | 0–4s | "커트는 기술이 아닙니다." | 블랙 (완성) |
| S2 REFRAME | 4–8s | "원리를 이해하는 일입니다." | **커트 클로즈업 클립 (플레이스홀더)** |
| S3 PROOF | 8–16s | 원리·구조·재현·분석 + 비달사순 TTC 배지 | **시술 몽타주 클립 (플레이스홀더)** |
| S4 DETAIL | 16–22s | 65기 일정·정원·강사 이력 | 텍스트 카드 (완성) |
| S5 PHILOSOPHY | 22–26s | "기술이 아니라 기준을 세운다." | 블랙 (완성) |
| S6 CTA | 26–30s | 65기 모집·8/17 개강·잔여 3자리 | 텍스트 (완성) |

## ⚠️ 아직 남은 것 — 실사 영상 클립 2개

S2·S3는 **점선 플레이스홀더 패널**로 렌더된다(실사 클립 미준비). 텍스트·타이밍·애니메이션은 완성이라
구조·카피는 지금 바로 확인할 수 있다. 실사 클립을 넣으려면:

1. `images/` 폴더에 클립을 넣는다 (예: `images/s2-cut-closeup.mp4`, `images/s3-montage.mp4`).
   - 깨끗한 클립(자체 자막·로고 없음), 다크 톤, 9:16.
2. `index.html`의 해당 `<div class="media-holder">…</div>` 블록을 아래처럼 `<video>`로 교체한다:
   ```html
   <video src="images/s2-cut-closeup.mp4" muted autoplay loop
          style="position:absolute; inset:0; width:1080px; height:1920px; object-fit:cover;"></video>
   ```
3. 가독성을 위해 `.scrim-bottom`(하단 그라데이션)은 그대로 둔다.

## 미리보기 · 렌더

```bash
cd ad-projects/classic-65기-hf
npm run dev       # 브라우저 미리보기 (long-running — 백그라운드로 실행)
npm run check     # lint + validate + inspect
npm run render    # MP4 렌더
```

> 최초 실행 시 `npx hyperframes`가 도구를 내려받는다(네트워크 필요).
> 렌더 후 Windows 플레이어로 열어 최종 검수한다(WSL VS Code 미리보기는 오디오 미지원).

## 배달 경로 (렌더 후)

완성 MP4는 소재 조직 규약(`docs/ad-asset-organization.md`)에 따라
`public/ads/classic/65기/v{NN}/video/`로 복사한다.
