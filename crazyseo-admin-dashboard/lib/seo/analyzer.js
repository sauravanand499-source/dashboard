import readingTime from 'reading-time';

export class SEOAnalyzer {
  constructor(content, targetKeyword) {
    this.content = content;
    this.targetKeyword = targetKeyword.toLowerCase();
    this.text = this.extractText(content);
  }

  extractText(html) {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  calculateKeywordDensity() {
    const words = this.text.split(/\s+/).length;
    const keywordOccurrences = (this.text.match(new RegExp(this.targetKeyword, 'gi')) || []).length;
    const density = (keywordOccurrences / words) * 100;
    return {
      density: parseFloat(density.toFixed(2)),
      occurrences: keywordOccurrences,
      totalWords: words,
      status: density >= 1 && density <= 2.5 ? 'optimal' : density > 2.5 ? 'over-optimized' : 'under-optimized'
    };
  }

  checkMetaTags(metaTitle, metaDescription) {
    return {
      title: {
        length: metaTitle?.length || 0,
        status: metaTitle?.length >= 50 && metaTitle?.length <= 60 ? 'optimal' : 
                metaTitle?.length > 60 ? 'too-long' : 'too-short'
      },
      description: {
        length: metaDescription?.length || 0,
        status: metaDescription?.length >= 150 && metaDescription?.length <= 160 ? 'optimal' : 
                metaDescription?.length > 160 ? 'too-long' : 'too-short'
      }
    };
  }

  checkHeadings() {
    const h1Count = (this.content.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (this.content.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (this.content.match(/<h3[^>]*>/gi) || []).length;
    
    return {
      hasH1: h1Count === 1,
      h2Count,
      h3Count,
      status: h1Count === 1 && h2Count >= 2 ? 'good' : 'needs-improvement'
    };
  }

  calculateReadability() {
    const sentences = this.text.split(/[.!?]+/).length;
    const words = this.text.split(/\s+/).length;
    const syllables = this.countSyllables(this.text);
    
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    
    return {
      score: parseFloat(score.toFixed(1)),
      grade: score >= 70 ? 'Good' : score >= 50 ? 'Medium' : 'Poor',
      readingTime: readingTime(this.text).minutes
    };
  }

  countSyllables(text) {
    let count = 0;
    const words = text.split(/\s+/);
    words.forEach(word => {
      word = word.toLowerCase();
      let sylCount = 0;
      if (word.length <= 3) sylCount = 1;
      else {
        sylCount = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
                      .replace(/^y/, '')
                      .match(/[aeiouy]{1,2}/g)?.length || 1;
      }
      count += Math.max(1, sylCount);
    });
    return count;
  }

  checkImages(content) {
    const imgRegex = /<img[^>]+>/g;
    const images = content.match(imgRegex) || [];
    const missingAlt = [];
    
    images.forEach((img, index) => {
      if (!img.includes('alt=')) {
        missingAlt.push(index + 1);
      }
    });
    
    return {
      total: images.length,
      missingAlt: missingAlt.length,
      missingAltList: missingAlt,
      status: missingAlt.length === 0 ? 'perfect' : 'needs-alt-text'
    };
  }

  calculateOverallScore() {
    const metrics = {
      keywordDensity: this.calculateKeywordDensity().status === 'optimal' ? 25 : 
                      this.calculateKeywordDensity().status === 'under-optimized' ? 15 : 10,
      readability: this.calculateReadability().grade === 'Good' ? 25 : 
                   this.calculateReadability().grade === 'Medium' ? 15 : 10,
      headings: this.checkHeadings().status === 'good' ? 25 : 15,
      images: this.checkImages(this.content).status === 'perfect' ? 25 : 
              this.checkImages(this.content).missingAlt > 0 ? 15 : 10
    };
    
    const total = Object.values(metrics).reduce((a, b) => a + b, 0);
    
    return {
      score: total,
      metrics,
      grade: total >= 80 ? 'Excellent' : total >= 60 ? 'Good' : total >= 40 ? 'Needs Improvement' : 'Poor'
    };
  }

  async analyze(metaTitle, metaDescription) {
    return {
      keywordDensity: this.calculateKeywordDensity(),
      metaTags: this.checkMetaTags(metaTitle, metaDescription),
      headings: this.checkHeadings(),
      readability: this.calculateReadability(),
      images: this.checkImages(this.content),
      overallScore: this.calculateOverallScore(),
      suggestions: this.generateSuggestions()
    };
  }

  generateSuggestions() {
    const suggestions = [];
    const keywordData = this.calculateKeywordDensity();
    const readabilityData = this.calculateReadability();
    const headingData = this.checkHeadings();
    const imageData = this.checkImages(this.content);
    
    if (keywordData.status === 'under-optimized') {
      suggestions.push(`✨ Increase keyword "${this.targetKeyword}" usage (current: ${keywordData.density}%, target: 1-2.5%)`);
    } else if (keywordData.status === 'over-optimized') {
      suggestions.push(`⚠️ Reduce keyword "${this.targetKeyword}" usage (current: ${keywordData.density}%, target: 1-2.5%)`);
    }
    
    if (readabilityData.grade !== 'Good') {
      suggestions.push(`📖 Improve readability (score: ${readabilityData.score}). Use shorter sentences and simpler words.`);
    }
    
    if (headingData.status === 'needs-improvement') {
      suggestions.push(`📌 Add H1 tag (one only) and at least 2 H2 tags for better structure.`);
    }
    
    if (imageData.missingAlt > 0) {
      suggestions.push(`🖼️ Add alt text to ${imageData.missingAlt} image(s) for better SEO and accessibility.`);
    }
    
    suggestions.push(`🎯 Target keyword appears in first 100 words: ${this.text.toLowerCase().indexOf(this.targetKeyword) < 100 ? '✅ Yes' : '❌ No'}`);
    
    return suggestions;
  }
}
