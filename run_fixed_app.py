#!/usr/bin/env python3
from fixed_app import app
import sys

if __name__ == '__main__':
    port = 5002
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    
    print("=" * 50)
    print("🚀 سامانه ضد چندپارگی - Anti-Fragmentation System")
    print("=" * 50)
    print(f"🌐 آدرس: http://localhost:{port}")
    print("📋 صفحات موجود:")
    print(f"   📍 http://localhost:{port}/ - صفحه اصلی")
    print(f"   💬 http://localhost:{port}/nataq - نطق مصطلح")
    print(f"   📊 http://localhost:{port}/mizanro - میزان‌رو")
    print(f"   🔄 http://localhost:{port}/anti_fragmentation - ضد چندپارگی")
    print(f"   ❤️  http://localhost:{port}/health - وضعیت سرویس")
    print("=" * 50)
    print("📝 برای توقف برنامه: Ctrl+C")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=port, debug=True)
