import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { communityPosts } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const post = await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.id, parseInt(id)))
        .limit(1);

      if (post.length === 0) {
        return NextResponse.json(
          { error: 'Community post not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(post[0], { status: 200 });
    }

    // List with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const authorId = searchParams.get('authorId');
    const category = searchParams.get('category');

    let query = db.select().from(communityPosts);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(communityPosts.content, `%${search}%`),
          like(communityPosts.authorName, `%${search}%`)
        )
      );
    }

    if (authorId) {
      if (isNaN(parseInt(authorId))) {
        return NextResponse.json(
          { error: 'Valid authorId is required', code: 'INVALID_AUTHOR_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(communityPosts.authorId, parseInt(authorId)));
    }

    if (category) {
      conditions.push(eq(communityPosts.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
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
    const { authorId, authorName, content, category, isAnonymous } = body;

    // Validation: Required fields
    if (!authorName || authorName.trim() === '') {
      return NextResponse.json(
        { error: 'Author name is required', code: 'MISSING_AUTHOR_NAME' },
        { status: 400 }
      );
    }

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    if (!category || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const insertData = {
      authorId: authorId || null,
      authorName: authorName.trim(),
      content: content.trim(),
      category: category.trim(),
      isAnonymous: isAnonymous !== undefined ? Boolean(isAnonymous) : false,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newPost = await db
      .insert(communityPosts)
      .values(insertData)
      .returning();

    return NextResponse.json(newPost[0], { status: 201 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingPost = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, parseInt(id)))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Community post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content, category, likesCount, commentsCount } = body;

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (content !== undefined) {
      if (content.trim() === '') {
        return NextResponse.json(
          { error: 'Content cannot be empty', code: 'INVALID_CONTENT' },
          { status: 400 }
        );
      }
      updateData.content = content.trim();
    }

    if (category !== undefined) {
      if (category.trim() === '') {
        return NextResponse.json(
          { error: 'Category cannot be empty', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      updateData.category = category.trim();
    }

    if (likesCount !== undefined) {
      if (typeof likesCount !== 'number' || likesCount < 0) {
        return NextResponse.json(
          { error: 'Likes count must be a non-negative number', code: 'INVALID_LIKES_COUNT' },
          { status: 400 }
        );
      }
      updateData.likesCount = likesCount;
    }

    if (commentsCount !== undefined) {
      if (typeof commentsCount !== 'number' || commentsCount < 0) {
        return NextResponse.json(
          { error: 'Comments count must be a non-negative number', code: 'INVALID_COMMENTS_COUNT' },
          { status: 400 }
        );
      }
      updateData.commentsCount = commentsCount;
    }

    const updated = await db
      .update(communityPosts)
      .set(updateData)
      .where(eq(communityPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingPost = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, parseInt(id)))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Community post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(communityPosts)
      .where(eq(communityPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Community post deleted successfully',
        deletedPost: deleted[0],
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