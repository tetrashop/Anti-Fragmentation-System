import os
import re

# خواندن فایل base.html
with open('templates/base.html', 'r', encoding='utf-8') as f:
    content = f.read()

# جایگزینی 'home' با 'index'
content = content.replace("url_for('home')", "url_for('index')")
content = content.replace('url_for("home")', 'url_for("index")')

# ذخیره فایل اصلاح شده
with open('templates/base.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ templateها اصلاح شدند")
