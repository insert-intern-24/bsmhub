import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedPortfolioData } from '@/services/portfolio/getPaginatedPortfolioData.server';

// 데이터 캐싱은 getPaginatedPortfolioData 내부의 unstable_cache와 아래 Cache-Control 헤더로 처리합니다.
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
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
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
