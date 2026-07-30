#!/usr/bin/env bash
# 최종 릴스 빌드: HyperFrames 본편(무음 9:16) + 공용 로고 아웃트로 + BGM 합성.
#
# 배경: HyperFrames render 는 본편(index.html, 무음 9:16)만 출력한다.
#   여기서 공용 아웃트로를 1080x1920 세로로 변환해 concat 하고 BGM 을 얹는다.
#
# 주의: .localbin/ffmpeg(Remotion 번들)은 pad·setpts·fps 필터가 없는 최소 빌드라 사용 불가.
#   전체 기능 ffmpeg 필요. 우선순위: $FFMPEG > ../.localbin/ffmpeg-full > PATH 의 ffmpeg.
#
# 사용법:  ./build-final.sh [본편_render.mp4]
#   인자 생략 시 renders/ 의 최신 mp4 를 본편으로 사용.
set -euo pipefail
cd "$(dirname "$0")"

# ── 공용 브랜드 자산 (중앙 위치 — 프로젝트마다 복제하지 않는다) ──────────────
REPO="../.."                                    # ad-projects/{proj}/ → 리포 루트
OUTRO="$REPO/remotion/public/brand/somss-outro-1080.mp4"
BGM="$REPO/remotion/public/audio/paulyudin-background-background-music-574010.mp3"   # 코스에 맞는 BGM 으로 교체
# ─────────────────────────────────────────────────────────────────────────────

PROJECT="$(basename "$(pwd)")"
OUT="${PROJECT}-reels.mp4"
DUR=34.5       # 본편 컷 지점(CTA 풀 노출 직후 → 아웃트로로 전환). 본편 길이에 맞춰 조절.
TOTAL=43.46    # DUR + 아웃트로(8.96s)
BGM_VOL=0.85   # BGM 볼륨(0dBFS 소스는 amix 후 alimiter 로 클리핑 방지)

FF="${FFMPEG:-}"
[ -z "$FF" ] && [ -x ../.localbin/ffmpeg-full ] && FF="$(cd .. && pwd)/.localbin/ffmpeg-full"
[ -z "$FF" ] && FF="$(command -v ffmpeg || true)"
[ -z "$FF" ] && { echo "전체 기능 ffmpeg 를 찾을 수 없음. FFMPEG=/path/to/ffmpeg 지정 또는 ../.localbin/ffmpeg-full 준비."; exit 1; }
FILTERS="$("$FF" -hide_banner -filters 2>/dev/null || true)"
case "$FILTERS" in *" pad "*) : ;; *) echo "ffmpeg 에 pad 필터 없음(최소 빌드). 전체 빌드 필요: $FF"; exit 1 ;; esac

MAIN="${1:-$(ls -t renders/*.mp4 | head -1)}"
[ -f "$OUTRO" ] || { echo "아웃트로 없음: $OUTRO"; exit 1; }
[ -f "$BGM" ]   || { echo "BGM 없음: $BGM (다른 트랙으로 BGM 변수 수정)"; exit 1; }

echo "ffmpeg : $FF"
echo "본편   : $MAIN"
echo "아웃트로: $OUTRO"
echo "BGM    : $BGM"
echo "출력   : $OUT"

# [seq] = 본편(무음)+아웃트로 concat / [bgm] = 전체 길이에 페이드+볼륨 다운 후 amix
FILTER="[0:v]trim=0:${DUR},setpts=PTS-STARTPTS,scale=1080:1920,fps=30,setsar=1[mv];\
[2:v]scale=1080:-2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,fps=30,setsar=1[ov];\
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
