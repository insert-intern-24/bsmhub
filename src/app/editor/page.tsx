'use client';

import { useState, useEffect } from 'react';
import 'lexical-rich-text-editor/lexical-rich-text-editor.css';
import './editor-overrides.css';
export default function Editor() {
  const [RichTextEditorComponent, setRichTextEditorComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    // 클라이언트에서만 동적으로 라이브러리 임포트
    import('lexical-rich-text-editor')
      .then((module) => setRichTextEditorComponent(() => module.RichTextEditor))
      .catch((err) => console.error('Failed to load rich text editor:', err));
  }, []);

  return (
    <div suppressHydrationWarning aria-label="Rich Text Editor">
      {RichTextEditorComponent && <RichTextEditorComponent />}
    </div>
  );
}
