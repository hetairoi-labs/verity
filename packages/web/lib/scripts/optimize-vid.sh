#!/bin/bash

INPUT_DIR="public/videos"
SCALE="1280:-1"

for file in "$INPUT_DIR"/*.mp4; do
  [ -e "$file" ] || continue
  base=$(basename "$file" .mp4)
  output="$INPUT_DIR/$base.webm"

  echo "Analyzing $file..."

  # Extract metadata
  duration=$(ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$file")
  width=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width \
    -of default=noprint_wrappers=1:nokey=1 "$file")

  # Decide CRF based on heuristics
  if (( $(echo "$duration < 60" | bc -l) )); then
    # Short clips → higher quality
    CRF=24
  elif (( $(echo "$duration < 300" | bc -l) )); then
    CRF=28
  else
    CRF=32
  fi

  # Adjust for resolution
  if [ "$width" -ge 1920 ]; then
    CRF=$((CRF - 2))  # give extra quality for HD+
  fi

  echo "Optimizing $file -> $output (CRF=$CRF)"

  # First pass
  ffmpeg -i "$file" \
    -c:v libvpx-vp9 \
    -b:v 0 \
    -crf $CRF \
    -vf scale=$SCALE \
    -pass 1 \
    -an \
    -f null /dev/null

  # Second pass
  ffmpeg -i "$file" \
    -c:v libvpx-vp9 \
    -b:v 0 \
    -crf $CRF \
    -vf scale=$SCALE \
    -pass 2 \
    -cpu-used 4 \
    -row-mt 1 \
    -threads 8 \
    -an \
    "$output"

  rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree
done
