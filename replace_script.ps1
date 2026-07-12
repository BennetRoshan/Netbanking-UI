$path = "C:\Users\benne\Downloads\Nexus bank front end\features\cards\cards.html"
$lines = Get-Content $path
$start = -1
$end = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq '<script>' -and $lines[$i+1].Trim() -match "^document.addEventListener\('DOMContentLoaded'") {
        $start = $i
    }
    if ($start -ne -1 -and $i -gt $start -and $lines[$i].Trim() -eq '</script>') {
        $end = $i
        break
    }
}
if ($start -ne -1 -and $end -ne -1) {
    $newLines = @()
    for ($i = 0; $i -lt $start; $i++) { $newLines += $lines[$i] }
    $newLines += '    <script src="cards-logic.js"></script>'
    for ($i = $end + 1; $i -lt $lines.Count; $i++) { $newLines += $lines[$i] }
    $newLines | Set-Content $path -Encoding UTF8
}
