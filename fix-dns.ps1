# DNS Verification Script
Write-Host "🔍 Verifying DNS Configuration" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Gray

# Correct Vercel IPs
$correctIPs = @("76.76.21.21", "76.76.21.22")
$wrongIP = "216.198.79.1"

Write-Host "`n✅ Correct Vercel IPs:" -ForegroundColor Green
foreach ($ip in $correctIPs) {
    Write-Host "  $ip" -ForegroundColor Cyan
}

Write-Host "`n❌ Wrong IP (DO NOT USE):" -ForegroundColor Red
Write-Host "  $wrongIP" -ForegroundColor Red

# Check current DNS
Write-Host "`n🔍 Current DNS Configuration:" -ForegroundColor Yellow

try {
    $currentRecords = Resolve-DnsName -Name "matchvita.com" -Type A -ErrorAction Stop
    Write-Host "  Current A records for matchvita.com:" -ForegroundColor White
    
    $hasWrongIP = $false
    foreach ($record in $currentRecords) {
        Write-Host "  - $($record.IPAddress)" -ForegroundColor White
        
        if ($record.IPAddress -eq $wrongIP) {
            Write-Host "    ⚠️ WRONG! This IP is incorrect!" -ForegroundColor Red
            $hasWrongIP = $true
        }
        
        if ($correctIPs -contains $record.IPAddress) {
            Write-Host "    ✅ CORRECT! This is a valid Vercel IP" -ForegroundColor Green
        }
    }
    
    if ($hasWrongIP) {
        Write-Host "`n🚨 ACTION REQUIRED:" -ForegroundColor Red -BackgroundColor Black
        Write-Host "You have the wrong IP address in your DNS!" -ForegroundColor White
        Write-Host "Go to Namecheap and change it to: 76.76.21.21 and 76.76.21.22" -ForegroundColor White
    }
    
} catch {
    Write-Host "  Cannot resolve DNS for matchvita.com" -ForegroundColor Red
}

# Test www version
Write-Host "`n🔍 Checking www version:" -ForegroundColor Yellow
try {
    $wwwRecords = Resolve-DnsName -Name "www.matchvita.com" -Type CNAME -ErrorAction Stop
    Write-Host "  Current CNAME for www.matchvita.com:" -ForegroundColor White
    foreach ($record in $wwwRecords) {
        Write-Host "  - $($record.NameHost)" -ForegroundColor White
    }
} catch {
    Write-Host "  Cannot resolve CNAME for www.matchvita.com" -ForegroundColor Red
}

Write-Host "`n🎯 Quick Fix Instructions:" -ForegroundColor Green
Write-Host "1. Login to Namecheap" -ForegroundColor White
Write-Host "2. Go to: Domain List → matchvita.com → Manage" -ForegroundColor White
Write-Host "3. Click: Advanced DNS" -ForegroundColor White
Write-Host "4. Remove ALL A records with IP: 216.198.79.1" -ForegroundColor Red
Write-Host "5. Add NEW A records:" -ForegroundColor Cyan
Write-Host "   - Type: A, Host: @, Value: 76.76.21.21" -ForegroundColor White
Write-Host "   - Type: A, Host: @, Value: 76.76.21.22" -ForegroundColor White
Write-Host "6. Save and wait 10 minutes" -ForegroundColor White