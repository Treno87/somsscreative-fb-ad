# _template-hf — Hyperframe 영상 스타터

새 Hyperframe 광고 영상 프로젝트의 **복사 시작점**. 프리셋 시스템·공용 컴포넌트·중앙 자산
배선이 이미 들어 있어, 매번 처음부터 짜지 않아도 된다.

## 새 프로젝트 시작하기

```bash
# 1) 이 폴더를 새 프로젝트로 복사
cp -r ad-projects/_template-hf "ad-projects/{course}-{기수}-hf"
cd "ad-projects/{course}-{기수}-hf"

# 2) meta.json 의 id/name 을 프로젝트명으로 수정
```

3. **프리셋 고르기** — `ad-projects/_presets/`의 `showcase.html`들을 브라우저로 열어 룩을 고른다
   (editorial-dark / ivory-premium / magenta-block / split-bold).
4. 고른 프리셋 `FRAME.md`의 `colors`·`typography` 값을 `index.html`의 `:root` 슬롯에 붙여넣는다.
5. `courses/{course}/campaigns/{기수}-story-plan.md`의 씬대로 씬을 추가한다.
   공용 컴포넌트(`.eyebrow`·`.badge`·`.headline`·`.card`·`.info-list`·`.cta`)를 재사용.
6. 타이밍은 하단 GSAP 마스터 타임라인에 절대초로.

## 만들기 → 배달

```bash
npm run dev        # 백그라운드 프리뷰
npm run check      # 변경 후 항상
npm run render     # 본편 MP4 → renders/
./build-final.sh   # 아웃트로 + BGM 합성 → {프로젝트}-reels.mp4
./make-feed-sizes.sh   # 4:5 파생
```
확정본은 `public/ads/{course}/{기수}/v{NN}/video/`로 복사 (규약: `docs/ad-asset-organization.md`).

## 들어있는 것

| 파일 | 역할 |
|------|------|
| `index.html` | 토큰 슬롯 + 공용 컴포넌트 + GSAP 마스터 타임라인 골격 + 예시 씬 2개 |
| `AGENTS.md` / `CLAUDE.md` | 프레임워크 규칙 (이 레포 관행 반영) |
| `build-final.sh` | 아웃트로(`remotion/public/brand/`) + BGM(`remotion/public/audio/`) 합성 |
| `make-feed-sizes.sh` | 9:16 → 4:5 파생 |
| `fonts/PretendardVariable.woff2` | 브랜드 폰트 (자립형) |
| `hyperframes.json`·`package.json`·`meta.json` | Hyperframe CLI 설정 |

> 프리셋을 새로 만들려면: `ad-projects/_presets/README.md`의 "새 프리셋 추가하기(~10분)".
