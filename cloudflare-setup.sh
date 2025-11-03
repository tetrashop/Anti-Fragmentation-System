#!/bin/bash

echo "🚀 شروع استقرار خودکار سامانه ضد چندپارگی..."

# بررسی وجود Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "📦 نصب Wrangler..."
    npm install -g wrangler
fi

# لاگین به Cloudflare (اگر قبلاً انجام نشده)
echo "🔐 ورود به Cloudflare..."
wrangler login

# ایجاد پروژه جدید
echo "🆕 ایجاد پروژه Cloudflare Workers..."
wrangler init anti-fragmentation-system --yes

# رفتن به دایرکتوری پروژه
cd anti-fragmentation-system

# کپی فایل‌های پروژه
echo "📁 کپی فایل‌های پروژه..."
cp ../worker.js .
cp ../wrangler.toml .
cp ../package.json .

# استقرار
echo "☁️ در حال استقرار روی Cloudflare Workers..."
wrangler deploy

echo "✅ استقرار کامل شد!"
echo "🌐 آدرس سرویس شما: https://anti-fragmentation-system.YOUR_SUBDOMAIN.workers.dev"
