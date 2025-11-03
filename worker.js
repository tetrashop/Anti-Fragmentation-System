export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // صفحه اصلی
    if (path === '/' || path === '/index.html') {
      return new Response(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <title>سامانه ضد چندپارگی - نسخه ساده</title>
            <style>
                body { font-family: Tahoma; direction: rtl; padding: 40px; text-align: center; }
                .btn { display: inline-block; margin: 10px; padding: 15px 25px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>🚀 سامانه ضد چندپارگی</h1>
            <p>این یک نسخه ساده و تستی است</p>
            
            <div>
                <a href="/nataq" class="btn">نطق مصطلح</a>
                <a href="/mizanro" class="btn">میزان‌رو</a>
                <a href="/anti_fragmentation" class="btn">ضد چندپارگی</a>
            </div>
            
            <p><a href="/health">بررسی سلامت سرویس</a></p>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    // صفحه نطق مصطلح
    if (path === '/nataq') {
      return new Response(`
        <html dir="rtl">
        <head><title>نطق مصطلح</title></head>
        <body style="font-family: Tahoma; direction: rtl; padding: 20px;">
            <h1>💬 نطق مصطلح - فعال</h1>
            <p>این صفحه کار می‌کند!</p>
            <a href="/">بازگشت</a>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    // صفحه سلامت
    if (path === '/health') {
      return new Response(JSON.stringify({
        status: 'active',
        message: 'سامانه کار می‌کند',
        timestamp: new Date().toISOString()
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // اگر صفحه پیدا نشد
    return new Response(`
      <html dir="rtl">
      <body style="font-family: Tahoma; direction: rtl; padding: 20px;">
        <h1>۴۰۴ - صفحه پیدا نشد</h1>
        <p>صفحه ${path} وجود ندارد</p>
        <a href="/">بازگشت به صفحه اصلی</a>
      </body>
      </html>
    `, { 
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}
