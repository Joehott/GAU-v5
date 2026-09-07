#!/usr/bin/env bash
# GAU v5 One-Line Installer for Linux / macOS
set -e
PROJECT="${1:-$PWD}"
URL="${GAU_URL:-https://gau-v5.vercel.app/downloads/GAU-v5.zip}"

echo "=== GAU v5 Installer ==="
echo "Target Project: $PROJECT"

TMP_ZIP="$(mktemp /tmp/gau-v5-XXXXXX.zip)"
TMP_DIR="$(mktemp -d /tmp/gau-v5-ext-XXXXXX)"

echo "Downloading GAU v5 package..."
curl -fsSL "$URL" -o "$TMP_ZIP"

echo "Extracting..."
unzip -q "$TMP_ZIP" -d "$TMP_DIR"

echo "Installing GAU v5 into $PROJECT..."
python3 "$TMP_DIR/GAU-v5/install.py" --project "$PROJECT"

echo "Verifying..."
python3 "$PROJECT/.gau/runtime/gau.py" --project "$PROJECT" doctor

rm -rf "$TMP_ZIP" "$TMP_DIR"
echo ""
echo "[SUCCESS] GAU v5 installed successfully!"
