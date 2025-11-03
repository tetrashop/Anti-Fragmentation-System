/**
 * سامانه ضد چندپارگی - Cloudflare Worker
 * نسخه خالص JavaScript - بدون وابستگی به Python
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    console.log(`📨 ${method} ${pathname}`);

    // مدیریت CORS
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // مسیرهای اصلی
    switch (pathname) {
      case '/':
      case '/index.html':
        return serveIndex();
      
      case '/nataq':
        return serveNataq();
      
      case '/mizanro':
        return serveMizanro();
      
      case '/anti_fragmentation':
        return serveAntiFragmentation();
      
      case '/health':
      case '/status':
        return serveHealth();
      
      default:
        // API endpoints
        if (pathname.startsWith('/api/')) {
          return handleAPI(pathname, method, request);
        }
        return serveNotFound(pathname);
    }
  }
}

// 📊 صفحه اصلی
function serveIndex() {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه ضد چندپارگی</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Tahoma, Arial, sans-serif; 
            direction: rtl; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 20px; 
            min-height: 100vh;
            line-height: 1.6;
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
            padding: 20px;
        }
        .header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .header p {
            color: #7f8c8d;
            font-size: 1.2em;
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
            transition: all 0.3s ease; 
            border: 1px solid #e9ecef;
            text-decoration: none;
            color: inherit;
            display: block;
        }
        .feature-card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            background: #ffffff;
        }
        .feature-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        .feature-card p {
            color: #7f8c8d;
            margin-bottom: 20px;
        }
        .btn { 
            display: inline-block; 
            background: #007bff; 
            color: white; 
            padding: 12px 25px; 
            border-radius: 25px; 
            text-decoration: none; 
            transition: background 0.3s; 
            border: none;
            cursor: pointer;
            font-size: 1em;
        }
        .btn:hover { 
            background: #0056b3; 
        }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e9ecef;
            color: #7f8c8d;
        }
        .status-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 سامانه ضد چندپارگی</h1>
            <p>پیشرفته‌ترین سیستم پردازش زبان فارسی</p>
            <div class="status-badge">همه سرویس‌ها فعال</div>
        </div>
        
        <div class="features">
            <a href="/nataq" class="feature-card">
                <h3>💬 نطق مصطلح</h3>
                <p>پردازش و بهینه‌سازی تلفظ متن فارسی</p>
                <div class="btn">ورود به نطق مصطلح</div>
            </a>
            
            <a href="/mizanro" class="feature-card">
                <h3>📊 میزان‌رو</h3>
                <p>تحلیل کیفیت و خوانایی متن فارسی</p>
                <div class="btn">ورود به میزان‌رو</div>
            </a>
            
            <a href="/anti_fragmentation" class="feature-card">
                <h3>🔄 ضد چندپارگی</h3>
                <p>کاهش تکه‌تکه‌شدگی و بهینه‌سازی متن</p>
                <div class="btn">ورود به ضد چندپارگی</div>
            </a>
        </div>
        
        <div class="footer">
            <p>🔄 وضعیت سرویس: <a href="/health" style="color: #007bff;">/health</a></p>
            <p>📧 پشتیبانی: support@tetrashop.com</p>
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

// 🎯 سایر صفحات
function serveNataq() {
  return createPage('نطق مصطلح', '💬', 'پردازش و بهینه‌سازی تلفظ متن فارسی');
}

function serveMizanro() {
  return createPage('میزان‌رو', '📊', 'تحلیل کیفیت و خوانایی متن فارسی');
}

function serveAntiFragmentation() {
  return createPage('ضد چندپارگی', '🔄', 'کاهش تکه‌تکه‌شدگی و بهینه‌سازی متن');
}

function createPage(title, emoji, description) {
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>${title} - سامانه ضد چندپارگی</title>
    <style>
        body { 
            font-family: Tahoma, Arial, sans-serif; 
            direction: rtl; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 40px; 
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            padding: 40px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        h1 { 
            color: #2c3e50; 
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        p { 
            color: #7f8c8d; 
            margin-bottom: 30px;
            font-size: 1.2em;
        }
        .btn { 
            display: inline-block; 
            background: #007bff; 
            color: white; 
            padding: 12px 25px; 
            border-radius: 25px; 
            text-decoration: none; 
            transition: background 0.3s; 
        }
        .btn:hover { 
            background: #0056b3; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${emoji} ${title}</h1>
        <p>${description}</p>
        <p>✅ این سرویس با موفقیت فعال شده است</p>
        <a href="/" class="btn">بازگشت به صفحه اصلی</a>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// 🩺 صفحه سلامت
function serveHealth() {
  const healthData = {
    status: 'healthy',
    service: 'Anti-Fragmentation System',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: 'production',
    features: ['nataq', 'mizanro', 'anti_fragmentation'],
    endpoints: [
      '/', '/nataq', '/mizanro', '/anti_fragmentation', '/health',
      '/api/nataq', '/api/mizanro', '/api/anti_fragmentation'
    ]
  };
  
  return new Response(JSON.stringify(healthData, null, 2), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// 🔧 مدیریت API
async function handleAPI(pathname, method, request) {
  try {
    switch (pathname) {
      case '/api/nataq':
        if (method === 'POST') {
          const { text } = await request.json();
          return new Response(JSON.stringify({
            success: true,
            result: text ? `✅ متن پردازش شده: ${text}` : '⚠️ متنی دریافت نشد',
            timestamp: new Date().toISOString()
          }), {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        break;
      
      case '/api/mizanro':
        if (method === 'POST') {
          const { text } = await request.json();
          const score = text ? Math.min(100, Math.floor(text.length / 2)) : 0;
          return new Response(JSON.stringify({
            success: true,
            score: score,
            analysis: score >= 50 ? 'متن با کیفیت' : 'نیاز به بهبود',
            timestamp: new Date().toISOString()
          }), {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        break;
      
      case '/api/anti_fragmentation':
        if (method === 'POST') {
          const { text } = await request.json();
          const optimized = text ? text.replace(/\s+/g, ' ').trim() : '⚠️ متنی دریافت نشد';
          return new Response(JSON.stringify({
            success: true,
            optimized: optimized,
            reduction: text ? Math.floor((text.length - optimized.length) / text.length * 100) : 0,
            timestamp: new Date().toISOString()
          }), {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        break;
    }
    
    return new Response(JSON.stringify({
      error: 'API endpoint not found',
      available_endpoints: ['/api/nataq', '/api/mizanro', '/api/anti_fragmentation']
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 404 صفحه پیدا نشد
function serveNotFound(pathname) {
  return new Response(JSON.stringify({
    error: 'صفحه پیدا نشد',
    path: pathname,
    available_routes: [
      '/', '/nataq', '/mizanro', '/anti_fragmentation', '/health',
      '/api/nataq', '/api/mizanro', '/api/anti_fragmentation'
    ]
  }), {
    status: 404,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
