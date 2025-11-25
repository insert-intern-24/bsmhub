export function convertToDatabaseImageURL(url: string): string {
  return url.replace(process.env.NEXT_PUBLIC_SUPABASE_URL!, '{{supabaseHost}}').replace(process.env.NEXT_PUBLIC_SUPABASE_INTERNAL_URL!, '{{supabaseHost}}');
}

export function convertFromDatabaseImageURL(url: string): string {
  // PostgreSQL 타입 캐스팅 문법 제거 (::text 등)
  let cleanedUrl = url.replace(/::\w+$/, '');
  // 작은따옴표 제거 (문자열 리터럴인 경우)
  cleanedUrl = cleanedUrl.replace(/^'|'$/g, '');

  const internalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_INTERNAL_URL?.replace(/\/$/, '') || '';
  const externalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || '';
  
  const excludedExtensions = ['.svg', '.ico', '.bmp'];
  const isExcluded = excludedExtensions.some(ext => cleanedUrl.toLowerCase().endsWith(ext));

  if(isExcluded) {
    cleanedUrl = cleanedUrl.replace('{{supabaseHost}}', externalSupabaseUrl);
  }else {
    // {{supabaseHost}}를 실제 URL로 변환
    cleanedUrl = cleanedUrl.replace('{{supabaseHost}}', internalSupabaseUrl);
  }
  
  // 이중 슬래시 제거 (http:// 또는 https:// 다음의 슬래시는 제외)
  cleanedUrl = cleanedUrl.replace(/([^:]\/)\/+/g, '$1');
  
  return cleanedUrl;
}

