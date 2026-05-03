'use client';

import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SEOChecker from './SEOChecker';

export default function BlogEditor({ post = null }) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [targetKeyword, setTargetKeyword] = useState(post?.targetKeyword || '');
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');
  const [seoData, setSeoData] = useState(null);
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };
  
  const handleSEOAanalysis = async () => {
    const response = await fetch('/api/seo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        targetKeyword,
        metaTitle,
        metaDescription
      })
    });
    
    const data = await response.json();
    setSeoData(data.analysis);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content && targetKeyword) {
        handleSEOAanalysis();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [content, targetKeyword, metaTitle, metaDescription]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold w-full border-0 focus:ring-0 p-0"
          />
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Target Keyword"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleSEOAanalysis}
              className="btn-primary"
            >
              Analyze SEO
            </button>
          </div>
          
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-96"
          />
        </div>
        
        <div className="lg:col-span-1">
          <SEOChecker seoData={seoData} />
          
          <div className="card mt-6">
            <h3 className="font-semibold mb-3">Meta Information</h3>
            <input
              type="text"
              placeholder="Meta Title (50-60 chars)"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-3 text-sm"
            />
            <div className="text-xs text-gray-500 mb-3">{metaTitle.length}/60</div>
            
            <textarea
              placeholder="Meta Description (150-160 chars)"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <div className="text-xs text-gray-500">{metaDescription.length}/160</div>
          </div>
          
          <div className="card mt-6">
            <h3 className="font-semibold mb-3">URL Slug</h3>
            <div className="text-sm text-gray-600">
              crazyseoteam.in/blog/
              <span className="text-blue-600">{generateSlug(title)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">
          Save Draft
        </button>
        <button className="btn-primary">
          Publish Post
        </button>
      </div>
    </div>
  );
}
