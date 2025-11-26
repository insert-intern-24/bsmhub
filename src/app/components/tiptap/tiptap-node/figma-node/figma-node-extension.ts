import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { FigmaNode as FigmaNodeComponent } from "@/app/components/tiptap/tiptap-node/figma-node/figma-node"
import { getFigmaEmbedUrl } from "@/app/components/tiptap/tiptap-node/figma-node/figma-utils"

export interface FigmaNodeOptions {
  /**
   * HTML attributes to add to the figma iframe element.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>
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
      originalUrl: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("data-original-url")
        },
        renderHTML: (attributes) => {
          if (!attributes.originalUrl) {
            return {}
          }
          return {
            "data-original-url": attributes.originalUrl,
          }
        },
      },
      height: {
        default: 450,
        parseHTML: (element) => {
          const iframe = element.querySelector("iframe")
          const heightAttr = iframe?.getAttribute("height") || element.getAttribute("height")
          return heightAttr ? parseInt(heightAttr, 10) : 450
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {}
          }
          return {
            "data-height": attributes.height,
          }
        },
      }
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
          if (src) {
            try {
              const url = new URL(src)
              const allowedHosts = ["figma.com", "www.figma.com", "embed.figma.com"]
              if (allowedHosts.includes(url.hostname)) {
                return {
                  url: src,
                }
              }
            } catch {
              // Invalid URL, reject it
              return false
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
              originalUrl: options.url,
            },
          })
        },
    }
  },
})

export default FigmaNode

