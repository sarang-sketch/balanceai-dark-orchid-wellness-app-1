import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizResults } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_MOOD_RESULTS = ['Balanced', 'Needs Attention', 'Overloaded'];

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

      const result = await db
        .select()
        .from(quizResults)
        .where(eq(quizResults.id, parseInt(id)))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Quiz result not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(quizResults);

    // Filter by userId if provided
    if (userIdParam) {
      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(quizResults.userId, userId));
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
    const {
      userId,
      balanceScore,
      moodResult,
      cognitiveScore,
      physicalScore,
      digitalScore,
    } = body;

    // Validate required fields
    if (userId === undefined || userId === null) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (balanceScore === undefined || balanceScore === null) {
      return NextResponse.json(
        { error: 'balanceScore is required', code: 'MISSING_BALANCE_SCORE' },
        { status: 400 }
      );
    }

    if (!moodResult) {
      return NextResponse.json(
        { error: 'moodResult is required', code: 'MISSING_MOOD_RESULT' },
        { status: 400 }
      );
    }

    if (cognitiveScore === undefined || cognitiveScore === null) {
      return NextResponse.json(
        { error: 'cognitiveScore is required', code: 'MISSING_COGNITIVE_SCORE' },
        { status: 400 }
      );
    }

    if (physicalScore === undefined || physicalScore === null) {
      return NextResponse.json(
        { error: 'physicalScore is required', code: 'MISSING_PHYSICAL_SCORE' },
        { status: 400 }
      );
    }

    if (digitalScore === undefined || digitalScore === null) {
      return NextResponse.json(
        { error: 'digitalScore is required', code: 'MISSING_DIGITAL_SCORE' },
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

    // Validate scores are valid integers
    const balanceScoreInt = parseInt(balanceScore);
    if (isNaN(balanceScoreInt)) {
      return NextResponse.json(
        { error: 'balanceScore must be a valid integer', code: 'INVALID_BALANCE_SCORE' },
        { status: 400 }
      );
    }

    const cognitiveScoreInt = parseInt(cognitiveScore);
    if (isNaN(cognitiveScoreInt)) {
      return NextResponse.json(
        { error: 'cognitiveScore must be a valid integer', code: 'INVALID_COGNITIVE_SCORE' },
        { status: 400 }
      );
    }

    const physicalScoreInt = parseInt(physicalScore);
    if (isNaN(physicalScoreInt)) {
      return NextResponse.json(
        { error: 'physicalScore must be a valid integer', code: 'INVALID_PHYSICAL_SCORE' },
        { status: 400 }
      );
    }

    const digitalScoreInt = parseInt(digitalScore);
    if (isNaN(digitalScoreInt)) {
      return NextResponse.json(
        { error: 'digitalScore must be a valid integer', code: 'INVALID_DIGITAL_SCORE' },
        { status: 400 }
      );
    }

    // Validate moodResult
    if (!VALID_MOOD_RESULTS.includes(moodResult)) {
      return NextResponse.json(
        {
          error: `moodResult must be one of: ${VALID_MOOD_RESULTS.join(', ')}`,
          code: 'INVALID_MOOD_RESULT',
        },
        { status: 400 }
      );
    }

    // Create new quiz result
    const newResult = await db
      .insert(quizResults)
      .values({
        userId: userIdInt,
        balanceScore: balanceScoreInt,
        moodResult: moodResult.trim(),
        cognitiveScore: cognitiveScoreInt,
        physicalScore: physicalScoreInt,
        digitalScore: digitalScoreInt,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newResult[0], { status: 201 });
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

    const idInt = parseInt(id);

    // Check if record exists
    const existing = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.id, idInt))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Quiz result not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      balanceScore,
      moodResult,
      cognitiveScore,
      physicalScore,
      digitalScore,
    } = body;

    const updates: Record<string, any> = {};

    // Validate and add balanceScore if provided
    if (balanceScore !== undefined && balanceScore !== null) {
      const balanceScoreInt = parseInt(balanceScore);
      if (isNaN(balanceScoreInt)) {
        return NextResponse.json(
          { error: 'balanceScore must be a valid integer', code: 'INVALID_BALANCE_SCORE' },
          { status: 400 }
        );
      }
      updates.balanceScore = balanceScoreInt;
    }

    // Validate and add moodResult if provided
    if (moodResult !== undefined) {
      if (!VALID_MOOD_RESULTS.includes(moodResult)) {
        return NextResponse.json(
          {
            error: `moodResult must be one of: ${VALID_MOOD_RESULTS.join(', ')}`,
            code: 'INVALID_MOOD_RESULT',
          },
          { status: 400 }
        );
      }
      updates.moodResult = moodResult.trim();
    }

    // Validate and add cognitiveScore if provided
    if (cognitiveScore !== undefined && cognitiveScore !== null) {
      const cognitiveScoreInt = parseInt(cognitiveScore);
      if (isNaN(cognitiveScoreInt)) {
        return NextResponse.json(
          { error: 'cognitiveScore must be a valid integer', code: 'INVALID_COGNITIVE_SCORE' },
          { status: 400 }
        );
      }
      updates.cognitiveScore = cognitiveScoreInt;
    }

    // Validate and add physicalScore if provided
    if (physicalScore !== undefined && physicalScore !== null) {
      const physicalScoreInt = parseInt(physicalScore);
      if (isNaN(physicalScoreInt)) {
        return NextResponse.json(
          { error: 'physicalScore must be a valid integer', code: 'INVALID_PHYSICAL_SCORE' },
          { status: 400 }
        );
      }
      updates.physicalScore = physicalScoreInt;
    }

    // Validate and add digitalScore if provided
    if (digitalScore !== undefined && digitalScore !== null) {
      const digitalScoreInt = parseInt(digitalScore);
      if (isNaN(digitalScoreInt)) {
        return NextResponse.json(
          { error: 'digitalScore must be a valid integer', code: 'INVALID_DIGITAL_SCORE' },
          { status: 400 }
        );
      }
      updates.digitalScore = digitalScoreInt;
    }

    // If no updates provided, return error
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    // Update the record
    const updated = await db
      .update(quizResults)
      .set(updates)
      .where(eq(quizResults.id, idInt))
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
      .from(quizResults)
      .where(eq(quizResults.id, idInt))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Quiz result not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the record
    const deleted = await db
      .delete(quizResults)
      .where(eq(quizResults.id, idInt))
      .returning();

    return NextResponse.json(
      {
        message: 'Quiz result deleted successfully',
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