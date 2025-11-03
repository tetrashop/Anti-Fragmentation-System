import os
import re

# لیست تمام templateها
template_files = ['base.html', 'index.html', 'nataq.html', 'mizanro.html', 'anti_fragmentation.html']

for template_file in template_files:
    file_path = os.path.join('templates', template_file)
    if os.path.exists(file_path):
        print(f"🔧 در حال اصلاح {template_file}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # جایگزینی endpointهای قدیمی با جدید
        content = content.replace("url_for('nataq_page')", "url_for('nataq')")
        content = content.replace("url_for('mizanro_page')", "url_for('mizanro')")
        content = content.replace("url_for('anti_fragmentation_page')", "url_for('anti_fragmentation')")
        
        # جایگزینی برای نقل قول دوگانه
        content = content.replace('url_for("nataq_page")', 'url_for("nataq")')
        content = content.replace('url_for("mizanro_page")', 'url_for("mizanro")')
        content = content.replace('url_for("anti_fragmentation_page")', 'url_for("anti_fragmentation")')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {template_file} اصلاح شد")

print("🎉 تمام templateها با موفقیت اصلاح شدند")
