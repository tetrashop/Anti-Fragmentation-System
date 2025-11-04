/**
 * 🔧 کوانتوم ابزارهای کمکی
 * توابع utility و helper functions
 */

export class UtilsQuantum {
  constructor() {
    this.cache = new Map();
    this.validators = new Map();
    this.initializeValidators();
  }

  // مدیریت کش
  cacheSet(key, value, ttl = 300) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000)
    });
  }

  cacheGet(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  cacheDelete(key) {
    this.cache.delete(key);
  }

  cacheClear() {
    this.cache.clear();
  }

  // اعتبارسنجی داده‌ها
  initializeValidators() {
    this.validators.set('email', (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    });

    this.validators.set('phone', (phone) => {
      const regex = /^09[0-9]{9}$/;
      return regex.test(phone);
    });

    this.validators.set('text', (text, minLength = 1, maxLength = 1000) => {
      return text.length >= minLength && text.length <= maxLength;
    });

    this.validators.set('number', (num, min = 0, max = 1000000) => {
      const number = parseFloat(num);
      return !isNaN(number) && number >= min && number <= max;
    });
  }

  validate(type, value, ...args) {
    const validator = this.validators.get(type);
    if (!validator) {
      throw new Error(`Validator برای نوع ${type} یافت نشد`);
    }
    return validator(value, ...args);
  }

  // فرمت‌دهی داده‌ها
  formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('fa-IR').format(num.toFixed(decimals));
  }

  formatDate(date, format = 'full') {
    const d = new Date(date);
    const formats = {
      short: d.toLocaleDateString('fa-IR'),
      medium: d.toLocaleDateString('fa-IR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      full: d.toLocaleDateString('fa-IR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }),
      time: d.toLocaleTimeString('fa-IR')
    };
    return formats[format] || formats.medium;
  }

  formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  // تولید شناسه یکتا
  generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // مدیریت خطاها
  createError(message, code = 'UNKNOWN_ERROR', details = null) {
    const error = new Error(message);
    error.code = code;
    error.details = details;
    error.timestamp = new Date().toISOString();
    return error;
  }

  handleError(error, context = '') {
    console.error(`[${context}]`, error);
    
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        context: context,
        timestamp: error.timestamp || new Date().toISOString()
      }
    };
  }

  // عملیات روی آرایه‌ها
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  uniqueArray(array, key = null) {
    if (key) {
      const seen = new Set();
      return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
    }
    return [...new Set(array)];
  }

  // عملیات روی آبجکت‌ها
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  }

  mergeObjects(target, source) {
    const merged = this.deepClone(target);
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (this.isObject(merged[key]) && this.isObject(source[key])) {
          merged[key] = this.mergeObjects(merged[key], source[key]);
        } else {
          merged[key] = this.deepClone(source[key]);
        }
      }
    }
    
    return merged;
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  // مدیریت رشته‌ها
  truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - suffix.length) + suffix;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  sanitizeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  // عملیات زمان
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // رمزنگاری ساده
  base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  base64Decode(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  // بررسی محیط اجرا
  isBrowser() {
    return typeof window !== 'undefined';
  }

  isNode() {
    return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
  }

  // لاگینگ پیشرفته
  createLogger(prefix = '') {
    return {
      info: (message, data = null) => {
        console.log(`[${prefix}] ℹ️ ${message}`, data || '');
      },
      warn: (message, data = null) => {
        console.warn(`[${prefix}] ⚠️ ${message}`, data || '');
      },
      error: (message, data = null) => {
        console.error(`[${prefix}] ❌ ${message}`, data || '');
      },
      debug: (message, data = null) => {
        console.debug(`[${prefix}] 🐛 ${message}`, data || '');
      },
      success: (message, data = null) => {
        console.log(`[${prefix}] ✅ ${message}`, data || '');
      }
    };
  }

  // تولید داده تست
  generateTestData(type, count = 1) {
    const generators = {
      text: () => {
        const texts = [
          'سامانه ضد چندپارگی متون تخصصی عملکرد بسیار خوبی دارد.',
          'پردازش زبان طبیعی یکی از زمینه‌های مهم هوش مصنوعی است.',
          'الگوریتم پیشرفته این سیستم سرعت پردازش را افزایش می‌دهد.',
          'کوانتوم‌های فایلی ساختار ماژولار ایجاد می‌کنند.',
          'بهینه‌سازی متن باعث بهبود خوانایی می‌شود.'
        ];
        return texts[Math.floor(Math.random() * texts.length)];
      },
      
      number: (min = 1, max = 100) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      
      date: () => {
        const start = new Date(2020, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      },
      
      boolean: () => {
        return Math.random() > 0.5;
      }
    };

    const generator = generators[type];
    if (!generator) {
      throw new Error(`Generator برای نوع ${type} یافت نشد`);
    }

    if (count === 1) {
      return generator();
    }

    return Array.from({ length: count }, () => generator());
  }

  // بررسی عملکرد
  async measurePerformance(fn, ...args) {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    return {
      result,
      duration: end - start,
      durationFormatted: `${(end - start).toFixed(2)}ms`
    };
  }
}

export default new UtilsQuantum();
