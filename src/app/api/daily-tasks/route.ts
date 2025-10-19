import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyTasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const completed = searchParams.get('completed');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const task = await db
        .select()
        .from(dailyTasks)
        .where(eq(dailyTasks.id, parseInt(id)))
        .limit(1);

      if (task.length === 0) {
        return NextResponse.json(
          { error: 'Daily task not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(task[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(dailyTasks);
    const conditions = [];

    // Filter by userId if provided
    if (userId) {
      const userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(dailyTasks.userId, userIdInt));
    }

    // Filter by completed status if provided
    if (completed !== null && completed !== undefined) {
      const completedBool = completed === 'true';
      conditions.push(eq(dailyTasks.completed, completedBool));
    }

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const tasks = await query.limit(limit).offset(offset);

    return NextResponse.json(tasks, { status: 200 });
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
    const { userId, taskName, taskTime, completed, completionDate } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!taskName) {
      return NextResponse.json(
        { error: 'taskName is required', code: 'MISSING_TASK_NAME' },
        { status: 400 }
      );
    }

    if (!taskTime) {
      return NextResponse.json(
        { error: 'taskTime is required', code: 'MISSING_TASK_TIME' },
        { status: 400 }
      );
    }

    // Validate userId is valid integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTaskName = taskName.trim();
    const sanitizedTaskTime = taskTime.trim();

    // Prepare insert data with defaults
    const insertData: any = {
      userId: userIdInt,
      taskName: sanitizedTaskName,
      taskTime: sanitizedTaskTime,
      completed: completed !== undefined ? completed : false,
    };

    // Only add completionDate if provided
    if (completionDate !== undefined && completionDate !== null) {
      insertData.completionDate = completionDate;
    }

    const newTask = await db.insert(dailyTasks).values(insertData).returning();

    return NextResponse.json(newTask[0], { status: 201 });
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

    const idInt = parseInt(id);

    // Check if record exists
    const existing = await db
      .select()
      .from(dailyTasks)
      .where(eq(dailyTasks.id, idInt))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Daily task not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { taskName, taskTime, completed, completionDate } = body;

    // Prepare update data (only include provided fields)
    const updateData: any = {};

    if (taskName !== undefined) {
      updateData.taskName = taskName.trim();
    }

    if (taskTime !== undefined) {
      updateData.taskTime = taskTime.trim();
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    if (completionDate !== undefined) {
      updateData.completionDate = completionDate;
    }

    // If no fields to update, return current record
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existing[0], { status: 200 });
    }

    const updated = await db
      .update(dailyTasks)
      .set(updateData)
      .where(eq(dailyTasks.id, idInt))
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

    const idInt = parseInt(id);

    // Check if record exists
    const existing = await db
      .select()
      .from(dailyTasks)
      .where(eq(dailyTasks.id, idInt))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Daily task not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(dailyTasks)
      .where(eq(dailyTasks.id, idInt))
      .returning();

    return NextResponse.json(
      {
        message: 'Daily task deleted successfully',
        deletedTask: deleted[0],
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