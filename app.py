from flask import Flask, render_template, request, jsonify
from modules.nataq_masdum import NataqProcessor
from modules.mizanro import MizanroSystem
from modules.anti_fragmentation import AntiFragmentationSystem

app = Flask(__name__)

# Initialize systems
nataq = NataqProcessor()
mizanro = MizanroSystem()
anti_frag = AntiFragmentationSystem()

@app.route('/')
def home():
    return render_template('base.html')

@app.route('/nataq', methods=['POST'])
def process_nataq():
    text = request.json.get('text')
    result = nataq.process(text)
    return jsonify(result)

@app.route('/mizanro', methods=['POST'])
def process_mizanro():
    data = request.json
    result = mizanro.analyze(data)
    return jsonify(result)

@app.route('/anti-fragmentation', methods=['POST'])
def anti_fragmentation():
    text = request.json.get('text')
    result = anti_frag.process(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
