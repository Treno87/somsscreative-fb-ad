# Meta Marketing API 광고 성과 자동 수집

CSV 수동 다운로드/업로드를 없애고, Facebook/Instagram 광고 계정에서 캠페인·광고세트·광고
성과를 직접 가져온다. 기존 분석·트렌드·AI 진단 로직을 그대로 재사용한다.

## 아키텍처

```
lib/dashboard/meta/
├── config.ts      → env 자격증명 로드 (loadMetaConfig / hasMetaConfig)
├── types.ts       → Graph API 응답 타입
├── client.ts      → 저수준 Graph API 클라이언트 (fetch 주입 가능, 페이지네이션)
├── mappers.ts     → Meta 응답 → CampaignRow/AdSetRow/AdRow (순수 함수 · 테스트됨)
├── dateRange.ts   → lastNDays / previousIsoWeek
└── sync.ts        → 오케스트레이션 → WeekSnapshot[]

lib/dashboard/serverStore.ts   → analytics/store/dashboard.json 영구 저장 (cron용)

app/api/meta/
├── sync/route.ts   → POST 온디맨드 (대시보드 버튼), GET 설정 확인
├── cron/route.ts   → GET 스케줄 수집 (CRON_SECRET 보호)
└── weeks/route.ts  → GET 서버 저장소 조회 (클라이언트 하이드레이션)

scripts/meta-sync.mjs → 시스템 cron 트리거
```

데이터 단위 규약(CSV 파서와 동일): `spend`/`cpm`/예산은 통화 단위 정수(KRW),
`linkCtr`은 소수(0.0394=3.94%), `costPerLead`는 `spend/leads` 재계산.

## 1. Meta 앱 + 토큰 발급 (1회)

1. <https://developers.facebook.com/apps> → **앱 만들기** → 유형 "비즈니스".
2. **Marketing API** 제품 추가.
3. **비즈니스 설정 → 시스템 사용자** 생성 → 광고 계정 자산 할당(권한: 광고 관리 또는 보기).
4. 시스템 사용자 → **토큰 생성** → 권한 `ads_read` 선택 → **장기 토큰** 발급(만료 없음 권장).
5. 광고 계정 ID 확인: 광고 관리자 URL 의 `act_XXXXXXXXXXXX`.

> 토큰은 서버 전용. `NEXT_PUBLIC_` 접두사 절대 금지 — 클라이언트에 노출되면 안 된다.

## 2. 환경변수 (`.env.local`)

```bash
META_ACCESS_TOKEN=EAAB...        # 시스템 유저 장기 토큰
META_AD_ACCOUNT_ID=act_1234567890
META_API_VERSION=v23.0           # 선택
META_CURRENCY_OFFSET=1           # KRW=1, USD 등 2자리 통화=100
CRON_SECRET=아무_긴_랜덤_문자열   # cron 보호
```

입력 후 `npm run dev` 재시작. 설정 여부는 `GET /api/meta/sync` → `{configured:true}` 로 확인.

## 3. 수동 동기화

`/dashboard/upload` 상단 **"Meta에서 동기화"** → 기간 선택 → 버튼. 결과가 localStorage 에
저장되고 overview 로 이동. (CSV 업로드는 폴백으로 유지)

직접 호출:

```bash
curl -X POST localhost:3000/api/meta/sync \
  -H 'Content-Type: application/json' \
  -d '{"days":7}'                       # 또는 {"since":"2026-06-15","until":"2026-06-21"}
```

## 4. 자동 수집 (cron)

서버측 `analytics/store/dashboard.json` 에 쌓이며 사람 개입이 필요 없다.

```bash
# 매주 월요일 09:00 → 직전 ISO 주차(월~일) 수집
0 9 * * 1  cd /home/ken/project/somsscreative-fb-ad && \
  CRON_SECRET=<동일값> node scripts/meta-sync.mjs >> /tmp/meta-sync.log 2>&1
```

엔드포인트 직접 호출:

```bash
curl 'localhost:3000/api/meta/cron' -H 'Authorization: Bearer <CRON_SECRET>'
# 최근 N일: ?days=14
```

Vercel 배포 시 `vercel.json` 의 `crons` 로 `/api/meta/cron` 을 스케줄하면 된다.

## 5. 동작 검증 (자격증명 없이)

매퍼/오케스트레이션은 목 데이터로 테스트된다:

```bash
npx jest metaMappers metaSync
```

## 리드 집계 주의

`actions` 배열에서 `lead → onsite_conversion.lead_grouped → offsite_conversion.fb_pixel_lead …`
우선순위로 첫 매칭 값을 리드로 본다. 계정 전환 설정에 따라 실제 리드 action_type 이 다르면
`lib/dashboard/meta/mappers.ts` 의 `LEAD_ACTION_TYPES` 를 조정한다.
