'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectDetailViewModel } from '@/services/project/types';
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
import updateProjectContent from '@/services/project/updateProjectContent.client';
import { useToast } from '@/app/components/toast/ToastContext';

interface ProjectMainContentProps {
  project: ProjectDetailViewModel;
  hasEditPermission?: boolean;
}

const ProjectMainContent = ({ project, hasEditPermission }: ProjectMainContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<SimpleEditorRef>(null);
  const { showToast } = useToast();
  const router = useRouter();

  // HTML을 JSON으로 변환 (초기 콘텐츠 및 편집 취소 시 사용)
  const initialContent = useMemo<JSONContent | undefined>(() => {
    if (!project.detailDescription) return undefined;

    try {
      const extensions = createEditorExtensions();
      const json = generateJSON(project.detailDescription, extensions);
      return json;
    } catch (error) {
      console.error('HTML to JSON conversion failed:', error);
      return undefined;
    }
  }, [project.detailDescription]);

  const [editedContentJson, setEditedContentJson] = useState<JSONContent | null>(null);

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

      // project_html_description에 저장
      const result = await updateProjectContent(project.id, staticHTML);

      if (!result.success) {
        // console.error('프로젝트 내용 저장 실패:', result.error);
        showToast(
          result.error?.message || '저장에 실패했습니다.',
          'error'
        );
        return;
      }

      showToast('프로젝트 내용이 저장되었습니다.', 'success');
      setIsEditing(false);
      setEditedContentJson(null);
      router.refresh();
    } catch (error) {
      console.error('프로젝트 내용 저장 중 오류 발생:', error);
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
        <button
          className="absolute top-8 right-4"
          onClick={handleEditClick}
          aria-label="프로젝트 편집"
        >
          <IconPencil className="text-gray-footer" size={12} />
        </button>
      )}
      <section
        className={`flex-1 w-full ${
          isEditing ? 'pt-6' : 'pt-[4.5rem]'
        } mobile:px-0`}
      >
        {isEditing ? (
          <div>
            <SimpleEditor
              ref={editorRef}
              initialContent={editedContentJson || initialContent}
              onChange={(json: JSONContent) => {
                setEditedContentJson(json);
              }}
              onSave={handleSaveClick}
              onCancel={handleCancelClick}
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

export default ProjectMainContent;
