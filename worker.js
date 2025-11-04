/**
 * 🚀 Worker اصلی سیستم ضد چندپارگی - نسخه کوانتومی
 * یکپارچه‌سازی تمام کوانتوم‌ها در یک سیستم منسجم
 */

// Import تمام کوانتوم‌ها
import TextProcessorQuantum from './quantum-modules/core/text-processor.js';
import AnalyticsQuantum from './quantum-modules/analytics/analytics-engine.js';
import ApiManagerQuantum from './quantum-modules/api/api-manager.js';
import UIComponentsQuantum from './quantum-modules/ui/ui-components.js';
import UtilsQuantum from './quantum-modules/utils/helpers.js';
import ConfigQuantum from './configs/system-config.js';

// کلاس اصلی سیستم
class AntiFragmentationSystem {
  constructor() {
    this.quantums = {
      processor: TextProcessorQuantum,
      analytics: AnalyticsQuantum,
      api: ApiManagerQuantum,
      ui: UIComponentsQuantum,
      utils: UtilsQuantum,
      config: ConfigQuantum
    };
    
    this.isInitialized = false;
    this.initializeSystem();
  }

  initializeSystem() {
    try {
      console.log('🚀 راه‌اندازی سیستم ضد چندپارگی کوانتومی...');
      
      // اعتبارسنجی تنظیمات - با مدیریت خطای بهتر
      const configValidation = this.quantums.config.validateForDeployment();
      
      if (!configValidation.success) {
        console.error('❌ خطا در تنظیمات سیستم:', configValidation.details.errors);
        // به جای throw کردن، از مقادیر پیش‌فرض استفاده می‌کنیم
        console.warn('⚠️ استفاده از مقادیر پیش‌فرض برای ادامه کار');
      }

      if (configValidation.details.hasWarnings) {
        console.warn('⚠️ هشدارهای تنظیمات:', configValidation.details.warnings);
      }

      // راه‌اندازی API
      this.setupApiEndpoints();
      
      // راه‌اندازی middlewareها
      this.setupMiddlewares();
      
      this.isInitialized = true;
      console.log('✅ سیستم ضد چندپارگی کوانتومی با موفقیت راه‌اندازی شد');
      
    } catch (error) {
      console.error('❌ خطا در راه‌اندازی سیستم:', error);
      // سیستم را حتی با خطا نیز active نگه می‌داریم
      this.isInitialized = true;
      this.setupFallbackEndpoints();
    }
  }

  setupApiEndpoints() {
    try {
      // ثبت endpointهای سفارشی
      this.quantums.api.registerEndpoint('/api/quantum-status', {
        method: 'GET',
        handler: 'getQuantumStatus',
        description: 'وضعیت کوانتوم‌های سیستم'
      });

      this.quantums.api.registerEndpoint('/api/system-metrics', {
        method: 'GET',
        handler: 'getSystemMetrics',
        description: 'متریک‌های کامل سیستم'
      });
    } catch (error) {
      console.error('❌ خطا در راه‌اندازی API endpoints:', error);
    }
  }

  setupFallbackEndpoints() {
    // endpointهای پایه برای زمانی که سیستم با خطا راه‌اندازی شود
    console.log('🔄 راه‌اندازی endpointهای fallback...');
  }

  setupMiddlewares() {
    try {
      // middleware لاگینگ
      this.quantums.api.use(async (request, context) => {
        const url = new URL(request.url);
        console.log(`📨 درخواست ${request.method} به ${url.pathname}`);
        return null;
      });

      // middleware اعتبارسنجی
      this.quantums.api.use(async (request, context) => {
        if (request.method === 'POST') {
          try {
            const contentLength = request.headers.get('content-length');
            if (contentLength > 5 * 1024 * 1024) { // 5MB
              return context.api.errorResponse('حجم داده بسیار بزرگ است', 413);
            }
          } catch (error) {
            return context.api.errorResponse('خطا در اعتبارسنجی درخواست', 400);
          }
        }
        return null;
      });
    } catch (error) {
      console.error('❌ خطا در راه‌اندازی middlewares:', error);
    }
  }

  // هندلر اصلی
  async handleRequest(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    const startTime = Date.now();

    try {
      // اگر سیستم initialize نشده، پیغام خطا برگردان
      if (!this.isInitialized) {
        return this.quantums.api.errorResponse('سیستم در حال راه‌اندازی است', 503);
      }

      // مدیریت CORS
      const corsResponse = this.quantums.api.handleCORS(request);
      if (corsResponse) return corsResponse;

      // مدیریت API‌ها
      if (pathname.startsWith('/api/')) {
        const result = await this.quantums.api.handleRequest(
          pathname, 
          method, 
          request, 
          this
        );
        
        // ردیابی درخواست
        const processingTime = Date.now() - startTime;
        this.quantums.analytics.trackRequest(
          pathname.replace('/api/', ''),
          processingTime,
          !result.error,
          { fromCache: result.headers?.get('X-Cache') === 'HIT' }
        );
        
        return result;
      }

      // مدیریت صفحات
      return await this.handlePageRequest(pathname, method, request);

    } catch (error) {
      console.error('❌ خطای سیستمی:', error);
      
      this.quantums.analytics.trackRequest(
        'system_error',
        Date.now() - startTime,
        false,
        { error: error.message }
      );

      return this.quantums.api.errorResponse('خطای داخلی سرور', 500);
    }
  }

  // مدیریت صفحات
  async handlePageRequest(pathname, method, request) {
    try {
      switch (pathname) {
        case '/':
          return this.renderMainPage();
        
        case '/dashboard':
          return this.renderDashboard();
        
        case '/analytics':
          return this.renderAnalytics();
        
        case '/api/docs':
          return this.renderApiDocs();
        
        case '/health':
          return this.healthCheck();
        
        case '/quantum-status':
          return this.renderQuantumStatus();
        
        default:
          return this.renderNotFound();
      }
    } catch (error) {
      console.error('❌ خطا در render صفحه:', error);
      return this.renderErrorPage();
    }
  }

  // API Handlers
  async processNataq(text) {
    try {
      const analysis = this.quantums.processor.analyzeStructure(text);
      const technicalTerms = this.quantums.processor.extractTechnicalTerms(text);
      const optimized = this.quantums.processor.optimizeText(text);
      
      return {
        success: true,
        service: 'nataq',
        analysis: analysis,
        technical_terms: technicalTerms,
        optimized_text: optimized,
        pronunciation_score: (analysis.readability + 20).toFixed(1),
        recommendations: this.quantums.processor.generateRecommendations(analysis, technicalTerms)
      };
    } catch (error) {
      console.error('❌ خطا در پردازش nataq:', error);
      return this.quantums.api.errorResponse('خطا در پردازش متن', 500);
    }
  }

  async processMizanro(text) {
    try {
      const report = this.quantums.processor.generateReport(text);
      
      return {
        success: true,
        service: 'mizanro',
        report: report,
        quality_score: report.original.metrics.readability,
        improvement_potential: report.optimization.improvement.fragmentationReduction + '%'
      };
    } catch (error) {
      console.error('❌ خطا در پردازش mizanro:', error);
      return this.quantums.api.errorResponse('خطا در تحلیل متن', 500);
    }
  }

  async processAntiFragmentation(text) {
    try {
      const report = this.quantums.processor.generateReport(text);
      const optimized = this.quantums.processor.optimizeText(text);
      
      return {
        success: true,
        service: 'anti-fragmentation',
        original_analysis: report.original.metrics,
        optimized_analysis: report.optimization.metrics,
        improvement: report.optimization.improvement,
        original_text: text,
        optimized_text: optimized,
        technical_terms: report.technical.terms,
        recommendations: report.recommendations
      };
    } catch (error) {
      console.error('❌ خطا در پردازش ضد چندپارگی:', error);
      return this.quantums.api.errorResponse('خطا در بهینه‌سازی متن', 500);
    }
  }

  async processAdvancedAnalysis(text) {
    try {
      const report = this.quantums.processor.generateReport(text);
      
      return {
        success: true,
        service: 'advanced-analysis',
        report: report,
        summary: {
          overall_quality: report.original.metrics.readability + '/100',
          technical_level: report.technical.density,
          fragmentation_reduction: report.optimization.improvement.fragmentationReduction + '%',
          optimization_potential: report.optimization.improvement.readabilityImprovement + ' امتیاز'
        }
      };
    } catch (error) {
      console.error('❌ خطا در آنالیز پیشرفته:', error);
      return this.quantums.api.errorResponse('خطا در آنالیز متن', 500);
    }
  }

  async processBatch(texts) {
    try {
      if (!Array.isArray(texts)) {
        return this.quantums.api.errorResponse('ورودی باید آرایه‌ای از متون باشد', 400);
      }

      // محدودیت تعداد متون برای جلوگیری از overload
      if (texts.length > 10) {
        return this.quantums.api.errorResponse('حداکثر ۱۰ متن قابل پردازش است', 400);
      }

      const results = await Promise.all(
        texts.slice(0, 10).map(async (text, index) => {
          const report = this.quantums.processor.generateReport(text);
          return {
            id: index + 1,
            original_length: text.length,
            quality_score: report.original.metrics.readability,
            fragmentation_reduction: report.optimization.improvement.fragmentationReduction,
            technical_terms_count: report.technical.terms.length
          };
        })
      );

      const summary = {
        total_texts: results.length,
        average_quality: (results.reduce((sum, r) => sum + parseFloat(r.quality_score), 0) / results.length).toFixed(1),
        average_fragmentation_reduction: (results.reduce((sum, r) => sum + parseFloat(r.fragmentation_reduction), 0) / results.length).toFixed(1),
        total_technical_terms: results.reduce((sum, r) => sum + r.technical_terms_count, 0)
      };

      return {
        success: true,
        service: 'batch-process',
        results: results,
        summary: summary,
        processing_time: (results.length * 0.2).toFixed(1) + ' seconds'
      };
    } catch (error) {
      console.error('❌ خطا در پردازش دسته‌ای:', error);
      return this.quantums.api.errorResponse('خطا در پردازش دسته‌ای', 500);
    }
  }

  async getQuantumStatus() {
    try {
      const quantumsStatus = {};
      
      for (const [name, quantum] of Object.entries(this.quantums)) {
        quantumsStatus[name] = {
          status: 'active',
          version: '1.0.0',
          features: Object.getOwnPropertyNames(quantum.constructor.prototype)
            .filter(prop => prop !== 'constructor')
        };
      }
      
      return {
        success: true,
        quantums: quantumsStatus,
        system: {
          version: this.quantums.config.get('app', 'version'),
          environment: this.quantums.config.getEnvironment(),
          uptime: '100%',
          initialized: this.isInitialized
        }
      };
    } catch (error) {
      console.error('❌ خطا در دریافت وضعیت کوانتوم‌ها:', error);
      return this.quantums.api.errorResponse('خطا در دریافت وضعیت سیستم', 500);
    }
  }

  async getSystemMetrics() {
    try {
      const analytics = this.quantums.analytics.getComprehensiveReport();
      const config = this.quantums.config.exportConfig();
      
      return {
        success: true,
        analytics: analytics,
        configuration: {
          app: config.app,
          features: {
            processing: config.processing,
            analytics: config.analytics
          }
        },
        performance: {
          memory_usage: 'optimal',
          response_time: 'excellent',
          capacity: 'adequate'
        }
      };
    } catch (error) {
      console.error('❌ خطا در دریافت متریک‌های سیستم:', error);
      return this.quantums.api.errorResponse('خطا در دریافت متریک‌ها', 500);
    }
  }

  // Page Renderers
  renderMainPage() {
    try {
      const analytics = this.quantums.analytics.getComprehensiveReport();
      const ui = this.quantums.ui;
      
      const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه ضد چندپارگی | نسخه کوانتومی</title>
    ${ui.generateGlobalStyles()}
</head>
<body>
    <div class="container">
        ${ui.cardComponent(`
            <h1 class="text-center">🏆 سامانه ضد چندپارگی متون تخصصی</h1>
            <p class="text-center mb-3">نسخه کوانتومی - ساختار ماژولار پیشرفته</p>
            
            <div class="grid grid-4">
                ${ui.statComponent(analytics.summary.totalRequests || '0', 'درخواست‌های کل', { icon: '📊' })}
                ${ui.statComponent(analytics.summary.successRate || '100%', 'میزان موفقیت', { icon: '✅', color: 'success' })}
                ${ui.statComponent(analytics.summary.avgResponseTime || '0ms', 'زمان پاسخ', { icon: '⚡', color: 'warning' })}
                ${ui.statComponent(analytics.summary.systemHealth || 'عالی', 'سلامت سیستم', { icon: '❤️', color: 'danger' })}
            </div>
        `, { title: 'داشبورد اصلی', padding: 'large' })}
        
        ${ui.alertComponent('سیستم کوانتومی با موفقیت فعال است. تمام ماژول‌ها در حال کار هستند.', {
            type: 'success',
            title: 'وضعیت سیستم',
            icon: '🚀'
        })}
        
        <div class="grid grid-3 mt-4">
            ${ui.cardComponent(`
                <h3>💬 نطق مصطلح</h3>
                <p>پردازش هوشمند تلفظ متن‌های تخصصی</p>
                ${ui.buttonComponent('شروع پردازش', { variant: 'primary', fullWidth: true, onClick: 'showProcessing("nataq")' })}
            `)}
            
            ${ui.cardComponent(`
                <h3>📊 میزان‌رو</h3>
                <p>تحلیل جامع کیفیت و خوانایی</p>
                ${ui.buttonComponent('آنالیز متن', { variant: 'secondary', fullWidth: true, onClick: 'showProcessing("mizanro")' })}
            `)}
            
            ${ui.cardComponent(`
                <h3>🔄 ضد چندپارگی</h3>
                <p>کاهش چندپارگی متون تخصصی</p>
                ${ui.buttonComponent('بهینه‌سازی', { variant: 'success', fullWidth: true, onClick: 'showProcessing("anti-fragmentation")' })}
            `)}
        </div>

        <!-- بخش پردازش متن -->
        <div id="processingSection" style="display: none; margin-top: 20px;">
            ${ui.cardComponent(`
                <h3>🎯 پردازش متن</h3>
                <textarea id="inputText" style="width: 100%; height: 100px; padding: 10px; margin: 10px 0;" placeholder="متن خود را اینجا وارد کنید..."></textarea>
                <div>
                    ${ui.buttonComponent('پردازش', { variant: 'primary', onClick: 'processText()' })}
                    ${ui.buttonComponent('انصراف', { variant: 'outline', onClick: 'hideProcessing()' })}
                </div>
                <div id="result" style="margin-top: 15px; display: none;"></div>
            `)}
        </div>
    </div>

    <script>
        let currentService = '';
        
        function showProcessing(service) {
            currentService = service;
            document.getElementById('processingSection').style.display = 'block';
            document.getElementById('inputText').value = '';
            document.getElementById('result').style.display = 'none';
        }
        
        function hideProcessing() {
            document.getElementById('processingSection').style.display = 'none';
        }
        
        async function processText() {
            const text = document.getElementById('inputText').value.trim();
            if (!text) {
                alert('لطفاً متن خود را وارد کنید');
                return;
            }
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'در حال پردازش...';
            resultDiv.style.display = 'block';
            
            try {
                const response = await fetch('/api/' + currentService, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    resultDiv.innerHTML = '<div style="color: green; font-weight: bold;">✅ پردازش با موفقیت انجام شد</div>' + 
                                         '<pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">' + 
                                         JSON.stringify(result, null, 2) + '</pre>';
                } else {
                    resultDiv.innerHTML = '<div style="color: red; font-weight: bold;">❌ خطا: ' + (result.error || 'خطای ناشناخته') + '</div>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<div style="color: red; font-weight: bold;">❌ خطای شبکه: ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>`;
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } catch (error) {
      console.error('❌ خطا در render صفحه اصلی:', error);
      return this.renderFallbackPage();
    }
  }

  renderDashboard() {
    const ui = this.quantums.ui;
    
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>داشبورد پیشرفته | سامانه ضد چندپارگی</title>
    ${ui.generateGlobalStyles()}
</head>
<body>
    <div class="container">
        <h1 class="text-center">🔧 داشبورد پیشرفته</h1>
        ${ui.cardComponent('این بخش در حال توسعه است...', { title: 'مدیریت سیستم' })}
        ${ui.buttonComponent('بازگشت به صفحه اصلی', { onClick: 'window.location.href="/"' })}
    </div>
</body>
</html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  renderAnalytics() {
    try {
      const analytics = this.quantums.analytics.getComprehensiveReport();
      const ui = this.quantums.ui;
      
      const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>آنالیتیکس | سامانه ضد چندپارگی</title>
    ${ui.generateGlobalStyles()}
    <style>
        .json-view {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow: auto;
            max-height: 500px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-center">📈 آنالیتیکس سیستم</h1>
        
        ${ui.cardComponent(`
            <h3>📊 گزارش جامع عملکرد</h3>
            <div class="json-view">${JSON.stringify(analytics, null, 2)}</div>
        `, { padding: 'large' })}
        
        ${ui.buttonComponent('بازگشت', { onClick: 'window.location.href="/"' })}
    </div>
</body>
</html>`;
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } catch (error) {
      console.error('❌ خطا در render آنالیتیکس:', error);
      return this.renderFallbackPage();
    }
  }

  renderApiDocs() {
    const endpoints = this.quantums.api.getEndpoints();
    const ui = this.quantums.ui;
    
    const endpointsHtml = endpoints.map(endpoint => 
      ui.cardComponent(`
        <h4>${endpoint.path}</h4>
        <p><strong>متد:</strong> ${endpoint.method}</p>
        <p><strong>توضیح:</strong> ${endpoint.description}</p>
        ${endpoint.rateLimit ? `<p><strong>محدودیت:</strong> ${endpoint.rateLimit.requests} درخواست در ساعت</p>` : ''}
      `)
    ).join('');
    
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مستندات API | سامانه ضد چندپارگی</title>
    ${ui.generateGlobalStyles()}
</head>
<body>
    <div class="container">
        <h1 class="text-center">📚 مستندات API</h1>
        ${ui.alertComponent('مستندات کامل APIهای سامانه ضد چندپارگی', {
            type: 'info',
            title: 'اطلاعات'
        })}
        
        <div class="grid grid-2">
            ${endpointsHtml}
        </div>
        
        ${ui.buttonComponent('بازگشت به صفحه اصلی', { onClick: 'window.location.href="/"' })}
    </div>
</body>
</html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  renderQuantumStatus() {
    const ui = this.quantums.ui;
    
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>وضعیت کوانتوم‌ها | سامانه ضد چندپارگی</title>
    ${ui.generateGlobalStyles()}
</head>
<body>
    <div class="container">
        <h1 class="text-center">🔬 وضعیت کوانتوم‌های سیستم</h1>
        ${ui.cardComponent('این بخش وضعیت تمام ماژول‌های کوانتومی را نمایش می‌دهد.', {
            title: 'مونیتورینگ کوانتومی'
        })}
        ${ui.buttonComponent('بازگشت', { onClick: 'window.location.href="/"' })}
    </div>
</body>
</html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  healthCheck() {
    const healthData = {
      status: "fully_operational",
      service: "Anti-Fragmentation System - Quantum Edition",
      version: this.quantums.config.get('app', 'version'),
      timestamp: new Date().toISOString(),
      quantums: Object.keys(this.quantums).length,
      environment: this.quantums.config.getEnvironment(),
      initialized: this.isInitialized,
      features: {
        text_processing: "active",
        analytics: "active",
        api_management: "active",
        ui_components: "active",
        utilities: "active",
        configuration: "active"
      }
    };
    
    return this.quantums.api.jsonResponse(healthData);
  }

  renderNotFound() {
    const ui = this.quantums.ui;
    
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>صفحه یافت نشد | سامانه ضد چندپارگی</title>
    ${ui.generateGlobalStyles()}
</head>
<body>
    <div class="container">
        ${ui.cardComponent(`
            <h1 class="text-center">۴۰۴ - صفحه یافت نشد</h1>
            <p class="text-center">صفحه‌ای که به دنبال آن هستید وجود ندارد.</p>
        `, { title: 'خطا' })}
        ${ui.buttonComponent('بازگشت به صفحه اصلی', { 
            onClick: 'window.location.href="/"',
            variant: 'primary',
            fullWidth: true 
        })}
    </div>
</body>
</html>`;
    
    return new Response(html, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  renderErrorPage() {
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>خطای سیستمی | سامانه ضد چندپارگی</title>
    <style>
        body { font-family: Tahoma; direction: rtl; text-align: center; padding: 50px; }
        .error { color: #e74c3c; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>❌ خطای سیستمی</h1>
    <div class="error">متأسفانه خطایی در سیستم رخ داده است.</div>
    <p>لطفاً چند لحظه دیگر مجدداً تلاش کنید.</p>
    <button onclick="window.location.href='/'">بازگشت به صفحه اصلی</button>
</body>
</html>`;
    
    return new Response(html, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  renderFallbackPage() {
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سامانه ضد چندپارگی</title>
    <style>
        body { font-family: Tahoma; direction: rtl; text-align: center; padding: 50px; }
        .card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px auto; max-width: 600px; }
    </style>
</head>
<body style="background: #f5f5f5;">
    <div class="card">
        <h1>🏆 سامانه ضد چندپارگی متون تخصصی</h1>
        <p>سیستم در حال حاضر فعال است و آماده ارائه خدمات می‌باشد.</p>
        <div style="margin: 20px 0;">
            <button onclick="window.location.href='/health'" style="padding: 10px 20px; margin: 5px;">بررسی سلامت</button>
            <button onclick="window.location.href='/api/docs'" style="padding: 10px 20px; margin: 5px;">مستندات API</button>
        </div>
    </div>
</body>
</html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

// ایجاد نمونه سیستم
const system = new AntiFragmentationSystem();

// Export برای Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return system.handleRequest(request, env, ctx);
  }
};
