import type { JSONContent } from "@tiptap/react"
import type { ImageUploadHandler } from "./utils/extensions"

/**
 * SimpleEditor 컴포넌트의 props
 */
export interface SimpleEditorProps {
  /**
   * 초기 콘텐츠 (JSON 형식)
   * @default undefined (기본 콘텐츠 사용)
   */
  initialContent?: JSONContent

  /**
   * 콘텐츠가 변경될 때 호출되는 콜백
   * @param content - 변경된 콘텐츠 (JSON 형식)
   */
  onChange?: (content: JSONContent) => void

  /**
   * 콘텐츠가 업데이트될 때 호출되는 콜백
   * HTML과 JSON 모두 제공
   * @param content - 업데이트된 콘텐츠 (HTML과 JSON)
   */
  onUpdate?: (content: { html: string; json: JSONContent }) => void

  /**
   * 이미지 업로드 핸들러
   * @default handleImageUpload from @/utils/lib/tiptap-utils
   */
  imageUploadHandler?: ImageUploadHandler
}

/**
 * SimpleEditor ref를 통해 접근 가능한 메서드
 */
export interface SimpleEditorRef {
  /**
   * 현재 에디터의 콘텐츠를 반환
   * @returns HTML 문자열과 JSON 콘텐츠
   */
  getData: () => { html: string; json: JSONContent }
}

/**
 * SimpleEditorViewer 컴포넌트의 props
 */
export interface SimpleEditorViewerProps {
  /**
   * 표시할 콘텐츠 (JSON 형식)
   */
  content: JSONContent

  /**
   * 추가 CSS 클래스명
   */
  className?: string
}

