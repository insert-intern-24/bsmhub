"use client"

import { useState, useEffect } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button"
import { Input } from "@/app/components/tiptap/tiptap-ui-primitive/input"
import { CloseIcon } from "@/app/components/tiptap/tiptap-icons/close-icon"
import { ExternalLinkIcon } from "@/app/components/tiptap/tiptap-icons/external-link-icon"
import "@/app/components/tiptap/tiptap-node/youtube-node/youtube-node.scss"

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
  return url
}

/**
 * Get original YouTube URL from embed URL
 */
function getOriginalYouTubeUrl(embedUrl: string): string | null {
  const match = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (match && match[1]) {
    return `https://www.youtube.com/watch?v=${match[1]}`
  }
  return null
}

export const YoutubeNode: React.FC<NodeViewProps> = (props) => {
  const { url: initialUrl } = props.node.attrs
  const [url, setUrl] = useState(initialUrl ? getOriginalYouTubeUrl(initialUrl) || initialUrl : "")
  const [isEditing, setIsEditing] = useState(!initialUrl)
  const [embedUrl, setEmbedUrl] = useState(
    initialUrl ? getYouTubeEmbedUrl(initialUrl) : ""
  )

  useEffect(() => {
    if (initialUrl) {
      const originalUrl = getOriginalYouTubeUrl(initialUrl) || initialUrl
      setUrl(originalUrl)
      setEmbedUrl(getYouTubeEmbedUrl(originalUrl))
    }
  }, [initialUrl])

  const handleSubmit = () => {
    if (!url.trim()) return

    const newEmbedUrl = getYouTubeEmbedUrl(url)
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
      setUrl(initialUrl ? getOriginalYouTubeUrl(initialUrl) || initialUrl : "")
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

  const originalUrl = embedUrl ? getOriginalYouTubeUrl(embedUrl) : null

  if (isEditing) {
    return (
      <NodeViewWrapper className="tiptap-youtube-node" data-drag-handle>
        <div className="tiptap-youtube-node-editor">
          <Input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="tiptap-youtube-node-actions">
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
                setUrl(initialUrl ? getOriginalYouTubeUrl(initialUrl) || initialUrl : "")
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
    <NodeViewWrapper className="tiptap-youtube-node" data-drag-handle>
      <div className="tiptap-youtube-node-container">
        <div className="tiptap-youtube-node-toolbar">
          <Button
            type="button"
            data-style="ghost"
            onClick={() => setIsEditing(true)}
            tooltip="Edit YouTube URL"
          >
            Edit
          </Button>
          {originalUrl && (
            <Button
              type="button"
              data-style="ghost"
              onClick={() => window.open(originalUrl, "_blank")}
              tooltip="Open in YouTube"
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
          <div className="tiptap-youtube-node-embed">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Embed"
            />
          </div>
        ) : (
          <div className="tiptap-youtube-node-placeholder">
            <p>No YouTube URL provided</p>
            <Button
              type="button"
              data-style="ghost"
              onClick={() => setIsEditing(true)}
            >
              Add YouTube URL
            </Button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

