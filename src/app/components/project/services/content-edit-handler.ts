import { createClient } from '@/utils/supabase/client';

export default function projectContentEditHandler(
  project_id: number,
  content: string,
) {
  const supabase = createClient();
  supabase
    .from('project_html_description')
    .update({ html_content: content })
    .eq('project_id', project_id)
    .then((response) => {
      if (response.error) {
        console.error('프로젝트 내용 업데이트 실패:', response.error);
      } else {
        console.log('프로젝트 내용이 성공적으로 업데이트되었습니다.');
      }
    });
}
