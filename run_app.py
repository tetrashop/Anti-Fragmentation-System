#!/usr/bin/env python3
from flask import Flask, render_template, request, jsonify
import os
import sys

app = Flask(__name__)

# تنظیمات امنیتی
app.config['SECRET_KEY'] = 'anti-fragmentation-system-secret-key'

# Routeهای اصلی
@app.route('/')
@app.route('/home')
@app.route('/index')
def index():
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

# توابع کمکی برای پردازش متن
def simple_nataq_processing(text):
    """پردازش ساده برای نطق مصطلح"""
    return f"✅ متن پردازش شده: {text}"

def simple_mizanro_analysis(text):
    """تحلیل ساده برای میزان‌رو"""
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    score = min(100, word_count * 3 + char_count // 10)
    
    return {
        'score': score,
        'word_count': word_count,
        'char_count': char_count,
        'analysis': 'تحلیل کیفیت متن انجام شد',
        'readability': 'مناسب' if score > 50 else 'نیاز به بهبود'
    }

def simple_anti_fragmentation(text):
    """کاهش ساده چندپارگی"""
    optimized = ' '.join(text.split())
    return {
        'optimized': optimized,
        'fragmentation_reduced': len(optimized) < len(text),
        'reduction_percent': max(0, (len(text) - len(optimized)) / len(text) * 100) if text else 0,
        'original_length': len(text),
        'optimized_length': len(optimized)
    }

# API endpoints
@app.route('/api/nataq', methods=['POST'])
def api_nataq():
    try:
        data = request.get_json()
        text = data.get('text', '') if data else ''
        if not text:
            return jsonify({'error': 'متن ورودی ضروری است'}), 400
        result = simple_nataq_processing(text)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': f'خطا در پردازش: {str(e)}'}), 500

@app.route('/api/mizanro', methods=['POST'])
def api_mizanro():
    try:
        data = request.get_json()
        text = data.get('text', '') if data else ''
        if not text:
            return jsonify({'error': 'متن ورودی ضروری است'}), 400
        result = simple_mizanro_analysis(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': f'خطا در تحلیل: {str(e)}'}), 500

@app.route('/api/anti_fragmentation', methods=['POST'])
def api_anti_frag():
    try:
        data = request.get_json()
        text = data.get('text', '') if data else ''
        if not text:
            return jsonify({'error': 'متن ورودی ضروری است'}), 400
        result = simple_anti_fragmentation(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': f'خطا در پردازش: {str(e)}'}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'Anti-Fragmentation System'})

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 سامانه ضد چندپارگی - Anti-Fragmentation System")
    print("=" * 50)
    print("📋 صفحات و APIهای موجود:")
    print("   🌐 http://localhost:5001/ - صفحه اصلی")
    print("   💬 http://localhost:5001/nataq - نطق مصطلح")
    print("   📊 http://localhost:5001/mizanro - میزان‌رو")
    print("   🔄 http://localhost:5001/anti_fragmentation - ضد چندپارگی")
    print("   ❤️  http://localhost:5001/health - وضعیت سرویس")
    print("=" * 50)
    print("📝 برای توقف برنامه: Ctrl+C")
    print("=" * 50)
    
    # استفاده از پورت 5001 به جای 5000
    app.run(host='0.0.0.0', port=5001, debug=True)
