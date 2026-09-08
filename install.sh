#!/usr/bin/env bash
# GAU v5 One-Line Installer for Linux / macOS
set -e
PROJECT="${1:-$PWD}"
URL="${GAU_URL:-https://joehott.github.io/GAU-v5/downloads/GAU-v5.zip}"

echo "=== GAU v5 Installer ==="
echo "Target Project: $PROJECT"

TMP_DIR="$(mktemp -d /tmp/gau-v5-ext-XXXXXX)"
TMP_ZIP="$TMP_DIR/gau-v5.zip"

echo "Downloading GAU v5 package..."
curl -fsSL "$URL" -o "$TMP_ZIP"

echo "Extracting..."
unzip -q "$TMP_ZIP" -d "$TMP_DIR"

echo "Installing GAU v5 into $PROJECT..."
python3 "$TMP_DIR/GAU-v5/install.py" --project "$PROJECT"

echo "Verifying..."
python3 "$PROJECT/.gau/runtime/gau.py" --project "$PROJECT" doctor

rm -rf "$TMP_DIR"
echo ""
echo "[SUCCESS] GAU v5 installed successfully!"
