#!/bin/bash

# Android Release Deploy Script
# Builds and installs the release APK to connected Android device

set -e  # Exit on any error

echo "🚀 Starting Android Release Build and Deploy..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check for connected devices
print_status "Checking for connected Android devices..."

# Get list of connected devices (excluding header and emulators if we want hardware only)
DEVICES=($(adb devices | grep -E "device$" | awk '{print $1}'))

if [ ${#DEVICES[@]} -eq 0 ]; then
    print_error "No Android devices connected!"
    print_warning "Please connect your Android device and enable USB debugging"
    exit 1
elif [ ${#DEVICES[@]} -eq 1 ]; then
    SELECTED_DEVICE="${DEVICES[0]}"
    print_success "Found one device: $SELECTED_DEVICE"
else
    print_warning "Multiple devices found:"
    echo ""
    
    # Show all devices with details
    for i in "${!DEVICES[@]}"; do
        DEVICE_ID="${DEVICES[$i]}"
        MODEL=$(adb -s "$DEVICE_ID" shell getprop ro.product.model 2>/dev/null | tr -d '\r\n' || echo "Unknown")
        BRAND=$(adb -s "$DEVICE_ID" shell getprop ro.product.brand 2>/dev/null | tr -d '\r\n' || echo "Unknown")
        
        # Check if it's an emulator
        if echo "$DEVICE_ID" | grep -q "emulator"; then
            DEVICE_TYPE="(Emulator)"
        else
            DEVICE_TYPE="(Hardware)"
        fi
        
        echo "  $((i+1)). $DEVICE_ID - $BRAND $MODEL $DEVICE_TYPE"
    done
    
    echo ""
    
    # If you want to prefer hardware devices automatically, uncomment this:
    # Filter for hardware devices only (non-emulator)
    HARDWARE_DEVICES=()
    for device in "${DEVICES[@]}"; do
        if ! echo "$device" | grep -q "emulator"; then
            HARDWARE_DEVICES+=("$device")
        fi
    done
    
    if [ ${#HARDWARE_DEVICES[@]} -eq 1 ]; then
        SELECTED_DEVICE="${HARDWARE_DEVICES[0]}"
        print_success "Auto-selected hardware device: $SELECTED_DEVICE"
    else
        # Ask user to select
        while true; do
            read -p "Select device (1-${#DEVICES[@]}): " choice
            if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#DEVICES[@]} ]; then
                SELECTED_DEVICE="${DEVICES[$((choice-1))]}"
                break
            else
                print_error "Invalid selection. Please enter a number between 1 and ${#DEVICES[@]}"
            fi
        done
    fi
fi

# Get device details
MODEL=$(adb -s "$SELECTED_DEVICE" shell getprop ro.product.model 2>/dev/null | tr -d '\r\n' || echo "Unknown Device")
print_success "Selected device: $MODEL ($SELECTED_DEVICE)"

# Set ADB to use the selected device for subsequent commands
export ADB_DEVICE_ARG="-s $SELECTED_DEVICE"

# Build the release APK
print_status "Building release APK..."
if ! yarn android-release; then
    print_error "Build failed!"
    exit 1
fi

print_success "Build completed!"

# Find the APK file - check multiple possible locations
print_status "Locating APK file..."

APK_PATHS=(
    "android/app/build/outputs/apk/experimentalPlay/release/app-experimental-play-release.apk"
    "android/app/build/outputs/apk/officialPlay/release/app-official-play-release.apk"
    "android/app/build/outputs/apk/experimental/release/app-experimental-release.apk"
    "android/app/build/outputs/apk/official/release/app-official-release.apk"
    "android/app/build/outputs/apk/release/app-release.apk"
    "android/app/build/outputs/apk/release/app-arm64-v8a-release.apk"
    "android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk"
    "android/app/build/outputs/apk/release/app-x86_64-release.apk"
)

APK_PATH=""
for path in "${APK_PATHS[@]}"; do
    if [ -f "$path" ]; then
        APK_PATH="$path"
        print_success "Found APK at: $APK_PATH"
        break
    fi
done

if [ -z "$APK_PATH" ]; then
    print_error "Could not locate APK file in any expected location!"
    print_warning "Searching for any APK files in build outputs..."
    
    # Use find command as fallback (try both find and fd)
    if command -v find >/dev/null 2>&1; then
        FOUND_APKS=$(find android/app/build/outputs -name "*.apk" -type f 2>/dev/null | head -1)
    elif command -v fd >/dev/null 2>&1; then
        FOUND_APKS=$(fd -e apk . android/app/build/outputs 2>/dev/null | head -1)
    else
        FOUND_APKS=""
    fi
    if [ -n "$FOUND_APKS" ]; then
        APK_PATH="$FOUND_APKS"
        print_success "Found APK at: $APK_PATH"
    else
        print_error "No APK files found! Make sure the build completed successfully."
        exit 1
    fi
fi

# Get app package name
PACKAGE_NAME=$(grep "applicationId" android/app/build.gradle | cut -d'"' -f2 | tr -d ' ')
if [ -z "$PACKAGE_NAME" ]; then
    PACKAGE_NAME="com.t1dreachout.nextgen"  # fallback
fi

print_status "Package name: $PACKAGE_NAME"

# Function to perform clean uninstall
clean_uninstall() {
    print_status "Performing clean uninstall..."
    
    # Force stop the app if it's running
    adb $ADB_DEVICE_ARG shell am force-stop "$PACKAGE_NAME" 2>/dev/null || true
    
    # Clear app data and cache
    adb $ADB_DEVICE_ARG shell pm clear "$PACKAGE_NAME" 2>/dev/null || true
    
    # Uninstall the app
    if adb $ADB_DEVICE_ARG uninstall "$PACKAGE_NAME" 2>/dev/null; then
        print_success "Successfully uninstalled existing app"
        return 0
    else
        print_warning "App was not installed or already removed"
        return 0
    fi
}

# Function to install APK with retry logic
install_apk() {
    local max_attempts=2
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Installing APK to device (attempt $attempt/$max_attempts)..."
        
        # Capture the full error output
        INSTALL_OUTPUT=$(adb $ADB_DEVICE_ARG install "$APK_PATH" 2>&1)
        INSTALL_RESULT=$?
        
        if [ $INSTALL_RESULT -eq 0 ]; then
            print_success "✅ App successfully installed!"
            return 0
        else
            print_error "Installation failed:"
            echo "$INSTALL_OUTPUT"
            
            # Check for specific error types
            if echo "$INSTALL_OUTPUT" | grep -q "INSTALL_FAILED_UPDATE_INCOMPATIBLE"; then
                print_warning "Signature mismatch detected - existing app was signed with different keys"
                if [ $attempt -lt $max_attempts ]; then
                    print_status "Attempting clean uninstall and retry..."
                    clean_uninstall
                    sleep 2  # Give device a moment to process
                else
                    print_error "Failed to resolve signature mismatch after clean uninstall"
                    print_warning "You may need to manually uninstall the app from your device"
                    return 1
                fi
            elif echo "$INSTALL_OUTPUT" | grep -q "INSTALL_FAILED_INSUFFICIENT_STORAGE"; then
                print_error "Insufficient storage on device"
                return 1
            elif echo "$INSTALL_OUTPUT" | grep -q "INSTALL_FAILED_INVALID_APK"; then
                print_error "Invalid APK file"
                return 1
            else
                print_error "Unknown installation error"
                if [ $attempt -lt $max_attempts ]; then
                    print_status "Retrying after clean uninstall..."
                    clean_uninstall
                    sleep 2
                else
                    return 1
                fi
            fi
        fi
        
        attempt=$((attempt + 1))
    done
    
    return 1
}

# Initial uninstall (optional - helps prevent conflicts)
print_status "Checking for existing app installation..."
if adb $ADB_DEVICE_ARG shell pm list packages | grep -q "$PACKAGE_NAME"; then
    print_warning "Found existing installation - removing to prevent conflicts"
    clean_uninstall
else
    print_status "No existing installation found"
fi

# Install the APK with retry logic
if install_apk; then
    # Optional: Launch the app
    print_status "Launching app..."
    adb $ADB_DEVICE_ARG shell am start -n "$PACKAGE_NAME/.MainActivity" 2>/dev/null || print_warning "Could not launch app automatically"
    
    print_success "🎉 Deploy completed successfully!"
    print_status "APK size: $(ls -lah "$APK_PATH" | awk '{print $5}')"
else
    print_error "Failed to install APK after all attempts!"
    print_warning "Troubleshooting tips:"
    print_warning "1. Make sure your device has enough storage space"
    print_warning "2. Try manually uninstalling the app from your device"
    print_warning "3. Check that USB debugging is enabled"
    print_warning "4. Verify the APK file is not corrupted"
    exit 1
fi