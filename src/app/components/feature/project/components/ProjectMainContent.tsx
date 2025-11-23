'use client';

import { useState, useRef, useMemo } from 'react';
import type { ProjectDetailViewModel } from '@/services/project/types';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import { generateJSON } from '@tiptap/html';
import type { JSONContent } from '@tiptap/react';
import {
  SimpleEditor,
  SimpleEditorViewer,
  type SimpleEditorRef,
  createEditorExtensions,
} from '@/app/components/tiptap/tiptap-templates/simple';
import updateProjectContent from '@/services/project/updateProjectContent.client';

interface ProjectMainContentProps {
  project: ProjectDetailViewModel;
  hasEditPermission?: boolean;
}

const ProjectMainContent = ({ project, hasEditPermission }: ProjectMainContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<SimpleEditorRef>(null);
  
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

  const handleSaveClick = async () => {
    try {
      if (!editorRef.current) {
        alert('에디터 데이터를 가져올 수 없습니다.');
        return;
      }

      const data = editorRef.current.getData();
      // HTML로 변환하여 저장
      await updateProjectContent(project.id, data.html);
      setIsEditing(false);
      setEditedContentJson(null);
    } catch (error) {
      console.error('프로젝트 내용 저장 중 오류 발생:', error);
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
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
      {hasEditPermission && (
        <button
          className="absolute top-8 right-4"
          onClick={isEditing ? undefined : handleEditClick}
          aria-label={isEditing ? '저장 또는 취소' : '프로젝트 편집'}
        >
          {isEditing ? (
            <div className="flex gap-2">
              <IconCheck
                className="text-green-500 cursor-pointer"
                size={12}
                onClick={handleSaveClick}
              />
              <IconX
                className="text-red-500 cursor-pointer"
                size={12}
                onClick={handleCancelClick}
              />
            </div>
          ) : (
            <IconPencil className="text-gray-footer" size={12} />
          )}
        </button>
      )}
      <section
        className={`flex-1 w-full ${
          isEditing ? 'p-3 pt-6' : 'px-[4.7rem] pt-[4.5rem]'
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
            />
          </div>
        ) : (
          <div className="prose max-w-none">
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
