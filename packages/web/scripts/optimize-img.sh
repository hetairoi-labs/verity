#!/bin/bash

INPUT_DIR="src/assets"

# Find all matching files recursively
find "$INPUT_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r file; do
  base=$(basename "$file")
  output="${file%.*}.webp"

  # Skip if already converted
  if [ -f "$output" ]; then
    echo "Skipping $file (already has WebP)"
    continue
  fi

  echo "Converting $file -> $output"
  cwebp -q 90 "$file" -o "$output"
done
