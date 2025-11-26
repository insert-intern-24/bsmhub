'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { renderToHTMLString } from '@tiptap/static-renderer';
import type { EditorView } from '@tiptap/pm/view';

// --- Types ---
import type { SimpleEditorProps, SimpleEditorRef } from './types';

// --- Extensions ---
import { createEditorExtensions } from './utils/extensions';

// --- UI Primitives ---
import { Button } from '@/app/components/tiptap/tiptap-ui-primitive/button';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/app/components/tiptap/tiptap-ui-primitive/toolbar';

// --- Tiptap Node Styles ---
import '@/app/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/app/components/tiptap/tiptap-node/code-block-node/code-block-node.scss';
import '@/app/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import '@/app/components/tiptap/tiptap-node/list-node/list-node.scss';
import '@/app/components/tiptap/tiptap-node/image-node/image-node.scss';
import '@/app/components/tiptap/tiptap-node/heading-node/heading-node.scss';
import '@/app/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/app/components/tiptap/tiptap-node/figma-node/figma-node.scss';
import '@/app/components/tiptap/tiptap-node/youtube-node/youtube-node.scss';
import '@/app/components/tiptap/tiptap-node/link-card-node/link-card.scss';

// Highlight.js styles for syntax highlighting
// Using a theme that works well in both light and dark modes
import 'highlight.js/styles/github.css';

// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/app/components/tiptap/tiptap-ui/heading-dropdown-menu';
import { ImageUploadButton } from '@/app/components/tiptap/tiptap-ui/image-upload-button';
import { FigmaButton } from '@/app/components/tiptap/tiptap-ui/figma-button';
import { YoutubeButton } from '@/app/components/tiptap/tiptap-ui/youtube-button';
import { ListDropdownMenu } from '@/app/components/tiptap/tiptap-ui/list-dropdown-menu';
import { BlockquoteButton } from '@/app/components/tiptap/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '@/app/components/tiptap/tiptap-ui/code-block-button';
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from '@/app/components/tiptap/tiptap-ui/color-highlight-popover';
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from '@/app/components/tiptap/tiptap-ui/link-popover';
import { MarkButton } from '@/app/components/tiptap/tiptap-ui/mark-button';
import { TextAlignButton } from '@/app/components/tiptap/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/app/components/tiptap/tiptap-ui/undo-redo-button';

// --- Icons ---
import { ArrowLeftIcon } from '@/app/components/tiptap/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@/app/components/tiptap/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@/app/components/tiptap/tiptap-icons/link-icon';
import { SaveIcon } from '@/app/components/tiptap/tiptap-icons/save-icon';
import { CloseIcon } from '@/app/components/tiptap/tiptap-icons/close-icon';

// --- Hooks ---
import { useIsBreakpoint } from '@/utils/hook/tiptap/use-is-breakpoint';
import { useCursorVisibility } from '@/utils/hook/tiptap/use-cursor-visibility';

// --- Components ---
// import { ThemeToggle } from "@/app/components/tiptap/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload } from '@/utils/lib/tiptap-utils';
import { MAX_FILE_SIZE } from '@/shared/constants/upload';

// --- Styles ---
import '@/app/components/tiptap/tiptap-templates/simple/simple-editor.scss';

import defaultContent from '@/app/components/tiptap/tiptap-templates/simple/data/content.json';

// --- 상수 ---
// 로딩 플레이스홀더 이미지 (URL 인코딩된 인라인 SVG - 유니코드 지원)
const LOADING_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="#f3f4f6" width="200" height="150"/><text x="100" y="70" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="14">업로드 중...</text><circle cx="100" cy="100" r="8" fill="none" stroke="#6b7280" stroke-width="2" stroke-dasharray="25" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="1s" repeatCount="indefinite"/></circle></svg>`,
)}`;

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onSave,
  onCancel,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={['bulletList', 'orderedList', 'taskList']}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
        <YoutubeButton text="YouTube" />
        <FigmaButton text="Figma" />
      </ToolbarGroup>

      {isMobile && <ToolbarSeparator />}

      {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}

      {(onSave || onCancel) && (
        <>
          <ToolbarSeparator />
          <ToolbarGroup>
            {onSave && (
              <Button data-style="ghost" onClick={onSave} title="저장">
                <SaveIcon className="tiptap-button-icon" />
                {!isMobile && <span>저장</span>}
              </Button>
            )}
            {onCancel && (
              <Button data-style="ghost" onClick={onCancel} title="취소">
                <CloseIcon className="tiptap-button-icon" />
                {!isMobile && <span>취소</span>}
              </Button>
            )}
          </ToolbarGroup>
        </>
      )}
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link';
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

export const SimpleEditor = forwardRef<SimpleEditorRef, SimpleEditorProps>(
  function SimpleEditor(
    {
      initialContent,
      onChange,
      onUpdate,
      imageUploadHandler,
      onSave,
      onCancel,
    },
    ref,
  ) {
    const isMobile = useIsBreakpoint();
    const [mobileView, setMobileView] = useState<
      'main' | 'highlighter' | 'link'
    >('main');
    const toolbarRef = useRef<HTMLDivElement>(null);
    const initialContentRef = useRef(initialContent || defaultContent);
    
    // 언마운트 상태 추적 (비동기 업로드 완료 후 상태 업데이트 방지)
    const isMountedRef = useRef(true);
    
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    // Extensions 생성 (imageUploadHandler가 있으면 포함)
    const extensions = createEditorExtensions({
      imageUploadHandler: imageUploadHandler || handleImageUpload,
      maxFileSize: MAX_FILE_SIZE,
      maxImageLimit: 3,
      onImageUploadError: (error) => console.error('Upload failed:', error),
    });

    // 이미지 업로드 핸들러 참조 (paste 핸들러에서 사용)
    const uploadHandler = imageUploadHandler || handleImageUpload;

    /**
     * 이미지 파일 유효성 검사
     * 파일 크기 제한을 검증
     */
    const validateImageFiles = useCallback((files: File[]): File[] => {
      // 파일 크기 초과 이미지 필터링
      return files.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`파일 크기가 제한을 초과했습니다: ${file.name}`);
          }
          window.alert(`파일 크기가 제한을 초과했습니다: ${file.name} (최대 ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB)`);
          return false;
        }
        return true;
      });
    }, []);

    /**
     * 이미지 업로드 및 삽입 공통 함수
     * 플레이스홀더 삽입, 업로드, 성공/실패 처리 로직을 통합
     */
    const uploadAndInsertImage = useCallback((
      view: EditorView,
      file: File,
      index: number,
      position?: number | null,
    ) => {
      // 고유 placeholderId 생성 (인덱스 포함하여 충돌 방지)
      const placeholderId = `upload-${Date.now()}-${index}-${Math.random()
        .toString(36)
        .slice(2)}`;
      const filename = file.name?.replace(/\.[^/.]+$/, '') || 'image';

      // 로딩 플레이스홀더 이미지 삽입
      const imageNode = view.state.schema.nodes.image.create({
        src: LOADING_PLACEHOLDER,
        alt: filename,
        title: placeholderId, // 임시로 ID 저장
      });

      if (position !== null && position !== undefined) {
        // 드롭 위치에 삽입
        view.dispatch(view.state.tr.insert(position, imageNode));
      } else {
        // 현재 선택 위치에 삽입
        view.dispatch(view.state.tr.replaceSelectionWith(imageNode));
      }

      // 비동기로 업로드
      uploadHandler(file)
        .then((url) => {
          // 언마운트된 경우 상태 업데이트 방지
          if (!isMountedRef.current) return;
          if (!url) return;

          // 플레이스홀더 찾아서 실제 URL로 교체
          const { state } = view;
          let placeholderPos: number | null = null;

          state.doc.descendants((node, pos) => {
            if (
              node.type.name === 'image' &&
              node.attrs.title === placeholderId
            ) {
              placeholderPos = pos;
              return false;
            }
            return true;
          });

          if (placeholderPos !== null) {
            view.dispatch(
              view.state.tr.setNodeMarkup(placeholderPos, undefined, {
                src: url,
                alt: filename,
                title: '',
              }),
            );
          } else {
            // 플레이스홀더를 찾을 수 없는 경우 사용자 알림
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[SimpleEditor] 플레이스홀더(${placeholderId})를 찾을 수 없습니다. 파일명: ${filename}`,
              );
            }
            window.alert(
              '이미지 업로드는 완료되었으나, 에디터에 삽입되지 않았습니다. 다시 시도해주세요.',
            );
          }
        })
        .catch((error) => {
          // 언마운트된 경우 상태 업데이트 방지
          if (!isMountedRef.current) return;

          if (process.env.NODE_ENV === 'development') {
            console.error('이미지 업로드 실패:', error);
          }
          window.alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');

          // 실패 시 플레이스홀더 제거
          const { state } = view;
          let placeholderPos: number | null = null;
          let nodeSize = 0;

          state.doc.descendants((node, pos) => {
            if (
              node.type.name === 'image' &&
              node.attrs.title === placeholderId
            ) {
              placeholderPos = pos;
              nodeSize = node.nodeSize;
              return false;
            }
            return true;
          });

          if (placeholderPos !== null) {
            view.dispatch(
              view.state.tr.delete(placeholderPos, placeholderPos + nodeSize),
            );
          }
        });
    }, [uploadHandler]);

    const editor = useEditor({
      immediatelyRender: false,
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          'aria-label': 'Main content area, start typing to enter text.',
          class: 'simple-editor',
        },
        // 이미지 붙여넣기 시 blob URL 대신 실제 업로드 후 URL 사용
        handlePaste: (view, event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;

          // 클립보드에서 이미지 파일 찾기
          const imageFiles: File[] = [];
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) {
                imageFiles.push(file);
              }
            }
          }

          // 이미지 파일이 없으면 기본 동작 수행
          if (imageFiles.length === 0) return false;

          // 파일 크기 및 개수 검증
          const validImageFiles = validateImageFiles(imageFiles);
          if (validImageFiles.length === 0) return false;

          // 이미지 파일이 있으면 업로드 후 삽입
          event.preventDefault();

          // 각 이미지에 대해 플레이스홀더 삽입 후 업로드
          validImageFiles.forEach((file, index) => {
            uploadAndInsertImage(view, file, index, null);
          });

          return true;
        },
        // 이미지 드롭 시에도 업로드 처리
        handleDrop: (view, event, _slice, moved) => {
          // 에디터 내부 이동이면 기본 동작 수행
          if (moved) return false;

          const files = event.dataTransfer?.files;
          if (!files || files.length === 0) return false;

          // 이미지 파일 필터링
          const imageFiles: File[] = [];
          for (const file of files) {
            if (file.type.startsWith('image/')) {
              imageFiles.push(file);
            }
          }

          if (imageFiles.length === 0) return false;

          // 파일 크기 및 개수 검증
          const validImageFiles = validateImageFiles(imageFiles);
          if (validImageFiles.length === 0) return false;

          event.preventDefault();

          // 드롭 위치 계산
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          if (!coordinates) return false;

          // 각 이미지에 대해 플레이스홀더 삽입 후 업로드
          // 여러 이미지를 드롭할 때 위치를 순차적으로 조정
          let insertPos = coordinates.pos;
          validImageFiles.forEach((file, index) => {
            uploadAndInsertImage(view, file, index, insertPos);
            // 다음 이미지 위치 조정 (이미지 노드 크기만큼 증가)
            insertPos += 1;
          });

          return true;
        },
      },
      onUpdate: ({ editor }) => {
        const json = editor.getJSON();
        const html = editor.getHTML();

        // onChange 콜백 호출
        onChange?.(json);

        // onUpdate 콜백 호출
        onUpdate?.({ html, json });

        // Static Renderer를 사용하여 HTML 생성 (개발 환경에서만 디버깅용)
        if (process.env.NODE_ENV === 'development') {
          try {
            const staticHTML = renderToHTMLString({
              extensions,
              content: json,
            });
            console.log('Static Rendered HTML:', staticHTML);
          } catch (error) {
            console.error('Static render error:', error);
          }
        }
      },
      extensions,
      content: initialContent || defaultContent,
    });

    // ref를 통해 getData 메서드 제공
    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          if (!editor) {
            return { html: '', json: { type: 'doc', content: [] } };
          }
          return {
            html: editor.getHTML(),
            json: editor.getJSON(),
          };
        },
      }),
      [editor],
    );

    useCursorVisibility({
      editor,
      overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    });

    useEffect(() => {
      if (!isMobile && mobileView !== 'main') {
        setMobileView('main');
      }
    }, [isMobile, mobileView]);

    // 저장 핸들러
    const handleSave = () => {
      if (!editor) return;

      const html = editor.getHTML();
      const json = editor.getJSON();

      onSave?.({ html, json });
    };

    // 취소 핸들러 - 초기 상태로 복원
    const handleCancel = () => {
      if (!editor) return;

      editor.commands.setContent(initialContentRef.current);
      onCancel?.();
    };

    return (
      <div className="simple-editor-wrapper">
        <EditorContext.Provider value={{ editor }}>
          <div className="simple-editor-container">
            <Toolbar ref={toolbarRef} data-variant="fixed">
              {mobileView === 'main' ? (
                <MainToolbarContent
                  onHighlighterClick={() => setMobileView('highlighter')}
                  onLinkClick={() => setMobileView('link')}
                  onSave={onSave ? handleSave : undefined}
                  onCancel={onCancel ? handleCancel : undefined}
                  isMobile={isMobile}
                />
              ) : (
                <MobileToolbarContent
                  type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
                  onBack={() => setMobileView('main')}
                />
              )}
            </Toolbar>

            <EditorContent
              editor={editor}
              role="presentation"
              className="simple-editor-content"
            />
          </div>
        </EditorContext.Provider>
      </div>
    );
  },
);
