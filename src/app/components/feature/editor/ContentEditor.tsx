'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IconPencil } from '@tabler/icons-react';
import { generateJSON } from '@tiptap/html';
import { renderToHTMLString } from '@tiptap/static-renderer';
import type { JSONContent } from '@tiptap/react';
import {
  SimpleEditor,
  SimpleEditorViewer,
  type SimpleEditorRef,
  createEditorExtensions,
} from '@/app/components/tiptap/tiptap-templates/simple';
import { useToast } from '@/app/components/toast/ToastContext';
import { handleImageUpload } from '@/utils/lib/tiptap-utils';
import RoundedButton from '@/app/components/ui/button/RoundedButton';

// Import update functions
import updateProjectContent from '@/services/project/updateProjectContent.client';
import updateProfileContent from '@/services/profile/updateProfileContent.client';

interface ContentEditorProps {
  contentType: 'project' | 'profile';
  id: number | string;
  initialHtmlContent?: string | null;
  hasEditPermission?: boolean;
}

const ContentEditor = ({
  contentType,
  id,
  initialHtmlContent,
  hasEditPermission,
}: ContentEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<SimpleEditorRef>(null);
  const { showToast } = useToast();
  const router = useRouter();

  // HTML을 JSON으로 변환 (초기 콘텐츠 및 편집 취소 시 사용)
  const initialContent = useMemo<JSONContent | undefined>(() => {
    if (!initialHtmlContent) return undefined;

    try {
      const extensions = createEditorExtensions();
      const json = generateJSON(initialHtmlContent, extensions);
      return json;
    } catch (error) {
      console.error('HTML to JSON conversion failed:', error);
      return undefined;
    }
  }, [initialHtmlContent]);

  const [editedContentJson, setEditedContentJson] =
    useState<JSONContent | null>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContentJson(initialContent || null);
  };

  const handleSaveClick = async (data: { html: string; json: JSONContent }) => {
    try {
      // Static Renderer를 사용하여 HTML 생성
      const extensions = createEditorExtensions();
      const staticHTML = renderToHTMLString({
        extensions,
        content: data.json,
      });

      // contentType에 따라 적절한 update 함수 호출
      let result;
      if (contentType === 'project') {
        result = await updateProjectContent(id as number, staticHTML);
      } else {
        result = await updateProfileContent(id as string, staticHTML);
      }

      if (!result.success) {
        showToast(result.error?.message || '저장에 실패했습니다.', 'error');
        return;
      }

      showToast(
        contentType === 'project'
          ? '프로젝트 내용이 저장되었습니다.'
          : '프로필 내용이 저장되었습니다.',
        'success',
      );
      // 낙관적 업데이트: 저장된 콘텐츠를 즉시 반영
      setEditedContentJson(data.json);
      setIsEditing(false);
      // 서버 컴포넌트가 있는 경우에만 refresh (선택적)
      // 낙관적 업데이트로 대부분의 경우 불필요하지만, 
      // 서버 컴포넌트에서 데이터를 가져오는 경우를 위해 주석 처리
      // router.refresh();
    } catch (error) {
      console.error('내용 저장 중 오류 발생:', error);
      showToast('저장 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleCancelClick = () => {
    setEditedContentJson(initialContent || null);
    setIsEditing(false);
  };

  // 읽기 모드용 콘텐츠 (JSON 또는 HTML에서 변환)
  const viewContent = useMemo<JSONContent | null>(() => {
    if (isEditing) return null;

    if (editedContentJson) {
      return editedContentJson;
    }

    return initialContent || null;
  }, [isEditing, editedContentJson, initialContent]);

  return (
    <div className="relative w-full h-full">
      {hasEditPermission && !isEditing && (
        <RoundedButton
          className="absolute top-8 right-0 !w-fit px-6 mobile:!w-full"
          onClick={handleEditClick}
          aria-label="내용 편집"
        >
          <IconPencil className="text-white" size={12} /> 설명 수정
        </RoundedButton>
      )}
      <section
        className={`flex-1 w-full ${
          isEditing
            ? 'pt-6'
            : contentType === 'project' || hasEditPermission
              ? 'pt-[4.5rem]'
              : ''
        } mobile:px-0`}
      >
        {isEditing ? (
          <div>
            <SimpleEditor
              ref={editorRef}
              initialContent={
                editedContentJson ||
                initialContent || { type: 'doc', content: [] }
              }
              onChange={(json: JSONContent) => {
                setEditedContentJson(json);
              }}
              onSave={handleSaveClick}
              onCancel={handleCancelClick}
              imageUploadHandler={handleImageUpload}
            />
          </div>
        ) : (
          <div className="max-w-none">
            {viewContent ? (
              <SimpleEditorViewer content={viewContent} />
            ) : (
              <p>자세한 설명 정보가 없습니다.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ContentEditor;
