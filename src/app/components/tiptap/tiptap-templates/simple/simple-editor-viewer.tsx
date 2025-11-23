"use client"

import { renderToHTMLString } from "@tiptap/static-renderer"
import type { SimpleEditorViewerProps } from "./types"
import { createEditorExtensions } from "./utils/extensions"

// --- Styles ---
import "@/app/components/tiptap/tiptap-templates/simple/simple-editor.scss"
import "@/app/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/app/components/tiptap/tiptap-node/code-block-node/code-block-node.scss"
import "@/app/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/app/components/tiptap/tiptap-node/list-node/list-node.scss"
import "@/app/components/tiptap/tiptap-node/image-node/image-node.scss"
import "@/app/components/tiptap/tiptap-node/heading-node/heading-node.scss"
import "@/app/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/app/components/tiptap/tiptap-node/figma-node/figma-node.scss"
import "@/app/components/tiptap/tiptap-node/youtube-node/youtube-node.scss"

// Highlight.js styles for syntax highlighting
import "highlight.js/styles/github.css"

/**
 * YouTube URL에서 embed URL 생성
 */
function getYouTubeEmbedUrl(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
  }

  // If we can't extract the video ID, try to use the URL as-is
  return url
}

/**
 * Figma URL에서 embed URL 생성
 */
function getFigmaEmbedUrl(url: string): string {
  // Figma file ID 추출
  const fileIdMatch = url.match(/figma\.com\/(file|proto)\/([a-zA-Z0-9]+)/)
  if (fileIdMatch && fileIdMatch[2]) {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
  }
  return url
}

/**
 * SimpleEditorViewer - 정적 리더기 컴포넌트
 * 에디터 인스턴스 없이 JSON 콘텐츠를 HTML로 렌더링합니다.
 */
export function SimpleEditorViewer({
  content,
  className = "",
}: SimpleEditorViewerProps) {
  // Extensions 생성 (이미지 업로드 핸들러는 필요 없음)
  const extensions = createEditorExtensions()

  // 커스텀 노드 매핑
  const nodeMapping = {
    youtube: ({ node }: { node: any }) => {
      const url = node.attrs?.url
      if (!url) {
        return '<div data-type="youtube">No YouTube URL provided</div>'
      }

      const embedUrl = getYouTubeEmbedUrl(url)
      const width = node.attrs?.width || "100%"
      const height = node.attrs?.height || "100%"

      return `
        <div class="tiptap-youtube-node" data-type="youtube">
          <div class="tiptap-youtube-node-embed">
            <iframe
              src="${embedUrl}"
              width="${width}"
              height="${height}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="YouTube Embed"
            ></iframe>
          </div>
        </div>
      `
    },
    figma: ({ node }: { node: any }) => {
      const url = node.attrs?.url
      if (!url) {
        return '<div data-type="figma">No Figma URL provided</div>'
      }

      const embedUrl = getFigmaEmbedUrl(url)

      return `
        <div class="tiptap-figma-node" data-type="figma">
          <div class="tiptap-figma-node-embed">
            <iframe
              src="${embedUrl}"
              width="100%"
              height="450"
              frameborder="0"
              allowfullscreen
              title="Figma Embed"
            ></iframe>
          </div>
        </div>
      `
    },
  }

  // Static Renderer를 사용하여 HTML 생성
  let html = ""
  try {
    html = renderToHTMLString({
      extensions,
      content,
      options: {
        nodeMapping,
      },
    })
  } catch (error) {
    console.error("Static render error:", error)
    html = '<div class="error">콘텐츠를 렌더링하는 중 오류가 발생했습니다.</div>'
  }

  return (
    <div
      className={`simple-editor-viewer ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

