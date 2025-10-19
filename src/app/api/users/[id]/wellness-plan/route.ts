import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wellnessPlans, wellnessGoals } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const userId = parseInt(id);

    // Fetch the most recent wellness plan for the user
    const planResult = await db
      .select()
      .from(wellnessPlans)
      .where(eq(wellnessPlans.userId, userId))
      .orderBy(desc(wellnessPlans.createdAt))
      .limit(1);

    // Fetch all wellness goals for the user
    const goalsResult = await db
      .select()
      .from(wellnessGoals)
      .where(eq(wellnessGoals.userId, userId));

    // Check if wellness plan exists
    if (planResult.length === 0) {
      return NextResponse.json(
        {
          error: 'Wellness plan not found for this user',
          code: 'PLAN_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Return combined data
    return NextResponse.json(
      {
        userId: userId,
        plan: planResult[0],
        goals: goalsResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET wellness plan error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}