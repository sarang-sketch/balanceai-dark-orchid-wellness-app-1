import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { badges } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userIdParam = searchParams.get('userId');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const badge = await db
        .select()
        .from(badges)
        .where(eq(badges.id, parseInt(id)))
        .limit(1);

      if (badge.length === 0) {
        return NextResponse.json(
          { error: 'Badge not found', code: 'BADGE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(badge[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(badges);

    // Filter by userId if provided
    if (userIdParam) {
      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(badges.userId, userId));
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
    const { userId, badgeId, badgeName } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!badgeId) {
      return NextResponse.json(
        { error: 'badgeId is required', code: 'MISSING_BADGE_ID' },
        { status: 400 }
      );
    }

    if (!badgeName) {
      return NextResponse.json(
        { error: 'badgeName is required', code: 'MISSING_BADGE_NAME' },
        { status: 400 }
      );
    }

    // Validate userId is a valid integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Auto-generate earnedAt timestamp
    const earnedAt = new Date().toISOString();

    // Insert new badge
    const newBadge = await db
      .insert(badges)
      .values({
        userId: userIdInt,
        badgeId: badgeId.trim(),
        badgeName: badgeName.trim(),
        earnedAt,
      })
      .returning();

    return NextResponse.json(newBadge[0], { status: 201 });
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const badgeId = parseInt(id);

    // Check if badge exists
    const existingBadge = await db
      .select()
      .from(badges)
      .where(eq(badges.id, badgeId))
      .limit(1);

    if (existingBadge.length === 0) {
      return NextResponse.json(
        { error: 'Badge not found', code: 'BADGE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Accept partial updates for badgeId and badgeName
    if (body.badgeId !== undefined) {
      updates.badgeId = body.badgeId.trim();
    }

    if (body.badgeName !== undefined) {
      updates.badgeName = body.badgeName.trim();
    }

    // If no valid fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    // Update badge
    const updatedBadge = await db
      .update(badges)
      .set(updates)
      .where(eq(badges.id, badgeId))
      .returning();

    return NextResponse.json(updatedBadge[0], { status: 200 });
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const badgeId = parseInt(id);

    // Check if badge exists
    const existingBadge = await db
      .select()
      .from(badges)
      .where(eq(badges.id, badgeId))
      .limit(1);

    if (existingBadge.length === 0) {
      return NextResponse.json(
        { error: 'Badge not found', code: 'BADGE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete badge
    const deleted = await db
      .delete(badges)
      .where(eq(badges.id, badgeId))
      .returning();

    return NextResponse.json(
      {
        message: 'Badge deleted successfully',
        badge: deleted[0],
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