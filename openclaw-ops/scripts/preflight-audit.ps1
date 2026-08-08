# OpenClaw cleanup preflight (READ-ONLY)
# Run in PowerShell on the Windows host that owns O:\OPENCLAW
# Usage: powershell -ExecutionPolicy Bypass -File .\preflight-audit.ps1

param(
  [string]$Root = "O:\OPENCLAW",
  [string]$OllamaModelsAlt = "O:\OLLAMA_MODELS",
  [string]$OutDir = "O:\OPENCLAW\_quarantine\reports"
)

$ErrorActionPreference = "Continue"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$report = Join-Path $OutDir "preflight-$stamp.md"

function Get-DirSizeGB([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  $bytes = (Get-ChildItem -LiteralPath $Path -Recurse -Force -ErrorAction SilentlyContinue |
    Measure-Object -Property Length -Sum).Sum
  if ($null -eq $bytes) { return 0 }
  return [math]::Round($bytes / 1GB, 2)
}

function Write-Section($title) {
  Add-Content -LiteralPath $report -Value "`n## $title`n"
}

$lines = @()
$lines += "# OpenClaw preflight $stamp"
$lines += "Root: $Root"
$lines += ""

# Drive free space
$drive = Get-PSDrive -Name O -ErrorAction SilentlyContinue
if ($drive) {
  $lines += "## Drive O"
  $lines += ("- UsedGB: {0}" -f [math]::Round(($drive.Used / 1GB), 2))
  $lines += ("- FreeGB: {0}" -f [math]::Round(($drive.Free / 1GB), 2))
}

Write-Section "Top-level sizes" | Out-Null
$lines += "## Top-level sizes"
Get-ChildItem -LiteralPath $Root -Force -ErrorAction SilentlyContinue | ForEach-Object {
  $sz = Get-DirSizeGB $_.FullName
  $lines += ("- {0}: {1} GB" -f $_.Name, $sz)
}

$lines += ""
$lines += "## Candidate buckets"
$candidates = @(
  "cache\npm", ".cache", "tmp", "sandbox", "lab", "_edge-eye-test",
  "models", "state", "workspace",
  "state.bak-before-agent-so-1-creation",
  "_backup_unknown_parent_20260708_154420",
  "_backup_reset_session_20260708_153753",
  "state-backup-pairing",
  "state_bi_loi_20260708_154722",
  "workspace_so_1", "workspace_so_2", "workspace_so_3"
)
foreach ($rel in $candidates) {
  $p = Join-Path $Root $rel
  $sz = Get-DirSizeGB $p
  if ($null -ne $sz) { $lines += ("- {0}: {1} GB" -f $rel, $sz) }
}

$lines += ""
$lines += "## Ollama models alt"
$lines += ("- {0}: {1} GB" -f $OllamaModelsAlt, (Get-DirSizeGB $OllamaModelsAlt))
$lines += ("- Env OLLAMA_MODELS: {0}" -f $env:OLLAMA_MODELS)

$lines += ""
$lines += "## VS Code installer dirs under tmp"
$tmp = Join-Path $Root "tmp"
if (Test-Path -LiteralPath $tmp) {
  Get-ChildItem -LiteralPath $tmp -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "vscode-stable-user-x64-*" } |
    ForEach-Object {
      $sz = Get-DirSizeGB $_.FullName
      $lines += ("- {0}: {1} GB" -f $_.Name, $sz)
    }
}

$lines += ""
$lines += "## Processes likely holding OpenClaw"
$names = "node","ollama","openclaw","9router","chrome","Code","CodeSetup"
Get-Process -ErrorAction SilentlyContinue |
  Where-Object { $names -contains $_.ProcessName } |
  Select-Object ProcessName, Id, Path |
  ForEach-Object { $lines += ("- {0} pid={1} path={2}" -f $_.ProcessName, $_.Id, $_.Path) }

$lines += ""
$lines += "## Config hints"
$configCandidates = @(
  (Join-Path $Root "openclaw.json"),
  (Join-Path $Root "state\openclaw.json"),
  "$env:USERPROFILE\.openclaw\openclaw.json"
)
foreach ($c in $configCandidates) {
  if (Test-Path -LiteralPath $c) { $lines += ("- FOUND config: {0}" -f $c) }
}
$lines += ("- OPENCLAW_STATE_DIR={0}" -f $env:OPENCLAW_STATE_DIR)
$lines += ("- OPENCLAW_WORKSPACE_DIR={0}" -f $env:OPENCLAW_WORKSPACE_DIR)

$lines += ""
$lines += "## Skill scan roots (existence only)"
$skillRoots = @(
  (Join-Path $Root "skills"),
  (Join-Path $Root "workspace\skills"),
  (Join-Path $Root "workspace")
)
foreach ($sr in $skillRoots) {
  if (Test-Path -LiteralPath $sr) {
    $skillDirs = Get-ChildItem -LiteralPath $sr -Directory -Recurse -Force -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -eq "skills" -or (Test-Path (Join-Path $_.FullName "SKILL.md")) }
    $lines += ("- under {0}: {1} skill-ish dirs" -f $sr, @($skillDirs).Count)
  }
}

$lines | Set-Content -LiteralPath $report -Encoding UTF8
Write-Host "Wrote $report"
Get-Content -LiteralPath $report
