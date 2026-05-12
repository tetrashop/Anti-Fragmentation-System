#!/usr/bin/env python3
from flask import Flask, render_template, request, jsonify
import os
import sys

app = Flask(__name__)

# تنظیمات امنیتی
app.config['SECRET_KEY'] = 'anti-fragmentation-system-secret-key'

# اضافه کردن مسیر ماژول‌ها
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(current_dir, 'modules'))
sys.path.insert(0, os.path.join(current_dir, 'text_processor'))

# Routeهای اصلی
@app.route('/')
@app.route('/home')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/nataq', methods=['GET', 'POST'])
def nataq():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Bad Request', 'message': 'Input text is required'}), 400
        from text_processor import NataqProcessor
        proc = NataqProcessor()
        result = proc.process(data['text'])
        return jsonify({'success': True, 'processed_text': result})
    return render_template('nataq.html')

@app.route('/mizanro', methods=['GET', 'POST'])
def mizanro():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Bad Request', 'message': 'Input text is required'}), 400
        from text_processor import MizanroAnalyzer
        analyzer = MizanroAnalyzer()
        result = analyzer.analyze(data['text'])
        return jsonify(result)
    return render_template('mizanro.html')

@app.route('/anti_fragmentation', methods=['GET', 'POST'])
def anti_fragmentation():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Bad Request', 'message': 'Input text is required'}), 400
        from text_processor import AntiFragmentation
        proc = AntiFragmentation()
        original = data['text']
        result_dict = proc.process(original)
        processed = result_dict['processed_text'] if isinstance(result_dict, dict) else result_dict
        score_before = proc._calculate_fragmentation(original)
        score_after = proc._calculate_fragmentation(processed)
        improvement = round((1 - score_after/score_before)*100, 2) if score_before else 100
        return jsonify({
            'success': True,
            'original_text': original,
            'processed_text': processed,
            'fragmentation_score_before': score_before,
            'fragmentation_score_after': score_after,
            'improvement_percentage': improvement
        })
    return render_template('anti_fragmentation.html')

# توابع کمکی برای پردازش متن
def simple_nataq_processing(text):
    """پردازش ساده برای نطق مصطلح"""
    # اینجا می‌توانید منطق پیچیده‌تری اضافه کنید
    return f"✅ متن پردازش شده: {text}"

def simple_mizanro_analysis(text):
    """تحلیل ساده برای میزان‌رو"""
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    
    # امتیاز ساده بر اساس طول متن
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
    # حذف فضاهای اضافه و بهینه‌سازی
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
            return jsonify({'error': 'Bad Request', 'message': 'Input text is required'}), 400
        
        result = simple_nataq_processing(text)
        return jsonify({'result': result})
        
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route('/api/mizanro', methods=['POST'])
def api_mizanro():
    try:
        data = request.get_json()
        text = data.get('text', '') if data else ''
        
        if not text:
            return jsonify({'error': 'Bad Request', 'message': 'Input text is required'}), 400
        
        result = simple_mizanro_analysis(text)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route('/api/anti_fragmentation', methods=['POST'])
def api_anti_frag():
    try:
        data = request.get_json()
        text = data.get('text', '') if data else ''
        
        if not text:
            return jsonify({'error': 'Bad Request', 'message': 'Input text is required'}), 400
        
        result = simple_anti_fragmentation(text)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# Route برای تست سلامت سیستم
@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'Anti-Fragmentation System'})

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 سامانه ضد چندپارگی - Anti-Fragmentation System")
    print("=" * 50)
    print("📋 صفحات و APIهای موجود:")
    print("   🌐 http://localhost:5000/ - صفحه اصلی")
    print("   💬 http://localhost:5000/nataq - نطق مصطلح")
    print("   📊 http://localhost:5000/mizanro - میزان‌رو")
    print("   🔄 http://localhost:5000/anti_fragmentation - ضد چندپارگی")
    print("   ❤️  http://localhost:5000/health - وضعیت سرویس")
    print("=" * 50)
    print("📝 برای توقف برنامه: Ctrl+C")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
