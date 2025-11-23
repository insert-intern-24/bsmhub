"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/utils/hook/tiptap/use-tiptap-editor"

// --- Lib ---
import { isExtensionAvailable } from "@/utils/lib/tiptap-utils"

export interface UseFigmaConfig {
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
   * Callback function called after a successful Figma insertion.
   */
  onInserted?: () => void
}

/**
 * Checks if Figma can be inserted in the current editor state
 */
export function canInsertFigma(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, "figma")) return false

  return editor.can().insertContent({ type: "figma" })
}

/**
 * Checks if Figma is currently active
 */
export function isFigmaActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive("figma")
}

/**
 * Inserts a Figma embed in the editor
 */
export function insertFigma(editor: Editor | null, url?: string): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canInsertFigma(editor)) return false

  try {
    if (url) {
      return editor.chain().focus().setFigma({ url }).run()
    } else {
      // Insert empty Figma node (user will enter URL in the node)
      return editor
        .chain()
        .focus()
        .insertContent({
          type: "figma",
          attrs: {
            url: null,
          },
        })
        .run()
    }
  } catch {
    return false
  }
}

/**
 * Determines if the Figma button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor) return false

  if (hideWhenUnavailable) {
    return canInsertFigma(editor)
  }

  return true
}

/**
 * Custom hook that provides Figma embed functionality for Tiptap editor
 */
export function useFigma(config?: UseFigmaConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canInsert = canInsertFigma(editor)
  const isActive = isFigmaActive(editor)

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

  const handleFigma = useCallback(
    (url?: string) => {
      if (!editor) return false

      const success = insertFigma(editor, url)
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
    handleFigma,
    canInsert,
    label: "Add Figma",
  }
}

