import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { familyMembers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single family member by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const familyMember = await db
        .select()
        .from(familyMembers)
        .where(eq(familyMembers.id, parseInt(id)))
        .limit(1);

      if (familyMember.length === 0) {
        return NextResponse.json(
          { error: 'Family member not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(familyMember[0], { status: 200 });
    }

    // List family members with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const familyGroupId = searchParams.get('familyGroupId');
    const userId = searchParams.get('userId');

    let query = db.select().from(familyMembers);

    // Apply filters
    const conditions = [];
    if (familyGroupId) {
      conditions.push(eq(familyMembers.familyGroupId, familyGroupId));
    }
    if (userId) {
      const userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(familyMembers.userId, userIdInt));
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
    const { familyGroupId, userId } = body;

    // Validate required fields
    if (!familyGroupId) {
      return NextResponse.json(
        { error: 'familyGroupId is required', code: 'MISSING_FAMILY_GROUP_ID' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
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
    const sanitizedFamilyGroupId = familyGroupId.toString().trim();

    // Create new family member
    const newFamilyMember = await db
      .insert(familyMembers)
      .values({
        familyGroupId: sanitizedFamilyGroupId,
        userId: userIdInt,
        joinedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newFamilyMember[0], { status: 201 });
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

    const idInt = parseInt(id);

    // Check if family member exists
    const existing = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.id, idInt))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Family member not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { familyGroupId } = body;

    // Prepare update data
    const updates: any = {};

    if (familyGroupId !== undefined) {
      updates.familyGroupId = familyGroupId.toString().trim();
    }

    // Only update if there are changes
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing[0], { status: 200 });
    }

    // Update family member
    const updated = await db
      .update(familyMembers)
      .set(updates)
      .where(eq(familyMembers.id, idInt))
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

    const idInt = parseInt(id);

    // Check if family member exists
    const existing = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.id, idInt))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Family member not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete family member
    const deleted = await db
      .delete(familyMembers)
      .where(eq(familyMembers.id, idInt))
      .returning();

    return NextResponse.json(
      {
        message: 'Family member deleted successfully',
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