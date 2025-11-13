declare module 'lexical-rich-text-editor' {
  import { FC } from 'react';

  interface RichTextEditorProps {
    defaultData?: string;
    onChange?: (data: string) => void;
  }

  export const RichTextEditor: FC<RichTextEditorProps>;
}
