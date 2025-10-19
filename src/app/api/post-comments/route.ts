import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postComments, communityPosts, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single post comment by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        }, { status: 400 });
      }

      const comment = await db.select()
        .from(postComments)
        .where(eq(postComments.id, parseInt(id)))
        .limit(1);

      if (comment.length === 0) {
        return NextResponse.json({
          error: 'Post comment not found',
          code: 'COMMENT_NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json(comment[0], { status: 200 });
    }

    // List all post comments with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');

    let query = db.select().from(postComments).orderBy(desc(postComments.createdAt));

    // Apply filters
    const conditions = [];
    if (postId) {
      if (isNaN(parseInt(postId))) {
        return NextResponse.json({
          error: 'Valid postId is required',
          code: 'INVALID_POST_ID'
        }, { status: 400 });
      }
      conditions.push(eq(postComments.postId, parseInt(postId)));
    }

    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID'
        }, { status: 400 });
      }
      conditions.push(eq(postComments.userId, parseInt(userId)));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId, commentText } = body;

    // Validate required fields
    if (!postId) {
      return NextResponse.json({
        error: 'postId is required',
        code: 'MISSING_POST_ID'
      }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
        code: 'MISSING_USER_ID'
      }, { status: 400 });
    }

    if (!commentText) {
      return NextResponse.json({
        error: 'commentText is required',
        code: 'MISSING_COMMENT_TEXT'
      }, { status: 400 });
    }

    // Validate postId is valid integer
    if (isNaN(parseInt(postId))) {
      return NextResponse.json({
        error: 'postId must be a valid integer',
        code: 'INVALID_POST_ID'
      }, { status: 400 });
    }

    // Validate userId is valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json({
        error: 'userId must be a valid integer',
        code: 'INVALID_USER_ID'
      }, { status: 400 });
    }

    // Validate commentText is non-empty
    const trimmedCommentText = commentText.trim();
    if (trimmedCommentText.length === 0) {
      return NextResponse.json({
        error: 'commentText must be non-empty',
        code: 'EMPTY_COMMENT_TEXT'
      }, { status: 400 });
    }

    // Validate post exists
    const post = await db.select()
      .from(communityPosts)
      .where(eq(communityPosts.id, parseInt(postId)))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json({
        error: 'Post not found',
        code: 'POST_NOT_FOUND'
      }, { status: 400 });
    }

    // Validate user exists
    const user = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 400 });
    }

    // Create new post comment
    const newComment = await db.insert(postComments)
      .values({
        postId: parseInt(postId),
        userId: parseInt(userId),
        commentText: trimmedCommentText,
        createdAt: new Date().toISOString()
      })
      .returning();

    // Update comments count on the post
    await db.update(communityPosts)
      .set({
        commentsCount: post[0].commentsCount + 1,
        updatedAt: new Date().toISOString()
      })
      .where(eq(communityPosts.id, parseInt(postId)));

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const body = await request.json();
    const { commentText } = body;

    // Check if comment exists
    const existingComment = await db.select()
      .from(postComments)
      .where(eq(postComments.id, parseInt(id)))
      .limit(1);

    if (existingComment.length === 0) {
      return NextResponse.json({
        error: 'Post comment not found',
        code: 'COMMENT_NOT_FOUND'
      }, { status: 404 });
    }

    // Build update object
    const updates: any = {};

    if (commentText !== undefined) {
      const trimmedCommentText = commentText.trim();
      if (trimmedCommentText.length === 0) {
        return NextResponse.json({
          error: 'commentText must be non-empty',
          code: 'EMPTY_COMMENT_TEXT'
        }, { status: 400 });
      }
      updates.commentText = trimmedCommentText;
    }

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        error: 'No fields to update',
        code: 'NO_UPDATES'
      }, { status: 400 });
    }

    // Update the comment
    const updated = await db.update(postComments)
      .set(updates)
      .where(eq(postComments.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    // Check if comment exists
    const existingComment = await db.select()
      .from(postComments)
      .where(eq(postComments.id, parseInt(id)))
      .limit(1);

    if (existingComment.length === 0) {
      return NextResponse.json({
        error: 'Post comment not found',
        code: 'COMMENT_NOT_FOUND'
      }, { status: 404 });
    }

    // Get the post to update comments count
    const post = await db.select()
      .from(communityPosts)
      .where(eq(communityPosts.id, existingComment[0].postId))
      .limit(1);

    // Delete the comment
    const deleted = await db.delete(postComments)
      .where(eq(postComments.id, parseInt(id)))
      .returning();

    // Update comments count on the post
    if (post.length > 0) {
      await db.update(communityPosts)
        .set({
          commentsCount: Math.max(0, post[0].commentsCount - 1),
          updatedAt: new Date().toISOString()
        })
        .where(eq(communityPosts.id, existingComment[0].postId));
    }

    return NextResponse.json({
      message: 'Post comment deleted successfully',
      comment: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}