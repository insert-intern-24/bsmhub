"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/utils/hook/tiptap/use-tiptap-editor"

// --- Lib ---
import { isExtensionAvailable } from "@/utils/lib/tiptap-utils"

export interface UseYoutubeConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when insertion is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful YouTube insertion.
   */
  onInserted?: () => void
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
  return url
}

/**
 * Checks if YouTube can be inserted in the current editor state
 */
export function canInsertYoutube(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, "youtube")) return false

  return editor.can().insertContent({ type: "youtube" })
}

/**
 * Checks if YouTube is currently active
 */
export function isYoutubeActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive("youtube")
}

/**
 * Inserts a YouTube embed in the editor
 */
export function insertYoutube(editor: Editor | null, url?: string): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canInsertYoutube(editor)) return false

  try {
    if (url) {
      const embedUrl = getYouTubeEmbedUrl(url)
      return editor
        .chain()
        .focus()
        .insertContent({
          type: "youtube",
          attrs: {
            url: embedUrl,
            width: 640,
            height: 480,
          },
        })
        .run()
    } else {
      // Insert empty YouTube node (user will enter URL in the node)
      return editor
        .chain()
        .focus()
        .insertContent({
          type: "youtube",
          attrs: {
            url: null,
            width: 640,
            height: 480,
          },
        })
        .run()
    }
  } catch {
    return false
  }
}

/**
 * Determines if the YouTube button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor) return false

  if (hideWhenUnavailable) {
    return canInsertYoutube(editor)
  }

  return true
}

/**
 * Custom hook that provides YouTube embed functionality for Tiptap editor
 */
export function useYoutube(config?: UseYoutubeConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canInsert = canInsertYoutube(editor)
  const isActive = isYoutubeActive(editor)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleYoutube = useCallback(
    (url?: string) => {
      if (!editor) return false

      const success = insertYoutube(editor, url)
      if (success) {
        onInserted?.()
      }
      return success
    },
    [editor, onInserted]
  )

  return {
    isVisible,
    isActive,
    handleYoutube,
    canInsert,
    label: "Add YouTube",
  }
}

