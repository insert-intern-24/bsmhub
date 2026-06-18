"use client"

import { forwardRef, useState } from "react"
import { useTiptapEditor } from "@/utils/hook/tiptap/use-tiptap-editor"
import type { UseCodeBlockConfig } from "@/app/components/tiptap/tiptap-ui/code-block-button"
import { useCodeBlock } from "@/app/components/tiptap/tiptap-ui/code-block-button"
import type { ButtonProps } from "@/app/components/tiptap/tiptap-ui-primitive/button"
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/components/tiptap/tiptap-ui-primitive/dropdown-menu"
import { Card, CardBody } from "@/app/components/tiptap/tiptap-ui-primitive/card"
import { ChevronDownIcon } from "@/app/components/tiptap/tiptap-icons/chevron-down-icon"
import "@/app/components/tiptap/tiptap-ui/code-block-dropdown-menu/code-block-dropdown-menu.scss"

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "shell", label: "Shell" },
  { value: "powershell", label: "PowerShell" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
]

export interface CodeBlockDropdownMenuProps
  extends Omit<ButtonProps, "type">,
    UseCodeBlockConfig {
  hideWhenUnavailable?: boolean
  portal?: boolean
  onOpenChange?: (open: boolean) => void
}

export const CodeBlockDropdownMenu = forwardRef<
  HTMLButtonElement,
  CodeBlockDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      portal = false,
      onOpenChange,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState(false)
    const { isVisible, canToggle, isActive, Icon } = useCodeBlock({
      editor,
      hideWhenUnavailable,
    })

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    }

    const handleLanguageSelect = (language: string) => {
      if (!editor) return
      
      editor
        .chain()
        .focus()
        .toggleCodeBlock({ language })
        .run()
      
      setIsOpen(false)
    }

    if (!isVisible) {
      return null
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            data-active-state={isActive ? "on" : "off"}
            role="button"
            tabIndex={-1}
            disabled={!canToggle}
            data-disabled={!canToggle}
            aria-label="Insert code block"
            aria-pressed={isActive}
            tooltip="Code Block"
            {...buttonProps}
            ref={ref}
          >
            <Icon className="tiptap-button-icon" />
            <ChevronDownIcon className="tiptap-button-dropdown-small" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" portal={portal}>
          <Card>
            <CardBody>
              <div className="tiptap-code-block-dropdown-grid">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem key={lang.value} asChild>
                    <Button
                      type="button"
                      data-style="ghost"
                      onClick={() => handleLanguageSelect(lang.value)}
                      showTooltip={false}
                    >
                      {lang.label}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </div>
            </CardBody>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

CodeBlockDropdownMenu.displayName = "CodeBlockDropdownMenu"
