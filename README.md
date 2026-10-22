# سامانهٔ ضد چندپارگی فارسی
### Anti-Fragmentation System - Persian Text Processing Platform

<div align="center">

![Version](https://img.shields.io/badge/version-3.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Flask](https://img.shields.io/badge/flask-2.3.3-orange)
![License](https://img.shields.io/badge/license-MIT-purple)
![Status](https://img.shields.io/badge/status-production--ready-success)

**پردازشگر جامع متون فارسی با تحلیل خوانایی، خلاصه‌سازی، استخراج کلیدواژه و اصلاح هوشمند**

[🌐 نسخه آنلاین](https://anti-fragmentation-system.vercel.app) · [🐛 گزارش باگ](https://github.com/tetrashop/Anti-Fragmentation-System/issues) · [📖 مستندات](#-api-ها)

</div>

---

## 📋 فهرست مطالب

- [چکیده](#-چکیده)
- [ویژگی‌ها](#-ویژگیها)
- [معماری](#-معماری)
- [نصب و راه‌اندازی](#-نصب-و-راهاندازی)
- [APIها](#-api-ها)
- [نمونه‌های استفاده](#-نمونههای-استفاده)
- [رابط کاربری](#-رابط-کاربری)
- [تاریخچه عیب‌زدایی](#-تاریخچه-عیبزدایی)
- [استقرار](#-استقرار)
- [توسعه آتی](#-توسعه-آتی)
- [مجوز](#-مجوز)

---

## 🎯 چکیده

**سامانه ضد چندپارگی** یک پلتفرم تحت وب مبتنی بر Flask است که برای پردازش، تحلیل و بهینه‌سازی متون فارسی طراحی شده است. این سامانه با ترکیب شش ماژول تخصصی، امکان **اصلاح هوشمند نویسه‌های عربی**، **استانداردسازی نیم‌فاصله**، **تحلیل خوانایی علمی**، **خلاصه‌سازی استخراجی**، **استخراج کلیدواژه** و **کاهش چندپارگی** را در یک رابط کاربری یکپارچه فراهم می‌کند.

این پروژه به‌طور ویژه برای **متون دانشگاهی و پژوهشی** بهینه شده و می‌تواند به‌عنوان یک سرویس مستقل (SaaS) یا کتابخانه پایتون در پروژه‌های NLP فارسی استفاده شود.

---

## ✨ ویژگی‌ها

### ۱. 💬 نطق مصطلح (Nataq Processor)
- جایگزینی نویسه‌های عربی (`ي` → `ی`، `ك` → `ک`، `ة` → `ه`)
- استانداردسازی نیم‌فاصله در پیشوندها (`می‌شود`) و پسوندها (`کتاب‌ها`)
- تبدیل اعداد انگلیسی و عربی به فارسی
- اصلاح فاصله‌گذاری علائم نگارشی
- پشتیبانی از محدودیت طول (برای چکیده مقالات)

### ۲. 📊 میزان‌رو (Mizanro Analyzer)
- شمارش کلمات، جملات و واژه‌های یکتا
- محاسبه تنوع واژگانی (Lexical Diversity)
- امتیاز پیچیدگی متن
- تحلیل ساختار زبانی

### ۳. 🔄 ضد چندپارگی (Anti-Fragmentation)
- حذف فاصله‌های اضافی و خطوط خالی متوالی
- محاسبه امتیاز چندپارگی قبل و بعد از پردازش
- گزارش درصد بهبود

### ۴. 📖 تحلیل خوانایی (Readability)
- امتیاز خوانایی (۰ تا ۱۰۰)
- تخمین سطح مخاطب (عمومی، دبیرستان، دانشگاهی، تخصصی)
- محاسبه میانگین طول جمله و کلمه
- نسبت کلمات پیچیده
- زمان تخمینی مطالعه
- پیشنهادهای بهبود خوانایی

### ۵. 🔑 استخراج کلیدواژه (Keyword Extractor)
- استخراج ۱۰ کلیدواژه برتر با وزن‌دهی فرکانسی
- شناسایی ترکیبات دوتایی معنادار (Bigrams)
- فیلتر کلمات توقف فارسی

### ۶. 📄 خلاصه‌سازی استخراجی (Summarizer)
- خلاصه‌سازی خودکار تا ۷۰٪ کاهش حجم
- وزن‌دهی بر اساس فرکانس و موقعیت جمله
- حفظ انسجام و ترتیب اصلی متن

### ۷. 🔍 تحلیل جامع (Comprehensive Analyzer)
همه‌ی موارد بالا در **یک درخواست** با خروجی JSON ساختاریافته.

---

## 🏗️ معماری

```

Anti-Fragmentation-System/
│
├── 📄 index.py                        # نقطه ورود اصلی (Flask app - نسخه Vercel)
├── 📄 main.py                          # نسخه توسعه محلی
├── 📄 algorithm_manager.py             # سیستم بروزرسانی پویای الگوریتم‌ها
├── 📄 requirements.txt                 # وابستگی‌ها
├── 📄 vercel.json                      # تنظیمات استقرار Vercel
│
├── 📁 text_processor/                  # بسته ماژول‌های پردازش
│   ├── init.py                     # export همه ماژول‌ها
│   ├── nataq.py                        # NataqProcessor
│   ├── mizanro.py                      # MizanroAnalyzer
│   ├── anti_frag.py                    # AntiFragmentation
│   ├── readability.py                  # ReadabilityAnalyzer
│   ├── keywords.py                     # KeywordExtractor
│   ├── summarizer.py                   # Summarizer
│   └── comprehensive.py                # ComprehensiveAnalyzer
│
├── 📁 templates/                       # قالب‌های HTML (فقط برای main.py محلی)
├── 📁 static/                          # فایل‌های CSS/JS/تصاویر
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   └── style.css
│   ├── js/
│   │   ├── bootstrap.min.js
│   │   └── script.js
│   └── images/
│       └── logo.svg
│
├── 📁 algorithm_backups/               # پشتیبان خودکار الگوریتم‌ها (auto)
├── 📁 tests/                           # تست‌های واحد
└── 📄 README.md                        # همین فایل

```

### 🔄 جریان پردازش در `/analyze`

```

متن ورودی
↓
[1] NataqProcessor       ← اصلاح نویسه، نیم‌فاصله، اعداد
↓
[2] AntiFragmentation    ← حذف فاصله‌های اضافی
↓
├──[3] MizanroAnalyzer    → کیفیت و پیچیدگی
├──[4] ReadabilityAnalyzer → خوانایی
├──[5] KeywordExtractor    → کلیدواژه
└──[6] Summarizer           → خلاصه
↓
JSON خروجی یکپارچه

```

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Python 3.8 یا بالاتر
- pip (مدیر بسته پایتون)
- Git

### نصب سریع

```bash
# ۱. کلون مخزن
git clone https://github.com/tetrashop/Anti-Fragmentation-System.git
cd Anti-Fragmentation-System

# ۲. نصب وابستگی‌ها
pip install -r requirements.txt

# ۳. اجرا
python main.py
```

سپس آدرس http://localhost:5000 را باز کنید.

اجرای نسخه Vercel (محلی)

```bash
python index.py
```

استفاده به‌عنوان کتابخانه

```python
from text_processor import (
    NataqProcessor, 
    MizanroAnalyzer, 
    AntiFragmentation,
    ComprehensiveAnalyzer
)

# فقط تصحیح
proc = NataqProcessor()
corrected = proc.process("در اين مقاله به بررسي مساله ي چندپارگي مي‌پردازيم")
# → "در این مقاله به بررسی مسئله‌ای چندپارگی می‌پردازیم"

# تحلیل جامع
analyzer = ComprehensiveAnalyzer(max_length=250)
result = analyzer.analyze(corrected)
print(result['readability']['readability_score'])  # 42.5
print(result['keywords'][:5])                       # ۵ کلیدواژه برتر
print(result['summary'])                            # خلاصه
```

---

🌐 APIها

آدرس پایه: https://anti-fragmentation-system.vercel.app

۱. POST /nataq - نطق مصطلح

ورودی:

```json
{ "text": "كتابي درباره‌ي شعر" }
```

خروجی:

```json
{
  "success": true,
  "processed_text": "کتابی درباره‌ی شعر"
}
```

---

۲. POST /mizanro - میزان‌رو

ورودی:

```json
{ "text": "این یک جمله است. این هم جمله دوم." }
```

خروجی:

```json
{
  "success": true,
  "analysis": {
    "word_count": 8,
    "sentence_count": 2,
    "unique_words": 6,
    "avg_sentence_length": 4.0,
    "lexical_diversity": 0.75,
    "complexity_score": 42
  }
}
```

---

۳. POST /anti_fragmentation - ضد چندپارگی

ورودی:

```json
{ "text": "این   یک    متن        شلوغ است." }
```

خروجی:

```json
{
  "success": true,
  "processed_text": "این یک متن شلوغ است.",
  "fragmentation_score_before": 26,
  "fragmentation_score_after": 0,
  "improvement_percentage": 100.0
}
```

---

۴. POST /analyze - تحلیل جامع ⭐

ورودی:

```json
{
  "text": "متن دانشگاهی مورد بررسی...",
  "max_length": 250
}
```

خروجی:

```json
{
  "success": true,
  "original_text": "...",
  "cleaned_text": "...",
  "quality": {
    "word_count": 52,
    "sentence_count": 5,
    "complexity_score": 62
  },
  "readability": {
    "readability_score": 41.8,
    "level": "متوسط (مناسب دانشگاهی)",
    "recommendations": ["..."]
  },
  "keywords": [
    { "word": "مقاله", "frequency": 3, "type": "unigram" },
    { "word": "چندپارگی متون", "frequency": 2, "type": "bigram" }
  ],
  "summary": "...",
  "stats": {
    "word_count": 52,
    "char_count": 306,
    "sentence_count": 5
  },
  "limit": {
    "max": 250,
    "remaining": 198,
    "exceeded": false
  }
}
```

---

۵. GET /health - بررسی سلامت

```json
{
  "status": "healthy",
  "service": "Anti-Fragmentation System",
  "modules": "loaded"
}
```

---

💡 نمونه‌های استفاده

cURL

```bash
# تست نطق
curl -X POST https://anti-fragmentation-system.vercel.app/nataq \
  -H "Content-Type: application/json" \
  -d '{"text":"كتابي درباره‌ي شعر"}'

# تست تحلیل جامع
curl -X POST https://anti-fragmentation-system.vercel.app/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"متن نمونه برای تحلیل","max_length":100}'
```

Python

```python
import requests

response = requests.post(
    'https://anti-fragmentation-system.vercel.app/analyze',
    json={'text': 'متن دانشگاهی نمونه', 'max_length': 250}
)
print(response.json())
```

JavaScript

```javascript
fetch('https://anti-fragmentation-system.vercel.app/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'متن نمونه', max_length: 250 })
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

🎨 رابط کاربری

سامانه دارای ۵ صفحه تعاملی است:

صفحه مسیر ویژگی
🏠 خانه / نمای کلی ۴ سرویس
💬 نطق /nataq فرم ساده با نمایش نتیجه
📊 میزان‌رو /mizanro نمایش شاخص‌های کیفیت
🔄 ضد چندپارگی /anti_fragmentation مقایسه قبل/بعد با نمودار
🔍 تحلیل جامع /analyze تحلیل کامل با تمام شاخص‌ها

پاسخ‌گو (Responsive) — با Bootstrap 5 برای همه دستگاه‌ها بهینه‌سازی شده.

---

🐛 تاریخچه عیب‌زدایی

در توسعه این پروژه ۹ باگ بحرانی شناسایی و رفع شد:

# باگ محل راه‌حل
۱ محاسبه دوباره فاصله‌ها در fragmentation score anti_frag.py تفکیک ضرایب برای فاصله و خط جدید
۲ ناسازگاری پورت‌ها main.py / app_simple.py یکسان‌سازی روی پورت ۵۰۰۰
۳ import اشتباه کلاس‌ها __init__.py from .module import Class
۴ پیام‌های خطای غیراستاندارد APIها استانداردسازی به انگلیسی
۵ عدم پذیرش POST مسیرها methods=['GET','POST']
۶ پاسخ HTML بجای JSON POST if request.method == 'POST'
۷ AttributeError: 'dict' object has no attribute 'count' main.py استخراج processed_text از dict
۸ TemplateNotFound در Vercel index.py جاسازی HTML با render_template_string
۹ ۴۰۴ فایل‌های استاتیک static/ ایجاد Bootstrap/Logo

تست‌های موفق نهایی (روی Vercel):

Endpoint ورودی نمونه خروجی مورد انتظار وضعیت
/nataq كتابي کتابی ✅
/mizanro جمله تست word_count=2 ✅
/anti_fragmentation متن   شلوغ متن شلوغ ✅
/analyze متن دانشگاهی همه شاخص‌ها ✅
/health — status=healthy ✅

---

🚢 استقرار

Vercel (توصیه‌شده برای دموی سریع)

```bash
npm i -g vercel
vercel --prod
```

یا از طریق داشبورد vercel.com مخزن را import کنید.

Render (توصیه‌شده برای production)

1. اکانت رایگان در render.com بسازید
2. New → Web Service → اتصال به GitHub
3. تنظیمات:
   · Build Command: pip install -r requirements.txt
   · Start Command: gunicorn index:app --bind 0.0.0.0:$PORT --timeout 120
4. Deploy

⚠️ برای جلوگیری از خواب ۱۵ دقیقه‌ای در پلن رایگان، از cron-job.org برای پینگ دوره‌ای /health استفاده کنید.

Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "index:app", "--bind", "0.0.0.0:5000"]
```

```bash
docker build -t anti-frag .
docker run -p 5000:5000 anti-frag
```

---

🔮 توسعه آتی

کوتاه‌مدت

☐ 🔐 احراز هویت API با توکن
☐ 📥 خروجی PDF گزارش تحلیل
☐ 💾 ذخیره‌سازی تاریخچه در پایگاه داده
☐ 📊 داشبورد آمار استفاده

میان‌مدت

☐ 🤖 تصحیح دستوری با NLP
☐ 📚 دیکشنری غلط‌یاب بزرگ
☐ 🌐 پشتیبانی چندزبانه (عربی/انگلیسی)
☐ ⚡ PWA برای نصب روی موبایل

بلندمدت

☐ 🧠 یادگیری ماشین برای پیشنهاد اصلاحات
☐ 📈 تحلیل احساسات (Sentiment Analysis)
☐ 🔍 تشخیص سرقت ادبی
☐ 🎯 سیستم بروزرسانی الگوریتمی خودکار (فعال‌سازی کامل algorithm_manager.py)

---

🤝 مشارکت

از مشارکت شما استقبال می‌کنیم!

```bash
# ۱. Fork کنید
# ۲. Branch جدید بسازید
git checkout -b feature/awesome-feature

# ۳. تغییرات را commit کنید
git commit -m "Add awesome feature"

# ۴. Push کنید
git push origin feature/awesome-feature

# ۵. Pull Request ارسال کنید
```

قوانین کدنویسی

· PEP 8 برای پایتون
· تست‌های واحد برای هر ماژول جدید
· به‌روزرسانی README.md هنگام افزودن قابلیت جدید

---

📊 آمار پروژه

شاخص مقدار
خطوط کد ~۱٫۲۰۰
ماژول‌های پردازش ۷
Endpointهای API ۵
صفحات UI ۵
باگ‌های رفع‌شده ۹
پوشش تست ~۷۵٪

---

📜 مجوز

این پروژه تحت مجوز MIT منتشر شده است. برای جزئیات، فایل LICENSE را ببینید.

```
MIT License

Copyright (c) 2025 Ramin Edjlal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

📞 تماس و پشتیبانی

· GitHub Issues: گزارش باگ یا درخواست قابلیت
· نسخه آنلاین: anti-fragmentation-system.vercel.app
· مخزن گیت‌هاب: tetrashop/Anti-Fragmentation-System

---

🙏 قدردانی

· تیم Flask
· تیم Vercel برای پلتفرم رایگان
· جامعه Termux برای محیط توسعه موبایل

---

<div align="center">

⭐ اگر این پروژه برایتان مفید بود، به آن ستاره بدهید ⭐

ساخته شده با ❤️ برای زبان فارسی

نسخه ۳.۰ — اکتبر ۲۰۲۶

</div>
