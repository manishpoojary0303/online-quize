# SeminarQuiz - Lightweight Local Development Server for Windows
# Runs natively using .NET HttpListener without requiring Node.js or Python.

param(
    [int]$Port = 3000
)

$HostIP = "localhost"
$Prefix = "http://$HostIP`:$Port/"
$Folder = $PSScriptRoot

if (-not (Test-Path $Folder)) {
    $Folder = Get-Location
}

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add($Prefix)

try {
    $Listener.Start()
} catch {
    Write-Host "[ERROR] Could not start server on port $Port. Retrying on port 8080..." -ForegroundColor Yellow
    $Port = 8080
    $Prefix = "http://$HostIP`:$Port/"
    $Listener = New-Object System.Net.HttpListener
    $Listener.Prefixes.Add($Prefix)
    $Listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " SeminarQuiz Local Server Running!" -ForegroundColor Green
Write-Host " Local URL:     $Prefix" -ForegroundColor White
Write-Host " Direct Quiz:  $Prefix`index.html#/quiz/ds-fundamentals" -ForegroundColor White
Write-Host " Organizer QR: $Prefix`index.html#/organizer" -ForegroundColor White
Write-Host " Press Ctrl+C in this terminal window to stop the server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Try opening in default browser automatically
try {
    Start-Process $Prefix
} catch {}

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
}

while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $UrlPath = $Request.Url.LocalPath
        if ($UrlPath -eq "/" -or $UrlPath -eq "") {
            $UrlPath = "/index.html"
        }

        $CleanPath = $UrlPath.TrimStart("/").Replace("/", "\")
        $FilePath = Join-Path $Folder $CleanPath

        if (Test-Path $FilePath -PathType Leaf) {
            $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = $MimeTypes[$Ext]
            if (-not $ContentType) { $ContentType = "application/octet-stream" }

            $Response.ContentType = $ContentType
            $Response.Headers.Add("Access-Control-Allow-Origin", "*")
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentLength64 = $Bytes.Length
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            $Response.StatusCode = 404
            $Buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $Response.ContentLength64 = $Buffer.Length
            $Response.OutputStream.Write($Buffer, 0, $Buffer.Length)
        }
        $Response.OutputStream.Close()
    } catch {
        # Listener stopped or client aborted
    }
}
