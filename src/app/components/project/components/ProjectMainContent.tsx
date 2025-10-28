'use client';

import { useState, useMemo, useEffect } from 'react';
import type { ProjectDetailViewModel } from './types';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import 'lexical-rich-text-editor/lexical-rich-text-editor.css';
import { RichTextEditor } from 'lexical-rich-text-editor';
import DOMPurify from 'isomorphic-dompurify';
import projectContentEditHandler from '../services/content-edit-handler';
import projectEditPermissionChecker from '../services/projectEditPermissionChecker';

interface ProjectMainContentProps {
  project: ProjectDetailViewModel;
  hasEditPermission?: boolean;
}

const ProjectMainContent = ({
  project,
  hasEditPermission,
}: ProjectMainContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(project.detailDescription);

  // HTML을 정제하여 XSS 공격 방지
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(editedContent, {
      // 허용할 태그와 속성 지정
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'a',
        'ul',
        'ol',
        'li',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'code',
        'pre',
        'img',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'div',
        'span',
        'iframe',
      ],
      ALLOWED_ATTR: [
        'href',
        'target',
        'rel',
        'src',
        'alt',
        'title',
        'class',
        'style',
        'width',
        'height',
        'data-lexical-equation',
        'data-lexical-inline',
        'aria-hidden',
      ],
      // target="_blank" 링크에 자동으로 rel="noopener noreferrer" 추가
      ALLOW_DATA_ATTR: true,
      ADD_ATTR: ['target'],
    });
  }, [editedContent]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await projectContentEditHandler(project.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('프로젝트 내용 저장 중 오류 발생:', error);
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCancelClick = () => {
    setEditedContent(project.detailDescription); // 원래 내용으로 복원
    setIsEditing(false);
  };

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
            <RichTextEditor
              defaultData={editedContent}
              onChange={(data: string) => {
                setEditedContent(data);
              }}
            />
          </div>
        ) : (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}
      </section>
    </div>
  );
};

export default ProjectMainContent;
