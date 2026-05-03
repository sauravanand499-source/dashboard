import { NextResponse } from 'next/server';
import { SEOAnalyzer } from '@/lib/seo/analyzer';

export async function POST(req) {
  try {
    const { content, targetKeyword, metaTitle, metaDescription } = await req.json();
    
    const analyzer = new SEOAnalyzer(content, targetKeyword);
    const analysis = await analyzer.analyze(metaTitle, metaDescription);
    
    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('SEO Analysis Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
