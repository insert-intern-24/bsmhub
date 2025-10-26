'use client';

import { useState, useMemo } from 'react';
import type { ProjectDetailViewModel } from './types';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import 'lexical-rich-text-editor/lexical-rich-text-editor.css';
import { RichTextEditor } from 'lexical-rich-text-editor';
import DOMPurify from 'isomorphic-dompurify';
import projectContentEditHandler from '../services/content-edit-handler';

interface ProjectMainContentProps {
  project: ProjectDetailViewModel;
}

const ProjectMainContent = ({ project }: ProjectMainContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(project.detailDescription);
  
  // HTML을 정제하여 XSS 공격 방지
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(editedContent, {
      // 허용할 태그와 속성 지정
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote', 'code', 'pre',
        'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'iframe'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title',
        'class', 'style', 'width', 'height', 'data-lexical-equation', 'data-lexical-inline', 'aria-hidden'
      ],
      // target="_blank" 링크에 자동으로 rel="noopener noreferrer" 추가
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'],
    });
  }, [editedContent]);
  // const [RichTextEditorComponent, setRichTextEditorComponent] =
  // useState<React.FC | null>(null);

  // useEffect(() => {
  //   if (isEditing) {
  //     // 편집 모드일 때만 동적으로 라이브러리 임포트
  //     import('lexical-rich-text-editor')
  //       .then((module) =>
  //         setRichTextEditorComponent(() => module.RichTextEditor),
  //       )
  //       .catch((err) => console.error('Failed to load rich text editor:', err));
  //   }
  // }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // TODO: 저장 로직 구현 (예: API 호출로 내용 업데이트)
    projectContentEditHandler(project.id, editedContent);
    console.log('저장된 내용:', editedContent);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedContent(project.detailDescription); // 원래 내용으로 복원
    setIsEditing(false);
  };

  return (
    <div className="relative w-full h-full max-w-full">
      <button
        className="absolute top-8 right-4"
        onClick={isEditing ? undefined : handleEditClick}
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
      <main
        className={`flex-1 w-full ${
          isEditing ? 'p-3 pt-6' : 'px-[4.6875rem] pt-[4.5rem]'
        } mobile:px-0`}
      >
        {isEditing ? (
          <div>
            {/* {RichTextEditorComponent && ( */}
            <RichTextEditor
              defaultData={editedContent}
              onChange={(data: string) => {
                setEditedContent(data);
              }}
            />
            {/* )} */}
          </div>
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          // <Markdown options={markdownOptions}>{editedContent}</Markdown>
        )}
      </main>
    </div>
  );
};

export default ProjectMainContent;
