$files = Get-ChildItem -Filter *.html
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    
    # Remove type="module"
    $content = $content -replace '<script src="js/main.js" type="module"></script>', '<script src="js/main.js"></script>'
    
    # Fix Home link href="#" to href="index.html"
    $content = $content -replace '<a class="nav-link active" aria-current="page" href="#">Home</a>', '<a class="nav-link active" aria-current="page" href="index.html">Home</a>'
    
    Set-Content -Path $f.FullName -Value $content -Encoding UTF8
    Write-Host "Updated $($f.Name)"
}
