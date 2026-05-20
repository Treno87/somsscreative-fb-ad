# 소옴크리에이티브 — Remotion 광고 영상

`somsscreative-fb-ad` 리포 안의 **독립 npm 프로젝트**. Next.js 앱과 의존성·빌드를
공유하지 않는다 (루트 `tsconfig.json`·`eslint.config.mjs`에서 `remotion/` 제외).
Meta(릴스·피드·스토리) 광고 소재를 코드로 생성한다.

## 명령 (리포 루트에서 실행)

```bash
npm install --prefix remotion          # 1회 설치
npm run dev --prefix remotion          # 스튜디오 — 브라우저에서 타임라인 편집
npm run render --prefix remotion -- KineticHeadlineAd-9x16 out/test.mp4
npm run render:all --prefix remotion -- data/classic-58.json   # 데이터 피드 일괄 렌더 (생략 시 classic-ads.json)
npm run typecheck --prefix remotion    # 타입 검사
```

> 첫 렌더 시 Remotion이 Chrome Headless Shell을 자동 다운로드한다(수백 MB, 1회).

## 구조

| 경로 | 역할 |
|------|------|
| `src/Root.tsx` | Composition 등록 — 9:16 / 1:1 / 4:5 규격 |
| `src/KineticHeadlineAd.tsx` | 키네틱 헤드라인 광고 템플릿 |
| `src/fonts.ts` | 폰트 로드 — 라틴(Clash·Cabinet·Space Grotesk) + 한글(Pretendard) |
| `data/classic-ads.json` | 변형 데이터 피드 — `ad-proposal` 에이전트 산출물 연결점 |
| `scripts/render-all.mjs` | 데이터 피드 → MP4 일괄 렌더 |
| `public/fonts/` | 폰트 woff2 — 브랜드 라틴 3종 + Pretendard(한글) |
| `out/` | 렌더 결과 (git 제외). 최종본은 `../public/ads/{course}-{기수}/`로 이동 |

## 데이터 피드 형식

```json
{
  "id": "classic-01-pain",
  "angle": "고통 포인트",
  "headline": "헤드라인 (\\n 으로 줄바꿈)",
  "subheadline": "서브헤드라인 한 문장",
  "cta": "CTA 버튼 텍스트",
  "accent": "#ff3bff"
}
```

`ad-proposal` 에이전트의 앵글·헤드라인·CTA 산출물을 이 형식으로 옮기면
같은 템플릿으로 변형 N개를 일괄 렌더할 수 있다.

## 메모

- **인라인 스타일은 의도적**이다 — Remotion 표준 방식이며, 루트 프로젝트의
  Tailwind/인라인 스타일 금지 규칙은 이 하위 프로젝트에 적용되지 않는다.
- 새 광고 개념은 `src/`에 템플릿을 추가하고 `Root.tsx`에 Composition을 등록한다.
