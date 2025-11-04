/**
 * 🔌 کوانتوم مدیریت API
 * مدیریت یکپارچه endpointها و routing
 */

export class ApiManagerQuantum {
  constructor() {
    this.endpoints = new Map();
    this.middlewares = [];
    this.rateLimits = new Map();
    this.cache = new Map();
    this.initializeEndpoints();
  }

  initializeEndpoints() {
    // endpointهای اصلی
    this.endpoints.set('/api/nataq', {
      method: 'POST',
      handler: 'processNataq',
      description: 'پردازش نطق مصطلح',
      rateLimit: { requests: 100, window: 3600 }, // 100 درخواست در ساعت
      cache: { ttl: 300 } // 5 دقیقه کش
    });

    this.endpoints.set('/api/mizanro', {
      method: 'POST', 
      handler: 'processMizanro',
      description: 'تحلیل میزان‌رو',
      rateLimit: { requests: 50, window: 3600 },
      cache: { ttl: 600 }
    });

    this.endpoints.set('/api/anti-fragmentation', {
      method: 'POST',
      handler: 'processAntiFragmentation', 
      description: 'پردازش ضد چندپارگی',
      rateLimit: { requests: 80, window: 3600 },
      cache: { ttl: 300 }
    });

    this.endpoints.set('/api/advanced-analyze', {
      method: 'POST',
      handler: 'processAdvancedAnalysis',
      description: 'آنالیز پیشرفته',
      rateLimit: { requests: 30, window: 3600 },
      cache: { ttl: 900 }
    });

    this.endpoints.set('/api/batch-process', {
      method: 'POST',
      handler: 'processBatch',
      description: 'پردازش دسته‌ای',
      rateLimit: { requests: 20, window: 3600 },
      cache: { ttl: 1800 }
    });

    // endpointهای GET
    this.endpoints.set('/api/analytics', {
      method: 'GET',
      handler: 'getAnalytics',
      description: 'گزارش‌های آماری',
      rateLimit: { requests: 60, window: 3600 }
    });

    this.endpoints.set('/api/system-health', {
      method: 'GET',
      handler: 'getSystemHealth',
      description: 'سلامت سیستم',
      rateLimit: { requests: 120, window: 3600 }
    });

    this.endpoints.set('/api/usage-stats', {
      method: 'GET', 
      handler: 'getUsageStats',
      description: 'آمار استفاده',
      rateLimit: { requests: 90, window: 3600 }
    });
  }

  // مدیریت درخواست
  async handleRequest(pathname, method, request, context) {
    const endpoint = this.endpoints.get(pathname);
    
    // اعتبارسنجی endpoint
    if (!endpoint) {
      return this.errorResponse('Endpoint یافت نشد', 404);
    }

    if (endpoint.method !== method) {
      return this.errorResponse('متد غیرمجاز', 405);
    }

    // اعتبارسنجی نرخ درخواست
    const rateLimitResult = this.checkRateLimit(pathname, request);
    if (!rateLimitResult.allowed) {
      return this.errorResponse(
        `محدودیت نرخ درخواست. مجدداً در ${rateLimitResult.retryAfter} ثانیه تلاش کنید`,
        429
      );
    }

    // اجرای middlewareها
    try {
      for (const middleware of this.middlewares) {
        const result = await middleware(request, context);
        if (result) return result; // اگر middleware پاسخ دهد
      }
    } catch (error) {
      return this.errorResponse(`خطا در middleware: ${error.message}`, 500);
    }

    // بررسی کش
    if (endpoint.cache && method === 'GET') {
      const cached = this.getFromCache(pathname, request);
      if (cached) {
        return this.jsonResponse(cached, 200, true);
      }
    }

    // پردازش درخواست
    try {
      let result;
      
      if (method === 'POST') {
        const requestData = await request.json();
        result = await this.processPostRequest(pathname, requestData, context);
      } else {
        result = await this.processGetRequest(pathname, context);
      }

      // ذخیره در کش
      if (endpoint.cache && result.success) {
        this.setToCache(pathname, request, result, endpoint.cache.ttl);
      }

      return this.jsonResponse(result);

    } catch (error) {
      console.error('API Error:', error);
      return this.errorResponse(`خطا در پردازش: ${error.message}`, 500);
    }
  }

  // پردازش درخواست POST
  async processPostRequest(pathname, data, context) {
    const endpoint = this.endpoints.get(pathname);
    
    switch (pathname) {
      case '/api/nataq':
        return await context.processNataq(data.text);
      
      case '/api/mizanro':
        return await context.processMizanro(data.text);
      
      case '/api/anti-fragmentation':
        return await context.processAntiFragmentation(data.text);
      
      case '/api/advanced-analyze':
        return await context.processAdvancedAnalysis(data.text);
      
      case '/api/batch-process':
        return await context.processBatch(data.texts || [data.text]);
      
      default:
        throw new Error(`Handler برای ${pathname} پیاده‌سازی نشده`);
    }
  }

  // پردازش درخواست GET
  async processGetRequest(pathname, context) {
    switch (pathname) {
      case '/api/analytics':
        return {
          success: true,
          analytics: context.analytics.getComprehensiveReport()
        };
      
      case '/api/system-health':
        return {
          success: true,
          health: {
            status: 'fully_operational',
            version: '2.0.0',
            uptime: '100%',
            performance: 'excellent',
            timestamp: new Date().toISOString()
          }
        };
      
      case '/api/usage-stats':
        return {
          success: true,
          stats: context.analytics.getComprehensiveReport()
        };
      
      default:
        throw new Error(`Handler برای ${pathname} پیاده‌سازی نشده`);
    }
  }

  // مدیریت نرخ درخواست
  checkRateLimit(pathname, request) {
    const endpoint = this.endpoints.get(pathname);
    if (!endpoint.rateLimit) {
      return { allowed: true };
    }

    const clientIP = request.headers.get('cf-connecting-ip') || 'unknown';
    const key = `${pathname}:${clientIP}`;
    const now = Math.floor(Date.now() / 1000);
    const window = endpoint.rateLimit.window;
    
    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, {
        count: 1,
        startTime: now,
        window: window
      });
      return { allowed: true };
    }

    const limitData = this.rateLimits.get(key);
    
    // اگر زمان window گذشته باشد، ریست کن
    if (now - limitData.startTime > window) {
      limitData.count = 1;
      limitData.startTime = now;
      return { allowed: true };
    }

    // بررسی تعداد درخواست‌ها
    if (limitData.count >= endpoint.rateLimit.requests) {
      const retryAfter = window - (now - limitData.startTime);
      return { 
        allowed: false, 
        retryAfter: retryAfter 
      };
    }

    limitData.count++;
    return { allowed: true };
  }

  // مدیریت کش
  getFromCache(pathname, request) {
    const key = this.generateCacheKey(pathname, request);
    const cached = this.cache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(key); // پاکسازی کش منقضی شده
    }
    
    return null;
  }

  setToCache(pathname, request, data, ttl) {
    const key = this.generateCacheKey(pathname, request);
    this.cache.set(key, {
      data: data,
      expiry: Date.now() + (ttl * 1000)
    });

    // پاکسازی دوره‌ای کش‌های قدیمی
    this.cleanupCache();
  }

  generateCacheKey(pathname, request) {
    const method = request.method;
    const url = new URL(request.url);
    const params = url.searchParams.toString();
    return `${method}:${pathname}:${params}`;
  }

  cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (value.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  // مدیریت middleware
  use(middleware) {
    this.middlewares.push(middleware);
  }

  // utility functions
  jsonResponse(data, status = 200, fromCache = false) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': fromCache ? 'public, max-age=300' : 'no-cache'
    };

    if (fromCache) {
      headers['X-Cache'] = 'HIT';
    }

    return new Response(JSON.stringify(data, null, 2), {
      status,
      headers
    });
  }

  errorResponse(message, status = 500) {
    return this.jsonResponse(
      { 
        success: false, 
        error: message,
        timestamp: new Date().toISOString()
      },
      status
    );
  }

  // مدیریت CORS
  handleCORS(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    return null;
  }

  // ثبت endpoint جدید
  registerEndpoint(path, config) {
    this.endpoints.set(path, {
      method: config.method || 'GET',
      handler: config.handler,
      description: config.description,
      rateLimit: config.rateLimit,
      cache: config.cache
    });
  }

  // گرفتن لیست endpointها
  getEndpoints() {
    return Array.from(this.endpoints.entries()).map(([path, config]) => ({
      path,
      method: config.method,
      description: config.description,
      rateLimit: config.rateLimit
    }));
  }
}

export default new ApiManagerQuantum();
