import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userMetrics } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_METRIC_TYPES = ['screen_time', 'sleep', 'activity', 'mood'] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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
        .from(userMetrics)
        .where(eq(userMetrics.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'User metric not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const metricType = searchParams.get('metricType');
    const date = searchParams.get('date');

    let query = db.select().from(userMetrics);

    // Build filter conditions
    const conditions = [];

    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(userMetrics.userId, parseInt(userId)));
    }

    if (metricType) {
      if (!VALID_METRIC_TYPES.includes(metricType as any)) {
        return NextResponse.json(
          {
            error: `Invalid metricType. Must be one of: ${VALID_METRIC_TYPES.join(', ')}`,
            code: 'INVALID_METRIC_TYPE',
          },
          { status: 400 }
        );
      }
      conditions.push(eq(userMetrics.metricType, metricType));
    }

    if (date) {
      conditions.push(eq(userMetrics.date, date));
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
    const { userId, metricType, value, date } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!metricType) {
      return NextResponse.json(
        { error: 'metricType is required', code: 'MISSING_METRIC_TYPE' },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        { error: 'value is required', code: 'MISSING_VALUE' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'date is required', code: 'MISSING_DATE' },
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

    // Validate metricType
    if (!VALID_METRIC_TYPES.includes(metricType)) {
      return NextResponse.json(
        {
          error: `metricType must be one of: ${VALID_METRIC_TYPES.join(', ')}`,
          code: 'INVALID_METRIC_TYPE',
        },
        { status: 400 }
      );
    }

    // Create new user metric
    const newUserMetric = await db
      .insert(userMetrics)
      .values({
        userId: parseInt(userId),
        metricType: metricType.trim(),
        value: value.toString().trim(),
        date: date.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newUserMetric[0], { status: 201 });
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

    // Check if record exists
    const existing = await db
      .select()
      .from(userMetrics)
      .where(eq(userMetrics.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'User metric not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { metricType, value, date } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (metricType !== undefined) {
      if (!VALID_METRIC_TYPES.includes(metricType)) {
        return NextResponse.json(
          {
            error: `metricType must be one of: ${VALID_METRIC_TYPES.join(', ')}`,
            code: 'INVALID_METRIC_TYPE',
          },
          { status: 400 }
        );
      }
      updates.metricType = metricType.trim();
    }

    if (value !== undefined) {
      updates.value = value.toString().trim();
    }

    if (date !== undefined) {
      updates.date = date.trim();
    }

    // Update the record
    const updated = await db
      .update(userMetrics)
      .set(updates)
      .where(eq(userMetrics.id, parseInt(id)))
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
      .from(userMetrics)
      .where(eq(userMetrics.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'User metric not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the record
    const deleted = await db
      .delete(userMetrics)
      .where(eq(userMetrics.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'User metric deleted successfully',
        deletedRecord: deleted[0],
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