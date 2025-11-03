#!/bin/bash

echo "🚀 استقرار مجدد سامانه با نسخه اصلاح شده..."

# آپدیت فایل‌ها در Git
git add worker.js
git commit -m "fix: complete routing and fix all endpoints"
git push origin main

echo "✅ کدهای اصلاح شده به GitHub ارسال شدند"
echo ""
echo "📋 اگر از GitHub Actions استفاده می‌کنید:"
echo "   - منتظر بمانید تا استقرار خودکار انجام شود"
echo "   - یا manually workflow را اجرا کنید"
echo ""
echo "🔗 آدرس سامانه: https://anti-fragmentation-system.tetrashop.workers.dev"
echo "🧪 تست endpointها:"
echo "   /             -> صفحه اصلی"
echo "   /nataq        -> نطق مصطلح" 
echo "   /mizanro      -> میزان‌رو"
echo "   /anti_fragmentation -> ضد چندپارگی"
echo "   /health       -> وضعیت سرویس"
