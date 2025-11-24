import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { YoutubeNode as YoutubeNodeComponent } from "@/app/components/tiptap/tiptap-node/youtube-node/youtube-node"

export interface YoutubeNodeOptions {
  /**
   * HTML attributes to add to the youtube iframe element.
   * @default {}
   */
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Insert a YouTube embed
       */
      setYoutube: (options: { url: string }) => ReturnType
    }
  }
}

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
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
 * Convert YouTube URL to embed URL
 */
function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url)
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`
  }
  // If we can't extract the video ID, try to use the URL as-is
  return url
}

/**
 * A Tiptap node extension that creates a YouTube embed component.
 */
export const YoutubeNode = Node.create<YoutubeNodeOptions>({
  name: "youtube",

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
      width: {
        default: 640,
        parseHTML: (element) => {
          const iframe = element.querySelector("iframe")
          return iframe?.getAttribute("width") || 640
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: 480,
        parseHTML: (element) => {
          const iframe = element.querySelector("iframe")
          return iframe?.getAttribute("height") || 480
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="youtube"]',
      },
      {
        tag: 'iframe[src*="youtube.com"]',
        getAttrs: (node) => {
          if (typeof node === "string") return false
          const element = node as HTMLElement
          const src = element.getAttribute("src")
          if (src && src.includes("youtube.com")) {
            return {
              url: src,
              width: element.getAttribute("width") || 640,
              height: element.getAttribute("height") || 480,
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
      mergeAttributes({ "data-type": "youtube" }, HTMLAttributes),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeNodeComponent)
  },

  addCommands() {
    return {
      setYoutube:
        (options) =>
        ({ commands }) => {
          const embedUrl = getYouTubeEmbedUrl(options.url)
          return commands.insertContent({
            type: this.name,
            attrs: {
              url: embedUrl,
              width: 640,
              height: 480,
            },
          })
        },
    }
  },
})

export default YoutubeNode

