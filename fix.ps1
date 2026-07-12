$a = Get-Content 'features\loans\loans.html' | Select-Object -First 198
$b = Get-Content 'features\loans\loans.html' | Select-Object -Skip 329
$a + $b | Set-Content 'features\loans\loans.html' -Encoding UTF8
