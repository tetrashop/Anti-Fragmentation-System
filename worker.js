// Cloudflare Worker برای سامانه ضد چندپارگی
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Routeهای اصلی
    if (url.pathname === '/' || url.pathname === '/index' || url.pathname === '/home') {
      return serveIndex();
    }
    
    if (url.pathname === '/nataq') {
      return serveNataq();
    }
    
    if (url.pathname === '/mizanro') {
      return serveMizanro();
    }
    
    if (url.pathname === '/anti_fragmentation') {
      return serveAntiFragmentation();
    }
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'Anti-Fragmentation System',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // API endpoints
    if (url.pathname === '/api/nataq' && request.method === 'POST') {
      return handleNataqAPI(request);
    }
    
    if (url.pathname === '/api/mizanro' && request.method === 'POST') {
      return handleMizanroAPI(request);
    }
    
    if (url.pathname === '/api/anti_fragmentation' && request.method === 'POST') {
      return handleAntiFragmentationAPI(request);
    }
    
    // اگر route پیدا نشد
    return new Response(JSON.stringify({
      error: 'صفحه پیدا نشد',
      available_routes: ['/', '/nataq', '/mizanro', '/anti_fragmentation', '/health']
    }), { 
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// صفحه اصلی
function serveIndex() {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه ضد چندپارگی - صفحه اصلی</title>
    <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            direction: rtl;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .feature-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.3s;
            border: 1px solid #e9ecef;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .btn {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            margin: 10px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #0056b3;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 سامانه ضد چندپارگی</h1>
            <p>پیشرفته‌ترین سیستم پردازش زبان فارسی</p>
        </div>
        
        <div class="features">
            <div class="feature-card">
                <h3>💬 نطق مصطلح</h3>
                <p>پردازش و بهینه‌سازی تلفظ متن فارسی</p>
                <a href="/nataq" class="btn">ورود به نطق مصطلح</a>
            </div>
            
            <div class="feature-card">
                <h3>📊 میزان‌رو</h3>
                <p>تحلیل کیفیت و خوانایی متن فارسی</p>
                <a href="/mizanro" class="btn">ورود به میزان‌رو</a>
            </div>
            
            <div class="feature-card">
                <h3>🔄 ضد چندپارگی</h3>
                <p>کاهش تکه‌تکه‌شدگی و بهینه‌سازی متن</p>
                <a href="/anti_fragmentation" class="btn">ورود به ضد چندپارگی</a>
            </div>
        </div>
        
        <div class="footer">
            <p>📞 پشتیبانی: <a href="mailto:support@tetrashop.com">support@tetrashop.com</a></p>
            <p>🔄 وضعیت سرویس: <a href="/health">/health</a></p>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// صفحه نطق مصطلح
function serveNataq() {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نطق مصطلح - سامانه ضد چندپارگی</title>
    <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            direction: rtl;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .input-area {
            margin-bottom: 20px;
        }
        textarea {
            width: 100%;
            height: 150px;
            padding: 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            resize: vertical;
            font-family: inherit;
        }
        .btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #218838;
        }
        .result {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            display: none;
        }
        .back-btn {
            color: #007bff;
            text-decoration: none;
            margin-bottom: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-btn">← بازگشت به صفحه اصلی</a>
        
        <div class="header">
            <h1>💬 نطق مصطلح</h1>
            <p>پردازش و بهینه‌سازی تلفظ متن فارسی</p>
        </div>
        
        <div class="input-area">
            <textarea id="textInput" placeholder="متن خود را اینجا وارد کنید..."></textarea>
        </div>
        
        <button class="btn" onclick="processText()">پردازش متن</button>
        
        <div id="result" class="result"></div>
    </div>

    <script>
        async function processText() {
            const text = document.getElementById('textInput').value;
            const resultDiv = document.getElementById('result');
            
            if (!text) {
                resultDiv.innerHTML = '<p style="color: red;">لطفاً متن خود را وارد کنید</p>';
                resultDiv.style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('/api/nataq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                
                const data = await response.json();
                resultDiv.innerHTML = '<h3>✅ نتیجه پردازش:</h3><p>' + data.result + '</p>';
                resultDiv.style.display = 'block';
                
            } catch (error) {
                resultDiv.innerHTML = '<p style="color: red;">خطا در پردازش متن</p>';
                resultDiv.style.display = 'block';
            }
        }
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// صفحه میزان‌رو
function serveMizanro() {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>میزان‌رو - سامانه ضد چندپارگی</title>
    <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            direction: rtl;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .input-area {
            margin-bottom: 20px;
        }
        textarea {
            width: 100%;
            height: 150px;
            padding: 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            resize: vertical;
            font-family: inherit;
        }
        .btn {
            background: #ffc107;
            color: #212529;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #e0a800;
        }
        .result {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            display: none;
        }
        .score {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
        }
        .back-btn {
            color: #007bff;
            text-decoration: none;
            margin-bottom: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-btn">← بازگشت به صفحه اصلی</a>
        
        <div class="header">
            <h1>📊 میزان‌رو</h1>
            <p>تحلیل کیفیت و خوانایی متن فارسی</p>
        </div>
        
        <div class="input-area">
            <textarea id="textInput" placeholder="متن خود را اینجا وارد کنید..."></textarea>
        </div>
        
        <button class="btn" onclick="analyzeText()">تحلیل متن</button>
        
        <div id="result" class="result"></div>
    </div>

    <script>
        async function analyzeText() {
            const text = document.getElementById('textInput').value;
            const resultDiv = document.getElementById('result');
            
            if (!text) {
                resultDiv.innerHTML = '<p style="color: red;">لطفاً متن خود را وارد کنید</p>';
                resultDiv.style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('/api/mizanro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                
                const data = await response.json();
                resultDiv.innerHTML = \`
                    <h3>📈 نتایج تحلیل:</h3>
                    <p><span class="score">امتیاز: \${data.score}/100</span></p>
                    <p><strong>تحلیل:</strong> \${data.analysis}</p>
                    <p><strong>تعداد کلمات:</strong> \${data.word_count || '---'}</p>
                    <p><strong>تعداد کاراکترها:</strong> \${data.char_count || '---'}</p>
                    <p><strong>خوانایی:</strong> \${data.readability || '---'}</p>
                \`;
                resultDiv.style.display = 'block';
                
            } catch (error) {
                resultDiv.innerHTML = '<p style="color: red;">خطا در تحلیل متن</p>';
                resultDiv.style.display = 'block';
            }
        }
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// صفحه ضد چندپارگی
function serveAntiFragmentation() {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ضد چندپارگی - سامانه ضد چندپارگی</title>
    <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            direction: rtl;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .input-area {
            margin-bottom: 20px;
        }
        textarea {
            width: 100%;
            height: 150px;
            padding: 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            resize: vertical;
            font-family: inherit;
        }
        .btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #c82333;
        }
        .result {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            display: none;
        }
        .comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
        }
        .comparison div {
            padding: 15px;
            border-radius: 8px;
        }
        .original {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
        }
        .optimized {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
        }
        .back-btn {
            color: #007bff;
            text-decoration: none;
            margin-bottom: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-btn">← بازگشت به صفحه اصلی</a>
        
        <div class="header">
            <h1>🔄 ضد چندپارگی</h1>
            <p>کاهش تکه‌تکه‌شدگی و بهینه‌سازی متن</p>
        </div>
        
        <div class="input-area">
            <textarea id="textInput" placeholder="متن خود را اینجا وارد کنید..."></textarea>
        </div>
        
        <button class="btn" onclick="defragmentText()">بهینه‌سازی متن</button>
        
        <div id="result" class="result"></div>
    </div>

    <script>
        async function defragmentText() {
            const text = document.getElementById('textInput').value;
            const resultDiv = document.getElementById('result');
            
            if (!text) {
                resultDiv.innerHTML = '<p style="color: red;">لطفاً متن خود را وارد کنید</p>';
                resultDiv.style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('/api/anti_fragmentation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                
                const data = await response.json();
                resultDiv.innerHTML = \`
                    <h3>✅ متن بهینه‌شده:</h3>
                    <div class="comparison">
                        <div class="original">
                            <h4>متن اصلی:</h4>
                            <p>\${text}</p>
                            <small>طول: \${data.original_length} کاراکتر</small>
                        </div>
                        <div class="optimized">
                            <h4>متن بهینه‌شده:</h4>
                            <p>\${data.optimized}</p>
                            <small>طول: \${data.optimized_length} کاراکتر</small>
                        </div>
                    </div>
                    <p style="margin-top: 15px;">
                        <strong>کاهش چندپارگی:</strong> \${data.fragmentation_reduced ? '✅ موفق' : '❌ ناموفق'}
                        \${data.reduction_percent ? ' | کاهش: ' + data.reduction_percent.toFixed(1) + '%' : ''}
                    </p>
                \`;
                resultDiv.style.display = 'block';
                
            } catch (error) {
                resultDiv.innerHTML = '<p style="color: red;">خطا در بهینه‌سازی متن</p>';
                resultDiv.style.display = 'block';
            }
        }
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// توابع پردازش API
async function handleNataqAPI(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return new Response(JSON.stringify({ error: 'متن ورودی ضروری است' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // شبیه‌سازی پردازش نطق مصطلح
    const result = `✅ متن پردازش شده: ${text}`;
    
    return new Response(JSON.stringify({ result: result }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطا در پردازش' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleMizanroAPI(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return new Response(JSON.stringify({ error: 'متن ورودی ضروری است' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // شبیه‌سازی تحلیل میزان‌رو
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    const score = Math.min(100, wordCount * 3 + Math.floor(charCount / 10));
    
    const result = {
      score: score,
      word_count: wordCount,
      char_count: charCount,
      analysis: 'تحلیل کیفیت متن انجام شد',
      readability: score > 50 ? 'مناسب' : 'نیاز به بهبود'
    };
    
    return new Response(JSON.stringify(result), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطا در تحلیل' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleAntiFragmentationAPI(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return new Response(JSON.stringify({ error: 'متن ورودی ضروری است' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // شبیه‌سازی کاهش چندپارگی
    const optimized = text.replace(/\s+/g, ' ').trim();
    const fragmentationReduced = optimized.length < text.length;
    const reductionPercent = text ? ((text.length - optimized.length) / text.length * 100) : 0;
    
    const result = {
      optimized: optimized,
      fragmentation_reduced: fragmentationReduced,
      reduction_percent: reductionPercent,
      original_length: text.length,
      optimized_length: optimized.length
    };
    
    return new Response(JSON.stringify(result), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطا در پردازش' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
