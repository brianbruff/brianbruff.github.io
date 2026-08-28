#!/usr/bin/env bash
#
# Re-encodes the homepage chapter clips into the deliverables under
# static/assets/. Run it from anywhere; pass the directory holding the source
# files as $1 (default: ./media-source).
#
# Expected sources: intro.mp4 walk.mp4 coding.mp4 zeus.mp4 commodities.mp4
#
# Why the flags matter for scroll scrubbing:
#   -g 6 -keyint_min 6 -sc_threshold 0  dense keyframes, so currentTime seeks
#                                       land almost instantly instead of
#                                       decoding a long GOP on every frame
#   -movflags +faststart                moov atom first, so playback can start
#                                       before the whole file has arrived
#   -an                                 no audio: nothing to autoplay-gate
#   libx264                             the original sources are HEVC, which
#                                       Chrome and Firefox will not decode
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/media-source}"
OUT="$ROOT/static/assets/video"
POSTER="$ROOT/static/assets/poster"

[ -d "$SRC" ] || { echo "No source directory at $SRC" >&2; exit 1; }
mkdir -p "$OUT" "$POSTER"

# $5 is an optional extra filter applied before scaling.
enc () { # src out_name desktop_width mobile_width [pre_filter]
  PRE="${5:+$5,}"
  echo "encoding $2"
  ffmpeg -y -v error -i "$SRC/$1.mp4" -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 23 -preset slow -g 6 -keyint_min 6 -sc_threshold 0 \
    -vf "${PRE}scale=$3:-2" -movflags +faststart "$OUT/$2.mp4"
  ffmpeg -y -v error -i "$SRC/$1.mp4" -an -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -crf 27 -preset slow -g 6 -keyint_min 6 -sc_threshold 0 \
    -vf "${PRE}scale=$4:-2" -movflags +faststart "$OUT/$2.mobile.mp4"
  ffmpeg -y -v error -i "$SRC/$1.mp4" -frames:v 1 -q:v 4 -vf "${PRE}scale=$3:-2" "$POSTER/$2.jpg"
}

enc intro       intro     1600 800
enc walk        walk      1600 800
enc coding      coding    1600 800
enc zeus        zeus       834 500
# The commodity clip carries a burned-in caption in its lower quarter.
enc commodities commodity  834 500 'crop=834:844:0:0'

echo "encode complete"
