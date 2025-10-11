export function convertToDatabaseImageURL(url: string): string {
  return url.replace(process.env.NEXT_PUBLIC_SUPABASE_URL!, '{{supabaseHost}}');
}

export function convertFromDatabaseImageURL(url: string): string {
  return url.replace('{{supabaseHost}}', process.env.NEXT_PUBLIC_SUPABASE_URL!);
}
