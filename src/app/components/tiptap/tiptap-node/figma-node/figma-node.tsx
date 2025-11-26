"use client"

import { useState, useEffect } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button"
import { Input } from "@/app/components/tiptap/tiptap-ui-primitive/input"
import { CloseIcon } from "@/app/components/tiptap/tiptap-icons/close-icon"
import { ExternalLinkIcon } from "@/app/components/tiptap/tiptap-icons/external-link-icon"
import "@/app/components/tiptap/tiptap-node/figma-node/figma-node.scss"

/**
 * Convert Figma URL to embed URL using www.figma.com/embed format
 */
function getFigmaEmbedUrl(url: string): string {
  // Validate the URL first
  try {
    const urlObj = new URL(url)
    const allowedHosts = ["figma.com", "www.figma.com", "embed.figma.com"]
    if (!allowedHosts.includes(urlObj.hostname)) {
      return ""
    }
    
    // If it's already an embed URL, return it as-is to avoid double encoding
    if (urlObj.hostname === "embed.figma.com" || urlObj.pathname.startsWith("/embed")) {
      return url
    }
  } catch {
    // Invalid URL
    return ""
  }
  
  // Use Figma's standard embed format: encode the full original URL
  const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
  return embedUrl
}

export const FigmaNode: React.FC<NodeViewProps> = (props) => {
  const { url: initialUrl } = props.node.attrs
  const [url, setUrl] = useState(initialUrl || "")
  const [isEditing, setIsEditing] = useState(!initialUrl)
  const [embedUrl, setEmbedUrl] = useState(
    initialUrl ? getFigmaEmbedUrl(initialUrl) : ""
  )

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl)
      setEmbedUrl(getFigmaEmbedUrl(initialUrl))
    }
  }, [initialUrl])

  const handleSubmit = () => {
    if (!url.trim()) return

    const newEmbedUrl = getFigmaEmbedUrl(url)
    setEmbedUrl(newEmbedUrl)
    setIsEditing(false)

    // Update the node attributes
    const pos = props.getPos()
    if (typeof pos === "number") {
      props.updateAttributes({
        url: newEmbedUrl,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setUrl(initialUrl || "")
    }
  }

  const handleDelete = () => {
    const pos = props.getPos()
    if (typeof pos === "number") {
      props.editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + props.node.nodeSize })
        .run()
    }
  }

  if (isEditing) {
    return (
      <NodeViewWrapper className="tiptap-figma-node" data-drag-handle>
        <div className="tiptap-figma-node-editor">
          <Input
            type="text"
            placeholder="Paste Figma URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="tiptap-figma-node-actions">
            <Button
              type="button"
              data-style="ghost"
              onClick={handleSubmit}
              disabled={!url.trim()}
            >
              Embed
            </Button>
            <Button
              type="button"
              data-style="ghost"
              onClick={() => {
                setIsEditing(false)
                setUrl(initialUrl || "")
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className="tiptap-figma-node" data-drag-handle>
      <div className="tiptap-figma-node-container">
        <div className="tiptap-figma-node-toolbar">
          <Button
            type="button"
            data-style="ghost"
            onClick={() => setIsEditing(true)}
            tooltip="Edit Figma URL"
          >
            Edit
          </Button>
          {url && (
            <Button
              type="button"
              data-style="ghost"
              onClick={() => window.open(url, "_blank")}
              tooltip="Open in Figma"
            >
              <ExternalLinkIcon className="tiptap-button-icon" />
            </Button>
          )}
          <Button
            type="button"
            data-style="ghost"
            onClick={handleDelete}
            tooltip="Delete"
          >
            <CloseIcon className="tiptap-button-icon" />
          </Button>
        </div>
        {embedUrl ? (
          <div className="tiptap-figma-node-embed">
            <iframe
              src={embedUrl}
              width="100%"
              height="450"
              frameBorder="0"
              allowFullScreen
              title="Figma Embed"
            />
          </div>
        ) : (
          <div className="tiptap-figma-node-placeholder">
            <p>No Figma URL provided</p>
            <Button
              type="button"
              data-style="ghost"
              onClick={() => setIsEditing(true)}
            >
              Add Figma URL
            </Button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

