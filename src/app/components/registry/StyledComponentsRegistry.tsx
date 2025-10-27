'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

/**
 * Styled Components 스타일을 서버 사이드에서 렌더링하기 위한 레지스트리
 * SSR 시 스타일이 HTML에 주입되어 FOUC(Flash of Unstyled Content)를 방지합니다
 *
 * Next.js App Router에서 twin.macro + styled-components를 사용할 때 필수입니다
 */
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버 사이드에서만 StyleSheet를 생성 (클라이언트에서는 null)
  const [styledComponentsStyleSheet] = useState(() => {
    const sheet = new ServerStyleSheet();
    return sheet;
  });

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
