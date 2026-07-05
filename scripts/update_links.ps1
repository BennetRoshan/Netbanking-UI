$files = Get-ChildItem -Filter *.html
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $newContent = [regex]::Replace($content, 'href="#"(>\s*<i class="bi bi-shield-check)', 'href="support.html"$1')
    if ($newContent -ne $content) {
        Set-Content $f.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated $($f.Name)"
    }
}
