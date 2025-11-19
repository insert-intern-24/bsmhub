import { FormConfig } from '@/app/components/ui/input/types/inputTypes';

/**
 * FormConfig의 사용자 정의 GraphQL Read Query 반환
 * @param formConfig - 폼 설정 객체
 * @returns GraphQL 쿼리 문자열
 */
export function buildReadQuery(formConfig: FormConfig): string {
  return formConfig.graphql.read;
}

/**
 * FormConfig의 사용자 정의 GraphQL Insert Mutation 반환
 */
export function buildInsertMutation(formConfig: FormConfig): string {
  return formConfig.graphql.insert;
}

/**
 * FormConfig의 사용자 정의 GraphQL Update Mutation 반환
 */
export function buildUpdateMutation(formConfig: FormConfig): string {
  return formConfig.graphql.update;
}

