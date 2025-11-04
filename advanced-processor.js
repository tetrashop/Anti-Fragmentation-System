/**
 * 🧠 سیستم پردازش پیشرفته متن‌های تخصصی
 * بهبود کیفیت و کاهش چندپارگی متون تخصصی
 */

class AdvancedTextProcessor {
  constructor() {
    this.technicalTerms = {
      'ضد چندپارگی': 'anti-fragmentation',
      'پردازش زبان طبیعی': 'natural language processing',
      'هوش مصنوعی': 'artificial intelligence',
      'الگوریتم پیشرفته': 'advanced algorithm',
      'سیستم تخصصی': 'specialized system'
    };
  }

  // تحلیل کامل ساختار متن
  analyzeTextStructure(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    return {
      sentence_count: sentences.length,
      paragraph_count: paragraphs.length,
      word_count: words.length,
      character_count: text.length,
      avg_sentence_length: (words.length / sentences.length).toFixed(1),
      avg_word_length: (text.length / words.length).toFixed(1),
      lexical_density: this.calculateLexicalDensity(words),
      readability_score: this.calculateReadabilityScore(text),
      complexity_level: this.assessComplexityLevel(text)
    };
  }

  // محاسبه چگالی واژگانی
  calculateLexicalDensity(words) {
    const uniqueWords = new Set(words.map(word => word.toLowerCase()));
    return ((uniqueWords.size / words.length) * 100).toFixed(1);
  }

  // محاسبه امتیاز خوانایی
  calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const complexWords = text.split(/\s+/).filter(word => word.length > 6).length;
    
    let score = 100 - (complexWords / words * 100) - (words / sentences * 0.5);
    return Math.max(10, Math.min(100, score.toFixed(1)));
  }

  // ارزیابی سطح پیچیدگی
  assessComplexityLevel(text) {
    const score = this.calculateReadabilityScore(text);
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
          english: this.technicalTerms[term]
        });
      }
    });

    return foundTerms;
  }

  // آنالیز پیشرفته کاهش چندپارگی
  advancedFragmentationAnalysis(text) {
    const originalAnalysis = this.analyzeTextStructure(text);
    
    // شبیه‌سازی پردازش کاهش چندپارگی
    const processedText = this.optimizeTextStructure(text);
    const processedAnalysis = this.analyzeTextStructure(processedText);
    
    return {
      original: originalAnalysis,
      processed: processedAnalysis,
      improvement: {
        fragmentation_reduction: this.calculateFragmentationReduction(originalAnalysis, processedAnalysis),
        readability_improvement: (processedAnalysis.readability_score - originalAnalysis.readability_score).toFixed(1),
        word_reduction: ((originalAnalysis.word_count - processedAnalysis.word_count) / originalAnalysis.word_count * 100).toFixed(1)
      }
    };
  }

  // بهینه‌سازی ساختار متن
  optimizeTextStructure(text) {
    let optimized = text;

    // 1. یکپارچه‌سازی جملات کوتاه
    optimized = optimized.replace(/([^.!?])\s+([ا-ی][^.!?]{1,20}[.!?])/g, '$1 $2');

    // 2. حذف افزونگی‌ها
    optimized = optimized.replace(/\b(واقعا|خیلی|بسیار|اصلا|حتما)\s+/g, '');
    
    // 3. استانداردسازی فاصله‌ها
    optimized = optimized.replace(/\s+/g, ' ').replace(/\s+([.,!?])/g, '$1');
    
    // 4. بهینه‌سازی پاراگراف‌ها
    optimized = optimized.replace(/\n\s*\n/g, '\n\n');

    return optimized.trim();
  }

  calculateFragmentationReduction(original, processed) {
    const originalFragmentation = original.sentence_count / original.paragraph_count;
    const processedFragmentation = processed.sentence_count / processed.paragraph_count;
    
    return Math.max(0, ((originalFragmentation - processedFragmentation) / originalFragmentation * 100)).toFixed(1);
  }

  // تولید گزارش جامع
  generateComprehensiveReport(text) {
    const structure = this.analyzeTextStructure(text);
    const technicalTerms = this.extractTechnicalTerms(text);
    const fragmentationAnalysis = this.advancedFragmentationAnalysis(text);
    const optimizedText = this.optimizeTextStructure(text);

    return {
      timestamp: new Date().toISOString(),
      text_metrics: structure,
      technical_analysis: {
        terms_found: technicalTerms,
        technical_density: (technicalTerms.reduce((sum, term) => sum + term.count, 0) / structure.word_count * 100).toFixed(1) + '%'
      },
      fragmentation_analysis: fragmentationAnalysis,
      optimization: {
        original_text: text,
        optimized_text: optimizedText,
        improvement_summary: fragmentationAnalysis.improvement
      },
      recommendations: this.generateRecommendations(structure, technicalTerms)
    };
  }

  // تولید پیشنهادات بهبود
  generateRecommendations(structure, technicalTerms) {
    const recommendations = [];

    if (structure.avg_sentence_length > 25) {
      recommendations.push('جملات طولانی را به جملات کوتاه‌تر تقسیم کنید');
    }

    if (structure.readability_score < 60) {
      recommendations.push('از واژه‌های ساده‌تر استفاده کنید');
    }

    if (structure.lexical_density < 40) {
      recommendations.push('تنوع واژگانی متن را افزایش دهید');
    }

    if (technicalTerms.length > 5) {
      recommendations.push('برای اصطلاحات تخصصی توضیح اضافه کنید');
    }

    return recommendations.length > 0 ? recommendations : ['متن از کیفیت مطلوبی برخوردار است'];
  }
}

export default new AdvancedTextProcessor();
