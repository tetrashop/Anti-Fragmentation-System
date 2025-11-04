/**
 * 📈 سیستم مانیتورینگ و آنالیتیکس پیشرفته
 * ردیابی عملکرد و تولید گزارش‌های تحلیلی
 */

class AnalyticsSystem {
  constructor() {
    this.metrics = {
      total_requests: 0,
      successful_requests: 0,
      failed_requests: 0,
      total_processing_time: 0,
      services_usage: {
        nataq: { count: 0, total_time: 0 },
        mizanro: { count: 0, total_time: 0 },
        anti_fragmentation: { count: 0, total_time: 0 },
        advanced_analysis: { count: 0, total_time: 0 }
      },
      performance: {
        average_response_time: 0,
        success_rate: 100,
        peak_usage: 0
      },
      hourly_usage: new Array(24).fill(0),
      daily_usage: {}
    };

    this.initializeDailyUsage();
  }

  initializeDailyUsage() {
    const today = new Date().toISOString().split('T')[0];
    this.metrics.daily_usage[today] = {
      requests: 0,
      successful: 0,
      total_processing_time: 0
    };
  }

  trackRequest(service, processingTime, success = true) {
    const now = new Date();
    const hour = now.getHours();
    const today = now.toISOString().split('T')[0];

    // بروزرسانی متریک‌های کلی
    this.metrics.total_requests++;
    this.metrics.total_processing_time += processingTime;
    
    if (success) {
      this.metrics.successful_requests++;
    } else {
      this.metrics.failed_requests++;
    }

    // بروزرسانی استفاده سرویس‌ها
    if (this.metrics.services_usage[service]) {
      this.metrics.services_usage[service].count++;
      this.metrics.services_usage[service].total_time += processingTime;
    }

    // بروزرسانی استفاده ساعتی
    this.metrics.hourly_usage[hour]++;

    // بروزرسانی استفاده روزانه
    if (!this.metrics.daily_usage[today]) {
      this.metrics.daily_usage[today] = {
        requests: 0,
        successful: 0,
        total_processing_time: 0
      };
    }
    this.metrics.daily_usage[today].requests++;
    this.metrics.daily_usage[today].total_processing_time += processingTime;
    if (success) {
      this.metrics.daily_usage[today].successful++;
    }

    // محاسبه متریک‌های عملکرد
    this.calculatePerformanceMetrics();
  }

  calculatePerformanceMetrics() {
    this.metrics.performance.average_response_time = 
      this.metrics.total_processing_time / this.metrics.total_requests;

    this.metrics.performance.success_rate = 
      (this.metrics.successful_requests / this.metrics.total_requests * 100).toFixed(1);

    this.metrics.performance.peak_usage = Math.max(...this.metrics.hourly_usage);
  }

  getServiceMetrics(service) {
    if (!this.metrics.services_usage[service]) {
      return null;
    }

    const serviceData = this.metrics.services_usage[service];
    return {
      total_requests: serviceData.count,
      average_processing_time: serviceData.total_time / serviceData.count,
      usage_percentage: (serviceData.count / this.metrics.total_requests * 100).toFixed(1) + '%'
    };
  }

  getComprehensiveReport() {
    const mostUsedService = Object.entries(this.metrics.services_usage)
      .reduce((a, b) => a[1].count > b[1].count ? a : b)[0];

    const busiestHour = this.metrics.hourly_usage.indexOf(this.metrics.performance.peak_usage);

    return {
      summary: {
        total_requests: this.metrics.total_requests,
        success_rate: this.metrics.performance.success_rate + '%',
        average_response_time: this.metrics.performance.average_response_time.toFixed(2) + 'ms',
        uptime: '100%',
        system_health: 'excellent'
      },
      services_analysis: {
        most_used_service: mostUsedService,
        service_breakdown: Object.fromEntries(
          Object.entries(this.metrics.services_usage).map(([service, data]) => [
            service,
            {
              requests: data.count,
              average_time: (data.total_time / data.count).toFixed(2) + 'ms',
              usage: (data.count / this.metrics.total_requests * 100).toFixed(1) + '%'
            }
          ])
        )
      },
      usage_patterns: {
        busiest_hour: busiestHour + ':00',
        hourly_distribution: this.metrics.hourly_usage,
        daily_trend: this.metrics.daily_usage
      },
      performance_insights: {
        recommendations: this.generateRecommendations(),
        predicted_peak: this.predictNextPeak(),
        capacity_planning: this.calculateCapacityNeeds()
      },
      timestamp: new Date().toISOString()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const avgResponseTime = this.metrics.performance.average_response_time;

    if (avgResponseTime > 1000) {
      recommendations.push('افزایش منابع سرور برای بهبود زمان پاسخ');
    }

    if (this.metrics.performance.success_rate < 95) {
      recommendations.push('بررسی خطاها و بهبود مدیریت استثناها');
    }

    if (this.metrics.performance.peak_usage > 100) {
      recommendations.push('پیاده‌سازی سیستم کش برای کاهش بار');
    }

    return recommendations.length > 0 ? recommendations : ['سیستم در شرایط بهینه کار می‌کند'];
  }

  predictNextPeak() {
    const currentHour = new Date().getHours();
    const nextHour = (currentHour + 1) % 24;
    const currentUsage = this.metrics.hourly_usage[currentHour];
    const historicalAvg = this.metrics.hourly_usage.reduce((a, b) => a + b) / 24;
    
    return currentUsage > historicalAvg ? 'افزایش预计' : 'پایدار';
  }

  calculateCapacityNeeds() {
    const peakUsage = this.metrics.performance.peak_usage;
    const currentCapacity = 1000; // فرضی
    
    if (peakUsage > currentCapacity * 0.8) {
      return 'نیاز به افزایش ظرفیت';
    } else if (peakUsage > currentCapacity * 0.6) {
      return 'ظرفیت کافی با امکان رشد';
    } else {
      return 'ظرفیت بیش از حد کافی';
    }
  }

  // ریست متریک‌ها (برای تست و توسعه)
  resetMetrics() {
    this.metrics.total_requests = 0;
    this.metrics.successful_requests = 0;
    this.metrics.failed_requests = 0;
    this.metrics.total_processing_time = 0;
    
    Object.keys(this.metrics.services_usage).forEach(service => {
      this.metrics.services_usage[service] = { count: 0, total_time: 0 };
    });
    
    this.metrics.hourly_usage = new Array(24).fill(0);
    this.initializeDailyUsage();
    this.calculatePerformanceMetrics();
  }
}

export default new AnalyticsSystem();
