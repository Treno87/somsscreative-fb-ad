# 클래식 66기 — 재현 불가 자산 보관소

> 기록일: 2026-09-08
> 이 폴더는 `assets/raw/` 안에 있지만 **카메라 원본이 아니라 잘린 클립**이다.
> 원본이나 생성 절차가 없어서, 지우면 되살릴 수 없어 예외로 git 추적한다.

## 왜 여기 있나

66기 A/B 영상(`ad-projects/classic-66기-hf-doc`, `-hf-split`)이 쓰는 mp4 3개는
`.gitignore:92`(`ad-projects/**/*.mp4`)에 걸려 커밋되지 않는다.
그 상태로 다른 컴퓨터에서 clone 하면 **HTML만 있고 영상이 없는 프로젝트**가 된다.
3개 합쳐 5.1MB로 작으므로 `.gitignore` 예외를 두어 추적한다.

## 목록

| 파일 | 크기(B) | sha256 | 재현 가능? |
|---|---:|---|---|
| `clip3.mp4` | 2,456,578 | `ecf00213af7b96f7556af5377a365ffa8a6ac4dd7c41f54efe5c118fcace76f1` | ❌ 불가 |
| `s2-student-a.mp4` | 2,011,875 | `116b3acd6448a20a2239bbde18b65b8f405b842d265fe036d15649e330e80f40` | ❌ 불가 |
| `s3-instructor.mp4` | 647,585 | `2094450d56773ad60e39d256f60a80aa14965ea70009bbe8af1bb9ed0a8d15fe` | ⚠️ 로컬에서만 |

### 재현 가능 여부 근거

- **`clip3.mp4`, `s2-student-a.mp4`** — `assets/raw/` 어디에도 대응 원본이 없고,
  `ad-projects/classic-66기-hf/make-clips.sh`도 이 둘을 만들지 않는다.
  출처는 65기 촬영분 재사용(`BRIEF.md:39-40`)이나 어느 원본에서 잘렸는지 기록이 없다.
- **`s3-instructor.mp4`** — `make-clips.sh`가 `assets/raw/classic-65기/P1029850.MOV`(95MB)에서
  생성한다. 그러나 그 원본은 git 미추적이라 **새 clone에서는 재생성 불가**다.
  또한 `assets/raw/classic-65기/s3-instructor.mp4`(1,499,728B)와는 다른 파일이다.

## 사용처

세 파일 모두 아래 5곳에 해시 동일 복사본으로 존재한다 (2026-09-08 확인).

```
ad-projects/classic-65기-hf/video/
ad-projects/classic-66기-hf/video/
ad-projects/classic-66기-hf-doc/assets/     ← 현행 A/B (doc 안)
ad-projects/classic-66기-hf-split/assets/   ← 현행 A/B (split 안)
public/hf66/video/                          ← 2026-09-08 중복 제거로 삭제됨
```

`instructor.png`(970,141B)는 `.gitignore` 대상이 아니라 프로젝트 폴더에서 정상 추적된다.

## 주의

- 컴포지션이 이 폴더를 직접 참조하지 않는다 (`CLAUDE.md` 규약). 프로젝트 폴더의 사본을 쓴다.
- 출처가 밝혀지면 `courses/classic/campaigns/66기-assets.md`에 옮겨 적고 이 문서는 정리한다.
