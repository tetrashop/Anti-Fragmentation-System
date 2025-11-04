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
    // تنظیمات پایه
    this.configs.set('app', {
      name: 'سامانه ضد چندپارگی متون تخصصی',
      version: '2.0.0',
      description: 'سیستم پیشرفته پردازش و بهینه‌سازی متون تخصصی فارسی',
      author: 'tetrashop',
      license: 'MIT'
    });

    // تنظیمات سرور
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
        windowMs: 900000 // 15 minutes
      }
    });

    // تنظیمات API
    this.configs.set('api', {
      basePath: '/api',
      version: 'v1',
      documentation: {
        enabled: true,
        path: '/api/docs'
      },
      caching: {
        enabled: true,
        defaultTTL: 300, // 5 minutes
        maxSize: 1000
      }
    });

    // تنظیمات پردازش متن
    this.configs.set('processing', {
      maxTextLength: 10000,
      timeout: 30000, // 30 seconds
      batchSize: 10,
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

    // تنظیمات آنالیتیکس
    this.configs.set('analytics', {
      enabled: true,
      retention: {
        hourly: 24,    // 24 hours
        daily: 30,     // 30 days
        monthly: 12    // 12 months
      },
      metrics: {
        responseTime: true,
        successRate: true,
        usagePatterns: true,
        performance: true
      },
      alerts: {
        enabled: true,
        thresholds: {
          responseTime: 1000,  // ms
          successRate: 95,     // %
          errorRate: 5         // %
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
        animations: true,
        realTimeUpdates: true
      },
      components: {
        useCustom: true,
        autoInject: true
      }
    });

    // تنظیمات امنیتی
    this.configs.set('security', {
      https: true,
      cors: true,
      rateLimiting: true,
      inputValidation: true,
      sanitization: true
    });

    // تنظیمات محیط‌های مختلف
    this.initializeEnvironments();
  }

  initializeEnvironments() {
    // توسعه (Development)
    this.environments.set('development', {
      debug: true,
      logging: 'verbose',
      caching: false,
      analytics: {
        enabled: true,
        sampleRate: 1.0
      }
    });

    // تست (Testing)
    this.environments.set('testing', {
      debug: true,
      logging: 'debug',
      caching: true,
      analytics: {
        enabled: true,
        sampleRate: 0.5
      }
    });

    // استیجینگ (Staging)
    this.environments.set('staging', {
      debug: false,
      logging: 'info',
      caching: true,
      analytics: {
        enabled: true,
        sampleRate: 0.8
      }
    });

    // تولید (Production)
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

  // گرفتن تنظیمات
  get(section, key = null) {
    if (!this.configs.has(section)) {
      throw new Error(`Section ${section} در تنظیمات یافت نشد`);
    }

    const sectionConfig = this.configs.get(section);
    
    if (key === null) {
      return sectionConfig;
    }

    if (!sectionConfig.hasOwnProperty(key)) {
      throw new Error(`Key ${key} در section ${section} یافت نشد`);
    }

    return sectionConfig[key];
  }

  // تنظیم مقدار
  set(section, key, value) {
    if (!this.configs.has(section)) {
      this.configs.set(section, {});
    }

    const sectionConfig = this.configs.get(section);
    sectionConfig[key] = value;
  }

  // گرفتن تنظیمات محیط
  getEnvironmentConfig(env) {
    if (!this.environments.has(env)) {
      console.warn(`Environment ${env} یافت نشد، استفاده از development`);
      return this.environments.get('development');
    }

    return this.environments.get(env);
  }

  // بررسی تنظیمات
  validateConfig() {
    const errors = [];

    // بررسی تنظیمات ضروری
    const requiredSections = ['app', 'server', 'api', 'processing'];
    for (const section of requiredSections) {
      if (!this.configs.has(section)) {
        errors.push(`Section ${section} ضروری است`);
      }
    }

    // بررسی مقادیر عددی
    const numericChecks = [
      ['server', 'port', (val) => val > 0 && val < 65536],
      ['processing', 'maxTextLength', (val) => val > 0],
      ['api', 'caching.defaultTTL', (val) => val > 0]
    ];

    for (const [section, key, validator] of numericChecks) {
      try {
        const value = this.get(section, key);
        if (!validator(value)) {
          errors.push(`مقدار ${key} در ${section} نامعتبر است: ${value}`);
        }
      } catch (error) {
        errors.push(`خطا در بررسی ${key} در ${section}: ${error.message}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // export تنظیمات
  exportConfig(includeSecrets = false) {
    const config = {
      app: this.get('app'),
      server: this.get('server'),
      api: this.get('api'),
      processing: this.get('processing'),
      analytics: this.get('analytics'),
      ui: this.get('ui'),
      security: this.get('security')
    };

    if (includeSecrets) {
      config.secrets = Object.fromEntries(this.secrets);
    }

    return config;
  }

  // import تنظیمات
  importConfig(config) {
    for (const [section, values] of Object.entries(config)) {
      if (section === 'secrets') {
        for (const [key, value] of Object.entries(values)) {
          this.secrets.set(key, value);
        }
      } else {
        this.configs.set(section, values);
      }
    }
  }

  // مدیریت secrets
  setSecret(key, value) {
    this.secrets.set(key, value);
  }

  getSecret(key) {
    if (!this.secrets.has(key)) {
      throw new Error(`Secret ${key} یافت نشد`);
    }
    return this.secrets.get(key);
  }

  // helper methods
  isDevelopment() {
    return this.getEnvironment() === 'development';
  }

  isProduction() {
    return this.getEnvironment() === 'production';
  }

  getEnvironment() {
    // در Cloudflare Workers می‌توان از env vars استفاده کرد
    return typeof process !== 'undefined' && process.env.NODE_ENV || 'production';
  }

  // گرفتن تنظیمات merge شده با محیط
  getMergedConfig(section) {
    const baseConfig = this.get(section);
    const envConfig = this.getEnvironmentConfig(this.getEnvironment());
    
    return this.deepMerge(baseConfig, envConfig);
  }

  deepMerge(target, source) {
    const output = { ...target };
    
    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (this.isObject(source[key])) {
            if (!(key in target)) {
              output[key] = source[key];
            } else {
              output[key] = this.deepMerge(target[key], source[key]);
            }
          } else {
            output[key] = source[key];
          }
        }
      }
    }
    
    return output;
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  // تولید مستندات تنظیمات
  generateConfigDocs() {
    const docs = {};
    
    for (const [section, config] of this.configs) {
      docs[section] = {
        description: this.getSectionDescription(section),
        properties: this.generatePropertyDocs(config)
      };
    }
    
    return docs;
  }

  getSectionDescription(section) {
    const descriptions = {
      app: 'تنظیمات پایه برنامه',
      server: 'تنظیمات سرور و شبکه',
      api: 'تنظیمات API و endpoints',
      processing: 'تنظیمات پردازش متن',
      analytics: 'تنظیمات آنالیتیکس و مانیتورینگ',
      ui: 'تنظیمات رابط کاربری',
      security: 'تنظیمات امنیتی'
    };
    
    return descriptions[section] || 'بدون توضیح';
  }

  generatePropertyDocs(config, prefix = '') {
    const docs = {};
    
    for (const [key, value] of Object.entries(config)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (this.isObject(value) && !Array.isArray(value)) {
        docs[fullKey] = {
          type: 'object',
          description: this.getPropertyDescription(fullKey),
          properties: this.generatePropertyDocs(value, fullKey)
        };
      } else {
        docs[fullKey] = {
          type: this.getType(value),
          default: value,
          description: this.getPropertyDescription(fullKey)
        };
      }
    }
    
    return docs;
  }

  getType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
  }

  getPropertyDescription(key) {
    const descriptions = {
      'app.name': 'نام برنامه',
      'app.version': 'نسخه برنامه',
      'server.port': 'پورت سرور',
      'api.basePath': 'مسیر پایه API',
      'processing.maxTextLength': 'حداکثر طول متن قابل پردازش',
      'analytics.enabled': 'فعال/غیرفعال کردن آنالیتیکس'
      // می‌توان descriptions بیشتری اضافه کرد
    };
    
    return descriptions[key] || 'بدون توضیح';
  }
}

export default new ConfigQuantum();
