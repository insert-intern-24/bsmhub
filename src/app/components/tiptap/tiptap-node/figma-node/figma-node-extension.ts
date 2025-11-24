import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { FigmaNode as FigmaNodeComponent } from "@/app/components/tiptap/tiptap-node/figma-node/figma-node"

export interface FigmaNodeOptions {
  /**
   * HTML attributes to add to the figma iframe element.
   * @default {}
   */
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    figma: {
      /**
       * Insert a Figma embed
       */
      setFigma: (options: { url: string }) => ReturnType
    }
  }
}

/**
 * Extract Figma file ID from URL
 */
function extractFigmaFileId(url: string): string | null {
  // Match patterns like:
  // https://www.figma.com/file/{fileId}/...
  // https://www.figma.com/design/{fileId}/...
  // https://figma.com/file/{fileId}/...
  const patterns = [
    /figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/,
    /figma\.com\/file\/([a-zA-Z0-9]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Convert Figma URL to embed URL
 */
function getFigmaEmbedUrl(url: string): string {
  const fileId = extractFigmaFileId(url)
  if (fileId) {
    return `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileId}`
  }
  // If we can't extract the file ID, try to use the URL as-is
  return url
}

/**
 * A Tiptap node extension that creates a Figma embed component.
 */
export const FigmaNode = Node.create<FigmaNodeOptions>({
  name: "figma",

  group: "block",

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      url: {
        default: null,
        parseHTML: (element) => {
          const iframe = element.querySelector("iframe")
          return iframe?.getAttribute("src") || element.getAttribute("data-url")
        },
        renderHTML: (attributes) => {
          if (!attributes.url) {
            return {}
          }
          return {
            "data-url": attributes.url,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="figma"]',
      },
      {
        tag: 'iframe[src*="figma.com"]',
        getAttrs: (node) => {
          if (typeof node === "string") return false
          const element = node as HTMLElement
          const src = element.getAttribute("src")
          if (src && src.includes("figma.com")) {
            return {
              url: src,
            }
          }
          return false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "figma" }, HTMLAttributes),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigmaNodeComponent)
  },

  addCommands() {
    return {
      setFigma:
        (options) =>
        ({ commands }) => {
          const embedUrl = getFigmaEmbedUrl(options.url)
          return commands.insertContent({
            type: this.name,
            attrs: {
              url: embedUrl,
            },
          })
        },
    }
  },
})

export default FigmaNode

