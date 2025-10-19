import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postLikes, communityPosts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const postId = context.params.id;

    // Validate postId
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        {
          error: 'Valid post ID is required',
          code: 'INVALID_POST_ID',
        },
        { status: 400 }
      );
    }

    const parsedPostId = parseInt(postId);

    // Parse request body
    const body = await request.json();
    const { userId } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID is required',
          code: 'MISSING_USER_ID',
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId);

    // Check if post exists
    const post = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, parsedPostId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        {
          error: 'Post not found',
          code: 'POST_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if user has already liked this post
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(
        and(
          eq(postLikes.postId, parsedPostId),
          eq(postLikes.userId, parsedUserId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike: Delete the like record
      await db
        .delete(postLikes)
        .where(
          and(
            eq(postLikes.postId, parsedPostId),
            eq(postLikes.userId, parsedUserId)
          )
        );

      // Decrement likesCount
      const currentLikesCount = post[0].likesCount || 0;
      const newLikesCount = Math.max(0, currentLikesCount - 1);

      await db
        .update(communityPosts)
        .set({
          likesCount: newLikesCount,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(communityPosts.id, parsedPostId));

      return NextResponse.json(
        {
          action: 'unliked',
          postId: parsedPostId,
          userId: parsedUserId,
          likesCount: newLikesCount,
        },
        { status: 200 }
      );
    } else {
      // Like: Create new like record
      await db.insert(postLikes).values({
        postId: parsedPostId,
        userId: parsedUserId,
        createdAt: new Date().toISOString(),
      });

      // Increment likesCount
      const currentLikesCount = post[0].likesCount || 0;
      const newLikesCount = currentLikesCount + 1;

      await db
        .update(communityPosts)
        .set({
          likesCount: newLikesCount,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(communityPosts.id, parsedPostId));

      return NextResponse.json(
        {
          action: 'liked',
          postId: parsedPostId,
          userId: parsedUserId,
          likesCount: newLikesCount,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}