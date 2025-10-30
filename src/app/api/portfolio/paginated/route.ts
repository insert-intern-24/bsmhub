import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedPortfolioData } from '@/services/server/portfolio/getPaginatedPortfolioData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    // 유효성 검사
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid page or limit parameters' },
        { status: 400 }
      );
    }

    const result = await getPaginatedPortfolioData(page, limit);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in paginated portfolio API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
