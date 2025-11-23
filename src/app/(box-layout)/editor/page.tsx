"use client"

import { useRef, useState } from "react"

import {
  SimpleEditor,
  SimpleEditorViewer,
  type SimpleEditorRef,
} from "@/app/components/tiptap/tiptap-templates/simple"

import type { JSONContent } from "@tiptap/react"

export default function Editor() {
  const editorRef = useRef<SimpleEditorRef>(null)
  const [content, setContent] = useState<JSONContent | null>(null)

  const handleGetData = () => {
    if (editorRef.current) {
      const data = editorRef.current.getData()
      console.log("Editor Data:", data)
      setContent(data.json)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <SimpleEditor
          ref={editorRef}
          onChange={(json) => {
            console.log("Content changed:", json)
          }}
          onUpdate={({ html, json }) => {
            console.log("Content updated - HTML:", html)
            console.log("Content updated - JSON:", json)
          }}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleGetData}>Get Data (ref 사용)</button>
        </div>
      </div>

      {content && (
        <div style={{ marginTop: "3rem" }}>
          <h2>정적 리더기 (SimpleEditorViewer)</h2>
          <SimpleEditorViewer content={content} />
        </div>
      )}
    </div>
  )
}
