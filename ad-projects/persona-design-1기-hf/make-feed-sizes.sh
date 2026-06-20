#!/usr/bin/env bash
# 9:16 최종본에서 메타 피드 사이즈 파생.
#   4:5 (1080x1350) — 가로 스케일 없이 세로 중앙 크롭. 9:16을 안전영역(y 285~1635)에
#                     맞춰 설계했으므로 텍스트 무손실. 피드 권장 사이즈.
#   1:1 (1080x1080) — 세로 중앙 크롭(y 420~1500). 아이브라우/하단 텍스트가 잘릴 수 있어
#                     깔끔한 1:1 은 전용 레이아웃 권장. (참고용 크롭만 생성)
set -euo pipefail
cd "$(dirname "$0")"

FF="${FFMPEG:-}"
[ -z "$FF" ] && [ -x ../.localbin/ffmpeg-full ] && FF="$(cd .. && pwd)/.localbin/ffmpeg-full"
[ -z "$FF" ] && FF="$(command -v ffmpeg || true)"
[ -z "$FF" ] && { echo "ffmpeg 없음"; exit 1; }

SRC="persona-design-1기-reels.mp4"
enc() { "$FF" -y -hide_banner -loglevel error -i "$SRC" -vf "$1" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart "$2"; echo "생성: $2"; }

enc "crop=1080:1350:0:285" "persona-design-1기-reels-4x5.mp4"
# 주의: 1:1 은 중앙 크롭하면 아이브라우/하단 텍스트가 잘린다. 1:1 은 전용 레이아웃을
#       build-final-1x1.sh(index-1x1.html 렌더본)로 별도 생성한다. 여기서 크롭 생성 금지.
