/**
 * 📊 کوانتوم موتور آنالیتیکس
 * سیستم مانیتورینگ و گزارش‌گیری پیشرفته
 */

export class AnalyticsQuantum {
  constructor() {
    this.metrics = this.initializeMetrics();
    this.hourlyData = new Array(24).fill(0).map(() => new Map());
    this.dailyData = new Map();
    this.performanceThresholds = {
      responseTime: 1000, // ms
      successRate: 95,    // درصد
      peakUsage: 100      // درخواست در ساعت
    };
  }

  initializeMetrics() {
    return {
      total: { requests: 0, success: 0, failure: 0, time: 0 },
      services: {
        nataq: { requests: 0, time: 0, cache: { hits: 0, misses: 0 } },
        mizanro: { requests: 0, time: 0, accuracy: 0 },
        antiFragmentation: { requests: 0, time: 0, improvement: 0 },
        advanced: { requests: 0, time: 0, complexity: 0 }
      },
      performance: {
        avgResponseTime: 0,
        successRate: 100,
        availability: 100,
        throughput: 0
      }
    };
  }

  // ردیابی درخواست
  trackRequest(service, duration, success = true, metadata = {}) {
    const timestamp = new Date();
    const hour = timestamp.getHours();
    const dateKey = timestamp.toISOString().split('T')[0];

    // به‌روزرسانی متریک‌های کلی
    this.metrics.total.requests++;
    this.metrics.total.time += duration;
    
    if (success) {
      this.metrics.total.success++;
    } else {
      this.metrics.total.failure++;
    }

    // به‌روزرسانی سرویس خاص
    if (this.metrics.services[service]) {
      this.metrics.services[service].requests++;
      this.metrics.services[service].time += duration;
      
      // به‌روزرسانی متریک‌های خاص سرویس
      if (metadata.cacheHit !== undefined) {
        this.metrics.services[service].cache.hits += metadata.cacheHit ? 1 : 0;
        this.metrics.services[service].cache.misses += metadata.cacheHit ? 0 : 1;
      }
      
      if (metadata.accuracy !== undefined) {
        this.metrics.services[service].accuracy = metadata.accuracy;
      }
      
      if (metadata.improvement !== undefined) {
        this.metrics.services[service].improvement = metadata.improvement;
      }
    }

    // به‌روزرسانی داده ساعتی
    if (!this.hourlyData[hour].has(service)) {
      this.hourlyData[hour].set(service, { requests: 0, time: 0 });
    }
    const hourData = this.hourlyData[hour].get(service);
    hourData.requests++;
    hourData.time += duration;

    // به‌روزرسانی داده روزانه
    if (!this.dailyData.has(dateKey)) {
      this.dailyData.set(dateKey, new Map());
    }
    const dayData = this.dailyData.get(dateKey);
    if (!dayData.has(service)) {
      dayData.set(service, { requests: 0, time: 0 });
    }
    const serviceDayData = dayData.get(service);
    serviceDayData.requests++;
    serviceDayData.time += duration;

    // محاسبه متریک‌های عملکرد
    this.calculatePerformanceMetrics();
    
    return this.generateRequestId(service, timestamp);
  }

  calculatePerformanceMetrics() {
    const total = this.metrics.total;
    
    this.metrics.performance.avgResponseTime = total.requests > 0 ? 
      total.time / total.requests : 0;
    
    this.metrics.performance.successRate = total.requests > 0 ? 
      (total.success / total.requests * 100) : 100;
    
    this.metrics.performance.throughput = total.requests > 0 ? 
      total.requests / (total.time / 1000) : 0; // requests per second
  }

  generateRequestId(service, timestamp) {
    return `${service}_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // گزارش‌های تحلیلی
  getServiceReport(service) {
    if (!this.metrics.services[service]) {
      return null;
    }

    const serviceData = this.metrics.services[service];
    const totalRequests = this.metrics.total.requests;
    
    return {
      usage: {
        total: serviceData.requests,
        percentage: totalRequests > 0 ? (serviceData.requests / totalRequests * 100).toFixed(1) + '%' : '0%',
        trend: this.calculateServiceTrend(service)
      },
      performance: {
        avgTime: serviceData.requests > 0 ? (serviceData.time / serviceData.requests).toFixed(2) + 'ms' : '0ms',
        efficiency: this.calculateServiceEfficiency(service)
      },
      quality: this.getServiceQualityMetrics(service),
      recommendations: this.generateServiceRecommendations(service)
    };
  }

  calculateServiceTrend(service) {
    // محاسبه روند استفاده در 24 ساعت گذشته
    const now = new Date();
    const currentHour = now.getHours();
    let previousHours = 0;
    let currentHours = 0;

    for (let i = 1; i <= 6; i++) {
      const prevHour = (currentHour - i + 24) % 24;
      if (this.hourlyData[prevHour].has(service)) {
        previousHours += this.hourlyData[prevHour].get(service).requests;
      }
    }

    for (let i = 0; i < 6; i++) {
      const hour = (currentHour - i + 24) % 24;
      if (this.hourlyData[hour].has(service)) {
        currentHours += this.hourlyData[hour].get(service).requests;
      }
    }

    if (previousHours === 0) return 'ثابت';
    const change = ((currentHours - previousHours) / previousHours * 100);
    
    if (change > 10) return 'صعودی 📈';
    if (change < -10) return 'نزولی 📉';
    return 'ثابت ➡️';
  }

  calculateServiceEfficiency(service) {
    const serviceData = this.metrics.services[service];
    if (serviceData.requests === 0) return 'نامشخص';
    
    const avgTime = serviceData.time / serviceData.requests;
    
    if (avgTime < 500) return 'عالی 🚀';
    if (avgTime < 1000) return 'خوب ✅';
    if (avgTime < 2000) return 'متوسط ⚠️';
    return 'نیاز بهبود 🔴';
  }

  getServiceQualityMetrics(service) {
    const serviceData = this.metrics.services[service];
    const metrics = {};

    if (serviceData.cache) {
      const totalCache = serviceData.cache.hits + serviceData.cache.misses;
      metrics.cacheHitRate = totalCache > 0 ? 
        (serviceData.cache.hits / totalCache * 100).toFixed(1) + '%' : '0%';
    }

    if (serviceData.accuracy !== undefined) {
      metrics.accuracy = serviceData.accuracy + '%';
    }

    if (serviceData.improvement !== undefined) {
      metrics.improvement = serviceData.improvement + '%';
    }

    return metrics;
  }

  generateServiceRecommendations(service) {
    const recommendations = [];
    const serviceData = this.metrics.services[service];
    const avgTime = serviceData.requests > 0 ? serviceData.time / serviceData.requests : 0;

    if (avgTime > this.performanceThresholds.responseTime) {
      recommendations.push({
        type: 'عملکرد',
        message: 'بهینه‌سازی زمان پاسخ سرویس',
        action: 'بررسی الگوریتم‌های پردازشی',
        urgency: 'بالا'
      });
    }

    if (serviceData.cache && serviceData.cache.misses > serviceData.cache.hits) {
      recommendations.push({
        type: 'کش',
        message: 'افزایش نرخ命中 کش',
        action: 'بررسی استراتژی کش‌گذاری',
        urgency: 'متوسط'
      });
    }

    return recommendations;
  }

  // گزارش جامع سیستم
  getComprehensiveReport() {
    const busiestService = Object.entries(this.metrics.services)
      .reduce((a, b) => a[1].requests > b[1].requests ? a : b)[0];

    const performanceAlerts = this.checkPerformanceAlerts();

    return {
      summary: {
        totalRequests: this.metrics.total.requests,
        successRate: this.metrics.performance.successRate.toFixed(1) + '%',
        avgResponseTime: this.metrics.performance.avgResponseTime.toFixed(2) + 'ms',
        systemHealth: this.calculateSystemHealth(),
        uptime: '100%'
      },
      services: Object.fromEntries(
        Object.entries(this.metrics.services).map(([service, data]) => [
          service,
          this.getServiceReport(service)
        ])
      ),
      patterns: {
        busiestService: busiestService,
        hourlyDistribution: this.getHourlyDistribution(),
        dailyTrend: this.getDailyTrend(),
        peakHours: this.getPeakHours()
      },
      insights: {
        alerts: performanceAlerts,
        predictions: this.generatePredictions(),
        recommendations: this.generateSystemRecommendations()
      },
      timestamp: new Date().toISOString()
    };
  }

  checkPerformanceAlerts() {
    const alerts = [];
    const perf = this.metrics.performance;

    if (perf.avgResponseTime > this.performanceThresholds.responseTime) {
      alerts.push({
        type: '⚠️ عملکرد',
        message: 'زمان پاسخ سیستم بالا است',
        metric: `میانگین: ${perf.avgResponseTime.toFixed(2)}ms`,
        severity: 'متوسط'
      });
    }

    if (perf.successRate < this.performanceThresholds.successRate) {
      alerts.push({
        type: '🔴 قابلیت اطمینان',
        message: 'نرخ موفقیت سیستم پایین است',
        metric: `موفقیت: ${perf.successRate.toFixed(1)}%`,
        severity: 'بالا'
      });
    }

    return alerts;
  }

  calculateSystemHealth() {
    const perf = this.metrics.performance;
    let score = 100;

    if (perf.avgResponseTime > 1000) score -= 20;
    if (perf.avgResponseTime > 2000) score -= 30;
    if (perf.successRate < 95) score -= 25;
    if (perf.successRate < 90) score -= 35;

    if (score >= 90) return 'عالی 🟢';
    if (score >= 70) return 'خوب 🟡';
    if (score >= 50) return 'متوسط 🟠';
    return 'نیاز توجه 🔴';
  }

  getHourlyDistribution() {
    return this.hourlyData.map((hourData, index) => ({
      hour: index,
      totalRequests: Array.from(hourData.values()).reduce((sum, data) => sum + data.requests, 0),
      services: Object.fromEntries(hourData)
    }));
  }

  getDailyTrend() {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      last7Days.push({
        date: dateKey,
        totalRequests: this.dailyData.has(dateKey) ? 
          Array.from(this.dailyData.get(dateKey).values()).reduce((sum, data) => sum + data.requests, 0) : 0
      });
    }
    
    return last7Days;
  }

  getPeakHours() {
    const hourlyTotals = this.hourlyData.map((hourData, index) => ({
      hour: index,
      requests: Array.from(hourData.values()).reduce((sum, data) => sum + data.requests, 0)
    }));
    
    return hourlyTotals
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 3)
      .map(item => `${item.hour}:00 - ${item.requests} درخواست`);
  }

  generatePredictions() {
    const hourly = this.getHourlyDistribution();
    const currentRequests = hourly.reduce((sum, hour) => sum + hour.totalRequests, 0);
    const avgDaily = currentRequests / (hourly.filter(h => h.totalRequests > 0).length || 1);
    
    return {
      nextHour: currentRequests > avgDaily ? 'افزایش预计' : 'پایدار',
      dailyEstimate: Math.round(avgDaily * 1.1) + ' درخواست',
      capacity: this.assessCapacityNeeds()
    };
  }

  assessCapacityNeeds() {
    const peakUsage = Math.max(...this.getHourlyDistribution().map(h => h.totalRequests));
    const currentCapacity = 1000; // فرضی
    
    if (peakUsage > currentCapacity * 0.8) {
      return { status: 'نیاز فوری', action: 'افزایش منابع' };
    } else if (peakUsage > currentCapacity * 0.6) {
      return { status: 'نیاز آینده', action: 'برنامه‌ریزی افزایش' };
    } else {
      return { status: 'کافی', action: 'مانیتورینگ ادامه' };
    }
  }

  generateSystemRecommendations() {
    const recommendations = [];
    const perf = this.metrics.performance;

    if (perf.avgResponseTime > 1000) {
      recommendations.push('بهینه‌سازی الگوریتم‌های پردازشی');
    }

    if (this.metrics.total.failure > this.metrics.total.requests * 0.1) {
      recommendations.push('بررسی و رفع خطاهای سیستم');
    }

    const cacheEfficiency = Object.values(this.metrics.services)
      .filter(s => s.cache)
      .map(s => s.cache.hits / (s.cache.hits + s.cache.misses))
      .reduce((a, b) => a + b, 0);

    if (cacheEfficiency < 0.6) {
      recommendations.push('بهبود استراتژی کش‌گذاری');
    }

    return recommendations.length > 0 ? recommendations : ['سیستم در شرایط بهینه کار می‌کند'];
  }

  // پاکسازی داده‌های قدیمی
  cleanupOldData(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffKey = cutoffDate.toISOString().split('T')[0];

    for (const [dateKey] of this.dailyData) {
      if (dateKey < cutoffKey) {
        this.dailyData.delete(dateKey);
      }
    }
  }

  // ریست متریک‌ها (برای تست)
  resetMetrics() {
    this.metrics = this.initializeMetrics();
    this.hourlyData = new Array(24).fill(0).map(() => new Map());
    this.dailyData.clear();
  }
}

export default new AnalyticsQuantum();
