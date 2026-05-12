from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
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

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'Anti-Fragmentation System'})

# API endpoints ساده
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
    print("🚀 سامانه ضد چندپارگی در حال راه‌اندازی...")
    print("🌐 آدرس: http://localhost:5001")
    app.run(host='0.0.0.0', port=5000, debug=True)
