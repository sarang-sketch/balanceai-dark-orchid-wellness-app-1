import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizResponses, quizResults } from '@/db/schema';

interface QuizResponse {
  questionId: string;
  answerIndex: number;
  category: string;
}

interface RequestBody {
  userId: number;
  responses: QuizResponse[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { userId, responses } = body;

    // Validate userId
    if (!userId || isNaN(parseInt(String(userId)))) {
      return NextResponse.json(
        { 
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate responses array
    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { 
          error: 'Responses must be an array',
          code: 'INVALID_RESPONSES_FORMAT' 
        },
        { status: 400 }
      );
    }

    if (responses.length === 0) {
      return NextResponse.json(
        { 
          error: 'Responses array cannot be empty',
          code: 'EMPTY_RESPONSES' 
        },
        { status: 400 }
      );
    }

    // Validate each response object
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      
      if (!response.questionId || typeof response.questionId !== 'string') {
        return NextResponse.json(
          { 
            error: `Response at index ${i} missing valid questionId`,
            code: 'INVALID_QUESTION_ID' 
          },
          { status: 400 }
        );
      }

      if (response.answerIndex === undefined || response.answerIndex === null || isNaN(parseInt(String(response.answerIndex)))) {
        return NextResponse.json(
          { 
            error: `Response at index ${i} missing valid answerIndex`,
            code: 'INVALID_ANSWER_INDEX' 
          },
          { status: 400 }
        );
      }

      if (!response.category || typeof response.category !== 'string') {
        return NextResponse.json(
          { 
            error: `Response at index ${i} missing valid category`,
            code: 'INVALID_CATEGORY' 
          },
          { status: 400 }
        );
      }
    }

    const timestamp = new Date().toISOString();

    // Calculate scores based on categories
    let cognitiveScore = 0;
    let physicalScore = 0;
    let digitalScore = 0;

    for (const response of responses) {
      const category = response.category.toLowerCase();
      
      if (category === 'cognitive') {
        cognitiveScore++;
      } else if (category === 'physical') {
        physicalScore++;
      } else if (category === 'digital') {
        digitalScore++;
      }
    }

    const balanceScore = cognitiveScore + physicalScore + digitalScore;

    // Determine mood result based on balance score
    let moodResult: string;
    if (balanceScore >= 15) {
      moodResult = 'Balanced';
    } else if (balanceScore >= 8) {
      moodResult = 'Needs Attention';
    } else {
      moodResult = 'Overloaded';
    }

    // Use transaction to ensure atomicity
    const savedResponses: any[] = [];
    let savedResult: any;

    try {
      // Save all quiz responses
      for (const response of responses) {
        const [savedResponse] = await db.insert(quizResponses)
          .values({
            userId: parseInt(String(userId)),
            questionId: response.questionId,
            answerIndex: parseInt(String(response.answerIndex)),
            category: response.category,
            createdAt: timestamp,
          })
          .returning();
        
        savedResponses.push(savedResponse);
      }

      // Save quiz result
      const [result] = await db.insert(quizResults)
        .values({
          userId: parseInt(String(userId)),
          balanceScore,
          moodResult,
          cognitiveScore,
          physicalScore,
          digitalScore,
          createdAt: timestamp,
        })
        .returning();

      savedResult = result;

    } catch (dbError) {
      console.error('Database transaction error:', dbError);
      return NextResponse.json(
        { 
          error: 'Failed to save quiz submission: ' + dbError,
          code: 'DATABASE_ERROR' 
        },
        { status: 500 }
      );
    }

    // Return the complete result
    return NextResponse.json(
      {
        result: savedResult,
        responses: savedResponses,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}