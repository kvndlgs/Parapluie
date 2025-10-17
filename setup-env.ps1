# Set environment variables for Android development
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-25.0.0.36-hotspot"
$androidHome = "C:\Users\poiss\AppData\Local\Android\Sdk"

# Set JAVA_HOME and ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'User')
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidHome, 'User')

# Get current PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')

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

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "JAVA_HOME = $javaHome" -ForegroundColor Cyan
Write-Host "ANDROID_HOME = $androidHome" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please RESTART your terminal/VSCode for changes to take effect!" -ForegroundColor Yellow
