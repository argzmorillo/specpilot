param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("up", "down", "restart", "open")]
  [string]$Command
)

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$LocalConfigPath = Join-Path $PSScriptRoot "specpilot.local.ps1"

$DockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
$BrowserPath = "brave.exe"
$EditorCommand = "code"

if (Test-Path $LocalConfigPath) {
  . $LocalConfigPath
}

function Open-Project {
  Start-Process $EditorCommand -ArgumentList "`"$ProjectRoot`""

  Start-Process $BrowserPath @(
    "http://localhost:4200",
    "http://localhost:8080"
  )
}

function Start-Project {
  if (Test-Path $DockerDesktopPath) {
    Start-Process $DockerDesktopPath
  }

  Start-Sleep -Seconds 20

  Set-Location $ProjectRoot
  docker compose up -d

  Start-Sleep -Seconds 5

  Open-Project
}

function Stop-Project {
  Set-Location $ProjectRoot
  docker compose down
}

switch ($Command) {
  "up" { Start-Project }
  "down" { Stop-Project }
  "restart" { Stop-Project; Start-Project }
  "open" { Open-Project }
}