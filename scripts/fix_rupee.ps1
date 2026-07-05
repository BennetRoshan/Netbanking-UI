$files = Get-ChildItem -Filter *.html

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    
    # Safely replace only the corrupted rupee characters
    $content = $content -replace 'â,¹', '&#8377;'
    $content = $content -replace ',1', '&#8377;'
    $content = $content -replace '₹', '&#8377;'
    
    Set-Content -Path $f.FullName -Value $content -Encoding UTF8
}

Write-Host "Rupee fixes applied"
