/**
 * 🧠 کوانتوم پردازشگر متن پیشرفته
 * هسته مرکزی سیستم ضد چندپارگی
 */

export class TextProcessorQuantum {
  constructor() {
    this.technicalTerms = this.loadTechnicalTerms();
    this.metrics = new Map();
  }

  loadTechnicalTerms() {
    return {
      'ضد چندپارگی': 'anti-fragmentation',
      'پردازش زبان طبیعی': 'natural language processing',
      'هوش مصنوعی': 'artificial intelligence',
      'الگوریتم پیشرفته': 'advanced algorithm',
      'سیستم تخصصی': 'specialized system',
      'کوانتوم پردازشی': 'processing quantum',
      'ماژولار سازی': 'modularization',
      'بهینه سازی': 'optimization'
    };
  }

  // تحلیل ساختار متن
  analyzeStructure(text) {
    try {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      
      return {
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        words: words.length,
        characters: text.length,
        avgSentenceLength: (words.length / sentences.length).toFixed(1),
        avgWordLength: (text.length / words.length).toFixed(1),
        lexicalDensity: this.calculateLexicalDensity(words),
        readability: this.calculateReadability(text),
        complexity: this.assessComplexity(text)
      };
    } catch (error) {
      throw new Error(`خطا در تحلیل ساختار: ${error.message}`);
    }
  }

  calculateLexicalDensity(words) {
    const uniqueWords = new Set(words.map(word => word.toLowerCase()));
    return ((uniqueWords.size / words.length) * 100).toFixed(1);
  }

  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const complexWords = text.split(/\s+/).filter(word => word.length > 6).length;
    
    let score = 100 - (complexWords / words * 100) - (words / sentences * 0.5);
    return Math.max(10, Math.min(100, score.toFixed(1)));
  }

  assessComplexity(text) {
    const score = this.calculateReadability(text);
    if (score > 80) return 'ساده';
    if (score > 60) return 'متوسط';
    if (score > 40) return 'پیچیده';
    return 'بسیار پیچیده';
  }

  // شناسایی اصطلاحات تخصصی
  extractTechnicalTerms(text) {
    const foundTerms = [];
    
    Object.keys(this.technicalTerms).forEach(term => {
      const regex = new RegExp(term, 'gi');
      const matches = text.match(regex);
      if (matches) {
        foundTerms.push({
          term: term,
          count: matches.length,
          english: this.technicalTerms[term],
          positions: this.findTermPositions(text, term)
        });
      }
    });

    return foundTerms;
  }

  findTermPositions(text, term) {
    const positions = [];
    const regex = new RegExp(term, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      positions.push({
        start: match.index,
        end: match.index + term.length,
        context: text.substring(Math.max(0, match.index - 20), Math.min(text.length, match.index + term.length + 20))
      });
    }
    
    return positions;
  }

  // بهینه‌سازی متن
  optimizeText(text, options = {}) {
    const defaultOptions = {
      removeRedundancy: true,
      optimizeSpacing: true,
      enhanceReadability: true,
      maxSentenceLength: 25
    };
    
    const config = { ...defaultOptions, ...options };
    let optimized = text;

    if (config.removeRedundancy) {
      optimized = this.removeRedundantWords(optimized);
    }

    if (config.optimizeSpacing) {
      optimized = this.optimizeSpacing(optimized);
    }

    if (config.enhanceReadability) {
      optimized = this.enhanceReadability(optimized, config.maxSentenceLength);
    }

    return optimized.trim();
  }

  removeRedundantWords(text) {
    const redundantWords = [
      'واقعا', 'خیلی', 'بسیار', 'اصلا', 'حتما', 'قطعا', 'البته',
      'در واقع', 'به طور کلی', 'به عبارت دیگر'
    ];
    
    let cleaned = text;
    redundantWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\s+`, 'gi');
      cleaned = cleaned.replace(regex, '');
    });
    
    return cleaned;
  }

  optimizeSpacing(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
      .replace(/([.,!?])([ا-ی])/g, '$1 $2')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  enhanceReadability(text, maxSentenceLength = 25) {
    const sentences = text.split(/[.!?]+/);
    const enhancedSentences = sentences.map(sentence => {
      const words = sentence.trim().split(/\s+/);
      if (words.length > maxSentenceLength) {
        // تقسیم جملات طولانی
        const midPoint = Math.floor(words.length / 2);
        return [
          words.slice(0, midPoint).join(' ') + '.',
          words.slice(midPoint).join(' ') + '.'
        ].join(' ');
      }
      return sentence.trim();
    });
    
    return enhancedSentences.filter(s => s.length > 0).join('. ');
  }

  // متریک‌های بهبود
  calculateImprovementMetrics(original, optimized) {
    const originalMetrics = this.analyzeStructure(original);
    const optimizedMetrics = this.analyzeStructure(optimized);
    
    return {
      fragmentationReduction: this.calculateFragmentationReduction(originalMetrics, optimizedMetrics),
      readabilityImprovement: (optimizedMetrics.readability - originalMetrics.readability).toFixed(1),
      wordReduction: ((originalMetrics.words - optimizedMetrics.words) / originalMetrics.words * 100).toFixed(1),
      complexityChange: this.assessComplexityChange(originalMetrics.complexity, optimizedMetrics.complexity)
    };
  }

  calculateFragmentationReduction(original, optimized) {
    const originalFragmentation = original.sentences / original.paragraphs;
    const optimizedFragmentation = optimized.sentences / optimized.paragraphs;
    
    return Math.max(0, ((originalFragmentation - optimizedFragmentation) / originalFragmentation * 100)).toFixed(1);
  }

  assessComplexityChange(original, optimized) {
    const complexityLevels = { 'ساده': 1, 'متوسط': 2, 'پیچیده': 3, 'بسیار پیچیده': 4 };
    const change = complexityLevels[optimized] - complexityLevels[original];
    
    if (change < 0) return 'کاهش پیچیدگی';
    if (change > 0) return 'افزایش پیچیدگی';
    return 'بدون تغییر';
  }

  // گزارش جامع
  generateReport(text, optimizedText = null) {
    const structure = this.analyzeStructure(text);
    const technicalTerms = this.extractTechnicalTerms(text);
    const optimized = optimizedText || this.optimizeText(text);
    const improvement = this.calculateImprovementMetrics(text, optimized);

    return {
      timestamp: new Date().toISOString(),
      original: {
        text: text,
        metrics: structure
      },
      technical: {
        terms: technicalTerms,
        density: (technicalTerms.reduce((sum, term) => sum + term.count, 0) / structure.words * 100).toFixed(1) + '%'
      },
      optimization: {
        text: optimized,
        metrics: this.analyzeStructure(optimized),
        improvement: improvement
      },
      recommendations: this.generateRecommendations(structure, technicalTerms)
    };
  }

  generateRecommendations(metrics, technicalTerms) {
    const recommendations = [];

    if (metrics.avgSentenceLength > 25) {
      recommendations.push({
        type: 'ساختاری',
        message: 'جملات طولانی را تقسیم کنید',
        priority: 'بالا',
        impact: 'بهبود ۱۵٪ در خوانایی'
      });
    }

    if (metrics.readability < 60) {
      recommendations.push({
        type: 'خوانایی',
        message: 'از واژه‌های ساده‌تر استفاده کنید',
        priority: 'متوسط',
        impact: 'بهبود ۱۰٪ در درک مطلب'
      });
    }

    if (metrics.lexicalDensity < 40) {
      recommendations.push({
        type: 'واژگانی',
        message: 'تنوع واژگانی را افزایش دهید',
        priority: 'پایین',
        impact: 'بهبود ۵٪ در غنای محتوا'
      });
    }

    if (technicalTerms.length > 5) {
      recommendations.push({
        type: 'تخصصی',
        message: 'برای اصطلاحات تخصصی توضیح اضافه کنید',
        priority: 'متوسط',
        impact: 'بهبود ۲۰٪ در انتقال مفاهیم'
      });
    }

    return recommendations.length > 0 ? recommendations : [{
      type: 'تأیید',
      message: 'متن از کیفیت مطلوبی برخوردار است',
      priority: 'پایین',
      impact: 'نیاز به بهبود خاصی ندارد'
    }];
  }
}

// ایجاد نمونه singleton
export default new TextProcessorQuantum();
