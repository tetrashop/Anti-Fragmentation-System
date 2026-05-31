// اسکریپت‌های عمومی سامانه ضد چندپارگی - نسخه ۲.۰

function showLoading(loaderId, resultsId, errorId) {
    document.getElementById(resultsId).classList.add('d-none');
    document.getElementById(errorId).classList.add('d-none');
    document.getElementById(loaderId).classList.remove('d-none');
}

function hideLoading(loaderId) {
    document.getElementById(loaderId).classList.add('d-none');
}

function showError(errorId, message) {
    var errDiv = document.getElementById(errorId);
    errDiv.textContent = message;
    errDiv.classList.remove('d-none');
}

// نطق مصطلح
var nataqForm = document.getElementById('nataq-form');
if (nataqForm) {
    nataqForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var text = document.getElementById('nataq-input').value.trim();
        if (!text) { showError('nataq-error', 'لطفاً متن ورودی را وارد کنید'); return; }
        showLoading('nataq-loading', 'nataq-results', 'nataq-error');
        fetch('/nataq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            hideLoading('nataq-loading');
            if (data.success) {
                document.getElementById('processed-text').textContent = data.processed_text;
                document.getElementById('nataq-results').classList.remove('d-none');
            } else {
                showError('nataq-error', data.error || 'خطا در پردازش');
            }
        })
        .catch(function(err) {
            hideLoading('nataq-loading');
            showError('nataq-error', 'خطا در ارتباط با سرور');
        });
    });
}

// میزان‌رو
var mizanroForm = document.getElementById('mizanro-form');
if (mizanroForm) {
    mizanroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var text = document.getElementById('mizanro-input').value.trim();
        if (!text) { showError('mizanro-error', 'لطفاً متن ورودی را وارد کنید'); return; }
        showLoading('mizanro-loading', 'mizanro-results', 'mizanro-error');
        fetch('/mizanro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            hideLoading('mizanro-loading');
            if (data.success) {
                var a = data.analysis;
                document.getElementById('word-count').textContent = a.word_count;
                document.getElementById('sentence-count').textContent = a.sentence_count;
                document.getElementById('complexity-score').textContent = a.complexity_score;
                document.getElementById('lexical-diversity').textContent = a.lexical_diversity;
                document.getElementById('avg-sentence-length').textContent = a.avg_sentence_length;
                document.getElementById('unique-words').textContent = a.unique_words;
                document.getElementById('mizanro-results').classList.remove('d-none');
            } else {
                showError('mizanro-error', data.error || 'خطا در تحلیل');
            }
        })
        .catch(function(err) {
            hideLoading('mizanro-loading');
            showError('mizanro-error', 'خطا در ارتباط با سرور');
        });
    });
}

// ضد چندپارگی
var antiFragForm = document.getElementById('anti-frag-form');
if (antiFragForm) {
    antiFragForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var text = document.getElementById('anti-frag-input').value.trim();
        if (!text) { showError('anti-frag-error', 'لطفاً متن ورودی را وارد کنید'); return; }
        showLoading('anti-frag-loading', 'anti-frag-results', 'anti-frag-error');
        fetch('/anti_fragmentation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            hideLoading('anti-frag-loading');
            if (data.success) {
                document.getElementById('optimized-text').textContent = data.processed_text;
                document.getElementById('score-before').textContent = data.fragmentation_score_before;
                document.getElementById('score-after').textContent = data.fragmentation_score_after;
                document.getElementById('improvement-percent').textContent = data.improvement_percentage;
                document.getElementById('anti-frag-results').classList.remove('d-none');
            } else {
                showError('anti-frag-error', data.error || 'خطا در پردازش');
            }
        })
        .catch(function(err) {
            hideLoading('anti-frag-loading');
            showError('anti-frag-error', 'خطا در ارتباط با سرور');
        });
    });
}

// سلامت سرویس
window.addEventListener('DOMContentLoaded', function() {
    var healthDiv = document.getElementById('health-status');
    if (healthDiv) {
        fetch('/health')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            healthDiv.innerHTML = '<span class="badge bg-success">✅ سرویس فعال است</span>';
        })
        .catch(function(err) {
            healthDiv.innerHTML = '<span class="badge bg-danger">❌ خطا در اتصال</span>';
        });
    }
});
