$files = Get-ChildItem -Filter *.html

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    
    # 1. Fix Rupee Symbol specifically for the bad encoding
    $content = $content -replace 'â,¹', '&#8377;'
    $content = $content -replace ',1', '&#8377;'
    
    # 2. Fix the overlap by removing old Nexa Chatbots
    if ($f.Name -eq 'index.html') {
        $content = $content -replace '(?s)<!-- Nexa Chatbot Bar -->.*?<!-- Nexa Chat Response Area.*?</div>\s*</div>\s*</div>', ''
    }
    
    Set-Content -Path $f.FullName -Value $content -Encoding UTF8
}

Write-Host "Replaced rupee symbols and removed old chatbots"
