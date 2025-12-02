import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedPortfolioData } from '@/services/portfolio/getPaginatedPortfolioData.server';

// 1시간 동안 캐시 (포트폴리오 데이터는 자주 변경되지 않음)
export const revalidate = 3600;

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
    
    // 캐시 헤더 추가
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error in paginated portfolio API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
