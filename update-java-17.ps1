# Update JAVA_HOME to Java 17 after installation

# Find Java 17 installation
$javaBasePath = "C:\Program Files\Eclipse Adoptium"
$java17Path = Get-ChildItem -Path $javaBasePath -Directory | Where-Object { $_.Name -like "jdk-17*" } | Select-Object -First 1

if ($null -eq $java17Path) {
    Write-Host "ERROR: Java 17 not found!" -ForegroundColor Red
    Write-Host "Please install Java 17 from: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Current Java versions installed:" -ForegroundColor Cyan
    Get-ChildItem -Path $javaBasePath -Directory | ForEach-Object { Write-Host "  - $($_.Name)" }
    exit 1
}

$javaHome = $java17Path.FullName
$androidHome = "C:\Users\poiss\AppData\Local\Android\Sdk"

Write-Host "Found Java 17 at: $javaHome" -ForegroundColor Green

# Set JAVA_HOME to Java 17
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'User')
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidHome, 'User')

# Update PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')

# Remove old Java 25 path if present
$currentPath = $currentPath -replace "C:\\Program Files\\Eclipse Adoptium\\jdk-25[^;]*;?", ""

# Paths to add
$newPaths = @(
    "$javaHome\bin",
    "$androidHome\platform-tools",
    "$androidHome\tools",
    "$androidHome\tools\bin"
)

# Add paths if not already present
foreach ($path in $newPaths) {
    if ($currentPath -notlike "*$path*") {
        $currentPath += ";$path"
    }
}

# Update PATH
[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'User')

Write-Host ""
Write-Host "Environment variables updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "JAVA_HOME = $javaHome" -ForegroundColor Cyan
Write-Host "ANDROID_HOME = $androidHome" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: RESTART your terminal/VSCode for changes to take effect!" -ForegroundColor Yellow
Write-Host ""
Write-Host "After restarting, verify with:" -ForegroundColor Cyan
Write-Host "  java -version" -ForegroundColor White
Write-Host "  (Should show version 17.x.x)" -ForegroundColor Gray
