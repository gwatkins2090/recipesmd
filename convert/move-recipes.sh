#!/bin/bash

# Move converted recipe files to recipes/family directory
# Excludes report files

SOURCE_DIR="convert/output"
DEST_DIR="recipes/family"

echo "Moving converted recipe files..."
echo "Source: $SOURCE_DIR"
echo "Destination: $DEST_DIR"
echo ""

# Count files to move
COUNT=0
for file in "$SOURCE_DIR"/*.md; do
  filename=$(basename "$file")
  # Skip report files
  if [[ ! "$filename" =~ (REVIEW|CONVERSION|SUMMARY|EXAMPLES) ]]; then
    ((COUNT++))
  fi
done

echo "Found $COUNT recipe files to move"
echo ""

# Move files
MOVED=0
for file in "$SOURCE_DIR"/*.md; do
  filename=$(basename "$file")
  
  # Skip report files
  if [[ ! "$filename" =~ (REVIEW|CONVERSION|SUMMARY|EXAMPLES) ]]; then
    cp "$file" "$DEST_DIR/$filename"
    if [ $? -eq 0 ]; then
      ((MOVED++))
      echo "✓ Moved: $filename"
    else
      echo "✗ Failed: $filename"
    fi
  fi
done

echo ""
echo "=========================================="
echo "Move complete!"
echo "Total files moved: $MOVED"
echo "=========================================="

