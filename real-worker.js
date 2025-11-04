/**
 * 🚀 Worker واقعی و عملیاتی سیستم ضد چندپارگی
 */

// Import ماژول‌های واقعی
import RealApiEndpoints from './quantum-modules/api/real-endpoints.js';

class RealAntiFragmentationSystem {
  constructor() {
    this.api = RealApiEndpoints;
    this.initialized = false;
    this.init();
  }

  async init() {
    console.log('🚀 راه‌اندازی سیستم واقعی ضد چندپارگی...');
    
    try {
      // راه‌اندازی ماژول‌های واقعی
      await this.initializeRealModules();
      this.initialized = true;
      console.log('✅ سیستم واقعی با موفقیت راه‌اندازی شد');
    } catch (error) {
      console.error('❌ خطا در راه‌اندازی سیستم واقعی:', error);
      this.initialized = false;
    }
  }

  async initializeRealModules() {
    // پیش‌لود ماژول‌های واقعی برای عملکرد بهتر
    const modules = [
      './quantum-modules/core/real-processor.js',
      './quantum-modules/api/real-endpoints.js'
    ];

    for (const modulePath of modules) {
      try {
        await import(modulePath);
        console.log(`✅ ماژول واقعی لود شد: ${modulePath}`);
      } catch (error) {
        console.warn(`⚠️ خطا در لود ماژول ${modulePath}:`, error.message);
      }
    }
  }

  async handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // مدیریت CORS
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // اگر سیستم initialize نشده
    if (!this.initialized) {
      return this.errorResponse('سیستم در حال راه‌اندازی است. لطفاً چند لحظه دیگر تلاش کنید.', 503);
    }

    try {
      // APIهای واقعی
      if (pathname.startsWith('/api/real/')) {
        const endpoint = this.api.endpoints.get(pathname);
        
        if (endpoint && endpoint.method === method) {
          return await endpoint.handler(request);
        } else {
          return this.errorResponse('Endpoint یافت نشد', 404);
        }
      }

      // APIهای قدیمی (برای سازگاری)
      if (pathname.startsWith('/api/')) {
        return await this.handleLegacyApi(pathname, method, request);
      }

      // صفحات وب
      return await this.handleWebPages(pathname, method, request);

    } catch (error) {
      console.error('❌ خطای سیستمی:', error);
      return this.errorResponse('خطای داخلی سرور: ' + error.message, 500);
    }
  }

  async handleLegacyApi(pathname, method, request) {
    // تبدیل APIهای قدیمی به جدید
    const mapping = {
      '/api/nataq': '/api/real/nataq',
      '/api/mizanro': '/api/real/mizanro', 
      '/api/anti-fragmentation': '/api/real/anti-fragmentation',
      '/api/batch-process': '/api/real/batch',
      '/api/health': '/api/real/health'
    };

    const realPath = mapping[pathname];
    if (realPath && method === 'POST') {
      const endpoint = this.api.endpoints.get(realPath);
      if (endpoint) {
        return await endpoint.handler(request);
      }
    }

    return this.errorResponse('API قدیمی پشتیبانی نمی‌شود. از APIهای real استفاده کنید.', 404);
  }

  async handleWebPages(pathname, method, request) {
    switch (pathname) {
      case '/':
        return this.renderRealHomePage();
      
      case '/real-demo':
        return this.renderRealDemoPage();
      
      case '/api-docs':
        return this.renderRealApiDocs();
      
      case '/health':
        return this.api.getRealHealth();
      
      default:
        return this.renderNotFound();
    }
  }

  renderRealHomePage() {
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه ضد چندپارگی - نسخه واقعی</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Tahoma; direction: rtl; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 10px; margin: 10px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .btn { display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 5px; border: none; cursor: pointer; }
        .btn:hover { background: #2980b9; }
        .demo-section { background: #e8f4f8; padding: 20px; border-radius: 10px; margin: 20px 0; }
        textarea { width: 100%; height: 120px; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-family: Tahoma; }
        .result { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 سامانه ضد چندپارگی متون تخصصی</h1>
            <p>نسخه واقعی و کاملاً عملیاتی - با پردازش پیشرفته متن</p>
            <div style="color: green; font-weight: bold; margin: 10px 0;">✅ سیستم فعال و آماده به کار</div>
        </div>

        <div class="card">
            <h2>🎯 خدمات واقعی سیستم</h2>
            <p>این سیستم کاملاً عملیاتی بوده و پردازش واقعی روی متن‌های شما انجام می‌دهد:</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin: 20px 0;">
                <div class="card">
                    <h3>💬 پردازش نطق مصطلح</h3>
                    <p>تحلیل و بهینه‌سازی تلفظ متن‌های تخصصی</p>
                    <button class="btn" onclick="showDemo('nataq')">آزمایش سرویس</button>
                </div>
                
                <div class="card">
                    <h3>📊 تحلیل میزان‌رو</h3>
                    <p>ارزیابی کیفیت و خوانایی متن</p>
                    <button class="btn" onclick="showDemo('mizanro')">آزمایش سرویس</button>
                </div>
                
                <div class="card">
                    <h3>🔄 پردازش ضد چندپارگی</h3>
                    <p>کاهش چندپارگی و بهینه‌سازی ساختار</p>
                    <button class="btn" onclick="showDemo('anti-fragmentation')">آزمایش سرویس</button>
                </div>
            </div>
        </div>

        <div id="demoSection" class="demo-section" style="display: none;">
            <h3>🎪 آزمایش سرویس</h3>
            <textarea id="demoText" placeholder="متن خود را اینجا وارد کنید...">سامانه ضد چندپارگی متون تخصصی می‌تواند به بهبود کیفیت محتوای علمی کمک نماید. این سیستم از الگوریتم‌های پیشرفته هوش مصنوعی استفاده می‌کند و می‌تواند متون تخصصی را تحلیل و بهینه‌سازی کند.</textarea>
            <div>
                <button class="btn" onclick="processDemo()">🚀 پردازش متن</button>
                <button class="btn" onclick="hideDemo()" style="background: #95a5a6;">انصراف</button>
            </div>
            <div id="demoResult" class="result"></div>
        </div>

        <div class="card">
            <h2>🔗 APIهای واقعی</h2>
            <p>برای استفاده برنامه‌نویسی از سیستم، از APIهای زیر استفاده کنید:</p>
            <div style="background: #2d3748; color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <code>POST /api/real/nataq</code><br>
                <code>POST /api/real/mizanro</code><br>
                <code>POST /api/real/anti-fragmentation</code><br>
                <code>POST /api/real/batch</code><br>
                <code>GET /api/real/health</code>
            </div>
            <a href="/api-docs" class="btn">📚 مشاهده مستندات کامل API</a>
        </div>

        <div class="card">
            <h2>✅ وضعیت سیستم</h2>
            <div id="systemStatus">در حال بررسی...</div>
            <button class="btn" onclick="checkSystemStatus()">بررسی وضعیت</button>
        </div>
    </div>

    <script>
        let currentService = '';
        
        function showDemo(service) {
            currentService = service;
            document.getElementById('demoSection').style.display = 'block';
            document.getElementById('demoResult').style.display = 'none';
            document.getElementById('demoText').value = '';
        }
        
        function hideDemo() {
            document.getElementById('demoSection').style.display = 'none';
        }
        
        async function processDemo() {
            const text = document.getElementById('demoText').value.trim();
            if (!text) {
                alert('لطفاً متن خود را وارد کنید');
                return;
            }
            
            const resultDiv = document.getElementById('demoResult');
            resultDiv.innerHTML = '🔮 در حال پردازش...';
            resultDiv.style.display = 'block';
            
            try {
                const response = await fetch('/api/real/' + currentService, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    resultDiv.innerHTML = '<div style="color: green; font-weight: bold;">✅ پردازش با موفقیت انجام شد</div>' + 
                                         '<pre style="background: white; padding: 15px; border-radius: 5px; overflow: auto; max-height: 400px;">' + 
                                         JSON.stringify(result, null, 2) + '</pre>';
                } else {
                    resultDiv.innerHTML = '<div style="color: red; font-weight: bold;">❌ خطا: ' + (result.error || 'خطای ناشناخته') + '</div>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<div style="color: red; font-weight: bold;">❌ خطای شبکه: ' + error.message + '</div>';
            }
        }
        
        async function checkSystemStatus() {
            const statusDiv = document.getElementById('systemStatus');
            statusDiv.innerHTML = '🔍 در حال بررسی...';
            
            try {
                const response = await fetch('/api/real/health');
                const result = await response.json();
                
                if (result.success) {
                    statusDiv.innerHTML = '✅ سیستم کاملاً فعال و عملیاتی است<br>' +
                                        '🟢 تمام سرویس‌ها در دسترس هستند<br>' +
                                        '📊 نسخه: ' + result.version;
                } else {
                    statusDiv.innerHTML = '❌ مشکل در سیستم';
                }
            } catch (error) {
                statusDiv.innerHTML = '❌ خطا در ارتباط با سیستم: ' + error.message;
            }
        }
        
        // بررسی خودکار وضعیت سیستم
        checkSystemStatus();
    </script>
</body>
</html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  renderRealDemoPage() {
    // صفحه دموی تعاملی
    return this.renderRealHomePage(); // استفاده از همان صفحه اصلی
  }

  renderRealApiDocs() {
    const endpoints = this.api.getRealEndpoints();
    
    const endpointsHtml = endpoints.map(endpoint => `
      <div class="card">
        <h3>${endpoint.path}</h3>
        <p><strong>متد:</strong> ${endpoint.method}</p>
        <p><strong>توضیح:</strong> ${endpoint.description}</p>
        <p><strong>مثال:</strong></p>
        <pre>curl -X POST https://anti-fragmentation-system.tetrashop.workers.dev${endpoint.path} \\
  -H "Content-Type: application/json" \\
  -d '{"text": "متن نمونه برای پردازش"}'</pre>
      </div>
    `).join('');
    
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مستندات API واقعی | سامانه ضد چندپارگی</title>
    <style>
        body { font-family: Tahoma; direction: rtl; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; }
        .card { background: white; padding: 20px; border-radius: 10px; margin: 10px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        pre { background: #2d3748; color: white; padding: 15px; border-radius: 5px; overflow: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 مستندات APIهای واقعی</h1>
        <div class="card">
            <h2>🎯 APIهای عملیاتی سیستم</h2>
            <p>این APIها کاملاً واقعی بوده و پردازش واقعی روی متن انجام می‌دهند.</p>
        </div>
        
        ${endpointsHtml}
        
        <div class="card">
            <a href="/" class="btn">بازگشت به صفحه اصلی</a>
        </div>
    </div>
</body>
</html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  renderNotFound() {
    return new Response(JSON.stringify({
      success: false,
      error: 'صفحه یافت نشد',
      suggestion: 'از /api/real/* برای APIهای واقعی استفاده کنید'
    }, null, 2), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  errorResponse(message, status = 500) {
    return new Response(JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: status,
      headers: {
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// ایجاد نمونه سیستم واقعی
const realSystem = new RealAntiFragmentationSystem();

// Export برای Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return realSystem.handleRequest(request);
  }
};
