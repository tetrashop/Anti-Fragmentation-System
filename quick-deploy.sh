#!/bin/bash

echo "🚀 استقرار فوری سامانه ضد چندپارگی"
echo "⏰ زمان شروع: $(date)"

# بررسی پیش‌نیازها
echo "🔍 بررسی پیش‌نیازها..."
if ! command -v git &> /dev/null; then
    echo "❌ Git نصب نیست"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "📦 نصب Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# نصب Wrangler
echo "📦 نصب Wrangler..."
npm install -g wrangler

# لاگین به Cloudflare
echo "🔐 ورود به Cloudflare..."
wrangler login

# استقرار پروژه
echo "☁️ در حال استقرار روی Cloudflare Workers..."
wrangler deploy

echo "✅ استقرار کامل شد!"
echo "🌐 آدرس سرویس شما: https://anti-fragmentation-system.YOUR_SUBDOMAIN.workers.dev"
echo "📊 برای تست: curl https://anti-fragmentation-system.YOUR_SUBDOMAIN.workers.dev/health"
