import type { Extension } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { ImageResize } from "tiptap-extension-resize-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { HorizontalRule } from "@tiptap/extension-horizontal-rule"
import { createLowlight } from "lowlight"
import { ImageUploadNode } from "@/app/components/tiptap/tiptap-node/image-upload-node"
import { YoutubeNode } from "@/app/components/tiptap/tiptap-node/youtube-node"
import { FigmaNode } from "@/app/components/tiptap/tiptap-node/figma-node"
import { CodeBlockNode } from "@/app/components/tiptap/tiptap-node/code-block-node/code-block-node"
import { LinkCardNode } from "@/app/components/tiptap/tiptap-node/link-card-node/link-card-node"

// Register common languages for code highlighting
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

// Create lowlight instance and register languages
const lowlight = createLowlight()

lowlight.register("javascript", javascript)
lowlight.register("typescript", typescript)
lowlight.register("css", css)
lowlight.register("html", html)
lowlight.register("xml", html) // xml uses same as html
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
 * Image upload handler type
 */
export interface ImageUploadHandler {
  (file: File, onProgress?: (event: { progress: number }) => void, abortSignal?: AbortSignal): Promise<string>
}

/**
 * Options for creating editor extensions
 */
export interface CreateEditorExtensionsOptions {
  /**
   * Image upload handler
   * @default undefined (ImageUploadNode가 비활성화됨)
   */
  imageUploadHandler?: ImageUploadHandler

  /**
   * Maximum file size for image upload (in bytes)
   * @default 5MB
   */
  maxFileSize?: number

  /**
   * Maximum number of images that can be uploaded
   * @default 3
   */
  maxImageLimit?: number

  /**
   * Error handler for image upload
   * @default console.error
   */
  onImageUploadError?: (error: Error) => void
}

/**
 * Create Tiptap extensions for SimpleEditor
 * @param options - Extension configuration options
 * @returns Array of Tiptap extensions
 */
export function createEditorExtensions(
  options: CreateEditorExtensionsOptions = {}
): Extension[] {
  const {
    imageUploadHandler,
    maxFileSize = 5 * 1024 * 1024, // 5MB
    maxImageLimit = 3,
    onImageUploadError = (error) => console.error("Upload failed:", error),
  } = options

  const extensions: Extension[] = [
    StarterKit.configure({
      horizontalRule: false,
      codeBlock: false, // CodeBlockLowlight로 대체
      link: {
        openOnClick: false,
        enableClickSelection: true,
      },
    }),
    CodeBlockLowlight.extend({
      draggable: true,
      addNodeView() {
        return ReactNodeViewRenderer(CodeBlockNode)
      },
    }).configure({
      lowlight,
    }) as Extension,
    YoutubeNode as Extension,
    HorizontalRule as Extension,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList as Extension,
    TaskItem.configure({ nested: true }) as Extension,
    Highlight.configure({ multicolor: true }) as Extension,
    ImageResize as Extension,
    Typography as Extension,
    Superscript as Extension,
    Subscript as Extension,
    Selection as Extension,
    FigmaNode as Extension,
    LinkCardNode as Extension,
  ]

  // ImageUploadNode는 upload handler가 제공된 경우에만 추가
  if (imageUploadHandler) {
    extensions.push(
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: maxFileSize,
        limit: maxImageLimit,
        upload: imageUploadHandler,
        onError: onImageUploadError,
      }) as Extension
    )
  }

  return extensions
}

