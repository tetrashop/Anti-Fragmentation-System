#!/bin/bash
echo "🚀 راه‌حل تسریع سینک..."

echo "1. بررسی وضعیت GitHub:"
git log --oneline -5

echo "2. بررسی تغییرات اخیر:"
git status

echo "3. اگر تغییری وجود دارد، commit کن:"
read -p "آیا می‌خواهید تغییرات را commit کنید؟ (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .
    git commit -m "🔄 سینک فوری - فعال‌سازی کنترل خوشه‌ای"
    git push origin main
    echo "✅ تغییرات آپلود شدند"
fi

echo "4. راه‌اندازی مجدد از Cloudflare Dashboard:"
echo "   - به https://dash.cloudflare.com بروید"
echo "   - Workers & Pages → anti-fragmentation-system"
echo "   - روی 'Configure Worker' کلیک کنید"
echo "   - 'Save and Deploy' را بزنید"

echo ""
echo "⏳ 2-3 دقیقه منتظر بمانید سپس بررسی کنید:"
echo "🌐 https://anti-fragmentation-system.ramin-edjlal1359.workers.dev/health"
