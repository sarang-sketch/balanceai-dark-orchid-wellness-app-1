import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postLikes, communityPosts, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const postLike = await db
        .select()
        .from(postLikes)
        .where(eq(postLikes.id, parsedId))
        .limit(1);

      if (postLike.length === 0) {
        return NextResponse.json(
          { error: 'Post like not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(postLike[0], { status: 200 });
    }

    // List with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');

    let query = db.select().from(postLikes);

    // Apply filters
    const filters = [];
    if (postId) {
      const parsedPostId = parseInt(postId);
      if (!isNaN(parsedPostId)) {
        filters.push(eq(postLikes.postId, parsedPostId));
      }
    }
    if (userId) {
      const parsedUserId = parseInt(userId);
      if (!isNaN(parsedUserId)) {
        filters.push(eq(postLikes.userId, parsedUserId));
      }
    }

    if (filters.length > 0) {
      query = query.where(and(...filters));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId } = body;

    // Validate required fields
    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required', code: 'MISSING_POST_ID' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Validate field types
    const parsedPostId = parseInt(postId);
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedPostId)) {
      return NextResponse.json(
        { error: 'postId must be a valid integer', code: 'INVALID_POST_ID' },
        { status: 400 }
      );
    }

    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Validate that post exists
    const postExists = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, parsedPostId))
      .limit(1);

    if (postExists.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate that user exists
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, parsedUserId))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Create new post like
    const newPostLike = await db
      .insert(postLikes)
      .values({
        postId: parsedPostId,
        userId: parsedUserId,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Update likes count on community post
    await db
      .update(communityPosts)
      .set({
        likesCount: postExists[0].likesCount + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(communityPosts.id, parsedPostId));

    return NextResponse.json(newPostLike[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if post like exists
    const existingPostLike = await db
      .select()
      .from(postLikes)
      .where(eq(postLikes.id, parsedId))
      .limit(1);

    if (existingPostLike.length === 0) {
      return NextResponse.json(
        { error: 'Post like not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Handle postId update
    if (body.postId !== undefined) {
      const parsedPostId = parseInt(body.postId);
      if (isNaN(parsedPostId)) {
        return NextResponse.json(
          { error: 'postId must be a valid integer', code: 'INVALID_POST_ID' },
          { status: 400 }
        );
      }

      // Validate that new post exists
      const postExists = await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.id, parsedPostId))
        .limit(1);

      if (postExists.length === 0) {
        return NextResponse.json(
          { error: 'Post not found', code: 'POST_NOT_FOUND' },
          { status: 400 }
        );
      }

      // Update likes count on old post
      if (existingPostLike[0].postId !== parsedPostId) {
        const oldPost = await db
          .select()
          .from(communityPosts)
          .where(eq(communityPosts.id, existingPostLike[0].postId))
          .limit(1);

        if (oldPost.length > 0) {
          await db
            .update(communityPosts)
            .set({
              likesCount: Math.max(0, oldPost[0].likesCount - 1),
              updatedAt: new Date().toISOString(),
            })
            .where(eq(communityPosts.id, existingPostLike[0].postId));
        }

        // Update likes count on new post
        await db
          .update(communityPosts)
          .set({
            likesCount: postExists[0].likesCount + 1,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(communityPosts.id, parsedPostId));
      }

      updates.postId = parsedPostId;
    }

    // Handle userId update
    if (body.userId !== undefined) {
      const parsedUserId = parseInt(body.userId);
      if (isNaN(parsedUserId)) {
        return NextResponse.json(
          { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }

      // Validate that user exists
      const userExists = await db
        .select()
        .from(users)
        .where(eq(users.id, parsedUserId))
        .limit(1);

      if (userExists.length === 0) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 400 }
        );
      }

      updates.userId = parsedUserId;
    }

    // Perform update
    const updatedPostLike = await db
      .update(postLikes)
      .set(updates)
      .where(eq(postLikes.id, parsedId))
      .returning();

    return NextResponse.json(updatedPostLike[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if post like exists
    const existingPostLike = await db
      .select()
      .from(postLikes)
      .where(eq(postLikes.id, parsedId))
      .limit(1);

    if (existingPostLike.length === 0) {
      return NextResponse.json(
        { error: 'Post like not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the post like
    const deleted = await db
      .delete(postLikes)
      .where(eq(postLikes.id, parsedId))
      .returning();

    // Update likes count on community post
    const post = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, existingPostLike[0].postId))
      .limit(1);

    if (post.length > 0) {
      await db
        .update(communityPosts)
        .set({
          likesCount: Math.max(0, post[0].likesCount - 1),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(communityPosts.id, existingPostLike[0].postId));
    }

    return NextResponse.json(
      {
        message: 'Post like deleted successfully',
        deletedPostLike: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}