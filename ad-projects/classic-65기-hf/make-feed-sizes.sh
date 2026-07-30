#!/usr/bin/env bash
# 9:16 최종본에서 메타 피드 사이즈 파생.
#   4:5 (1080x1350) — 세로 중앙 크롭. 9:16을 안전영역(y 285~1635)에 맞춰 설계했으면 텍스트 무손실.
#   1:1 (1080x1080) — 중앙 크롭 시 아이브라우/하단 텍스트 잘림 → 전용 레이아웃(index-1x1.html) 권장.
set -euo pipefail
cd "$(dirname "$0")"

FF="${FFMPEG:-}"
[ -z "$FF" ] && [ -x ../.localbin/ffmpeg-full ] && FF="$(cd .. && pwd)/.localbin/ffmpeg-full"
[ -z "$FF" ] && FF="$(command -v ffmpeg || true)"
[ -z "$FF" ] && { echo "ffmpeg 없음"; exit 1; }

PROJECT="$(basename "$(pwd)")"
SRC="${PROJECT}-reels.mp4"
[ -f "$SRC" ] || { echo "본편 최종본 없음: $SRC (먼저 ./build-final.sh)"; exit 1; }
enc() { "$FF" -y -hide_banner -loglevel error -i "$SRC" -vf "$1" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart "$2"; echo "생성: $2"; }

enc "crop=1080:1350:0:285" "${PROJECT}-reels-4x5.mp4"
# 주의: 1:1 은 중앙 크롭하면 텍스트가 잘린다. 1:1 은 전용 레이아웃(index-1x1.html) 렌더본으로 별도 생성.
