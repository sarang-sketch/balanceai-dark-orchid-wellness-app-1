import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizResponses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single quiz response by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const quizResponse = await db
        .select()
        .from(quizResponses)
        .where(eq(quizResponses.id, parseInt(id)))
        .limit(1);

      if (quizResponse.length === 0) {
        return NextResponse.json(
          { error: 'Quiz response not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(quizResponse[0], { status: 200 });
    }

    // List all quiz responses with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userIdFilter = searchParams.get('userId');

    let query = db.select().from(quizResponses);

    // Apply userId filter if provided
    if (userIdFilter) {
      const userIdInt = parseInt(userIdFilter);
      if (isNaN(userIdInt)) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(quizResponses.userId, userIdInt));
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
    const { userId, questionId, answerIndex, category } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required', code: 'MISSING_QUESTION_ID' },
        { status: 400 }
      );
    }

    if (answerIndex === undefined || answerIndex === null) {
      return NextResponse.json(
        { error: 'answerIndex is required', code: 'MISSING_ANSWER_INDEX' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'category is required', code: 'MISSING_CATEGORY' },
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

    // Validate answerIndex is a valid integer
    const answerIndexInt = parseInt(answerIndex);
    if (isNaN(answerIndexInt)) {
      return NextResponse.json(
        { error: 'answerIndex must be a valid integer', code: 'INVALID_ANSWER_INDEX' },
        { status: 400 }
      );
    }

    // Create new quiz response
    const newQuizResponse = await db
      .insert(quizResponses)
      .values({
        userId: userIdInt,
        questionId: questionId.trim(),
        answerIndex: answerIndexInt,
        category: category.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newQuizResponse[0], { status: 201 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { questionId, answerIndex, category } = body;

    // Check if quiz response exists
    const existingQuizResponse = await db
      .select()
      .from(quizResponses)
      .where(eq(quizResponses.id, parseInt(id)))
      .limit(1);

    if (existingQuizResponse.length === 0) {
      return NextResponse.json(
        { error: 'Quiz response not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updates: any = {};

    if (questionId !== undefined) {
      updates.questionId = questionId.trim();
    }

    if (answerIndex !== undefined) {
      const answerIndexInt = parseInt(answerIndex);
      if (isNaN(answerIndexInt)) {
        return NextResponse.json(
          { error: 'answerIndex must be a valid integer', code: 'INVALID_ANSWER_INDEX' },
          { status: 400 }
        );
      }
      updates.answerIndex = answerIndexInt;
    }

    if (category !== undefined) {
      updates.category = category.trim();
    }

    // If no fields to update, return current record
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingQuizResponse[0], { status: 200 });
    }

    // Update quiz response
    const updatedQuizResponse = await db
      .update(quizResponses)
      .set(updates)
      .where(eq(quizResponses.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedQuizResponse[0], { status: 200 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if quiz response exists
    const existingQuizResponse = await db
      .select()
      .from(quizResponses)
      .where(eq(quizResponses.id, parseInt(id)))
      .limit(1);

    if (existingQuizResponse.length === 0) {
      return NextResponse.json(
        { error: 'Quiz response not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete quiz response
    const deleted = await db
      .delete(quizResponses)
      .where(eq(quizResponses.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Quiz response deleted successfully',
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