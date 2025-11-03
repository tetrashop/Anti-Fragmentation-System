const https = require('https');

const BASE_URL = 'https://anti-fragmentation-system.tetrashop.workers.dev';

const endpoints = [
  '/',
  '/nataq',
  '/mizanro', 
  '/anti_fragmentation',
  '/health',
  '/api/nataq',
  '/api/mizanro',
  '/api/anti_fragmentation'
];

async function checkEndpoints() {
  console.log('🔍 بررسی endpointهای سامانه...\n');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const status = response.status;
      const contentType = response.headers.get('content-type');
      
      console.log(`${endpoint.padEnd(25)} | Status: ${status} | Type: ${contentType || 'N/A'}`);
      
      if (status === 200 && endpoint === '/') {
        const text = await response.text();
        if (text.includes('سامانه ضد چندپارگی')) {
          console.log('   ✅ صفحه اصلی درست کار می‌کند');
        } else {
          console.log('   ❌ صفحه اصلی محتوای اشتباه دارد');
        }
      }
    } catch (error) {
      console.log(`${endpoint.padEnd(25)} | ❌ خطا: ${error.message}`);
    }
  }
}

checkEndpoints();
