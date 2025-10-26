import { createClient } from '@/utils/supabase/client';

export default async function projectContentEditHandler(
  project_id: number,
  content: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('project_html_description')
    .update({ html_content: content } as never)
    .eq('project_id', project_id);
  if (error) {
    console.error('프로젝트 내용 업데이트 실패:', error);
  } else {
    console.log('프로젝트 내용이 성공적으로 업데이트되었습니다.');
  }
}
