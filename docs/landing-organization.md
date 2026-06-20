# 랜딩페이지 폴더 규약

광고 소재(`docs/ad-asset-organization.md`)와 **같은 원칙** — "코스마다 똑같은 자리, 예측 가능하게" — 를 랜딩에도 적용한다.
단, 랜딩은 광고와 달리 **기수·버전 폴더를 쓰지 않는다.** 코스당 **정본 1개**를 in-place로 수정하고, 이력은 git history로 관리한다.

> 기준일 2026-06-20.

---

## 코스별 고정 레이아웃

모든 코스가 동일하다:

```
courses/{course}/
├── imweb.html        ← 랜딩 "단일 정본" (항상 이 경로 — 에이전트·빌드가 여기서 읽는다)
└── landing/          ← 랜딩 부속 일체
      *_apple.html · *_hallmark.html       디자인 변형본
      imweb-preview.html                   로컬 미리보기(빌드 산출)
      imweb-tokens-playground.html         디자인 토큰 플레이그라운드
      build-preview.py · build-*.py        부속 빌드 스크립트
      thankyou.html                        전환 완료 페이지
      THEMES.md                            테마 메모
```

- **정본은 `courses/{course}/imweb.html` 하나** — `landing-builder`·`landing-optimizer` 에이전트, CLAUDE.md, 빌드 스크립트가 모두 이 경로를 본다. 절대 옮기지 않는다.
- **그 외 모든 랜딩 작업 파일은 `landing/` 한 폴더로** 모은다 — 정본이 부속에 묻히지 않게.
- 랜딩 이미지(렌더 자산)는 `public/courses/{course}/` (gitignored).

## 빌드 스크립트 규칙

`landing/`의 빌드 스크립트는 **정본(`../imweb.html` = `courses/{course}/imweb.html`)을 읽기만** 하고, 산출물은 `landing/`에 쓴다. 정본은 절대 수정하지 않는다.

## 왜 버전 폴더가 없나

광고는 "1차 → v2 → v3"로 여러 버전을 동시에 운영·비교하므로 `v{NN}/` 폴더로 나눈다.
랜딩은 라이브가 **항상 하나**(아임웹에 게시된 정본)뿐이라, 버전은 git 커밋 이력으로 충분하다. 과거 디자인을 따로 남기고 싶으면 `landing/`에 변형본으로 둔다(`*_apple.html` 등).

## 레거시 메모

`app/{course}/page.tsx` (Next.js 코스 랜딩 라우트)는 "per-course Next.js 폐지" 방침상 **레거시**다. 실제 미사용이 확인되면 제거 대상.

---

*소옴크리에이티브 · 랜딩페이지 폴더 규약 · 2026-06-20 · 광고 규약: `docs/ad-asset-organization.md`*
