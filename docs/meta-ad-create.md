# Meta 광고 생성(쓰기) 모듈

구조화된 스펙 파일 하나로 **캠페인 → 광고세트 → 크리에이티브 → 광고**를 생성한다.
읽기 동기화(`docs/meta-api-sync.md`)와 같은 시스템 유저 토큰을 쓰되 **`ads_management` 권한**이 필요하다.

## 안전 규약

- 생성되는 모든 엔티티는 **PAUSED**(코드 하드코딩, 스펙으로 override 불가). 사람이 Ads Manager에서 검토 후 직접 ON 해야 광고비가 집행된다.
- 기본 단계 `plan` 은 **dry-run**(쓰기 0). 실제 생성은 명시적 `--phase`.
- 크리에이티브는 **실미리보기 확인 후** 광고를 만든다(휴먼인더루프).
- `/api/meta/create` 는 `CRON_SECRET` 으로 보호된다.

## 환경변수 (`.env.local`)

읽기용 값에 더해 쓰기 전용:

```bash
META_PAGE_ID=930595100284609     # creative object_story_spec.page_id (필수)
META_INSTAGRAM_ACTOR_ID=          # 선택 (IG 노출)
```

## 1. 스펙 작성

`courses/_templates/adspec.template.mjs` 를 `courses/{course}/campaigns/{기수}-adspec.mjs` 로 복사해 채운다.
node 가 바로 import 하는 `.mjs`(평범한 객체) — 타입 힌트는 JSDoc `@type {import("…/write/adspec").AdSpec}`.

- 예산: 원(KRW) 정수. `dailyBudgetKRW` / `lifetimeBudgetKRW` 중 하나.
- 전환 최적화(`OFFSITE_CONVERSIONS`)는 `promotedObject.pixelId` 필요.
- 채용·인턴 광고는 `campaign.specialAdCategories: ["EMPLOYMENT"]` — 연령 18~65 고정·성별 제한 불가.
- 크리에이티브 `type`: `image` | `video` | `carousel`(카드 2장 이상).

## 2. 단계 실행 (휴먼인더루프)

실행 중인 dev 서버가 필요. `CRON_SECRET` 환경변수 설정 후:

```bash
SPEC=courses/persona-design/campaigns/1기-adspec.mjs

node scripts/meta-create.mjs --spec=$SPEC --phase=plan       # 검증 + payload 출력 (쓰기 0)
node scripts/meta-create.mjs --spec=$SPEC --phase=structure  # 캠페인+광고세트 생성 (PAUSED)
node scripts/meta-create.mjs --spec=$SPEC --phase=creative   # 자산 업로드+크리에이티브+미리보기 → 사람 확인
node scripts/meta-create.mjs --spec=$SPEC --phase=ad         # 광고 생성 (PAUSED)
```

각 단계는 생성된 id 를 `analytics/store/adbuild-<slug>.json`(gitignore) 에 저장하므로,
실패하거나 중단해도 같은 명령으로 이어서 재개된다(이미 생성된 엔티티는 건너뜀).

## 3. 마무리

- 생성물은 모두 PAUSED → Ads Manager 에서 검토 후 수동 ON, 또는 삭제.
- 읽기 동기화(`POST /api/meta/sync`)를 돌리면 새 엔티티가 대시보드에 잡힌다.

## 아키텍처

```
lib/dashboard/meta/write/
├── adspec.ts        → AdSpec 인터페이스 + validateSpec() (순수·테스트됨)
├── payloads.ts      → build{Campaign,AdSet,Creative,Ad}Payload() 순수 빌더 (테스트됨)
├── writeClient.ts   → MetaWriteClient (POST/업로드/미리보기, fetchFn 주입)
└── orchestrate.ts   → 단계 실행 + 빌드상태 영속화

app/api/meta/create/route.ts  → POST 단계 실행 (CRON_SECRET 보호)
scripts/meta-create.mjs       → 단계형 CLI
```

매퍼/빌더/클라이언트는 목 데이터로 단위 테스트됨
(`__tests__/dashboard/metaWritePayloads.test.ts`, `metaWriteClient.test.ts`).
