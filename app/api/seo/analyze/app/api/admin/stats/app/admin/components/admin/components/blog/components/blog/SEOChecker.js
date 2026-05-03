'use client';

import { CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

export default function SEOChecker({ seoData }) {
  if (!seoData) {
    return (
      <div className="card">
        <div className="text-center text-gray-500 py-8">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Add content and target keyword<br />to see SEO analysis</p>
        </div>
      </div>
    );
  }
  
  const { overallScore, keywordDensity, readability, headings, images, suggestions } = seoData;
  const scoreColor = overallScore.score >= 80 ? 'green' : overallScore.score >= 60 ? 'blue' : 'red';
  
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="text-center mb-4">
          <div className={`text-5xl font-bold text-${scoreColor}-600`}>
            {overallScore.score}
          </div>
          <div className="text-gray-600">SEO Score</div>
          <div className={`text-sm mt-2 font-semibold text-${scoreColor}-600`}>
            {overallScore.grade}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Keyword Density</span>
              <span className={keywordDensity.density >= 1 && keywordDensity.density <= 2.5 ? 'text-green-600' : 'text-red-600'}>
                {keywordDensity.density}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Optimal: 1-2.5%</span>
              <span>{keywordDensity.occurrences} occurrences</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Readability</span>
              <span className={readability.grade === 'Good' ? 'text-green-600' : 'text-yellow-600'}>
                {readability.score}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Grade: {readability.grade} | Reading time: {Math.ceil(readability.readingTime)} min
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Headings Structure</span>
              <span className={headings.status === 'good' ? 'text-green-600' : 'text-red-600'}>
                {headings.hasH1 ? '✓ H1' : '✗ H1'} | H2: {headings.h2Count}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span>Images</span>
              <span className={images.missingAlt === 0 ? 'text-green-600' : 'text-red-600'}>
                {images.missingAlt} missing alt tags
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {suggestions && suggestions.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Suggestions
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                {suggestion.includes('✅') ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                ) : suggestion.includes('⚠️') ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                ) : (
                  <span className="w-4 h-4 text-gray-400 mt-0.5">•</span>
                )}
                <span className={suggestion.includes('✅') ? 'text-gray-600' : 'text-gray-700'}>
                  {suggestion}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
