import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/gmail';
import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
import BlogPost from '@/models/BlogPost';
import SEOToolUsage from '@/models/SEOToolUsage';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.email.includes('@crazyseoteam.in')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  
  const totalUsers = await User.countDocuments();
  const totalBlogPosts = await BlogPost.countDocuments();
  const publishedPosts = await BlogPost.countDocuments({ status: 'published' });
  const totalViews = await BlogPost.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
  
  const seoUsage = await SEOToolUsage.aggregate([
    {
      $group: {
        _id: null,
        today: { 
          $sum: { 
            $cond: [
              { $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, new Date().toISOString().split('T')[0]] },
              1, 0
            ]
          }
        },
        total: { $sum: 1 }
      }
    }
  ]);
  
  const avgSeoScore = await BlogPost.aggregate([
    { $match: { seoScore: { $gt: 0 } } },
    { $group: { _id: null, avg: { $avg: '$seoScore' } } }
  ]);
  
  return NextResponse.json({
    totalUsers,
    totalBlogPosts,
    publishedPosts,
    totalViews: totalViews[0]?.total || 0,
    seoToolsUsedToday: seoUsage[0]?.today || 0,
    totalSeoToolsUsed: seoUsage[0]?.total || 0,
    avgSeoScore: avgSeoScore[0]?.avg.toFixed(1) || 0,
    recentActivity: {
      postsLastWeek: await BlogPost.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      usersLastWeek: await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    }
  });
}
