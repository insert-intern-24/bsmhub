'use client';
export default function GoogleCallback() {
  window.opener.postMessage('success', window.location.origin);
  return null;
}
