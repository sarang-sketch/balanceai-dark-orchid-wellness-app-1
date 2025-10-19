import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { communityPosts } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    // Validate limit
    const limit = limitParam ? parseInt(limitParam) : 10;
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { 
          error: 'Invalid limit parameter. Must be a positive integer.',
          code: 'INVALID_LIMIT'
        },
        { status: 400 }
      );
    }
    if (limit > 50) {
      return NextResponse.json(
        { 
          error: 'Limit cannot exceed 50',
          code: 'LIMIT_EXCEEDED'
        },
        { status: 400 }
      );
    }

    // Validate offset
    const offset = offsetParam ? parseInt(offsetParam) : 0;
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { 
          error: 'Invalid offset parameter. Must be a non-negative integer.',
          code: 'INVALID_OFFSET'
        },
        { status: 400 }
      );
    }

    // Validate userId if provided
    if (userId && (isNaN(parseInt(userId)) || parseInt(userId) < 1)) {
      return NextResponse.json(
        { 
          error: 'Invalid userId parameter. Must be a positive integer.',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    // Build WHERE conditions
    const conditions = [];
    
    if (category) {
      conditions.push(eq(communityPosts.category, category));
    }
    
    if (userId) {
      conditions.push(eq(communityPosts.authorId, parseInt(userId)));
    }

    // Build query for posts
    let postsQuery = db.select().from(communityPosts);
    
    if (conditions.length > 0) {
      postsQuery = postsQuery.where(and(...conditions));
    }
    
    const posts = await postsQuery
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count with same filters
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(communityPosts);
    
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    
    const countResult = await countQuery;
    const total = countResult[0]?.count || 0;

    // Return response with posts and pagination info
    return NextResponse.json({
      posts,
      pagination: {
        limit,
        offset,
        total
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}