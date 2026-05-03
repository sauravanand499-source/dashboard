import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: String,
  excerpt: String,
  metaTitle: String,
  metaDescription: String,
  targetKeyword: String,
  seoScore: {
    type: Number,
    default: 0,
  },
  keywordDensity: Number,
  readabilityScore: Number,
  readingTime: Number,
  imageAltTags: [String],
  internalLinks: [String],
  schemaMarkup: Object,
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  publishedAt: Date,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
