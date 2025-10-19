import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userMetrics, userStreaks, badges, dailyTasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    // Fetch data from all tables
    const [metricsData, streaksData, badgesData, tasksData] = await Promise.all([
      db.select().from(userMetrics).where(eq(userMetrics.userId, userId)),
      db.select().from(userStreaks).where(eq(userStreaks.userId, userId)).limit(1),
      db.select().from(badges).where(eq(badges.userId, userId)),
      db.select().from(dailyTasks).where(eq(dailyTasks.userId, userId)),
    ]);

    // Check if at least one table has data for this user
    const hasData =
      metricsData.length > 0 ||
      streaksData.length > 0 ||
      badgesData.length > 0 ||
      tasksData.length > 0;

    if (!hasData) {
      return NextResponse.json(
        {
          error: 'No dashboard data found for this user',
          code: 'USER_DATA_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Construct response object
    const dashboardData = {
      userId: userId,
      metrics: metricsData,
      streaks: streaksData.length > 0 ? streaksData[0] : null,
      badges: badgesData,
      tasks: tasksData,
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error('GET dashboard error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}