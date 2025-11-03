export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    console.log(`📨 درخواست: ${pathname}`);
    
    // صفحه اصلی
    if (pathname === '/') {
      const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <title>سامانه ضد چندپارگی - Ramin</title>
    <style>
        body { 
            font-family: Tahoma, Arial, sans-serif;
            direction: rtl;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5em; margin-bottom: 20px; }
        .btn {
            display: inline-block;
            margin: 10px;
            padding: 15px 30px;
            background: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: background 0.3s;
            font-size: 1.1em;
        }
        .btn:hover { background: #218838; }
        .status {
            background: #17a2b8;
            padding: 10px 20px;
            border-radius: 20px;
            margin: 20px 0;
            display: inline-block;
            font-size: 1.2em;
        }
        .url {
            background: rgba(255,255,255,0.2);
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 سامانه ضد چندپارگی</h1>
        <div class="status">✅ فعال برای Ramin</div>
        
        <div class="url">
            آدرس: anti-fragmentation-system.ramin-edjlal1359.workers.dev
        </div>
        
        <p>پیشرفته‌ترین سیستم پردازش زبان فارسی</p>
        
        <div style="margin: 30px 0;">
            <a href="/nataq" class="btn">💬 نطق مصطلح</a>
            <a href="/mizanro" class="btn">📊 میزان‌رو</a>
            <a href="/anti_fragmentation" class="btn">🔄 ضد چندپارگی</a>
        </div>
        
        <div style="margin-top: 40px;">
            <p>🩺 <a href="/health" style="color: #ffc107; font-size: 1.1em;">بررسی وضعیت سرویس</a></p>
            <p>📞 پشتیبانی: support@tetrashop.com</p>
        </div>
    </div>
</body>
</html>`;
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        }
      });
    }
    
    // صفحه سلامت
    if (pathname === '/health') {
      const data = {
        status: 'healthy',
        service: 'Anti-Fragmentation System',
        version: '4.0.0',
        domain: 'ramin-edjlal1359.workers.dev',
        timestamp: new Date().toISOString(),
        message: 'سامانه برای Ramin فعال است'
      };
      
      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      });
    }
    
    // سایر صفحات
    const pages = {
      '/nataq': ['نطق مصطلح', '💬', 'پردازش و بهینه‌سازی تلفظ متن فارسی'],
      '/mizanro': ['میزان‌رو', '📊', 'تحلیل کیفیت و خوانایی متن فارسی'],
      '/anti_fragmentation': ['ضد چندپارگی', '🔄', 'کاهش تکه‌تکه‌شدگی و بهینه‌سازی متن']
    };
    
    if (pages[pathname]) {
      const [title, emoji, desc] = pages[pathname];
      return new Response(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>${title} - Ramin</title>
            <style>
                body { 
                    font-family: Tahoma, Arial, sans-serif;
                    direction: rtl;
                    text-align: center;
                    padding: 50px;
                    background: #f8f9fa;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 { color: #333; margin-bottom: 20px; }
                .btn {
                    display: inline-block;
                    margin: 20px;
                    padding: 10px 20px;
                    background: #6c757d;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${emoji} ${title}</h1>
                <p>${desc}</p>
                <p>✅ این سرویس برای Ramin فعال شده است</p>
                <a href="/" class="btn">بازگشت به صفحه اصلی</a>
            </div>
        </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        }
      });
    }
    
    // صفحه 404
    return new Response(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <title>صفحه پیدا نشد - Ramin</title>
          <style>
              body { 
                  font-family: Tahoma, Arial, sans-serif;
                  direction: rtl;
                  text-align: center;
                  padding: 50px;
                  background: #f8f9fa;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: white;
                  padding: 40px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 { color: #dc3545; margin-bottom: 20px; }
              .btn {
                  display: inline-block;
                  margin: 20px;
                  padding: 10px 20px;
                  background: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>❌ صفحه پیدا نشد</h1>
              <p>صفحه "${pathname}" وجود ندارد</p>
              <a href="/" class="btn">بازگشت به صفحه اصلی</a>
          </div>
      </body>
      </html>
    `, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    });
  }
}
