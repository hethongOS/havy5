# Phase 1 quarantine: SAFE_REBUILD only
# REQUIRES: OpenClaw fully stopped + explicit -Approve
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\phase1-quarantine.ps1 -WhatIf
#   powershell -ExecutionPolicy Bypass -File .\phase1-quarantine.ps1 -Approve

param(
  [string]$Root = "O:\OPENCLAW",
  [string]$QuarantineRoot = "O:\OPENCLAW\_quarantine\20260808\phase1",
  [switch]$Approve,
  [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

function Assert-Stopped {
  $blocked = @("ollama")
  $running = Get-Process -ErrorAction SilentlyContinue | Where-Object { $blocked -contains $_.ProcessName }
  # node is common; only warn — operator must confirm gateway stopped
  if ($running) {
    throw "Blocked processes still running: $($running.ProcessName -join ', '). Stop OpenClaw first."
  }
  Write-Host "WARN: Confirm gateway/9Router/MCP/web/agent Node are stopped before -Approve."
}

function Get-SizeBytes([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return 0 }
  $item = Get-Item -LiteralPath $Path -Force
  if (-not $item.PSIsContainer) { return [int64]$item.Length }
  $sum = (Get-ChildItem -LiteralPath $Path -Recurse -Force -ErrorAction SilentlyContinue |
    Measure-Object -Property Length -Sum).Sum
  if ($null -eq $sum) { return [int64]0 }
  return [int64]$sum
}

Assert-Stopped
New-Item -ItemType Directory -Force -Path $QuarantineRoot | Out-Null

$manifest = [System.Collections.Generic.List[object]]::new()
$candidates = [System.Collections.Generic.List[string]]::new()

$npm = Join-Path $Root "cache\npm"
$cache = Join-Path $Root ".cache"
if (Test-Path -LiteralPath $npm) { $candidates.Add($npm) }
if (Test-Path -LiteralPath $cache) { $candidates.Add($cache) }

$tmp = Join-Path $Root "tmp"
if (Test-Path -LiteralPath $tmp) {
  Get-ChildItem -LiteralPath $tmp -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "vscode-stable-user-x64-*" } |
    ForEach-Object { $candidates.Add($_.FullName) }
}

# Never touch known live tmp names from the inventory unless operator overrides later
$denyExact = @(
  "vscode-stable-user-x64-5zbrcp8c9ta",
  "is-8F3F8.tmp",
  "agent-browser-chrome-cf919346-e6ad-409c-8454-d961f5110fc5"
)

foreach ($src in $candidates) {
  $name = Split-Path $src -Leaf
  if ($denyExact -contains $name) {
    $manifest.Add([pscustomobject]@{
      path = $src; action = "SKIP_LIVE"; reason = "Listed as in-use in inventory"; size_bytes = (Get-SizeBytes $src)
    })
    continue
  }

  $dest = Join-Path $QuarantineRoot ($src.Substring($Root.Length).TrimStart('\','/').Replace('\', '__'))
  $size = Get-SizeBytes $src
  if ($WhatIf -or -not $Approve) {
    $manifest.Add([pscustomobject]@{
      path = $src; action = "WOULD_QUARANTINE"; dest = $dest; size_bytes = $size; size_gb = [math]::Round($size/1GB, 2)
    })
    continue
  }

  New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
  Move-Item -LiteralPath $src -Destination $dest -Force
  $manifest.Add([pscustomobject]@{
    path = $src; action = "QUARANTINED"; dest = $dest; size_bytes = $size; size_gb = [math]::Round($size/1GB, 2)
  })
}

$manifestPath = Join-Path $QuarantineRoot "manifest-phase1.json"
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8
$total = ($manifest | Where-Object { $_.action -match "QUARANTINE" } | Measure-Object -Property size_bytes -Sum).Sum
Write-Host ("Manifest: {0}" -f $manifestPath)
Write-Host ("Total bytes touched/planned: {0} ({1} GB)" -f $total, [math]::Round(($total/1GB), 2))
if (-not $Approve) {
  Write-Host "Dry run only. Re-run with -Approve after OpenClaw is stopped."
}
