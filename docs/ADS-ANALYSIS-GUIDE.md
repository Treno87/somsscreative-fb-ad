# 광고 분석 스킬 가이드

> 소옴스크리에이티브 Meta Ads 분석 워크플로 및 스킬 사용 매뉴얼

---

## 사용 가능한 광고 분석 스킬

### 종합 분석

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| 전체 광고 감사 | `/ads-audit` | Google, Meta, LinkedIn, TikTok, Microsoft 전 플랫폼 병렬 분석. 서브에이전트 5개가 동시에 각 플랫폼을 검토하며 가장 포괄적인 결과 제공 |
| 전략 플래닝 | `/ads-plan` | 플랫폼 선택, 캠페인 구조, 예산 배분 전략 수립. 신규 캠페인 런칭 전 사용 |

### Meta(Facebook/Instagram) 전문

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| Meta 심화 분석 | `/ads-meta` | Pixel/CAPI 상태, EMQ 점수, 소재 다양성, 계정 구조, 오디언스 타겟팅 46개 항목 감사. Health Score 산출 |

### 소재(크리에이티브) 분석

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| 크리에이티브 감사 | `/ads-creative` | 전 플랫폼 광고 소재 품질 감사. 포맷 다양성, 소재 피로도(CTR 20% 이상 하락), 플랫폼별 스펙 준수 여부 평가 |

### 예산 및 입찰

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| 예산·입찰 감사 | `/ads-budget` | 예산 배분, 입찰 전략, 학습 단계 건강도, 오디언스 타겟팅, 캠페인 구조 감사 (LinkedIn, TikTok, Microsoft) |

### 랜딩페이지

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| 랜딩페이지 평가 | `/ads-landing` | 광고↔랜딩 메시지 일치도, 페이지 속도, 모바일 경험, 신뢰 신호, CTA 품질 평가. A/B 테스트 근거 보강에 특히 유용 |

### 경쟁사 분석

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| 경쟁사 광고 분석 | `/ads-competitor` | Google, Meta, LinkedIn, TikTok, Microsoft 전 플랫폼 경쟁사 광고 카피·소재·전략 분석 |

### 플랫폼별 심화

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| Google Ads | `/ads-google` | Search, PMax, Display, YouTube, Demand Gen 캠페인 74개 항목 분석 |
| YouTube Ads | `/ads-youtube` | 동영상 광고 캠페인, 크리에이티브, 오디언스, 측정 분석 |
| LinkedIn Ads | `/ads-linkedin` | B2B 광고 25개 항목 — 기술 설정, 오디언스, 소재, 리드 품질 |
| TikTok Ads | `/ads-tiktok` | 크리에이티브, 추적, 입찰, 캠페인 구조, TikTok Shop 25개 항목 |
| Microsoft Ads | `/ads-microsoft` | Search, PMax, Audience Network, Copilot 통합 20개 항목 |

### 보고서 시각화

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| 히트맵 보고서 | `/heatmap-report` | 히트맵 CSV 데이터(attention/click/scroll) 분석 → HTML/PDF 시각적 보고서 생성 |
| 캔버스 디자인 | `/canvas-design` | 전문적인 차트, 인포그래픽, 시각 자료를 PNG/PDF로 생성 |
| PDF 생성 | `/pdf` | 분석 결과를 전문적인 PDF 문서로 패키징 |
| 프레젠테이션 | `/pptx` | 고객 제출용 PowerPoint 보고서 생성 |

---

## 전문 보고서 생성 워크플로

### 기본 워크플로 (Meta 캠페인 기준)

```
STEP 1 — 데이터 준비
├── XLSX 파일 (최소 2~4주치, 캠페인/광고세트/광고 레벨)
├── Events Manager 스크린샷 (픽셀 상태, EMQ 점수)
└── 광고 소재 이미지 (크리에이티브 분석용)

STEP 2 — 데이터 분석
├── /ads-meta        → Pixel/CAPI, 소재, 계정구조, 오디언스 46개 항목
├── /ads-creative    → 소재 품질 심화 분석
├── /ads-budget      → 예산·입찰 전략 평가
└── /ads-landing     → 랜딩페이지 A/B 비교 근거 보강

STEP 3 — 보고서 생성
├── /heatmap-report  → 시각적 HTML/PDF 보고서
├── /canvas-design   → 차트, 인포그래픽
└── /pptx 또는 /pdf  → 고객 제출용 최종 문서
```

### 권장 사용 조합

#### 빠른 주간 점검 (Weekly Check)
```
/ads-meta [XLSX 파일]
```

#### 월간 종합 보고서 (Monthly Report)
```
/ads-meta [XLSX] + /ads-creative [소재 데이터] + /ads-landing [랜딩 URL]
→ /pdf 또는 /pptx 로 최종 패키징
```

#### 캠페인 런칭 전 감사 (Pre-launch Audit)
```
/ads-plan → /ads-audit → /ads-landing
```

#### 전체 계정 감사 (Full Account Audit)
```
/ads-audit (전 플랫폼 병렬) → /ads-competitor → /pptx
```

---

## 보고서 품질을 높이기 위한 필수 데이터

### Meta Ads 기준

| 데이터 | 형식 | 용도 | 없을 경우 |
|--------|------|------|-----------|
| 캠페인/광고세트/광고 레벨 XLSX | 파일 첨부 | 성과 수치 분석 | 분석 불가 |
| **최소 2~4주치 데이터** | XLSX | 통계 신뢰도 | 참고치만 제공 |
| Events Manager 스크린샷 | 이미지 | Pixel/CAPI/EMQ 평가 | 픽셀 섹션 스킵 |
| 광고 소재 이미지 | 이미지 | 크리에이티브 품질 평가 | 수치 기반만 분석 |
| 타겟 오디언스 설정 스크린샷 | 이미지 | 오디언스 겹침 평가 | 일부 항목 스킵 |

### 데이터 기간별 신뢰도

| 기간 | 신뢰도 | 권장 용도 |
|------|--------|-----------|
| 1~7일 | 낮음 ⚠ | 초기 트렌드 파악만 |
| 2~4주 | 보통 ✅ | 일반 성과 분석 |
| 1~3개월 | 높음 ✅✅ | 전략 의사결정 |
| 3개월+ | 매우 높음 ✅✅✅ | 고객 제출 공식 보고서 |

---

## 현재 계정 상태 요약 (2026-03-24 기준)

> 최근 분석 결과 스냅샷 — `META-ADS-REPORT.md` 참조

- **Health Score**: 62/100
- **A/B 결론**: `classic_landing` (B안) CPL 50% 절감 확인 → 예산 이동 필요
- **최우수 소재**: `classic-landing_헤어타겟20260204_1P` (CPL 5,565원)
- **즉시 조치**: 비활성 캠페인(`망했어요`) 삭제, 소재 수 확충 (현재 1~2개 → 5개+)

---

*최종 업데이트: 2026-03-24*
