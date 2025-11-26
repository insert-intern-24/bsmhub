/**
 * Supabase 쿠키 프리픽스 변환 유틸리티
 *
 * INTERNAL URL 사용 시, public URL (sb-bsmhub-*) 쿠키를
 * internal URL (sb-10-*) 형식으로 변환하여 사용합니다.
 *
 * 중요: sb-10-* 쿠키는 getAll에서 복제하여 반환만 하고,
 * 실제 쿠키로 저장하지 않습니다.
 */

export interface CookiePrefixes {
  publicPrefix: string;
  internalPrefix: string;
}

/**
 * Supabase URL에서 쿠키 프리픽스를 추출합니다.
 * @throws 환경 변수가 설정되지 않은 경우 에러 발생
 */
export function getCookiePrefixes(): CookiePrefixes {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const internalUrl = process.env.NEXT_PUBLIC_SUPABASE_INTERNAL_URL;

  if (!publicUrl || !internalUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_INTERNAL_URL must be set',
    );
  }

  const publicHost = new URL(publicUrl).host;
  const internalHost = new URL(internalUrl).host;

  return {
    publicPrefix: `sb-${publicHost.split('.')[0]}`,
    internalPrefix: `sb-${internalHost.split('.')[0]}`,
  };
}

/**
 * 쿠키 배열에서 public 프리픽스 쿠키를 internal 프리픽스로 복제하여 추가합니다.
 * 원본 배열을 수정하지 않고 새 배열을 반환합니다.
 *
 * @param cookies - 원본 쿠키 배열
 * @param prefixes - 쿠키 프리픽스 정보
 * @returns internal 프리픽스 쿠키가 복제된 새 배열
 */
export function duplicateCookiesForInternalUrl<
  T extends { name: string; value: string },
>(cookies: T[], prefixes: CookiePrefixes): T[] {
  const result = [...cookies];

  cookies.forEach((cookie) => {
    if (cookie.name.startsWith(prefixes.publicPrefix)) {
      result.push({
        ...cookie,
        name: prefixes.internalPrefix + cookie.name.slice(prefixes.publicPrefix.length),
      } as T);
    }
  });

  return result;
}

/**
 * internal 프리픽스 쿠키를 필터링합니다.
 * setAll에서 실제 쿠키 저장 시 internal 프리픽스 쿠키를 제외하기 위해 사용합니다.
 *
 * @param cookies - 저장할 쿠키 배열
 * @param prefixes - 쿠키 프리픽스 정보
 * @returns internal 프리픽스가 아닌 쿠키만 포함된 배열
 */
export function filterOutInternalPrefixCookies<
  T extends { name: string },
>(cookies: T[], prefixes: CookiePrefixes): T[] {
  return cookies.filter(
    (cookie) => !cookie.name.startsWith(prefixes.internalPrefix),
  );
}
