#!/usr/bin/env bash
# 카메라 원본(assets/raw/) → 풀블리드 세로 컷(video/) 재생성.
#
# 기존 66기 스크립트는 scale=-2:1080 이라 세로 4K 원본(2160x3840)이 608x1080 으로 줄었다.
# 이 영상은 클립을 화면 전체에 깔기 때문에 1080x1920 정규격으로 뽑는다.
#
# 사용법: ./make-clips.sh
set -euo pipefail
cd "$(dirname "$0")"

RAW="../../assets/raw/classic-65기"
FF="${FFMPEG:-$(command -v ffmpeg || true)}"
[ -z "$FF" ] && { echo "ffmpeg 없음"; exit 1; }
[ -d "$RAW" ] || { echo "원본 폴더 없음: $RAW"; exit 1; }

# vert <원본> <시작> <길이> <출력>  — 세로 원본을 1080x1920 으로 (크롭 없이 축소)
vert() {
  [ -f "$1" ] || { echo "원본 없음: $1"; exit 1; }
  "$FF" -y -hide_banner -loglevel error -ss "$2" -i "$1" -t "$3" \
    -vf "scale=1080:1920,fps=30,setsar=1" -an \
    -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p "$4"
  echo "생성: $4"
}

# land <원본> <시작> <길이> <출력>  — 가로 원본을 9:16 으로 중앙 크롭 후 1080x1920
land() {
  [ -f "$1" ] || { echo "원본 없음: $1"; exit 1; }
  "$FF" -y -hide_banner -loglevel error -ss "$2" -i "$1" -t "$3" \
    -vf "crop=ih*9/16:ih,scale=1080:1920,fps=30,setsar=1" -an \
    -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p "$4"
  echo "생성: $4"
}

# ── 강의실 시범 (수강생들이 둘러서서 촬영하는 현장) ──
vert "$RAW/IMG_9299.MOV"  0.5 1.6 video/room-a.mp4
vert "$RAW/IMG_9299.MOV"  3.0 1.6 video/room-b.mp4
vert "$RAW/IMG_9299.MOV"  6.0 1.6 video/room-c.mp4
vert "$RAW/IMG_9299.MOV"  9.2 1.6 video/room-d.mp4

# ── 마네킹 클로즈업 · 손동작 ──
vert "$RAW/P1029866.MOV"  0.3 1.6 video/hands-a.mp4
vert "$RAW/P1029866.MOV"  3.0 1.6 video/hands-b.mp4
vert "$RAW/P1029866.MOV"  6.0 1.6 video/hands-c.mp4
vert "$RAW/P1029866.MOV"  9.0 1.6 video/hands-d.mp4

# ── 1인 실습 (측면) ──
vert "$RAW/P1029850.MOV"  0.2 1.6 video/solo-a.mp4
vert "$RAW/P1029850.MOV"  2.6 1.6 video/solo-b.mp4

# ── 살롱 현장 (가로 원본 → 중앙 크롭) ──
land "$RAW/0729(1).mp4"   0.3 1.6 video/salon-a.mp4
land "$RAW/0729(2).mp4"   0.3 1.6 video/salon-b.mp4

ls -lh video/*.mp4
