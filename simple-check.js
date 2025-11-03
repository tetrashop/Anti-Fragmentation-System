const https = require('https');

const domain = 'anti-fragmentation-system.tetrashop.workers.dev';

console.log('🔍 بررسی ساده وضعیت سامانه...\n');

// تست صفحه اصلی
https.get(`https://${domain}/`, (res) => {
  console.log('📄 صفحه اصلی:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('سامانه ضد چندپارگی')) {
      console.log('✅ صفحه اصلی درست است');
    } else {
      console.log('❌ صفحه اصلی مشکل دارد');
    }
    checkOtherPages();
  });
}).on('error', (err) => {
  console.log('❌ خطا در دسترسی به سامانه:', err.message);
});

function checkOtherPages() {
  const pages = ['/nataq', '/mizanro', '/anti_fragmentation', '/health'];
  
  pages.forEach(page => {
    https.get(`https://${domain}${page}`, (res) => {
      console.log(`📄 ${page}: ${res.statusCode}`);
    }).on('error', () => {
      console.log(`📄 ${page}: ❌ خطا`);
    });
  });
}
