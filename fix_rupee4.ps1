$files = Get-ChildItem -Filter *.html

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    
    # Replace the exact sequence â‚¹
    $content = $content -replace 'â‚¹', '&#8377;'
    
    # Also fix a?sA1 if it exists
    $content = $content -replace 'A\?sA1', '&#8377;'
    
    Set-Content -Path $f.FullName -Value $content -Encoding UTF8
}

Write-Host "Rupee fixed globally with correct low-9 quote!"
