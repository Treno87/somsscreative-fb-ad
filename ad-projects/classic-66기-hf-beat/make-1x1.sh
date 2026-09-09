#!/usr/bin/env bash
# index.html(9:16) → index-1x1.html(1:1) 생성.
#
# 씬 구성·타임라인·카피(= <body>)는 9:16 과 **완전히 동일**하다.
# 다르게 가는 건 <style> 뿐이라, 이 스크립트가 styles/square.css 를 끼워 넣어 만든다.
# 카피나 연출을 바꿀 때는 index.html 만 고치고 이 스크립트를 다시 돌린다.
#
# 1:1 을 중앙 크롭으로 만들면 안 된다 — 상단 배지·하단 CTA 가 잘린다.
# (docs/video-hyperframe.md §5)
#
# 파일을 compositions/ 아래 두지 않는 이유: 린트가 자산 경로를 compositions/ 기준으로
# 재작성해 video/·fonts/ 를 못 찾고 missing_local_asset 에러를 낸다. 루트에 둔다.
#
# 사용법: ./make-1x1.sh   →  index-1x1.html
#         npx hyperframes render -c index-1x1.html -o renders/1x1.mp4
set -euo pipefail
cd "$(dirname "$0")"
[ -f styles/square.css ] || { echo "styles/square.css 없음"; exit 1; }

python3 - <<'PY'
import io, re
src = io.open("index.html", encoding="utf-8").read()
css = io.open("styles/square.css", encoding="utf-8").read()

# <style> 안쪽을 square.css 로 통째로 교체
out = re.sub(r"(?s)(<style>\n).*?(\n    </style>)", lambda m: m.group(1) + css.rstrip("\n") + m.group(2), src, count=1)
assert out != src, "<style> 블록을 못 찾았다"

out = out.replace('data-resolution="portrait"', 'data-resolution="square"')
out = out.replace('<meta name="viewport" content="width=1080, height=1920">',
                  '<meta name="viewport" content="width=1080, height=1080">')
out = out.replace('data-width="1080" data-height="1920"', 'data-width="1080" data-height="1080"')

io.open("index-1x1.html", "w", encoding="utf-8").write(out)
print("생성: index-1x1.html")
PY
