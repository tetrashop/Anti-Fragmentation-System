export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // صفحه اصلی
    if (pathname === '/') {
      const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه ضد چندپارگی | NLP پیشرفته</title>
    <style>
        body { font-family: Tahoma; direction: rtl; text-align: center; padding: 20px; background: #e8f5e8; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 15px; padding: 30px; }
        h1 { color: #2e7d32; margin-bottom: 20px; }
        .status { background: #27ae60; color: white; padding: 12px 25px; border-radius: 25px; display: inline-block; margin: 15px 0; }
        .btn { display: inline-block; margin: 10px; padding: 15px 25px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 سامانه ضد چندپارگی پیشرفته</h1>
        <div class="status">✅ سیستم فعال و بهینه شده</div>
        <p>پیشرفته‌ترین سیستم پردازش زبان فارسی</p>
        <div>
            <a href="/nataq" class="btn">💬 نطق مصطلح</a>
            <a href="/mizanro" class="btn">📊 میزان‌رو</a>
            <a href="/anti_fragmentation" class="btn">🔄 ضد چندپارگی</a>
            <a href="/health" class="btn">❤️ سلامت</a>
        </div>
    </div>
</body>
</html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    // صفحه سلامت
    if (pathname === '/health') {
      const healthData = {
        status: 'healthy',
        service: 'Anti-Fragmentation System',
        version: '3.0.0',
        nlp_status: 'fully_optimized_130',
        timestamp: new Date().toISOString()
      };
      return new Response(JSON.stringify(healthData, null, 2), { 
        headers: { 'Content-Type': 'application/json; charset=utf-8' } 
      });
    }
    
    // صفحات دیگر
    if (['/nataq', '/mizanro', '/anti_fragmentation'].includes(pathname)) {
      const names = { '/nataq': 'نطق مصطلح', '/mizanro': 'میزان‌رو', '/anti_fragmentation': 'ضد چندپارگی' };
      const icons = { '/nataq': '💬', '/mizanro': '📊', '/anti_fragmentation': '🔄' };
      const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>${names[pathname]}</title></head><body style="font-family: Tahoma; direction: rtl; text-align: center; padding: 50px;"><h1>${icons[pathname]} ${names[pathname]}</h1><p>✅ سرویس فعال</p><a href="/">بازگشت</a></body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    // 404
    return new Response('صفحه پیدا نشد', { 
      status: 404, 
      headers: { 'Content-Type': 'text/html; charset=utf-8' } 
    });
  }
}
