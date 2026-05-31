from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import sys

app = Flask(__name__, template_folder='templates', static_folder='static')

# مسیر ماژول‌ها
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'text_processor'))

# import مستقیم ماژول‌ها
from text_processor.nataq import NataqProcessor
from text_processor.mizanro import MizanroAnalyzer
from text_processor.anti_frag import AntiFragmentation

@app.route('/')
@app.route('/home')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/images', 'logo.svg')

@app.route('/health')
@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'Anti-Fragmentation System',
        'modules': 'loaded'
    })

@app.route('/nataq', methods=['GET', 'POST'])
def nataq():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Bad Request', 'message': 'Input text is required'}), 400
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

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response
