#!/bin/bash
echo "📡 مانیتورینگ لحظه‌ای سینک..."

for i in {1..10}; do
    echo "🔍 بررسی $i/10 - $(date)"
    
    RESPONSE=$(curl -s "https://anti-fragmentation-system.ramin-edjlal1359.workers.dev/health")
    VERSION=$(echo "$RESPONSE" | jq -r '.version' 2>/dev/null || echo "unknown")
    CLUSTER=$(echo "$RESPONSE" | jq -r '.cluster_control' 2>/dev/null || echo "unknown")
    
    echo "   نسخه: $VERSION"
    echo "   کنترل خوشه: $CLUSTER"
    
    if [ "$VERSION" == "5.0.0" ] && [ "$CLUSTER" == "active" ]; then
        echo "🎉 سینک کامل شد!"
        break
    fi
    
    if [ $i -lt 10 ]; then
        echo "⏳ 30 ثانیه منتظر می‌ماند..."
        sleep 30
    else
        echo "⚠️ سینک هنوز کامل نشده. لطفاً manually بررسی کنید."
    fi
done
