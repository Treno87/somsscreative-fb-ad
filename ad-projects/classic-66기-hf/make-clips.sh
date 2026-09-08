#!/usr/bin/env bash
# 카메라 원본(assets/raw/) → 컴포지션이 참조하는 경량 클립(video/) 재생성.
#
# 원본도 클립도 git 미추적이라, 이 스크립트가 클립의 유일한 재현 근거다.
# 컴포지션이 4K 원본을 data-media-start 로 잘라 쓰면 렌더가 느리고 원본을 옮기는 순간 깨진다.
# 그래서 필요한 구간만 미리 잘라 1080p로 낮춰 둔다.
#
# 사용법: ./make-clips.sh
set -euo pipefail
cd "$(dirname "$0")"

RAW="../../assets/raw/classic-65기"          # ad-projects/{proj}/ → 리포 루트 → assets/raw
FF="${FFMPEG:-$(command -v ffmpeg || true)}"
[ -z "$FF" ] && { echo "ffmpeg 없음"; exit 1; }
[ -d "$RAW" ] || { echo "원본 폴더 없음: $RAW"; exit 1; }

# enc <원본> <시작초> <길이초> <출력>  — 세로 1080 기준으로 낮추고 무음 처리
enc() {
  [ -f "$1" ] || { echo "원본 없음: $1"; exit 1; }
  "$FF" -y -hide_banner -loglevel error -ss "$2" -i "$1" -t "$3" \
    -vf "scale=-2:1080,fps=30" -an \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p "$4"
  echo "생성: $4"
}

# 씬별 사용 구간 — index.html 의 data-duration 에 여유 0.5초를 더한 값
enc "$RAW/P1029850.MOV" 0.3 3.0 video/s3-instructor.mp4   # S3 강사 시연 (data-duration 2.5)
enc "$RAW/IMG_9299.MOV" 3.0 3.3 video/s4-student-b.mp4    # S4 수강생 실습 (data-duration 2.8)

ls -lh video/*.mp4
