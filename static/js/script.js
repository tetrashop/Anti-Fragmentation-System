// اسکریپت سامانه ضد چندپارگی - نسخه نهایی بدون باگ

document.addEventListener('DOMContentLoaded', function() {
    
    // ======== نطق مصطلح ========
    var nataqForm = document.getElementById('nataq-form');
    if (nataqForm) {
        nataqForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var textInput = document.getElementById('nataq-input');
            var resultsDiv = document.getElementById('nataq-results');
            var loadingDiv = document.getElementById('nataq-loading');
            var errorDiv = document.getElementById('nataq-error');
            var processedText = document.getElementById('processed-text');
            
            var text = textInput.value.trim();
            if (!text) {
                errorDiv.textContent = 'لطفاً متن را وارد کنید';
                errorDiv.classList.remove('d-none');
                return;
            }
            
            resultsDiv.classList.add('d-none');
            errorDiv.classList.add('d-none');
            loadingDiv.classList.remove('d-none');
            
            fetch('/nataq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            })
            .then(function(response) {
                if (!response.ok) throw new Error('خطای سرور');
                return response.json();
            })
            .then(function(data) {
                loadingDiv.classList.add('d-none');
                if (data.success) {
                    processedText.textContent = data.processed_text;
                    resultsDiv.classList.remove('d-none');
                } else {
                    errorDiv.textContent = data.error || 'خطا در پردازش';
                    errorDiv.classList.remove('d-none');
                }
            })
            .catch(function(error) {
                loadingDiv.classList.add('d-none');
                errorDiv.textContent = 'خطا در ارتباط با سرور: ' + error.message;
                errorDiv.classList.remove('d-none');
            });
        });
    }
    
    // ======== میزان‌رو ========
    var mizanroForm = document.getElementById('mizanro-form');
    if (mizanroForm) {
        mizanroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var textInput = document.getElementById('mizanro-input');
            var resultsDiv = document.getElementById('mizanro-results');
            var loadingDiv = document.getElementById('mizanro-loading');
            var errorDiv = document.getElementById('mizanro-error');
            
            var text = textInput.value.trim();
            if (!text) {
                errorDiv.textContent = 'لطفاً متن را وارد کنید';
                errorDiv.classList.remove('d-none');
                return;
            }
            
            resultsDiv.classList.add('d-none');
            errorDiv.classList.add('d-none');
            loadingDiv.classList.remove('d-none');
            
            fetch('/mizanro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            })
            .then(function(response) {
                if (!response.ok) throw new Error('خطای سرور');
                return response.json();
            })
            .then(function(data) {
                loadingDiv.classList.add('d-none');
                if (data.success) {
                    document.getElementById('word-count').textContent = data.analysis.word_count;
                    document.getElementById('sentence-count').textContent = data.analysis.sentence_count;
                    document.getElementById('complexity-score').textContent = data.analysis.complexity_score;
                    document.getElementById('lexical-diversity').textContent = data.analysis.lexical_diversity;
                    document.getElementById('avg-sentence-length').textContent = data.analysis.avg_sentence_length;
                    document.getElementById('unique-words').textContent = data.analysis.unique_words;
                    resultsDiv.classList.remove('d-none');
                } else {
                    errorDiv.textContent = data.error || 'خطا در تحلیل';
                    errorDiv.classList.remove('d-none');
                }
            })
            .catch(function(error) {
                loadingDiv.classList.add('d-none');
                errorDiv.textContent = 'خطا در ارتباط با سرور: ' + error.message;
                errorDiv.classList.remove('d-none');
            });
        });
    }
    
    // ======== ضد چندپارگی ========
    var antiFragForm = document.getElementById('anti-frag-form');
    if (antiFragForm) {
        antiFragForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var textInput = document.getElementById('anti-frag-input');
            var resultsDiv = document.getElementById('anti-frag-results');
            var loadingDiv = document.getElementById('anti-frag-loading');
            var errorDiv = document.getElementById('anti-frag-error');
            
            var text = textInput.value.trim();
            if (!text) {
                errorDiv.textContent = 'لطفاً متن را وارد کنید';
                errorDiv.classList.remove('d-none');
                return;
            }
            
            resultsDiv.classList.add('d-none');
            errorDiv.classList.add('d-none');
            loadingDiv.classList.remove('d-none');
            
            fetch('/anti_fragmentation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            })
            .then(function(response) {
                if (!response.ok) throw new Error('خطای سرور');
                return response.json();
            })
            .then(function(data) {
                loadingDiv.classList.add('d-none');
                if (data.success) {
                    document.getElementById('optimized-text').textContent = data.processed_text;
                    document.getElementById('score-before').textContent = data.fragmentation_score_before;
                    document.getElementById('score-after').textContent = data.fragmentation_score_after;
                    document.getElementById('improvement-percent').textContent = data.improvement_percentage;
                    resultsDiv.classList.remove('d-none');
                } else {
                    errorDiv.textContent = data.error || 'خطا در پردازش';
                    errorDiv.classList.remove('d-none');
                }
            })
            .catch(function(error) {
                loadingDiv.classList.add('d-none');
                errorDiv.textContent = 'خطا در ارتباط با سرور: ' + error.message;
                errorDiv.classList.remove('d-none');
            });
        });
    }
});
