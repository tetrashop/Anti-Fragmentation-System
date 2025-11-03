#!/bin/bash

echo "🎯 تست کامل سامانه پس از اصلاح"
echo "⏰ لطفاً 2-3 دقیقه پس از استقرار منتظر بمانید..."
echo ""

# تست سلامت
echo "1. 🔍 تست سلامت سرویس:"
curl -s "https://anti-fragmentation-system.tetrashop.workers.dev/health" | jq '.' 2>/dev/null || curl -s "https://anti-fragmentation-system.tetrashop.workers.dev/health"

echo ""
echo "2. 📄 تست صفحات:"
pages=("/" "/nataq" "/mizanro" "/anti_fragmentation")

for page in "${pages[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://anti-fragmentation-system.tetrashop.workers.dev$page")
  echo "   $page -> $status"
done

echo ""
echo "3. 🔄 تست APIها:"
apis=("/api/nataq" "/api/mizanro" "/api/anti_fragmentation")

for api in "${apis[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -X GET "https://anti-fragmentation-system.tetrashop.workers.dev$api")
  echo "   GET $api -> $status"
done

echo ""
echo "✅ اگر همه statusها 200 باشند، مشکل حل شده است!"
