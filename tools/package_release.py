#!/usr/bin/env python3
"""Package GAU v5 into distributable release artifacts for the website and CLI."""
from pathlib import Path
import zipfile
import hashlib
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
GAU_SRC = ROOT / 'GAU-v5'
ROOT_DOWNLOADS = ROOT / 'downloads'
SITE = ROOT / 'site'
DOWNLOADS = SITE / 'downloads'
DIST = ROOT / 'dist'

def main():
    DOWNLOADS.mkdir(parents=True, exist_ok=True)
    ROOT_DOWNLOADS.mkdir(parents=True, exist_ok=True)
    DIST.mkdir(parents=True, exist_ok=True)
    
    print('[1/4] Running build_package.py to ensure payload freshness...')
    subprocess.run([sys.executable, str(GAU_SRC / 'build_package.py')], cwd=str(GAU_SRC), check=True)
    
    print('[2/4] Running package tests...')
    subprocess.run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tests'], cwd=str(GAU_SRC), check=True)
    
    print('[3/4] Packaging GAU-v5.zip...')
    zip_destinations = [DOWNLOADS / 'GAU-v5.zip', ROOT_DOWNLOADS / 'GAU-v5.zip', DIST / 'GAU-v5.zip']
    
    for zip_path in zip_destinations:
        with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
            for item in sorted(GAU_SRC.rglob('*')):
                if '__pycache__' in item.parts or item.name.endswith('.pyc') or item.is_dir():
                    continue
                rel = item.relative_to(GAU_SRC)
                archive_name = Path('GAU-v5') / rel
                z.write(item, str(archive_name.as_posix()))
        
        sha = hashlib.sha256(zip_path.read_bytes()).hexdigest()
        size = zip_path.stat().st_size
        print(f'   -> {zip_path.name} ({size:,} bytes, sha256: {sha[:16]}...)')
        
        # Write checksum file
        (zip_path.with_name(zip_path.name + '.sha256')).write_text(sha + '  ' + zip_path.name + '\n', encoding='utf-8')
    
    print('[4/4] Creating installation scripts (install.ps1 and install.sh)...')
    
    ps1_lines = [
        '# GAU v5 One-Line Installer for Windows',
        '[CmdletBinding()]',
        'param(',
        '    [string]$Project = $PWD,',
        '    [string]$Url = "https://joehott.github.io/GAU-v5/downloads/GAU-v5.zip"',
        ')',
        '',
        '$ErrorActionPreference = "Stop"',
        'Write-Host "=== GAU v5 Installer ===" -ForegroundColor Cyan',
        'Write-Host "Target Project: $Project"',
        '',
        '$tmpZip = Join-Path ([System.IO.Path]::GetTempPath()) "GAU-v5-tmp.zip"',
        '$tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) "GAU-v5-tmp-ext"',
        '',
        'if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }',
        '',
        'Write-Host "Downloading GAU v5 package..." -ForegroundColor Yellow',
        'try {',
        '    Invoke-WebRequest -Uri $Url -OutFile $tmpZip -UseBasicParsing',
        '} catch {',
        '    $localZip = Join-Path $PSScriptRoot "downloads/GAU-v5.zip"',
        '    if (Test-Path $localZip) {',
        '        Write-Host "Using local package fallback..." -ForegroundColor Yellow',
        '        Copy-Item $localZip $tmpZip',
        '    } else {',
        '        throw "Failed to download GAU package: $_"',
        '    }',
        '}',
        '',
        'Write-Host "Extracting..."',
        'Expand-Archive -Path $tmpZip -DestinationPath $tmpDir -Force',
        '',
        '$installScript = Join-Path $tmpDir "GAU-v5/install.py"',
        'if (-not (Test-Path $installScript)) {',
        '    throw "Invalid package format: install.py not found."',
        '}',
        '',
        'Write-Host "Installing GAU v5 into $Project..." -ForegroundColor Green',
        'py -3 $installScript --project $Project',
        '',
        'Write-Host "Verifying installation..."',
        'py -3 "$Project/.gau/runtime/gau.py" --project $Project doctor',
        '',
        'Remove-Item $tmpZip -Force -ErrorAction SilentlyContinue',
        'Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue',
        '',
        'Write-Host "`n[SUCCESS] GAU v5 is ready in $Project!" -ForegroundColor Cyan',
        'Write-Host "Open a new conversation in Antigravity to begin." -ForegroundColor Cyan',
        ''
    ]
    ps1_content = '\n'.join(ps1_lines)
    (SITE / 'install.ps1').write_text(ps1_content, encoding='utf-8')
    (SITE / 'downloads' / 'install.ps1').write_text(ps1_content, encoding='utf-8')
    (ROOT / 'install.ps1').write_text(ps1_content, encoding='utf-8')
    (ROOT_DOWNLOADS / 'install.ps1').write_text(ps1_content, encoding='utf-8')
    
    sh_lines = [
        '#!/usr/bin/env bash',
        '# GAU v5 One-Line Installer for Linux / macOS',
        'set -e',
        'PROJECT="${1:-$PWD}"',
        'URL="${GAU_URL:-https://joehott.github.io/GAU-v5/downloads/GAU-v5.zip}"',
        '',
        'echo "=== GAU v5 Installer ==="',
        'echo "Target Project: $PROJECT"',
        '',
        'TMP_ZIP="$(mktemp /tmp/gau-v5-XXXXXX.zip)"',
        'TMP_DIR="$(mktemp -d /tmp/gau-v5-ext-XXXXXX)"',
        '',
        'echo "Downloading GAU v5 package..."',
        'curl -fsSL "$URL" -o "$TMP_ZIP"',
        '',
        'echo "Extracting..."',
        'unzip -q "$TMP_ZIP" -d "$TMP_DIR"',
        '',
        'echo "Installing GAU v5 into $PROJECT..."',
        'python3 "$TMP_DIR/GAU-v5/install.py" --project "$PROJECT"',
        '',
        'echo "Verifying..."',
        'python3 "$PROJECT/.gau/runtime/gau.py" --project "$PROJECT" doctor',
        '',
        'rm -rf "$TMP_ZIP" "$TMP_DIR"',
        'echo ""',
        'echo "[SUCCESS] GAU v5 installed successfully!"',
        ''
    ]
    sh_content = '\n'.join(sh_lines)
    (SITE / 'install.sh').write_text(sh_content, encoding='utf-8')
    (SITE / 'downloads' / 'install.sh').write_text(sh_content, encoding='utf-8')
    (ROOT / 'install.sh').write_text(sh_content, encoding='utf-8')
    (ROOT_DOWNLOADS / 'install.sh').write_text(sh_content, encoding='utf-8')
    
    print('Release package complete! Artifacts created in site/downloads, downloads/ and dist/.')

if __name__ == '__main__':
    main()
