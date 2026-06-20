#!/usr/bin/env bash
# 최종 릴스 빌드: HyperFrames 본편(30초) + 로고 아웃트로(somss-outro.mp4) 이어붙이기
#
# 배경: HyperFrames render 는 본편(index.html, 30초 무음 9:16)만 출력한다.
#   4K 16:9 아웃트로를 컴포지션에 <video> 로 임베드하면 캡처 경로에서 검정으로
#   합성되므로, 여기서 1080x1920 세로로 변환(레터박스=검정이라 비가시) 후 concat 한다.
#
# 주의: .localbin/ffmpeg(Remotion 번들)은 pad·setpts·fps 필터가 없는 최소 빌드라 사용 불가.
#   전체 기능 ffmpeg 가 필요하다. 우선순위: $FFMPEG > .localbin/ffmpeg-full > PATH의 ffmpeg.
#   (.localbin/ffmpeg-full 은 `npm i ffmpeg-static` 로 받은 정적 바이너리를 복사해 둔 것.)
#
# 사용법:  ./build-final.sh [본편_render.mp4]
#   인자 생략 시 renders/ 의 최신 mp4 를 본편으로 사용.
set -euo pipefail
cd "$(dirname "$0")"

FF="${FFMPEG:-}"
[ -z "$FF" ] && [ -x ../.localbin/ffmpeg-full ] && FF="$(cd .. && pwd)/.localbin/ffmpeg-full"
[ -z "$FF" ] && FF="$(command -v ffmpeg || true)"
[ -z "$FF" ] && { echo "전체 기능 ffmpeg 를 찾을 수 없음. FFMPEG=/path/to/ffmpeg 로 지정하거나 .localbin/ffmpeg-full 준비."; exit 1; }
FILTERS="$("$FF" -hide_banner -filters 2>/dev/null || true)"
case "$FILTERS" in *" pad "*) : ;; *) echo "ffmpeg 에 pad 필터 없음(최소 빌드). 전체 빌드 필요: $FF"; exit 1 ;; esac

MAIN="${1:-$(ls -t renders/*.mp4 | head -1)}"
OUTRO="somss-outro.mp4"
BGM="persona-bgm.mp3"
OUT="persona-design-1기-reels.mp4"
DUR=29.6       # 본편 컷 지점(CTA 풀 노출 직후 → 아웃트로 검정 시작으로 자연 전환)
TOTAL=38.54    # DUR + 아웃트로(8.94s)
BGM_VOL=0.85   # BGM 볼륨(소스가 0dBFS 피크라 amix 후 alimiter로 클리핑 방지). 크/작으면 조절.

echo "ffmpeg : $FF"
echo "본편   : $MAIN"
echo "BGM    : $BGM"
echo "출력   : $OUT"

# [seq] = 본편(무음)+아웃트로(로고 스팅) 영상·오디오를 concat 한 시퀀스
# [bgm] = persona-bgm 을 전체 길이에 맞춰 트림, 인 1.5s / 끝 2.5s 페이드, 볼륨 다운
# amix(normalize=0) 로 BGM 위에 아웃트로 스팅이 그대로 얹히게 합성
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
