---
description: 테스트를 돌리고 전부 통과하면 한 번에 commit + push
argument-hint: [커밋 메시지 제목(선택)]
allowed-tools: Bash(npm test:*), Bash(npm run lint:*), Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git rev-parse:*), Bash(git branch:*), Bash(git log:*)
---

아래 절차를 순서대로 수행한다. **한 단계라도 실패하면 즉시 중단하고 commit/push 하지 않는다.**

## 1. 테스트

- `npm test` 를 실행한다.
- 하나라도 실패하면 → **여기서 중단**. 실패한 테스트 출력만 간결히 사용자에게 보여주고, commit·push는 절대 하지 않는다.

## 2. 변경 확인

- 테스트가 전부 통과하면 `git status`와 `git diff --stat` 로 변경 내용을 확인한다.
- 커밋할 변경이 없으면 그 사실을 알리고 종료한다 (빈 커밋 만들지 않는다).

## 3. 커밋 + 푸시 (한 번에)

- `git add -A` 로 스테이징한다.
- 변경 내용을 요약한 commit 메시지로 커밋한다.
  - `$ARGUMENTS` 가 주어지면 그것을 제목(첫 줄)으로 쓴다. 없으면 변경 내용을 보고 적절한 제목을 직접 작성한다 (한국어, 명령형, 50자 이내).
  - 메시지 **마지막 줄**에 반드시 다음을 포함한다:

    ```
    Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
    ```
- `git push` 로 현재 브랜치를 원격에 푸시한다. upstream이 없으면 `git push -u origin $(git rev-parse --abbrev-ref HEAD)`.

## 4. 보고

- 커밋 해시(짧은 형식)와 푸시된 브랜치/원격을 한 줄로 보고한다.

> 참고: 이 커맨드는 **현재 체크아웃된 브랜치**를 그대로 푸시한다. `main`에서 실행하면 main에 바로 올라간다 — 보호가 필요하면 실행 전 작업 브랜치로 전환할 것.
