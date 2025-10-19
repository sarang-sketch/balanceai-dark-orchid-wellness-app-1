import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userStreaks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(userStreaks)
        .where(eq(userStreaks.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'User streak not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');

    let query = db.select().from(userStreaks);

    // Filter by userId if provided
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid userId is required for filtering', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(userStreaks.userId, parseInt(userId)));
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
    const { userId, currentStreak, longestStreak, lastActivityDate } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_REQUIRED_FIELD' },
        { status: 400 }
      );
    }

    // Validate userId is valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const insertData = {
      userId: parseInt(userId),
      currentStreak: currentStreak !== undefined ? parseInt(currentStreak) : 0,
      longestStreak: longestStreak !== undefined ? parseInt(longestStreak) : 0,
      lastActivityDate: lastActivityDate || null,
      updatedAt: new Date().toISOString(),
    };

    // Validate numeric fields
    if (isNaN(insertData.currentStreak)) {
      return NextResponse.json(
        { error: 'currentStreak must be a valid integer', code: 'INVALID_CURRENT_STREAK' },
        { status: 400 }
      );
    }

    if (isNaN(insertData.longestStreak)) {
      return NextResponse.json(
        { error: 'longestStreak must be a valid integer', code: 'INVALID_LONGEST_STREAK' },
        { status: 400 }
      );
    }

    const newRecord = await db
      .insert(userStreaks)
      .values(insertData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { currentStreak, longestStreak, lastActivityDate } = body;

    // Check if record exists
    const existing = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'User streak not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Only include fields that are provided
    if (currentStreak !== undefined) {
      const parsedCurrentStreak = parseInt(currentStreak);
      if (isNaN(parsedCurrentStreak)) {
        return NextResponse.json(
          { error: 'currentStreak must be a valid integer', code: 'INVALID_CURRENT_STREAK' },
          { status: 400 }
        );
      }
      updateData.currentStreak = parsedCurrentStreak;
    }

    if (longestStreak !== undefined) {
      const parsedLongestStreak = parseInt(longestStreak);
      if (isNaN(parsedLongestStreak)) {
        return NextResponse.json(
          { error: 'longestStreak must be a valid integer', code: 'INVALID_LONGEST_STREAK' },
          { status: 400 }
        );
      }
      updateData.longestStreak = parsedLongestStreak;
    }

    if (lastActivityDate !== undefined) {
      updateData.lastActivityDate = lastActivityDate;
    }

    const updated = await db
      .update(userStreaks)
      .set(updateData)
      .where(eq(userStreaks.id, parseInt(id)))
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'User streak not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(userStreaks)
      .where(eq(userStreaks.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'User streak deleted successfully',
        deleted: deleted[0],
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