import { mergeAttributes, Node, nodePasteRule } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { LinkCardComponent } from "./LinkCardComponent"

export interface LinkCardOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkCard: {
      setLinkCard: (options: { href: string }) => ReturnType
    }
  }
}

export const LinkCardNode = Node.create<LinkCardOptions>({
  name: "linkCard",

  group: "block",

  draggable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      title: {
        default: null,
      },
      description: {
        default: null,
      },
      image: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="link-card"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "link-card",
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkCardComponent)
  },

  addCommands() {
    return {
      setLinkCard:
        (options: { href: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,})$/g,
        type: this.type,
        getAttributes: (match) => {
          return {
            href: match[0],
          }
        },
      }),
    ]
  },
})
