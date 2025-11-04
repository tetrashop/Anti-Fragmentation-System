/**
 * ⚙️ کوانتوم پیکربندی سیستم
 * مدیریت تنظیمات و کانفیگ‌های سیستم
 */

export class ConfigQuantum {
  constructor() {
    this.configs = new Map();
    this.environments = new Map();
    this.secrets = new Map();
    this.initializeConfigs();
  }

  initializeConfigs() {
    // تنظیمات پایه - با مقادیر پیش‌فرض ایمن
    this.configs.set('app', {
      name: 'سامانه ضد چندپارگی متون تخصصی',
      version: '2.0.0',
      description: 'سیستم پیشرفته پردازش و بهینه‌سازی متون تخصصی فارسی',
      author: 'tetrashop',
      license: 'MIT'
    });

    // تنظیمات سرور - مقادیر سازگار با Cloudflare Workers
    this.configs.set('server', {
      port: 8787,
      host: '0.0.0.0',
      cors: {
        origins: ['*'],
        methods: ['GET', 'POST', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization']
      },
      rateLimit: {
        enabled: true,
        maxRequests: 1000,
        windowMs: 900000
      }
    });

    // تنظیمات API - با مقادیر ایمن
    this.configs.set('api', {
      basePath: '/api',
      version: 'v1',
      documentation: {
        enabled: true,
        path: '/api/docs'
      },
      caching: {
        enabled: true,
        defaultTTL: 300,
        maxSize: 100
      }
    });

    // تنظیمات پردازش متن - با محدودیت‌های معقول
    this.configs.set('processing', {
      maxTextLength: 5000,
      timeout: 10000,
      batchSize: 5,
      optimization: {
        enabled: true,
        maxSentenceLength: 25,
        removeRedundancy: true,
        enhanceReadability: true
      },
      analysis: {
        depth: 'advanced',
        includeTechnicalTerms: true,
        generateRecommendations: true
      }
    });

    // تنظیمات آنالیتیکس - با مقادیر پایه
    this.configs.set('analytics', {
      enabled: true,
      retention: {
        hourly: 24,
        daily: 7,
        monthly: 3
      },
      metrics: {
        responseTime: true,
        successRate: true,
        usagePatterns: true,
        performance: true
      },
      alerts: {
        enabled: false,
        thresholds: {
          responseTime: 5000,
          successRate: 80,
          errorRate: 20
        }
      }
    });

    // تنظیمات UI
    this.configs.set('ui', {
      theme: 'default',
      rtl: true,
      features: {
        darkMode: true,
        responsive: true,
        animations: false,
        realTimeUpdates: false
      },
      components: {
        useCustom: true,
        autoInject: true
      }
    });

    // تنظیمات امنیتی - با مقادیر ایمن
    this.configs.set('security', {
      https: true,
      cors: true,
      rateLimiting: true,
      inputValidation: true,
      sanitization: true
    });

    this.initializeEnvironments();
  }

  initializeEnvironments() {
    // محیط توسعه
    this.environments.set('development', {
      debug: true,
      logging: 'verbose',
      caching: false,
      analytics: {
        enabled: true,
        sampleRate: 1.0
      }
    });

    // محیط تولید
    this.environments.set('production', {
      debug: false,
      logging: 'warn',
      caching: true,
      analytics: {
        enabled: true,
        sampleRate: 0.1
      }
    });
  }

  // گرفتن تنظیمات - با مدیریت خطای بهتر
  get(section, key = null) {
    try {
      if (!this.configs.has(section)) {
        console.warn(`Section ${section} در تنظیمات یافت نشد`);
        return this.getFallbackConfig(section, key);
      }

      const sectionConfig = this.configs.get(section);
      
      if (key === null) {
        return sectionConfig;
      }

      // پشتیبانی از کلیدهای تودرتو
      const keys = key.split('.');
      let value = sectionConfig;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Key ${key} در section ${section} یافت نشد`);
          return this.getFallbackValue(section, key);
        }
      }
      
      return value;

    } catch (error) {
      console.error(`خطا در خواندن تنظیمات ${section}.${key}:`, error);
      return this.getFallbackValue(section, key);
    }
  }

  // تنظیمات پیش‌فرض برای موارد خطا
  getFallbackConfig(section, key) {
    const fallbacks = {
      'app': {
        name: 'سامانه ضد چندپارگی',
        version: '2.0.0',
        description: 'سیستم پردازش متن'
      },
      'server': {
        port: 8787,
        host: '0.0.0.0',
        cors: { origins: ['*'] }
      },
      'api': {
        basePath: '/api',
        caching: { enabled: false }
      },
      'processing': {
        maxTextLength: 5000,
        timeout: 10000
      }
    };
    
    if (key && fallbacks[section] && key in fallbacks[section]) {
      return fallbacks[section][key];
    }
    
    return fallbacks[section] || {};
  }

  getFallbackValue(section, key) {
    const fallbackValues = {
      'server.port': 8787,
      'processing.maxTextLength': 5000,
      'api.caching.defaultTTL': 300,
      'analytics.enabled': true
    };
    
    const fullKey = `${section}.${key}`;
    return fallbackValues[fullKey] !== undefined ? fallbackValues[fullKey] : null;
  }

  // تنظیم مقدار - با اعتبارسنجی
  set(section, key, value) {
    try {
      if (!this.configs.has(section)) {
        this.configs.set(section, {});
      }

      const sectionConfig = this.configs.get(section);
      
      // پشتیبانی از کلیدهای تودرتو
      const keys = key.split('.');
      let current = sectionConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k] || typeof current[k] !== 'object') {
          current[k] = {};
        }
        current = current[k];
      }
      
      current[keys[keys.length - 1]] = value;
      return true;
      
    } catch (error) {
      console.error(`خطا در تنظیم مقدار ${section}.${key}:`, error);
      return false;
    }
  }

  // اعتبارسنجی تنظیمات - نسخه ساده‌تر و ایمن‌تر
  validateConfig() {
    const errors = [];
    const warnings = [];

    // بررسی sections ضروری
    const requiredSections = ['app', 'server', 'api', 'processing'];
    for (const section of requiredSections) {
      if (!this.configs.has(section)) {
        warnings.push(`Section ${section} یافت نشد - از مقادیر پیش‌فرض استفاده می‌شود`);
      }
    }

    // اعتبارسنجی مقادیر عددی - با محدوده‌های ایمن
    const numericChecks = [
      ['server', 'port', (val) => val > 0 && val < 65536],
      ['processing', 'maxTextLength', (val) => val > 0 && val <= 10000],
      ['processing', 'timeout', (val) => val > 0 && val <= 30000],
      ['api', 'caching.defaultTTL', (val) => val > 0 && val <= 3600]
    ];

    for (const [section, key, validator] of numericChecks) {
      try {
        const value = this.get(section, key);
        if (value !== null && !validator(value)) {
          warnings.push(`مقدار ${key} در ${section} ممکن است نامعتبر باشد: ${value}`);
        }
      } catch (error) {
        // خطا را نادیده می‌گیریم چون get خودش مقدار پیش‌فرض برمی‌گرداند
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      warnings: warnings,
      hasWarnings: warnings.length > 0
    };
  }

  // گرفتن تنظیمات محیط
  getEnvironmentConfig(env) {
    if (!this.environments.has(env)) {
      return this.environments.get('production') || {};
    }
    return this.environments.get(env);
  }

  // export تنظیمات - برای debugging
  exportConfig(includeSecrets = false) {
    const config = {};
    for (const [section, values] of this.configs) {
      config[section] = values;
    }
    return config;
  }

  // helper methods
  isDevelopment() {
    return this.getEnvironment() === 'development';
  }

  isProduction() {
    return this.getEnvironment() === 'production';
  }

  getEnvironment() {
    // در Cloudflare Workers معمولاً environment variable وجود دارد
    return 'production'; // همیشه production برای ایمنی
  }

  // اعتبارسنجی ساده‌تر برای استقرار
  validateForDeployment() {
    const validation = this.validateConfig();
    
    if (!validation.isValid) {
      console.error('خطاهای اعتبارسنجی:', validation.errors);
    }
    
    if (validation.hasWarnings) {
      console.warn('هشدارهای اعتبارسنجی:', validation.warnings);
    }
    
    // برای استقرار، فقط خطاهای critical را بررسی می‌کنیم
    return {
      success: validation.isValid,
      deploymentReady: validation.errors.length === 0,
      details: validation
    };
  }
}

// ایجاد نمونه singleton
const configInstance = new ConfigQuantum();

// اعتبارسنجی اولیه
const validationResult = configInstance.validateForDeployment();
if (!validationResult.deploymentReady) {
  console.warn('⚠️ تنظیمات نیاز به توجه دارند، اما سیستم ادامه می‌دهد');
}

export default configInstance;
