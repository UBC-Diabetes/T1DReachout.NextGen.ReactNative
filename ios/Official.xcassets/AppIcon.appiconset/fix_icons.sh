#!/bin/bash

# ==============================================================================
# fix_icons.sh
#
# A script to remove the alpha channel from all PNG files in the current
# directory using ImageMagick. This is useful for fixing iOS App Icons.
# ==============================================================================

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null
then
    echo "ImageMagick could not be found. Please install it first."
    echo "On macOS with Homebrew, run: brew install imagemagick"
    exit 1
fi

echo "Starting process to make all PNGs opaque..."
COUNT=0

# Loop through all files ending in .png
for file in *.png; do
    # Ensure it is a file before processing
    if [ -f "$file" ]; then
        echo "Processing $file..."
        # Use 'mogrify' for in-place editing to remove the alpha channel.
        # This command will not fail if the file is already opaque.
        magick mogrify -alpha off "$file"
        ((COUNT++))
    fi
done

echo "--------------------------------------------------"
echo "Done! Processed $COUNT files."
echo "You can verify with: sips -g hasAlpha your_file.png"
