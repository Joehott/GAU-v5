# GAU v5 One-Line Installer for Windows
[CmdletBinding()]
param(
    [string]$Project = $PWD,
    [string]$Url = "https://joehott.github.io/GAU-v5/downloads/GAU-v5.zip"
)

$ErrorActionPreference = "Stop"
Write-Host "=== GAU v5 Installer ===" -ForegroundColor Cyan
Write-Host "Target Project: $Project"

$tmpZip = Join-Path ([System.IO.Path]::GetTempPath()) "GAU-v5-tmp.zip"
$tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) "GAU-v5-tmp-ext"

if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }

Write-Host "Downloading GAU v5 package..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $Url -OutFile $tmpZip -UseBasicParsing
} catch {
    $localZip = Join-Path $PSScriptRoot "downloads/GAU-v5.zip"
    if (Test-Path $localZip) {
        Write-Host "Using local package fallback..." -ForegroundColor Yellow
        Copy-Item $localZip $tmpZip
    } else {
        throw "Failed to download GAU package: $_"
    }
}

Write-Host "Extracting..."
Expand-Archive -Path $tmpZip -DestinationPath $tmpDir -Force

$installScript = Join-Path $tmpDir "GAU-v5/install.py"
if (-not (Test-Path $installScript)) {
    throw "Invalid package format: install.py not found."
}

Write-Host "Installing GAU v5 into $Project..." -ForegroundColor Green
py -3 $installScript --project $Project

Write-Host "Verifying installation..."
py -3 "$Project/.gau/runtime/gau.py" --project $Project doctor

Remove-Item $tmpZip -Force -ErrorAction SilentlyContinue
Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n[SUCCESS] GAU v5 is ready in $Project!" -ForegroundColor Cyan
Write-Host "Open a new conversation in Antigravity to begin." -ForegroundColor Cyan
