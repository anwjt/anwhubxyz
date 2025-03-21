# Script to set up Vercel monorepo structure
# Create qr-generator project directory if it doesn't exist
if (!(Test-Path -Path "projects/qr-generator")) {
    New-Item -ItemType Directory -Path "projects/qr-generator" -Force
}

# Copy core project files to qr-generator directory (excluding monorepo config files)
$filesToCopy = @(
    "app",
    "components",
    "hooks",
    "lib",
    "public",
    "styles",
    ".env.local",
    ".gitignore",
    "components.json",
    "next-env.d.ts",
    "next.config.mjs",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "tsconfig.json"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Write-Host "Copying $file to projects/qr-generator"
        if (Test-Path -PathType Container $file) {
            # It's a directory, use Copy-Item with -Recurse
            Copy-Item -Path $file -Destination "projects/qr-generator/" -Recurse -Force
        } else {
            # It's a file
            Copy-Item -Path $file -Destination "projects/qr-generator/" -Force
        }
    }
}

# Copy package.json with appropriate modifications for the QR Generator project
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$packageJson.name = "qr-generator"
$packageJson | ConvertTo-Json -Depth 100 | Set-Content "projects/qr-generator/package.json"

# Rename the monorepo package.json
if (Test-Path "package.json.monorepo") {
    Move-Item -Path "package.json.monorepo" -Destination "package.json.new" -Force
}

Write-Host "Monorepo setup completed successfully!"
