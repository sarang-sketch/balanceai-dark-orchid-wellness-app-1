import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { familyMembers, users, userStreaks, badges, quizResults } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { groupId: string } }
) {
  try {
    const groupId = context.params.groupId;

    // Validate groupId is provided
    if (!groupId || groupId.trim() === '') {
      return NextResponse.json(
        {
          error: 'Family group ID is required',
          code: 'MISSING_GROUP_ID',
        },
        { status: 400 }
      );
    }

    // Fetch all family members for this group
    const groupMembers = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.familyGroupId, groupId));

    // If no members found, return empty array with 200 status
    if (groupMembers.length === 0) {
      return NextResponse.json({
        familyGroupId: groupId,
        members: [],
      });
    }

    // Fetch detailed progress data for each member
    const membersWithProgress = await Promise.all(
      groupMembers.map(async (member) => {
        // Fetch user info
        const userInfo = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          })
          .from(users)
          .where(eq(users.id, member.userId))
          .limit(1);

        // Fetch user streak data
        const streakData = await db
          .select({
            currentStreak: userStreaks.currentStreak,
            longestStreak: userStreaks.longestStreak,
          })
          .from(userStreaks)
          .where(eq(userStreaks.userId, member.userId))
          .limit(1);

        // Fetch badge count
        const badgeCountResult = await db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(badges)
          .where(eq(badges.userId, member.userId));

        const badgeCount = badgeCountResult[0]?.count || 0;

        // Fetch most recent quiz result
        const recentQuizResult = await db
          .select({
            balanceScore: quizResults.balanceScore,
            moodResult: quizResults.moodResult,
            cognitiveScore: quizResults.cognitiveScore,
            physicalScore: quizResults.physicalScore,
            digitalScore: quizResults.digitalScore,
            createdAt: quizResults.createdAt,
          })
          .from(quizResults)
          .where(eq(quizResults.userId, member.userId))
          .orderBy(desc(quizResults.createdAt))
          .limit(1);

        return {
          id: member.id,
          userId: member.userId,
          joinedAt: member.joinedAt,
          user: userInfo[0] || {
            id: member.userId,
            name: 'Unknown User',
            email: '',
            avatarUrl: null,
          },
          progress: {
            currentStreak: streakData[0]?.currentStreak || 0,
            longestStreak: streakData[0]?.longestStreak || 0,
            badgeCount: badgeCount,
            lastQuizResult: recentQuizResult[0] || null,
          },
        };
      })
    );

    return NextResponse.json({
      familyGroupId: groupId,
      members: membersWithProgress,
    });
  } catch (error) {
    console.error('GET family group members error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}