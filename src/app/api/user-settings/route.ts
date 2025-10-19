import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSettings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const settings = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.id, parseInt(id)))
        .limit(1);

      if (settings.length === 0) {
        return NextResponse.json(
          { error: 'User settings not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(settings[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(userSettings);

    // Filter by userId if provided
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid user ID is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(userSettings.userId, parseInt(userId)));
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

    // Validate required field
    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Validate userId is a valid integer
    if (isNaN(parseInt(body.userId))) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Validate theme if provided
    if (body.theme && body.theme !== 'dark' && body.theme !== 'light') {
      return NextResponse.json(
        {
          error: 'theme must be either "dark" or "light"',
          code: 'INVALID_THEME',
        },
        { status: 400 }
      );
    }

    // Prepare data with defaults
    const insertData = {
      userId: parseInt(body.userId),
      theme: body.theme || 'light',
      notificationsEnabled:
        body.notificationsEnabled !== undefined
          ? body.notificationsEnabled
          : true,
      smsEnabled: body.smsEnabled !== undefined ? body.smsEnabled : false,
      emailEnabled: body.emailEnabled !== undefined ? body.emailEnabled : true,
      updatedAt: new Date().toISOString(),
    };

    const newSettings = await db
      .insert(userSettings)
      .values(insertData)
      .returning();

    return NextResponse.json(newSettings[0], { status: 201 });
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

    const body = await request.json();

    // Validate theme if provided
    if (body.theme && body.theme !== 'dark' && body.theme !== 'light') {
      return NextResponse.json(
        {
          error: 'theme must be either "dark" or "light"',
          code: 'INVALID_THEME',
        },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'User settings not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.theme !== undefined) {
      updateData.theme = body.theme;
    }
    if (body.notificationsEnabled !== undefined) {
      updateData.notificationsEnabled = body.notificationsEnabled;
    }
    if (body.smsEnabled !== undefined) {
      updateData.smsEnabled = body.smsEnabled;
    }
    if (body.emailEnabled !== undefined) {
      updateData.emailEnabled = body.emailEnabled;
    }

    const updated = await db
      .update(userSettings)
      .set(updateData)
      .where(eq(userSettings.id, parseInt(id)))
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
    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'User settings not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(userSettings)
      .where(eq(userSettings.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'User settings deleted successfully',
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