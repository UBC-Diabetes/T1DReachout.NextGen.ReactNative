#!/bin/bash

# This script generates all the necessary app icons for iOS and Android
# from a single, high-resolution source image file.
#
# REQUIREMENTS:
# 1. ImageMagick must be installed. On macOS with Homebrew, run:
#    brew install imagemagick
#
# USAGE:
# 1. Place your source icon file named 'logo.png' (ideally 1024x1024 or larger)
#    in the project root directory.
# 2. Run this script from the project root directory:
#    ./scripts/generate-icons.sh

set -e

SOURCE_IMAGE="logo.png"
IOS_ICON_DIR="ios/Official.xcassets/AppIcon.appiconset"
ANDROID_RES_DIR="android/app/src/main/res"

# --- Verification ---
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "❌ Error: Source image '$SOURCE_IMAGE' not found in the project root."
    echo "Please place your 1024x1024 logo in the root and name it 'logo.png'."
    exit 1
fi

if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick could not be found. Please install it."
    echo "On macOS, you can use Homebrew: brew install imagemagick"
    exit 1
fi

echo "✅ Prerequsites met. Starting icon generation..."

# --- iOS Icon Generation ---
echo "⚙️  Generating iOS icons..."
convert "$SOURCE_IMAGE" -resize 20x20 "$IOS_ICON_DIR/20.png"
convert "$SOURCE_IMAGE" -resize 29x29 "$IOS_ICON_DIR/29.png"
convert "$SOURCE_IMAGE" -resize 40x40 "$IOS_ICON_DIR/40.png"
convert "$SOURCE_IMAGE" -resize 58x58 "$IOS_ICON_DIR/58.png"
convert "$SOURCE_IMAGE" -resize 60x60 "$IOS_ICON_DIR/60.png"
convert "$SOURCE_IMAGE" -resize 76x76 "$IOS_ICON_DIR/76.png"
convert "$SOURCE_IMAGE" -resize 80x80 "$IOS_ICON_DIR/80.png"
convert "$SOURCE_IMAGE" -resize 87x87 "$IOS_ICON_DIR/87.png"
convert "$SOURCE_IMAGE" -resize 120x120 "$IOS_ICON_DIR/120.png"
convert "$SOURCE_IMAGE" -resize 152x152 "$IOS_ICON_DIR/152.png"
convert "$SOURCE_IMAGE" -resize 167x167 "$IOS_ICON_DIR/167.png"
convert "$SOURCE_IMAGE" -resize 180x180 "$IOS_ICON_DIR/180.png"
convert "$SOURCE_IMAGE" -resize 1024x1024 "$IOS_ICON_DIR/1024.png"
convert "$SOURCE_IMAGE" -resize 16x16 "$IOS_ICON_DIR/16.png"
convert "$SOURCE_IMAGE" -resize 32x32 "$IOS_ICON_DIR/32.png"
convert "$SOURCE_IMAGE" -resize 48x48 "$IOS_ICON_DIR/48.png"
convert "$SOURCE_IMAGE" -resize 50x50 "$IOS_ICON_DIR/50.png"
convert "$SOURCE_IMAGE" -resize 55x55 "$IOS_ICON_DIR/55.png"
convert "$SOURCE_IMAGE" -resize 57x57 "$IOS_ICON_DIR/57.png"
convert "$SOURCE_IMAGE" -resize 64x64 "$IOS_ICON_DIR/64.png"
convert "$SOURCE_IMAGE" -resize 72x72 "$IOS_ICON_DIR/72.png"
convert "$SOURCE_IMAGE" -resize 88x88 "$IOS_ICON_DIR/88.png"
convert "$SOURCE_IMAGE" -resize 100x100 "$IOS_ICON_DIR/100.png"
convert "$SOURCE_IMAGE" -resize 114x114 "$IOS_ICON_DIR/114.png"
convert "$SOURCE_IMAGE" -resize 128x128 "$IOS_ICON_DIR/128.png"
convert "$SOURCE_IMAGE" -resize 144x144 "$IOS_ICON_DIR/144.png"
convert "$SOURCE_IMAGE" -resize 172x172 "$IOS_ICON_DIR/172.png"
convert "$SOURCE_IMAGE" -resize 196x196 "$IOS_ICON_DIR/196.png"
convert "$SOURCE_IMAGE" -resize 216x216 "$IOS_ICON_DIR/216.png"
convert "$SOURCE_IMAGE" -resize 256x256 "$IOS_ICON_DIR/256.png"
convert "$SOURCE_IMAGE" -resize 512x512 "$IOS_ICON_DIR/512.png"
cp "$IOS_ICON_DIR/1024.png" "$IOS_ICON_DIR/1024 1.png"
echo "✅ iOS icons generated."

# --- Android Icon Generation ---
echo "⚙️  Generating Android icons..."

# Clean up old .png files
find "$ANDROID_RES_DIR" -name "ic_launcher*.png" -delete

# --- Square Icons ---
convert "$SOURCE_IMAGE" -resize 48x48 "$ANDROID_RES_DIR/mipmap-mdpi/ic_launcher.webp"
convert "$SOURCE_IMAGE" -resize 72x72 "$ANDROID_RES_DIR/mipmap-hdpi/ic_launcher.webp"
convert "$SOURCE_IMAGE" -resize 96x96 "$ANDROID_RES_DIR/mipmap-xhdpi/ic_launcher.webp"
convert "$SOURCE_IMAGE" -resize 144x144 "$ANDROID_RES_DIR/mipmap-xxhdpi/ic_launcher.webp"
convert "$SOURCE_IMAGE" -resize 192x192 "$ANDROID_RES_DIR/mipmap-xxxhdpi/ic_launcher.webp"

# --- Round Icons ---
MASK_FILE=$(mktemp)
ROUND_MASK_FILE=$(mktemp)

convert -size 192x192 xc:none -fill white -draw "circle 96,96 96,0" "$MASK_FILE"

create_round_icon() {
    size=$1
    input_file=$2
    output_file=$3
    convert "$MASK_FILE" -resize ${size}x${size} "$ROUND_MASK_FILE"
    convert "${input_file}" -matte "$ROUND_MASK_FILE" -compose DstIn -composite "${output_file}"
}

create_round_icon 48 "$ANDROID_RES_DIR/mipmap-mdpi/ic_launcher.webp" "$ANDROID_RES_DIR/mipmap-mdpi/ic_launcher_round.webp"
create_round_icon 72 "$ANDROID_RES_DIR/mipmap-hdpi/ic_launcher.webp" "$ANDROID_RES_DIR/mipmap-hdpi/ic_launcher_round.webp"
create_round_icon 96 "$ANDROID_RES_DIR/mipmap-xhdpi/ic_launcher.webp" "$ANDROID_RES_DIR/mipmap-xhdpi/ic_launcher_round.webp"
create_round_icon 144 "$ANDROID_RES_DIR/mipmap-xxhdpi/ic_launcher.webp" "$ANDROID_RES_DIR/mipmap-xxhdpi/ic_launcher_round.webp"
create_round_icon 192 "$ANDROID_RES_DIR/mipmap-xxxhdpi/ic_launcher.webp" "$ANDROID_RES_DIR/mipmap-xxxhdpi/ic_launcher_round.webp"

rm "$MASK_FILE" "$ROUND_MASK_FILE"

# --- Foreground Icon (for adaptive icons) ---
# This is a simple foreground layer. For best results on Android, you might want
# to create a separate, transparent foreground image.
convert "$SOURCE_IMAGE" -resize 108x108 "$ANDROID_RES_DIR/mipmap-hdpi/ic_launcher_foreground.webp"
convert "$SOURCE_IMAGE" -resize 81x81 "$ANDROID_RES_DIR/mipmap-mdpi/ic_launcher_foreground.webp"
convert "$SOURCE_IMAGE" -resize 162x162 "$ANDROID_RES_DIR/mipmap-xhdpi/ic_launcher_foreground.webp"
convert "$SOURCE_IMAGE" -resize 216x216 "$ANDROID_RES_DIR/mipmap-xxhdpi/ic_launcher_foreground.webp"
convert "$SOURCE_IMAGE" -resize 324x324 "$ANDROID_RES_DIR/mipmap-xxxhdpi/ic_launcher_foreground.webp"

echo "✅ Android icons generated as .webp files."
echo "🎉 Icon generation complete!"
echo "NOTE: The original .png files for Android were removed."