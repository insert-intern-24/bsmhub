"use client"

import { useState, useEffect } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import "@/app/components/tiptap/tiptap-node/code-block-node/code-block-node.scss"

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

export const CodeBlockNode: React.FC<NodeViewProps> = (props) => {
  const { language: initialLanguage } = props.node.attrs
  const [language, setLanguage] = useState(initialLanguage || "plaintext")

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage)
    }
  }, [initialLanguage])

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value
    setLanguage(newLanguage)
    props.updateAttributes({ language: newLanguage })
  }

  return (
    <NodeViewWrapper className="tiptap-code-block-node">
      <div className="tiptap-code-block-header" data-drag-handle>
        <select
          className="tiptap-code-block-language-selector"
          value={language}
          onChange={handleLanguageChange}
          contentEditable={false}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <pre>
        <NodeViewContent />
      </pre>
    </NodeViewWrapper>
  )
}

export default CodeBlockNode
