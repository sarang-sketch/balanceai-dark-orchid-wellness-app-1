import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wellnessGoals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(wellnessGoals)
        .where(eq(wellnessGoals.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Wellness goal not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');

    let query = db.select().from(wellnessGoals);

    // Filter by userId if provided
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(wellnessGoals.userId, parseInt(userId)));
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
    const { userId, goalId, goalTitle } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!goalId) {
      return NextResponse.json(
        { error: 'goalId is required', code: 'MISSING_GOAL_ID' },
        { status: 400 }
      );
    }

    if (!goalTitle) {
      return NextResponse.json(
        { error: 'goalTitle is required', code: 'MISSING_GOAL_TITLE' },
        { status: 400 }
      );
    }

    // Validate userId is a valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Create new wellness goal
    const newGoal = await db
      .insert(wellnessGoals)
      .values({
        userId: parseInt(userId),
        goalId: goalId.trim(),
        goalTitle: goalTitle.trim(),
        selectedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newGoal[0], { status: 201 });
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

    // Check if record exists
    const existing = await db
      .select()
      .from(wellnessGoals)
      .where(eq(wellnessGoals.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Wellness goal not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { goalId, goalTitle } = body;

    // Prepare update object with only provided fields
    const updates: any = {};

    if (goalId !== undefined) {
      updates.goalId = goalId.trim();
    }

    if (goalTitle !== undefined) {
      updates.goalTitle = goalTitle.trim();
    }

    // If no fields to update, return error
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    // Update the record
    const updated = await db
      .update(wellnessGoals)
      .set(updates)
      .where(eq(wellnessGoals.id, parseInt(id)))
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(wellnessGoals)
      .where(eq(wellnessGoals.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Wellness goal not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the record
    const deleted = await db
      .delete(wellnessGoals)
      .where(eq(wellnessGoals.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Wellness goal deleted successfully',
        deletedGoal: deleted[0],
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