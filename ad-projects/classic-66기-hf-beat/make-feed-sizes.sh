#!/usr/bin/env bash
# 9:16 본편 → 4:5(피드) 파생. 중앙 세로 크롭이라 재렌더가 필요 없다.
#
#   1080x1920 에서 y 285~1635 만 남긴다 → 1080x1350
#   그래서 컴포지션의 모든 텍스트는 y 330~1580 안에 있어야 한다 (45px 여유).
#
# 1:1 은 여기서 만들지 않는다 — 중앙 크롭하면 상단 배지·하단 CTA 가 잘린다.
# 전용 레이아웃(index-1x1.html)을 따로 렌더한다. docs/video-hyperframe.md 참고.
#
# 사용법: ./make-feed-sizes.sh [소스mp4]
set -euo pipefail
cd "$(dirname "$0")"

SRC="${1:-$(ls -t renders/*.mp4 | head -1)}"
[ -f "$SRC" ] || { echo "소스 없음: $SRC"; exit 1; }
OUT="${SRC%.mp4}-4x5.mp4"

ffmpeg -y -hide_banner -loglevel error -i "$SRC" \
  -vf "crop=1080:1350:0:285" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a copy "$OUT"

echo "생성: $OUT"
ffprobe -v error -show_entries stream=width,height -of csv=p=0 "$OUT" | head -1
