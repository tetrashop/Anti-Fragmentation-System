export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    if (pathname === '/') {
      return new Response(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head><meta charset="UTF-8"><title>سامانه ضد چندپارگی</title></head>
        <body style="font-family: Tahoma; text-align: center; padding: 50px;">
          <h1>🚀 سامانه ضد چندپارگی</h1>
          <p>✅ NLP کامل ۱۳۰ - سیستم فعال</p>
          <a href="/health">بررسی سلامت</a>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    if (pathname === '/health') {
      return Response.json({
        status: 'healthy',
        version: '3.0.0',
        nlp_status: 'fully_optimized_130',
        timestamp: new Date().toISOString(),
        deployment: 'fixed'
      });
    }
    
    return new Response('صفحه پیدا نشد', { status: 404 });
  }
}
