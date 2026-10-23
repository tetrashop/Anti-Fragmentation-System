from flask import Flask, request, jsonify, send_from_directory, render_template_string, Response
import os, sys

app = Flask(__name__)
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(current_dir, 'text_processor'))
sys.path.insert(0, current_dir)

try:
    from utils import MemoryCache, HistoryDB
    cache = MemoryCache(default_ttl=300)
    history = HistoryDB('history.db')
except Exception:
    cache, history = None, None

NAV = """<nav class="navbar navbar-expand-lg navbar-dark bg-primary"><div class="container">
<a class="navbar-brand" href="/">🏠 سامانه ضد چندپارگی</a>
<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"><span class="navbar-toggler-icon"></span></button>
<div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav me-auto">
<li class="nav-item"><a class="nav-link" href="/">خانه</a></li>
<li class="nav-item"><a class="nav-link" href="/nataq">نطق</a></li>
<li class="nav-item"><a class="nav-link" href="/mizanro">میزان‌رو</a></li>
<li class="nav-item"><a class="nav-link" href="/anti_fragmentation">ضد چندپارگی</a></li>
<li class="nav-item"><a class="nav-link" href="/analyze">تحلیل جامع</a></li>
</ul></div></div></nav>"""

HEAD = """<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="/static/css/bootstrap.min.css" rel="stylesheet"><link href="/static/css/style.css" rel="stylesheet">
<style>body{font-family:Tahoma,sans-serif;direction:rtl;text-align:right}.stat-box{background:#f8f9fa;padding:12px;border-radius:8px;margin:8px 0;border-right:3px solid #0d6efd}.kw-tag{display:inline-block;background:#e7f1ff;color:#0d6efd;padding:4px 10px;border-radius:15px;margin:3px;font-size:13px}.score-bar{height:10px;background:#e9ecef;border-radius:5px;overflow:hidden}.score-fill{height:100%;background:linear-gradient(90deg,#28a745,#ffc107,#dc3545);transition:width .5s}</style>"""

FOOTER = """<footer class="bg-dark text-light py-4 mt-5"><div class="container text-center"><p>&copy; 2025 سامانه ضد چندپارگی v4.0</p></div></footer><script src="/static/js/bootstrap.min.js"></script>"""

INDEX_HTML = "<!DOCTYPE html><html lang='fa' dir='rtl'><head><title>سامانه ضد چندپارگی</title>" + HEAD + "</head><body>" + NAV + """
<main class='container my-4'><h1 class='text-center mb-4'>🚀 سامانه ضد چندپارگی v4.0</h1>
<p class='lead text-center'>پردازشگر جامع متون فارسی</p>
<div class='row mt-4'>
<div class='col-md-3 mb-3'><div class='card'><div class='card-header bg-primary text-white'>💬 نطق</div><div class='card-body'><p>اصلاح نویسه‌ها</p><a href='/nataq' class='btn btn-primary w-100'>ورود</a></div></div></div>
<div class='col-md-3 mb-3'><div class='card'><div class='card-header bg-info text-white'>📊 میزان‌رو</div><div class='card-body'><p>تحلیل کیفیت</p><a href='/mizanro' class='btn btn-info w-100'>ورود</a></div></div></div>
<div class='col-md-3 mb-3'><div class='card'><div class='card-header bg-warning'>🔄 ضد چندپارگی</div><div class='card-body'><p>بهینه‌سازی</p><a href='/anti_fragmentation' class='btn btn-warning w-100'>ورود</a></div></div></div>
<div class='col-md-3 mb-3'><div class='card'><div class='card-header bg-success text-white'>🔍 تحلیل جامع</div><div class='card-body'><p>۱۲ ماژول</p><a href='/analyze' class='btn btn-success w-100'>ورود</a></div></div></div>
</div>
</main>""" + FOOTER + "</body></html>"

NATAQ_HTML = "<!DOCTYPE html><html lang='fa' dir='rtl'><head><title>نطق</title>" + HEAD + "</head><body>" + NAV + """
<main class='container my-4'><div class='row'>
<div class='col-md-6'><div class='card'><div class='card-header bg-primary text-white'>ورودی</div><div class='card-body'>
<textarea id='in' class='form-control' rows='8' placeholder='متن...'></textarea>
<button id='btn' class='btn btn-primary w-100 mt-3'>پردازش</button>
<div id='ld' class='d-none mt-3'>⏳...</div><div id='err' class='alert alert-danger d-none mt-3'></div>
</div></div></div>
<div class='col-md-6'><div class='card'><div class='card-header bg-primary text-white'>نتیجه</div><div class='card-body'><p id='out' class='bg-light p-3 rounded'></p></div></div></div>
</div></main><script>
document.getElementById('btn').onclick=async()=>{const t=document.getElementById('in').value.trim(),e=document.getElementById('err'),l=document.getElementById('ld'),o=document.getElementById('out');if(!t){e.textContent='متن وارد کنید';e.classList.remove('d-none');return;}e.classList.add('d-none');l.classList.remove('d-none');try{const r=await fetch('/nataq',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:t})});const d=await r.json();l.classList.add('d-none');if(d.success)o.textContent=d.processed_text;else{e.textContent=d.error||'خطا';e.classList.remove('d-none');}}catch(x){l.classList.add('d-none');e.textContent='خطا: '+x.message;e.classList.remove('d-none');}};
</script>""" + FOOTER + "</body></html>"

MIZANRO_HTML = "<!DOCTYPE html><html lang='fa' dir='rtl'><head><title>میزان‌رو</title>" + HEAD + "</head><body>" + NAV + """
<main class='container my-4'><div class='row'>
<div class='col-md-6'><div class='card'><div class='card-header bg-info text-white'>ورودی</div><div class='card-body'>
<textarea id='in' class='form-control' rows='8'></textarea>
<button id='btn' class='btn btn-info w-100 mt-3'>تحلیل</button>
<div id='ld' class='d-none mt-3'>⏳...</div><div id='err' class='alert alert-danger d-none mt-3'></div>
</div></div></div>
<div class='col-md-6'><div class='card'><div class='card-header bg-info text-white'>نتیجه</div><div class='card-body' id='res'></div></div></div>
</div></main><script>
document.getElementById('btn').onclick=async()=>{const t=document.getElementById('in').value.trim(),e=document.getElementById('err'),l=document.getElementById('ld'),r=document.getElementById('res');if(!t){e.textContent='متن وارد کنید';e.classList.remove('d-none');return;}e.classList.add('d-none');l.classList.remove('d-none');try{const res=await fetch('/mizanro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:t})});const d=await res.json();l.classList.add('d-none');if(d.success&&d.analysis){const a=d.analysis;r.innerHTML=`<p>📝 کلمات: <b>${a.word_count}</b></p><p>📄 جملات: <b>${a.sentence_count}</b></p><p>📊 پیچیدگی: <b>${a.complexity_score}</b></p><p>🔤 تنوع: <b>${a.lexical_diversity}</b></p>`;}else{e.textContent=d.error||'خطا';e.classList.remove('d-none');}}catch(x){l.classList.add('d-none');e.textContent='خطا: '+x.message;e.classList.remove('d-none');}};
</script>""" + FOOTER + "</body></html>"

ANTI_HTML = "<!DOCTYPE html><html lang='fa' dir='rtl'><head><title>ضد چندپارگی</title>" + HEAD + "</head><body>" + NAV + """
<main class='container my-4'><div class='row'>
<div class='col-md-6'><div class='card'><div class='card-header bg-warning'>ورودی</div><div class='card-body'>
<textarea id='in' class='form-control' rows='8'></textarea>
<button id='btn' class='btn btn-warning w-100 mt-3'>پردازش</button>
<div id='ld' class='d-none mt-3'>⏳...</div><div id='err' class='alert alert-danger d-none mt-3'></div>
</div></div></div>
<div class='col-md-6'><div class='card'><div class='card-header bg-warning'>نتیجه</div><div class='card-body' id='res'></div></div></div>
</div></main><script>
document.getElementById('btn').onclick=async()=>{const t=document.getElementById('in').value.trim(),e=document.getElementById('err'),l=document.getElementById('ld'),r=document.getElementById('res');if(!t){e.textContent='متن وارد کنید';e.classList.remove('d-none');return;}e.classList.add('d-none');l.classList.remove('d-none');try{const res=await fetch('/anti_fragmentation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:t})});const d=await res.json();l.classList.add('d-none');if(d.success)r.innerHTML=`<p class='bg-light p-3 rounded'>${d.processed_text}</p><p>قبل: <b>${d.fragmentation_score_before}</b> | بعد: <b>${d.fragmentation_score_after}</b> | بهبود: <b>${d.improvement_percentage}%</b></p>`;else{e.textContent=d.error||'خطا';e.classList.remove('d-none');}}catch(x){l.classList.add('d-none');e.textContent='خطا: '+x.message;e.classList.remove('d-none');}};
</script>""" + FOOTER + "</body></html>"

ANALYZE_HTML = "<!DOCTYPE html><html lang='fa' dir='rtl'><head><title>تحلیل جامع</title>" + HEAD + "</head><body>" + NAV + """
<main class='container my-4'><h2 class='text-center mb-4'>🔍 تحلیل جامع (v4.0 - ۱۲ ماژول)</h2>
<div class='row'><div class='col-lg-5'><div class='card'><div class='card-header bg-primary text-white'>📝 ورودی</div><div class='card-body'>
<textarea id='in' class='form-control' rows='12' placeholder='متن...'></textarea>
<div class='form-check mt-2'><input class='form-check-input' type='checkbox' id='useLimit'><label class='form-check-label' for='useLimit'>محدودیت کلمه</label>
<input type='number' id='maxLen' class='form-control form-control-sm mt-1' value='250' disabled></div>
<button id='btn' class='btn btn-primary w-100 mt-3'>تحلیل جامع</button>
<div id='ld' class='d-none mt-3'>⏳ در حال تحلیل...</div><div id='err' class='alert alert-danger d-none mt-3'></div>
</div></div></div>
<div class='col-lg-7'><div id='res' class='d-none'>
<div class='card mb-3'><div class='card-header bg-success text-white'>📊 آمار</div><div class='card-body' id='stats'></div></div>
<div class='card mb-3'><div class='card-header bg-info text-white'>✅ متن تصحیح‌شده</div><div class='card-body'><p id='cleaned' class='bg-light p-3 rounded'></p></div></div>
<div class='card mb-3'><div class='card-header bg-warning'>📖 خوانایی</div><div class='card-body' id='read'></div></div>
<div class='card mb-3'><div class='card-header bg-danger text-white'>💭 احساسات</div><div class='card-body' id='senti'></div></div>
<div class='card mb-3'><div class='card-header bg-dark text-white'>🔑 کلیدواژه</div><div class='card-body' id='kw'></div></div>
<div class='card mb-3'><div class='card-header bg-secondary text-white'>📄 خلاصه</div><div class='card-body'><p id='sum' class='bg-light p-3 rounded'></p><small id='sumMeta' class='text-muted'></small></div></div>
</div></div></div></main>
<script>
document.getElementById('useLimit').onchange=function(){document.getElementById('maxLen').disabled=!this.checked;};
document.getElementById('btn').onclick=async()=>{const t=document.getElementById('in').value.trim(),e=document.getElementById('err'),l=document.getElementById('ld'),r=document.getElementById('res');if(!t){e.textContent='متن وارد کنید';e.classList.remove('d-none');return;}e.classList.add('d-none');r.classList.add('d-none');l.classList.remove('d-none');const p={text:t};if(document.getElementById('useLimit').checked)p.max_length=parseInt(document.getElementById('maxLen').value)||250;try{const res=await fetch('/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});const d=await res.json();l.classList.add('d-none');if(!d.success){e.textContent=(d.error||'خطا')+(d.details?' - '+d.details:'');e.classList.remove('d-none');return;}const s=d.stats;document.getElementById('stats').innerHTML=`<div class='stat-box'>📝 کلمات: <b>${s.word_count}</b></div><div class='stat-box'>📄 جملات: <b>${s.sentence_count}</b></div><div class='stat-box'>🔤 کاراکترها: <b>${s.char_count}</b></div>`+(d.limit?`<div class='stat-box'>⏱ باقی: <b>${d.limit.remaining}</b></div>`:'');document.getElementById('cleaned').textContent=d.cleaned_text;const rr=d.readability;document.getElementById('read').innerHTML=`<div class='stat-box'><b>خوانایی: ${rr.readability_score}/100</b> - ${rr.level}<div class='score-bar mt-2'><div class='score-fill' style='width:${rr.readability_score}%'></div></div></div>`;const se=d.sentiment;document.getElementById('senti').innerHTML=`<div class='stat-box'><b>احساس: ${se.label}</b> (امتیاز: ${se.score})<br>مثبت: ${se.positive_count} | منفی: ${se.negative_count}</div>`;document.getElementById('kw').innerHTML=d.keywords.map(k=>`<span class='kw-tag'>${k.word} (${k.frequency})</span>`).join('')||'<em>یافت نشد</em>';document.getElementById('sum').textContent=d.summary;document.getElementById('sumMeta').textContent='فشرده‌سازی: '+Math.round((1-d.summary.length/d.cleaned_text.length)*100)+'%';r.classList.remove('d-none');}catch(x){l.classList.add('d-none');e.textContent='خطا: '+x.message;e.classList.remove('d-none');}};
</script>""" + FOOTER + "</body></html>"

@app.route('/')
@app.route('/home')
@app.route('/index')
def index(): return render_template_string(INDEX_HTML)

@app.route('/favicon.ico')
def favicon():
    try: return send_from_directory(os.path.join(current_dir, 'static', 'images'), 'logo.svg')
    except: return '', 204

@app.route('/health')
@app.route('/api/health')
def health(): return jsonify({'status': 'healthy', 'service': 'Anti-Fragmentation v4.0', 'modules': 'loaded'})

@app.route('/nataq', methods=['GET', 'POST'])
def nataq():
    if request.method == 'POST':
        d = request.get_json()
        if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
        try:
            from text_processor.nataq import NataqProcessor
            return jsonify({'success': True, 'processed_text': NataqProcessor().process(d['text'])})
        except Exception as e:
            return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    return render_template_string(NATAQ_HTML)

@app.route('/mizanro', methods=['GET', 'POST'])
def mizanro():
    if request.method == 'POST':
        d = request.get_json()
        if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
        try:
            from text_processor.mizanro import MizanroAnalyzer
            return jsonify(MizanroAnalyzer().analyze(d['text']))
        except Exception as e:
            return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    return render_template_string(MIZANRO_HTML)

@app.route('/anti_fragmentation', methods=['GET', 'POST'])
def anti_fragmentation():
    if request.method == 'POST':
        d = request.get_json()
        if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
        try:
            from text_processor.anti_frag import AntiFragmentation
            p = AntiFragmentation()
            rd = p.process(d['text'])
            pt = rd['processed_text'] if isinstance(rd, dict) else rd
            sb = p._calculate_fragmentation(d['text']); sa = p._calculate_fragmentation(pt)
            return jsonify({'success': True, 'original_text': d['text'], 'processed_text': pt,
                            'fragmentation_score_before': sb, 'fragmentation_score_after': sa,
                            'improvement_percentage': round((1-sa/sb)*100, 2) if sb else 100})
        except Exception as e:
            return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    return render_template_string(ANTI_HTML)

@app.route('/analyze', methods=['GET', 'POST'])
def analyze_all():
    if request.method == 'POST':
        d = request.get_json()
        if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
        try:
            if cache:
                cached = cache.get(d['text'])
                if cached: return jsonify(cached)
            from text_processor.comprehensive import ComprehensiveAnalyzer
            r = ComprehensiveAnalyzer(max_length=d.get('max_length')).analyze(d['text'])
            if cache: cache.set(d['text'], r)
            if history:
                try: history.save(d['text'], r)
                except: pass
            return jsonify(r)
        except Exception as e:
            return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
    return render_template_string(ANALYZE_HTML)

@app.route('/sentiment', methods=['POST'])
def sentiment():
    d = request.get_json()
    if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
    try:
        from text_processor.sentiment import SentimentAnalyzer
        return jsonify(SentimentAnalyzer().analyze(d['text']))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/similarity', methods=['POST'])
def similarity():
    d = request.get_json()
    if not d or 'text1' not in d or 'text2' not in d: return jsonify({'error': 'text1 و text2 الزامی'}), 400
    try:
        from text_processor.similarity import SimilarityAnalyzer
        return jsonify(SimilarityAnalyzer().compare(d['text1'], d['text2']))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/grammar', methods=['POST'])
def grammar():
    d = request.get_json()
    if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
    try:
        from text_processor.grammar import GrammarChecker
        return jsonify(GrammarChecker().check(d['text']))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['POST'])
def stats():
    d = request.get_json()
    if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
    try:
        from text_processor.stats import StatsAnalyzer
        return jsonify(StatsAnalyzer().analyze(d['text']))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch', methods=['POST'])
def batch():
    d = request.get_json()
    if not d or 'texts' not in d: return jsonify({'error': 'texts الزامی'}), 400
    try:
        from text_processor.batch import BatchProcessor
        return jsonify(BatchProcessor(max_length=d.get('max_length')).process(d['texts']))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/export/<fmt>', methods=['POST'])
def export(fmt):
    if fmt not in ('json', 'md', 'csv', 'txt'): return jsonify({'error': 'فرمت نامعتبر'}), 400
    d = request.get_json()
    if not d or 'text' not in d: return jsonify({'error': 'Bad Request'}), 400
    try:
        from text_processor.comprehensive import ComprehensiveAnalyzer
        from text_processor.exporter import Exporter
        r = ComprehensiveAnalyzer().analyze(d['text'])
        e = Exporter()
        content, mime = {
            'json': (e.to_json(r), 'application/json; charset=utf-8'),
            'md': (e.to_markdown(r), 'text/markdown; charset=utf-8'),
            'csv': (e.to_csv(r), 'text/csv; charset=utf-8'),
            'txt': (e.to_txt(r), 'text/plain; charset=utf-8')
        }[fmt]
        return Response(content, mimetype=mime, headers={'Content-Disposition': f'attachment; filename=analysis.{fmt}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
def history_list():
    if not history: return jsonify({'error': 'تاریخچه غیرفعال'}), 503
    try:
        return jsonify({'analyses': history.list_recent(20), 'stats': history.stats()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history/<int:hid>', methods=['GET'])
def history_get(hid):
    if not history: return jsonify({'error': 'تاریخچه غیرفعال'}), 503
    try:
        r = history.get(hid)
        return Response(r, mimetype='application/json') if r else (jsonify({'error': 'یافت نشد'}), 404)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
