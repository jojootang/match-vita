# Stripe Webhook Setup Guide
Write-Host "🎯 STRIPE WEBHOOK SETUP INSTRUCTIONS" -ForegroundColor Green -BackgroundColor Black
Write-Host "====================================" -ForegroundColor Gray
Write-Host "" -ForegroundColor White

Write-Host "✅ YOUR WEBHOOK IS READY!" -ForegroundColor Green
Write-Host "" -ForegroundColor White

Write-Host "📌 Available URLs (both work):" -ForegroundColor Cyan
Write-Host "1. https://matchvita.com/api/webhooks/stripe" -ForegroundColor White
Write-Host "2. https://www.matchvita.com/api/webhooks/stripe" -ForegroundColor White
Write-Host "" -ForegroundColor White

Write-Host "🔧 Step 1: Update Stripe Dashboard" -ForegroundColor Yellow
Write-Host "   a. Go to: https://dashboard.stripe.com/test/webhooks" -ForegroundColor White
Write-Host "   b. Click 'Match Vita' destination" -ForegroundColor White
Write-Host "   c. Click 'Edit'" -ForegroundColor White
Write-Host "   d. Change URL to: https://www.matchvita.com/api/webhooks/stripe" -ForegroundColor Cyan
Write-Host "   e. SAVE" -ForegroundColor White
Write-Host "" -ForegroundColor White

Write-Host "🔧 Step 2: Test with Stripe CLI" -ForegroundColor Yellow
Write-Host "   Open PowerShell window 1:" -ForegroundColor White
Write-Host "   npx stripe-cli login" -ForegroundColor Green
Write-Host "   npx stripe-cli listen --forward-to https://www.matchvita.com/api/webhooks/stripe" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "   Open PowerShell window 2:" -ForegroundColor White
Write-Host "   npx stripe-cli trigger checkout.session.completed" -ForegroundColor Green
Write-Host "" -ForegroundColor White

Write-Host "🔧 Step 3: Or test in Stripe Dashboard" -ForegroundColor Yellow
Write-Host "   a. In Stripe Webhooks page" -ForegroundColor White
Write-Host "   b. Click 'Send test events'" -ForegroundColor White
Write-Host "   c. Select 'checkout.session.completed'" -ForegroundColor White
Write-Host "   d. Click 'Send test webhook'" -ForegroundColor White
Write-Host "" -ForegroundColor White

Write-Host "📊 Step 4: Check logs" -ForegroundColor Yellow
Write-Host "   Vercel Logs: https://vercel.com/jojoos-projects/matchvita/deployments" -ForegroundColor White
Write-Host "   Click latest deployment → Logs" -ForegroundColor White
Write-Host "" -ForegroundColor White

Write-Host "🎉 DONE! Your Stripe integration is ready!" -ForegroundColor Green