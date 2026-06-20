#!/usr/bin/env bash
# 1:1(1080x1080) 최종 릴스 빌드: index-1x1.html 본편 + 로고 아웃트로 + BGM.
# build-final.sh(9:16)의 1:1 변형. 아웃트로(16:9)는 가로 1080 맞춰 세로 중앙 레터박스.
#   본편: renders/persona-1x1-main.mp4 (인자로 다른 본편 지정 가능)
set -euo pipefail
cd "$(dirname "$0")"

FF="${FFMPEG:-}"
[ -z "$FF" ] && [ -x ../.localbin/ffmpeg-full ] && FF="$(cd .. && pwd)/.localbin/ffmpeg-full"
[ -z "$FF" ] && FF="$(command -v ffmpeg || true)"
[ -z "$FF" ] && { echo "ffmpeg 없음"; exit 1; }
FILTERS="$("$FF" -hide_banner -filters 2>/dev/null || true)"
case "$FILTERS" in *" pad "*) : ;; *) echo "ffmpeg 에 pad 필터 없음(최소 빌드). 전체 빌드 필요: $FF"; exit 1 ;; esac

MAIN="${1:-renders/persona-1x1-main.mp4}"
OUTRO="somss-outro.mp4"
BGM="persona-bgm.mp3"
OUT="persona-design-1기-reels-1x1.mp4"
DUR=29.6
TOTAL=38.54
BGM_VOL=0.85

echo "ffmpeg : $FF"
echo "본편   : $MAIN"
echo "출력   : $OUT"

FILTER="[0:v]trim=0:${DUR},setpts=PTS-STARTPTS,scale=1080:1080,fps=30,setsar=1[mv];\
[2:v]scale=1080:-2,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=black,fps=30,setsar=1[ov];\
[2:a]aformat=sample_rates=48000:channel_layouts=stereo[oa];\
[mv][1:a][ov][oa]concat=n=2:v=1:a=1[v][seq];\
[3:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:${TOTAL},asetpts=PTS-STARTPTS,volume=${BGM_VOL},afade=t=in:st=0:d=1.5,afade=t=out:st=$(awk "BEGIN{print ${TOTAL}-2.5}"):d=2.5[bgm];\
[seq][bgm]amix=inputs=2:normalize=0:duration=first:dropout_transition=0,alimiter=limit=0.95[a]"

"$FF" -y -hide_banner -loglevel error \
  -i "$MAIN" \
  -f lavfi -t "$DUR" -i anullsrc=r=48000:cl=stereo \
  -i "$OUTRO" \
  -i "$BGM" \
  -filter_complex "$FILTER" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart \
  "$OUT"

echo "완료: $OUT"
