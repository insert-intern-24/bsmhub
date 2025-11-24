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
 * Convert Figma URL to embed URL
 */
function getFigmaEmbedUrl(url: string): string {
  // Validate the URL first
  try {
    const urlObj = new URL(url)
    const allowedHosts = ["figma.com", "www.figma.com"]
    if (!allowedHosts.includes(urlObj.hostname)) {
      return ""
    }
  } catch {
    // Invalid URL
    return ""
  }
  
  const parsed = parseFigmaUrl(url)
  if (!parsed) {
    return ""
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

