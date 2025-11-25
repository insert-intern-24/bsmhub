import { FormConfig } from '@/app/components/ui/input/types/inputTypes';
import { ZodString } from 'zod';

/**
 * Config에서 Zod 스키마의 정규식을 가져와서 URL이 외부 링크인지 판단하는 함수
 * @param url - 확인할 URL
 * @param config - FormConfig 객체
 * @param fieldName - 링크 필드명 (예: 'project_link', 'profile_link')
 * @returns 외부 링크인 경우 true, 내부 링크인 경우 false
 */
export const isExternalLink = (
  url: string,
  config: FormConfig,
  fieldName: string,
): boolean => {
  // config에서 해당 필드 찾기
  const linkField = config.fields.find((field) => field.fieldName === fieldName);

  // inputList 타입인 경우 inputs 배열에서 'link' input 찾기
  if (linkField && linkField.type === 'inputList') {
    const linkInput = linkField.inputConfig.inputs.find(
      (input) => input.name === 'link',
    );

    // Zod 스키마에서 정규식 추출
    if (linkInput?.zodSchema) {
      const zodSchema = linkInput.zodSchema as ZodString;
      // Zod 스키마의 내부 구조에서 regex check 찾기
      const checks = zodSchema._def.checks as unknown as Array<{ kind: string; regex?: RegExp }>;
      const regexCheck = checks?.find((check) => check.kind === 'regex');
      
      if (regexCheck?.regex) {
        return regexCheck.regex.test(url);
      }
    }
  }

  // 기본 패턴: /로 시작하는 경우만 내부 링크
  // 그 외의 모든 경우는 외부 링크로 처리
  return !url.startsWith('/');
};

/**
 * 외부 링크 URL에 프로토콜을 추가하는 함수
 * @param url - URL
 * @returns 프로토콜이 포함된 URL
 */
export const normalizeExternalUrl = (url: string): string => {
  // 이미 프로토콜이 있으면 그대로 반환
  if (/^(https?:\/\/|\/\/)/i.test(url)) {
    return url;
  }

  // 프로토콜이 없으면 https:// 추가
  return `https://${url}`;
};

