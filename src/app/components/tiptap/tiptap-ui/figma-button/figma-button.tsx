"use client"

import { forwardRef, useCallback } from "react"
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button"
import { useTiptapEditor } from "@/utils/hook/tiptap/use-tiptap-editor"
import { useFigma, type UseFigmaConfig } from "./use-figma"

export interface FigmaButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    UseFigmaConfig {
  /**
   * Button text to display
   */
  text?: string
  /**
   * Custom click handler (will be called before the default handler)
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Custom icon component
   */
  icon?: React.ComponentType<{ className?: string }>
  /**
   * Custom children (overrides default icon and text)
   */
  children?: React.ReactNode
}

/**
 * Button component for inserting Figma embeds in a Tiptap editor.
 */
export const FigmaButton = forwardRef<HTMLButtonElement, FigmaButtonProps>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onInserted,
      onClick,
      icon: CustomIcon,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const { isVisible, canInsert, isActive, handleFigma, label } = useFigma({
      editor,
      hideWhenUnavailable,
      onInserted,
    })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleFigma()
      },
      [handleFigma, onClick]
    )

    if (!isVisible) {
      return null
    }

    const RenderIcon = CustomIcon

    return (
      <Button
        type="button"
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            {RenderIcon && <RenderIcon className="tiptap-button-icon" />}
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

FigmaButton.displayName = "FigmaButton"

