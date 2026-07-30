# assets/raw — 카메라 원본 보관소

촬영 원본(MOV·MP4·대용량 이미지)을 코스·기수별로 둔다. **git은 이 폴더를 추적하지 않는다**
(`.gitignore` — 이 README만 예외). 원본이 저장소에 커밋되면 GitHub 100MB 제한에 걸려 push가 막힌다.

```
assets/raw/{course}-{기수}/   예: classic-65기/
assets/raw/misc/              코스·용도 불명 (분류 전 임시)
assets/raw/_dup-검토/          중복·고아로 판정돼 격리한 파일 (일정 기간 후 삭제)
```

## 컴포지션은 이 폴더를 직접 참조하지 않는다

HyperFrames는 자산 경로에 `../`(프로젝트 밖)를 금지한다 — 린트 에러
`invalid_parent_traversal_in_asset_path`. 그래서 영상 클립은 이렇게 흐른다:

```
assets/raw/{course}-{기수}/원본.MOV
        │  make-clips.sh (ffmpeg로 필요한 구간만 잘라 경량화)
        ▼
ad-projects/{course}-{기수}-hf/video/씬이름.mp4   ← 컴포지션이 참조하는 것
```

`video/` 클립도 git 미추적이다. **재현 근거는 각 프로젝트의 `make-clips.sh`** — 원본과 이
스크립트만 있으면 언제든 다시 만들 수 있다. 4K 원본을 컴포지션이 직접 참조하면 렌더가 느리고,
원본을 옮기는 순간 깨진다.

전체 규약: `docs/ad-asset-organization.md`
