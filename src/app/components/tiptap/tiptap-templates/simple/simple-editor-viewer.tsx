"use client"

import { useMemo } from "react"
import { renderToReactElement } from "@tiptap/static-renderer/pm/react"
import { Node as ProsemirrorNode } from "@tiptap/pm/model"
import { IconLink } from "@tabler/icons-react"
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
import "@/app/components/tiptap/tiptap-node/link-card-node/link-card.scss"

// Highlight.js styles for syntax highlighting
import "highlight.js/styles/github.css"
import { createLowlight } from "lowlight"
import { toHtml } from "hast-util-to-html"

// Import all languages for syntax highlighting
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import css from "highlight.js/lib/languages/css"
import html from "highlight.js/lib/languages/xml"
import json from "highlight.js/lib/languages/json"
import python from "highlight.js/lib/languages/python"
import java from "highlight.js/lib/languages/java"
import bash from "highlight.js/lib/languages/bash"
import sql from "highlight.js/lib/languages/sql"
import cpp from "highlight.js/lib/languages/cpp"
import c from "highlight.js/lib/languages/c"
import csharp from "highlight.js/lib/languages/csharp"
import go from "highlight.js/lib/languages/go"
import rust from "highlight.js/lib/languages/rust"
import php from "highlight.js/lib/languages/php"
import ruby from "highlight.js/lib/languages/ruby"
import swift from "highlight.js/lib/languages/swift"
import kotlin from "highlight.js/lib/languages/kotlin"
import scss from "highlight.js/lib/languages/scss"
import yaml from "highlight.js/lib/languages/yaml"
import shell from "highlight.js/lib/languages/shell"
import powershell from "highlight.js/lib/languages/powershell"
import markdown from "highlight.js/lib/languages/markdown"
import plaintext from "highlight.js/lib/languages/plaintext"

// Create and configure lowlight
const lowlight = createLowlight()
lowlight.register("javascript", javascript)
lowlight.register("typescript", typescript)
lowlight.register("css", css)
lowlight.register("html", html)
lowlight.register("xml", html)
lowlight.register("json", json)
lowlight.register("python", python)
lowlight.register("java", java)
lowlight.register("bash", bash)
lowlight.register("sql", sql)
lowlight.register("cpp", cpp)
lowlight.register("c", c)
lowlight.register("csharp", csharp)
lowlight.register("go", go)
lowlight.register("rust", rust)
lowlight.register("php", php)
lowlight.register("ruby", ruby)
lowlight.register("swift", swift)
lowlight.register("kotlin", kotlin)
lowlight.register("scss", scss)
lowlight.register("yaml", yaml)
lowlight.register("shell", shell)
lowlight.register("powershell", powershell)
lowlight.register("markdown", markdown)
lowlight.register("plaintext", plaintext)

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
 * Parse Figma URL to extract type and file key
 */
function parseFigmaUrl(url: string): { type: string; fileKey: string } | null {
  const regex = /figma\.com\/(design|board|proto|slides|deck|file)\/([a-zA-Z0-9]+)/
  const match = url.match(regex)
  
  if (match && match[1] && match[2]) {
    // Normalize 'file' to 'design'
    const type = match[1] === 'file' ? 'design' : match[1]
    return {
      type,
      fileKey: match[2]
    }
  }
  
  return null
}

/**
 * Figma URL에서 embed URL 생성
 */
function getFigmaEmbedUrl(url: string): string {
  const parsed = parseFigmaUrl(url)
  if (!parsed) {
    return url
  }
  
  const { type, fileKey } = parsed
  const params = new URLSearchParams({
    'embed-host': 'bsmhub',
    'page-selector': 'true',
    'viewport-controls': 'true',
    'footer': 'true',
    'theme': 'system'
  })
  
  return `https://embed.figma.com/${type}/${fileKey}?${params.toString()}`
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
  const extensions = useMemo(() => createEditorExtensions(), [])

  // 커스텀 노드 매핑 (useMemo로 최적화)
  const nodeMapping = useMemo(() => ({
    youtube: ({ node }: { node: ProsemirrorNode }) => {
      const url = node.attrs.url
      if (!url) {
        return <div data-type="youtube">No YouTube URL provided</div>
      }

      const embedUrl = getYouTubeEmbedUrl(url)
      const width = node.attrs.width || "100%"
      const height = node.attrs.height || "100%"

      return (
        <div className="tiptap-youtube-node" data-type="youtube">
          <div className="tiptap-youtube-node-embed">
            <iframe
              src={embedUrl}
              width={width}
              height={height}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Embed"
            ></iframe>
          </div>
        </div>
      )
    },
    figma: ({ node }: { node: ProsemirrorNode }) => {
      const url = node.attrs.url
      if (!url) {
        return <div data-type="figma">No Figma URL provided</div>
      }

      const embedUrl = getFigmaEmbedUrl(url)

      return (
        <div className="tiptap-figma-node" data-type="figma">
          <div className="tiptap-figma-node-embed">
            <iframe
              src={embedUrl}
              width="100%"
              height="450"
              frameBorder="0"
              allowFullScreen
              title="Figma Embed"
            ></iframe>
          </div>
        </div>
      )
    },
    linkCard: ({ node }: { node: ProsemirrorNode }) => {
      const { href, title, description, image } = node.attrs

      return (
        <div className="link-card-wrapper">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card"
          >
            <div className="link-card__content">
              <div className="link-card__title">{title || href}</div>
              <div className="link-card__description">{description}</div>
              <div className="link-card__url">
                <IconLink size={14} />
                {href ? new URL(href).hostname : ""}
              </div>
            </div>
            {image && (
              <div className="link-card__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={title || "Link preview"} />
              </div>
            )}
          </a>
        </div>
      )
    },
    codeBlock: ({ node }: { node: ProsemirrorNode }) => {
      const language = node.attrs.language || "plaintext"
      const code = node.textContent

      // Apply syntax highlighting using lowlight
      let highlightedHtml = ""
      try {
        const tree = lowlight.highlight(language, code)
        highlightedHtml = toHtml(tree)
      } catch {
        // If language is not supported, fall back to plain text
        highlightedHtml = code
      }

      return (
        <pre>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      )
    },
    taskItem: ({
      node,
      children,
    }: {
      node: ProsemirrorNode
      children?: React.ReactNode
    }) => {
      return (
        <li
          data-type="taskItem"
          data-checked={node.attrs.checked}
          className="flex items-start"
        >
          <label className="flex items-center select-none">
            <input
              type="checkbox"
              checked={node.attrs.checked}
              disabled
              className="checkbox"
            />
            <span />
          </label>
          <div className="flex-1 min-w-0">{children}</div>
        </li>
      )
    },
  }), [])

  // Static Renderer를 사용하여 React Element 생성
  let element: React.ReactNode = null
  try {
    element = renderToReactElement({
      extensions,
      content,
      options: {
        nodeMapping,
      },
    })
  } catch (error) {
    console.error("Static render error:", error)
    element = <div className="error">콘텐츠를 렌더링하는 중 오류가 발생했습니다.</div>
  }

  return (
    <div className={`simple-editor-viewer tiptap ProseMirror ${className}`}>
      {element}
    </div>
  )
}

