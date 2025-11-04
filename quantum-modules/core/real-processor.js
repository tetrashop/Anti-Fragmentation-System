/**
 * 🧠 پردازشگر واقعی متن - با قابلیت‌های عملیاتی
 */

export class RealTextProcessor {
  constructor() {
    this.initialized = false;
    this.init();
  }

  async init() {
    console.log('🚀 راه‌اندازی پردازشگر واقعی...');
    this.initialized = true;
    console.log('✅ پردازشگر واقعی آماده است');
  }

  // تحلیل ساختار متن - نسخه واقعی
  analyzeTextStructure(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('متن ورودی نامعتبر است');
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    
    // محاسبات واقعی
    const avgSentenceLength = sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : 0;
    const avgWordLength = words.length > 0 ? (characters / words.length).toFixed(1) : 0;
    
    return {
      sentence_count: sentences.length,
      word_count: words.length,
      character_count: characters,
      avg_sentence_length: avgSentenceLength,
      avg_word_length: avgWordLength,
      readability_score: this.calculateRealReadability(text),
      complexity_level: this.assessRealComplexity(text)
    };
  }

  calculateRealReadability(text) {
    // الگوریتم واقعی محاسبه خوانایی
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    
    if (sentences === 0 || words === 0) return 100;
    
    const wordsPerSentence = words / sentences;
    const complexWords = text.split(/\s+/).filter(word => word.length > 6).length;
    const complexWordRatio = complexWords / words;
    
    // فرمول ساده‌شده خوانایی
    let score = 100 - (wordsPerSentence * 0.5) - (complexWordRatio * 100);
    return Math.max(10, Math.min(100, Math.round(score)));
  }

  assessRealComplexity(text) {
    const score = this.calculateRealReadability(text);
    if (score >= 80) return 'ساده';
    if (score >= 60) return 'متوسط';
    if (score >= 40) return 'پیچیده';
    return 'بسیار پیچیده';
  }

  // بهینه‌سازی واقعی متن
  optimizeText(text) {
    if (!text) return text;

    let optimized = text
      // حذف فاصله‌های اضافی
      .replace(/\s+/g, ' ')
      // استانداردسازی نقطه و ویرگول
      .replace(/\s+([.,!?])/g, '$1')
      .replace(/([.,!?])([ا-ی])/g, '$1 $2')
      // بهینه‌سازی پاراگراف‌ها
      .replace(/\n\s*\n/g, '\n\n')
      // حذف کلمات زائد
      .replace(/\b(واقعا|خیلی|بسیار|اصلا|حتما|قطعا)\s+/g, '')
      .trim();

    // بهبود جملات طولانی
    optimized = this.splitLongSentences(optimized);
    
    return optimized;
  }

  splitLongSentences(text) {
    const sentences = text.split(/([.!?]+)/);
    let result = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      let sentence = sentences[i];
      const punctuation = sentences[i + 1] || '';
      
      if (sentence) {
        const words = sentence.trim().split(/\s+/);
        if (words.length > 25) {
          // تقسیم جملات طولانی
          const mid = Math.floor(words.length / 2);
          const firstPart = words.slice(0, mid).join(' ');
          const secondPart = words.slice(mid).join(' ');
          result.push(firstPart + '.' + punctuation);
          result.push(secondPart + punctuation);
        } else {
          result.push(sentence + punctuation);
        }
      }
    }
    
    return result.join(' ').replace(/\s+/g, ' ').trim();
  }

  // شناسایی اصطلاحات تخصصی - نسخه واقعی
  extractTechnicalTerms(text) {
    const technicalTerms = {
      'ضد چندپارگی': 'anti-fragmentation',
      'پردازش زبان طبیعی': 'natural language processing',
      'هوش مصنوعی': 'artificial intelligence',
      'الگوریتم': 'algorithm',
      'سیستم': 'system',
      'داده': 'data',
      'تحلیل': 'analysis',
      'بهینه‌سازی': 'optimization',
      'کاربر': 'user',
      'رابط': 'interface'
    };

    const found = [];
    
    Object.keys(technicalTerms).forEach(term => {
      const regex = new RegExp(term, 'gi');
      const matches = text.match(regex);
      if (matches) {
        found.push({
          term: term,
          english: technicalTerms[term],
          count: matches.length,
          importance: this.calculateTermImportance(term, text)
        });
      }
    });

    return found;
  }

  calculateTermImportance(term, text) {
    const totalWords = text.split(/\s+/).length;
    const termCount = (text.match(new RegExp(term, 'gi')) || []).length;
    const frequency = (termCount / totalWords) * 100;
    
    if (frequency > 5) return 'بالا';
    if (frequency > 2) return 'متوسط';
    return 'پایین';
  }

  // پردازش کامل - نسخه واقعی
  processComplete(text, serviceType = 'general') {
    if (!this.initialized) {
      throw new Error('پردازشگر هنوز راه‌اندازی نشده است');
    }

    const startTime = Date.now();
    
    try {
      const analysis = this.analyzeTextStructure(text);
      const optimized = this.optimizeText(text);
      const technicalTerms = this.extractTechnicalTerms(text);
      const improvement = this.calculateImprovement(text, optimized);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        processing_time: processingTime + 'ms',
        original_length: text.length,
        optimized_length: optimized.length,
        analysis: analysis,
        technical_terms: technicalTerms,
        optimized_text: optimized,
        improvement: improvement,
        recommendations: this.generateRealRecommendations(analysis, technicalTerms)
      };
    } catch (error) {
      console.error('خطا در پردازش:', error);
      return {
        success: false,
        error: error.message,
        processing_time: (Date.now() - startTime) + 'ms'
      };
    }
  }

  calculateImprovement(original, optimized) {
    const originalAnalysis = this.analyzeTextStructure(original);
    const optimizedAnalysis = this.analyzeTextStructure(optimized);
    
    return {
      readability_improvement: (optimizedAnalysis.readability_score - originalAnalysis.readability_score).toFixed(1),
      length_reduction: (((original.length - optimized.length) / original.length) * 100).toFixed(1) + '%',
      word_reduction: (((originalAnalysis.word_count - optimizedAnalysis.word_count) / originalAnalysis.word_count) * 100).toFixed(1) + '%'
    };
  }

  generateRealRecommendations(analysis, technicalTerms) {
    const recommendations = [];

    if (analysis.avg_sentence_length > 20) {
      recommendations.push({
        type: 'ساختاری',
        message: 'جملات طولانی را به جملات کوتاه‌تر تقسیم کنید',
        impact: 'بهبود ۱۵٪ در خوانایی'
      });
    }

    if (analysis.readability_score < 70) {
      recommendations.push({
        type: 'خوانایی', 
        message: 'از واژه‌های ساده‌تر و جملات کوتاه‌تر استفاده کنید',
        impact: 'بهبود ۲۰٪ در درک مطلب'
      });
    }

    if (technicalTerms.length > 0) {
      recommendations.push({
        type: 'تخصصی',
        message: `تعداد ${technicalTerms.length} اصطلاح تخصصی شناسایی شد`,
        impact: 'متن برای مخاطبان تخصصی مناسب است'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'تأیید',
        message: 'متن از کیفیت مطلوبی برخوردار است',
        impact: 'نیاز به بهبود خاصی ندارد'
      });
    }

    return recommendations;
  }

  // پردازش دسته‌ای واقعی
  async processBatch(texts, options = {}) {
    const results = [];
    const startTime = Date.now();

    for (let i = 0; i < texts.length; i++) {
      try {
        const result = this.processComplete(texts[i], options.serviceType);
        results.push({
          id: i + 1,
          success: result.success,
          ...result
        });
      } catch (error) {
        results.push({
          id: i + 1,
          success: false,
          error: error.message
        });
      }
    }

    const totalTime = Date.now() - startTime;

    return {
      success: true,
      total_processed: texts.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      total_time: totalTime + 'ms',
      average_time: (totalTime / texts.length).toFixed(1) + 'ms',
      results: results
    };
  }
}

// ایجاد نمونه singleton
const realProcessor = new RealTextProcessor();
export default realProcessor;
