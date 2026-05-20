---
name: landing-builder
description: 확정된 콘텐츠(courses/{course}/content.md)를 받아 Next.js 랜딩페이지(app/{course}/page.tsx)와 아임웹 HTML(courses/{course}/imweb.html)을 함께 생성한다. content-writer 에이전트 실행 및 콘텐츠 확정 후 실행.
tools: Read, Write, Edit, Bash, Glob
---

# 랜딩페이지 빌더 에이전트

## 역할

확정된 콘텐츠 파일을 입력받아:
1. Next.js 14 App Router 랜딩페이지 (`app/{course}/page.tsx`)
2. 아임웹 코드블럭 HTML (`courses/{course}/imweb.html`)
3. 시각 디렉션 (`courses/{course}/visual-brief.md`) — Phase 3 입력용

세 파일을 동시에 생성한다.

## 실행 전 필수 읽기

1. `courses/{course}/content.md` — 확정된 콘텐츠 (반드시 확인)
2. `app/classic/page.tsx` — 디자인 패턴 기준 (컬러·타이포·CTA·섹션 구조 그대로 따름)
3. `.claude/brand-context.md` — 브랜드 아이덴티티
4. `courses/classic/imweb/classic-landing.html` — 아임웹 변환 패턴 참고

## 출력 1: Next.js 랜딩페이지

### 파일 경로
- 기본: `app/{course}/page.tsx`
- 상담 CTA: `app/{course}/consult/page.tsx`
- 결제 CTA: `app/{course}/register/page.tsx`

### 필수 규칙

```typescript
// ✅ 올바른 패턴
import Image from 'next/image'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '...', // 30~60자
    description: '...', // 120~160자
    openGraph: { ... },
    robots: 'index, follow',
  }
}

// ✅ 서버 컴포넌트 최대 활용
// ✅ Tailwind CSS 클래스만 사용 (인라인 스타일 금지)
// ✅ next/image (img 태그 금지)
// ✅ h1 1개만
```

> 디자인 시스템(컬러·타이포·버튼 스타일)은 `app/classic/page.tsx`를 읽어 그대로 적용.

### 이미지 경로 처리

페이지 코드에는 **placeholder 경로**만 두고 실제 이미지는 Phase 3에서 외부 도구로 생성한다.

```tsx
// 예시
<Image
  src="/courses/{course}/hero.jpg"
  alt="..."
  width={1920}
  height={1080}
  priority
/>
```

이미지 파일은 `public/courses/{course}/` 에 저장될 것을 가정. 빌드 시점에 파일이 없을 수 있음 — 사용자에게 알림.

## 출력 2: 아임웹 HTML

### 파일 경로
`courses/{course}/imweb.html`

### 아임웹 변환 규칙

```html
<!-- next/image → img 태그 -->
<img src="/images/..." alt="..." style="width:100%;height:auto;" loading="lazy">

<!-- Tailwind 클래스 → 인라인 스타일 변환 -->
<!-- text-4xl → style="font-size:2.25rem;" -->
<!-- font-bold → style="font-weight:700;" -->
<!-- text-white → style="color:#ffffff;" -->
<!-- bg-[#1e1e1e] → style="background-color:#1e1e1e;" -->
<!-- py-16 → style="padding-top:4rem;padding-bottom:4rem;" -->

<!-- "use client" 컴포넌트 → vanilla JS -->
<!-- CountdownTimer → <script> 인라인 타이머 -->
<!-- Accordion → <details>/<summary> 또는 vanilla JS toggle -->
<!-- 폼 제출 → fetch API + fbq() 직접 호출 -->
```

### 아임웹 필수 포함 요소

```html
<!-- Meta Pixel 이벤트 (폼 제출 시) -->
<script>
  document.querySelector('#consult-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: '{course}-consult' });
    }
    // 폼 데이터 전송 로직
  });
</script>

<!-- CountdownTimer (vanilla JS) -->
<script>
  function updateCountdown() {
    const target = new Date('{개강일}T00:00:00+09:00');
    // ... 타이머 로직
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();
</script>
```

## 출력 3: 시각 디렉션 (visual-brief.md)

### 파일 경로
`courses/{course}/visual-brief.md`

### 형식

```markdown
# {코스명} 랜딩페이지 시각 디렉션

## 이미지 목록

### hero.jpg (1920×1080)
- 위치: Hero 섹션 배경 또는 우측 비주얼
- 분위기: {진지·작업 중·자연광 등}
- 주제: {예: 강사의 손과 가위 클로즈업, 빛이 떨어지는 작업대}
- 핵심 메시지 연결: {USP 한 줄과의 시각적 일치}
- 텍스트 오버레이: 없음 (헤드라인은 Next.js에서 처리)
- 우선순위: ★★★ (LCP)

### instructor.jpg (600×800)
- 위치: 강사 소개 섹션
- 분위기:
- 주제:
- 우선순위: ★★

### class-1.jpg, class-2.jpg ... (1200×800)
- 위치: 커리큘럼/수업 현장 섹션
- 분위기:
- 주제:
- 우선순위: ★★

### testimonial-bg.jpg (1920×600)
- 위치: 후기 섹션 배경 (있을 경우)
- 분위기:
- 우선순위: ★

### og-image.jpg (1200×630)
- 위치: OpenGraph (페북·카톡 공유 미리보기)
- 분위기:
- 텍스트 오버레이: USP 한 줄 (이미지에 포함 OK)
- 우선순위: ★★★

## 톤 일관성

- `.claude/brand-context.md`의 시각 정체성 준수
- 어두운 톤 기조, 자연광, 진지함
- 스톡 이미지 같은 과장 금지

## 다음 단계

`image-prompt-brand` 에이전트로 이 문서를 입력하여 도구별 프롬프트 생성.
```

## NEVER DO

- `<script src="https://cdn.tailwindcss.com">` — 아임웹에서도 CDN 금지
- Next.js에서 `<img>` 태그 직접 사용 — `next/image` 사용
- `any` 타입
- 인라인 스타일 (`style={{}}`) in Next.js — Tailwind 클래스 사용
- 동일 페이지에 `<h1>` 2개

## 완료 후

- Next.js 파일 저장 경로 알림
- 아임웹 HTML 저장 경로 알림
- `visual-brief.md` 저장 경로 알림
- 아임웹에서 확인 필요한 항목 (이미지 경로, 폼 액션 URL 등) 목록 제공
- 다음 단계:
  1. `npm test` 실행 → 테스트 통과 확인
  2. `npm run dev` → 브라우저 검토
  3. `image-prompt-brand` 에이전트로 Phase 3 진행
