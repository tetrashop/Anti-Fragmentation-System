// تست APIهای سامانه
const BASE_URL = 'https://anti-fragmentation-system.YOUR_SUBDOMAIN.workers.dev';

async function testAPI() {
  console.log('🧪 شروع تست APIهای سامانه...\n');

  // تست سلامت سرویس
  try {
    const health = await fetch(`${BASE_URL}/health`);
    const healthData = await health.json();
    console.log('✅ تست سلامت:', healthData.status);
  } catch (error) {
    console.log('❌ تست سلامت شکست خورد');
  }

  // تست نطق مصطلح
  const nataqTest = {
    text: 'أهلاً وسهلاً     به    دنیای   پردازش زبان فارسی'
  };

  try {
    const nataq = await fetch(`${BASE_URL}/api/nataq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nataqTest)
    });
    const nataqData = await nataq.json();
    console.log('✅ تست نطق مصطلح:', nataqData.success ? 'موفق' : 'ناموفق');
  } catch (error) {
    console.log('❌ تست نطق مصطلح شکست خورد');
  }

  console.log('\n🎉 تست‌ها کامل شدند!');
}

testAPI();
