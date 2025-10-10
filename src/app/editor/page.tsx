'use client';

import { useState, useEffect } from 'react';
import 'lexical-rich-text-editor/lexical-rich-text-editor.css';
export default function Editor() {
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    // 클라이언트에서만 동적으로 라이브러리 임포트
    import('lexical-rich-text-editor')
      .then((module) => setComponent(() => module.RichTextEditor))
      .catch((err) => console.error(err));
  }, []);

  return <div suppressHydrationWarning>{Component && <Component />}</div>;
}
