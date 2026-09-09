#!/usr/bin/env bash
# 카메라 원본(assets/raw/) → 풀블리드 세로 컷(video/).
#
# 원본 촬영본은 6개뿐이다. 한 촬영본을 시간만 달리해 여러 번 자르면 파일은 달라도
# 화면에는 "같은 장면이 또 나온다"로 읽힌다. 그래서 4K(2160x3840)를 크롭해
# **화각이 다른 샷**을 만들고, 각 샷을 영상에서 딱 한 번만 쓴다.
#
# 사용법: ./make-clips.sh
set -euo pipefail
cd "$(dirname "$0")"

RAW="../../assets/raw/classic-65기"
FF="${FFMPEG:-$(command -v ffmpeg || true)}"
[ -z "$FF" ] && { echo "ffmpeg 없음"; exit 1; }
[ -d "$RAW" ] || { echo "원본 폴더 없음: $RAW"; exit 1; }

# shot <원본> <시작> <길이> <크롭|none> <출력>
shot() {
  [ -f "$1" ] || { echo "원본 없음: $1"; exit 1; }
  local vf="scale=1080:1920,fps=30,setsar=1"
  [ "$4" != "none" ] && vf="$4,scale=1080:1920,fps=30,setsar=1"
  "$FF" -y -hide_banner -loglevel error -ss "$2" -i "$1" -t "$3" \
    -vf "$vf" -an -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p "$5"
  echo "생성: $5"
}
# 가로 원본은 9:16 중앙 크롭이 먼저다
land() {
  [ -f "$1" ] || { echo "원본 없음: $1"; exit 1; }
  "$FF" -y -hide_banner -loglevel error -ss "$2" -i "$1" -t "$3" \
    -vf "crop=ih*9/16:ih,scale=1080:1920,fps=30,setsar=1" -an \
    -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p "$4"
  echo "생성: $4"
}

# 4K 세로 원본(2160x3840) → 중앙 크롭으로 화각을 만든다. 1080 출력이라 2배까지 무손실
WIDE="none"                      # 전체 화각
MID="crop=1512:2688:324:576"     # 1.43배 — 인물 중심
TIGHT="crop=1296:2304:432:768"   # 1.67배 — 손·도구 중심

# ── S2 「같은 커트를 두 번 해도」 — 광고주 지정: 살롱 커트 + 마네킹 클로즈업 ──
land "$RAW/0729(1).mp4"   0.20 2.10 video/a-salon-cut.mp4
shot "$RAW/P1029866.MOV"  1.30 2.10 "$WIDE"  video/b-hand-close.mp4

# ── S3 「커트를 배운 게 아니라 형태를 외웠기」 ──
shot "$RAW/IMG_9299.MOV"  0.20 2.80 "$WIDE"  video/c-room-wide.mp4
shot "$RAW/P1029850.MOV"  0.20 2.80 "$WIDE"  video/d-solo.mp4

# ── S5 커리큘럼 ──
shot "$RAW/IMG_9299.MOV"  3.60 2.50 "$MID"   video/e-room-mid.mp4
shot "$RAW/P1029866.MOV"  4.20 2.50 "$MID"   video/f-hand-mid.mp4

# ── S6 강사 ──
shot "$RAW/IMG_9299.MOV"  7.20 2.10 "$TIGHT" video/g-room-tight.mp4
land "$RAW/0729(2).mp4"   0.03 2.10 video/h-salon-talk.mp4

ls -lh video/*.mp4
