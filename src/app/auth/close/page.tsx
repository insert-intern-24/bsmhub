'use client';
import { useEffect } from 'react';
export default function GoogleCallback() {
  useEffect(() => {
    window.opener.postMessage('success', window.location.origin);
  }, []);
  return null;
}
