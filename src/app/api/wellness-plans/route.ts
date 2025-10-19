import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wellnessPlans } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single record by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const plan = await db
        .select()
        .from(wellnessPlans)
        .where(eq(wellnessPlans.id, parseInt(id)))
        .limit(1);

      if (plan.length === 0) {
        return NextResponse.json(
          { error: 'Wellness plan not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(plan[0], { status: 200 });
    }

    // List with optional filtering by userId
    let query = db.select().from(wellnessPlans);

    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid user ID is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      query = query.where(eq(wellnessPlans.userId, parseInt(userId)));
    }

    const plans = await query.limit(limit).offset(offset);

    return NextResponse.json(plans, { status: 200 });
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
    const { userId, planData } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!planData) {
      return NextResponse.json(
        { error: 'Plan data is required', code: 'MISSING_PLAN_DATA' },
        { status: 400 }
      );
    }

    // Validate userId is valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'Valid user ID is required', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Validate planData is valid JSON object
    if (typeof planData !== 'object' || planData === null || Array.isArray(planData)) {
      return NextResponse.json(
        { error: 'Plan data must be a valid JSON object', code: 'INVALID_PLAN_DATA' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    const newPlan = await db
      .insert(wellnessPlans)
      .values({
        userId: parseInt(userId),
        planData,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    return NextResponse.json(newPlan[0], { status: 201 });
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
    const { planData } = body;

    // Check if plan exists
    const existingPlan = await db
      .select()
      .from(wellnessPlans)
      .where(eq(wellnessPlans.id, parseInt(id)))
      .limit(1);

    if (existingPlan.length === 0) {
      return NextResponse.json(
        { error: 'Wellness plan not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate planData if provided
    if (planData !== undefined) {
      if (typeof planData !== 'object' || planData === null || Array.isArray(planData)) {
        return NextResponse.json(
          { error: 'Plan data must be a valid JSON object', code: 'INVALID_PLAN_DATA' },
          { status: 400 }
        );
      }
    }

    const updates: { planData?: any; updatedAt: string } = {
      updatedAt: new Date().toISOString(),
    };

    if (planData !== undefined) {
      updates.planData = planData;
    }

    const updatedPlan = await db
      .update(wellnessPlans)
      .set(updates)
      .where(eq(wellnessPlans.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedPlan[0], { status: 200 });
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

    // Check if plan exists
    const existingPlan = await db
      .select()
      .from(wellnessPlans)
      .where(eq(wellnessPlans.id, parseInt(id)))
      .limit(1);

    if (existingPlan.length === 0) {
      return NextResponse.json(
        { error: 'Wellness plan not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedPlan = await db
      .delete(wellnessPlans)
      .where(eq(wellnessPlans.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Wellness plan deleted successfully',
        deletedPlan: deletedPlan[0],
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