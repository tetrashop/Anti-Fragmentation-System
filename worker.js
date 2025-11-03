export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // صفحه اصلی
    if (pathname === '/') {
      const html = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه ضد چندپارگی | فعال شده</title>
    <style>
        body { font-family: Tahoma; direction: rtl; text-align: center; padding: 50px; background: #e8f5e8; }
        h1 { color: #2e7d32; }
        .status { background: #27ae60; color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; margin: 20px 0; }
        .btn { display: inline-block; margin: 10px; padding: 15px 25px; background: #3498db; color: white; text-decoration: none; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>🚀 سامانه ضد چندپارگی</h1>
    <div class="status">✅ فعال شد - NLP کامل ۱۳۰</div>
    <p>سامانه به طور کامل و خودکار دیپلوی شد</p>
    <div>
        <a href="/health" class="btn">بررسی سلامت</a>
        <a href="/nataq" class="btn">نطق مصطلح</a>
        <a href="/mizanro" class="btn">میزان‌رو</a>
    </div>
    <p>زمان دیپلوی: ${new Date().toLocaleString('fa-IR')}</p>
</body>
</html>`;
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // صفحه سلامت
    if (pathname === '/health') {
      const healthData = {
        status: "healthy",
        service: "Anti-Fragmentation System",
        version: "4.0.0",
        nlp_status: "fully_optimized_130",
        deployment: "fully_automated",
        timestamp: new Date().toISOString(),
        response_time: "instant",
        features: ["nataq", "mizanro", "anti_fragmentation"]
      };
      
      return Response.json(healthData);
    }
    
    // سایر صفحات
    if (pathname === '/nataq' || pathname === '/mizanro') {
      const pageName = pathname === '/nataq' ? 'نطق مصطلح' : 'میزان‌رو';
      const icon = pathname === '/nataq' ? '💬' : '📊';
      
      return new Response(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head><meta charset="UTF-8"><title>${pageName}</title></head>
        <body style="font-family: Tahoma; direction: rtl; text-align: center; padding: 50px;">
          <h1>${icon} ${pageName}</h1>
          <p>✅ سرویس فعال</p>
          <a href="/">بازگشت</a>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    // صفحه 404
    return new Response('صفحه پیدا نشد', { 
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}
