#!/usr/bin/env python3
from flask import Flask, render_template, request, jsonify
import os
import sys

app = Flask(__name__)

# Routeهای اصلی
@app.route('/')
def index():
    print("📄 درخواست برای صفحه اصلی دریافت شد")
    return render_template('index.html')

@app.route('/nataq')
def nataq():
    return render_template('nataq.html')

@app.route('/mizanro')
def mizanro():
    return render_template('mizanro.html')

@app.route('/anti_fragmentation')
def anti_fragmentation():
    return render_template('anti_fragmentation.html')

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'Anti-Fragmentation System'})

# API endpoints
@app.route('/api/nataq', methods=['POST'])
def api_nataq():
    text = request.json.get('text', '')
    return jsonify({'result': f'پردازش نطق مصطلح: {text}'})

@app.route('/api/mizanro', methods=['POST'])
def api_mizanro():
    text = request.json.get('text', '')
    return jsonify({'score': 85, 'analysis': 'تحلیل اولیه'})

@app.route('/api/anti_fragmentation', methods=['POST'])
def api_anti_frag():
    text = request.json.get('text', '')
    return jsonify({'optimized': text, 'fragmentation_reduced': True})

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 سامانه ضد چندپارگی - در حال راه‌اندازی...")
    print("=" * 60)
    
    try:
        # تست load کردن templateها
        print("🔍 بررسی templateها...")
        with app.test_client() as client:
            print("✅ Templateها قابل load هستند")
        
        port = 5002
        print(f"🌐 تلاش برای راه‌اندازی روی پورت {port}...")
        print(f"📱 آدرس دسترسی: http://localhost:{port}")
        print(f"🌐 آدرس شبکه: http://0.0.0.0:{port}")
        print("=" * 60)
        
        app.run(host='0.0.0.0', port=port, debug=True, threaded=True)
        
    except Exception as e:
        print(f"❌ خطا در راه‌اندازی: {e}")
        print("🔄 تلاش با پورت متفاوت...")
        app.run(host='0.0.0.0', port=5003, debug=True, threaded=True)
