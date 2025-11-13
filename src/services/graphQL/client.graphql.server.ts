import { createClient } from '@/services/supabase/server';
import type { GraphQLResponse } from './types.graphql';

/**
 * Supabase GraphQL 서버 클라이언트
 */
export class SupabaseGraphQLServerClient {
  private supabase: Awaited<ReturnType<typeof createClient>>;
  private graphqlEndpoint: string;

  constructor(supabase: Awaited<ReturnType<typeof createClient>>) {
    this.supabase = supabase;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
    }
    // URL 끝의 슬래시 제거
    const cleanUrl = supabaseUrl.replace(/\/$/, '');
    this.graphqlEndpoint = `${cleanUrl}/graphql/v1`;
  }

  /**
   * GraphQL 쿼리 실행
   */
  async executeQuery<T = unknown>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<GraphQLResponse<T>> {
    return this.execute<T>(query, variables);
  }

  /**
   * GraphQL Mutation 실행
   */
  async executeMutation<T = unknown>(
    mutation: string,
    variables: Record<string, unknown>,
  ): Promise<GraphQLResponse<T>> {
    return this.execute<T>(mutation, variables);
  }

  /**
   * 실제 GraphQL 요청 실행
   */
  private async execute<T>(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<GraphQLResponse<T>> {
    try {
      // Supabase 세션 토큰 가져오기
      const {
        data: { session },
      } = await this.supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session found');
      }

      console.log('GraphQL Request:', {
        endpoint: this.graphqlEndpoint,
        query: query.substring(0, 200) + '...',
        variables,
        hasSession: !!session,
      });

      // GraphQL 요청
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      console.log('GraphQL Response:', {
        hasData: !!result.data,
        hasErrors: !!result.errors,
        errorCount: result.errors?.length || 0,
      });

      // GraphQL 에러 처리
      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL Errors:', result.errors);
        console.error(
          'Full error details:',
          JSON.stringify(result.errors, null, 2),
        );
        throw new Error(result.errors[0].message);
      }

      return result;
    } catch (error) {
      console.error('GraphQL execution error:', error);
      throw error;
    }
  }

  /**
   * 배치 쿼리 실행 (여러 쿼리를 한 번에)
   */
  async executeBatch(
    queries: { query: string; variables?: Record<string, unknown> }[],
  ): Promise<GraphQLResponse<unknown>[]> {
    const promises = queries.map((q) => this.execute(q.query, q.variables));
    return Promise.all(promises);
  }
}

/**
 * GraphQL 서버 클라이언트 인스턴스 생성
 */
export async function createGraphQLServerClient() {
  const supabase = await createClient();
  return new SupabaseGraphQLServerClient(supabase);
}

/**
 * 편의 함수: 쿼리 실행 (서버용)
 */
export async function executeQueryServer<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const client = await createGraphQLServerClient();
  const response = await client.executeQuery<T>(query, variables);
  return response.data as T;
}

/**
 * 편의 함수: Mutation 실행 (서버용)
 */
export async function executeMutationServer<T = unknown>(
  mutation: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const client = await createGraphQLServerClient();
  const response = await client.executeMutation<T>(mutation, variables);
  return response.data as T;
}

