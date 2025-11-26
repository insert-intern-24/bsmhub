/**
 * Figma URL을 임베드 URL로 변환하는 유틸리티 함수
 */

const ALLOWED_FIGMA_HOSTS = ["figma.com", "www.figma.com", "embed.figma.com"]

/**
 * URL이 유효한 Figma URL인지 확인합니다.
 * @param url - 확인할 URL
 * @returns 유효한 Figma URL이면 true, 아니면 false
 */
export function isValidFigmaUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ALLOWED_FIGMA_HOSTS.includes(urlObj.hostname)
  } catch {
    return false
  }
}

/**
 * URL이 이미 Figma 임베드 URL인지 확인합니다.
 * @param url - 확인할 URL
 * @returns 이미 임베드 형식이면 true, 아니면 false
 */
export function isAlreadyEmbedUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return (
      urlObj.hostname === "embed.figma.com" ||
      urlObj.pathname.startsWith("/embed")
    )
  } catch {
    return false
  }
}

/**
 * Figma URL을 임베드 URL로 변환합니다.
 * - 이미 임베드 URL인 경우 그대로 반환합니다.
 * - 유효하지 않은 URL이면 빈 문자열을 반환합니다.
 *
 * @param url - 변환할 Figma URL
 * @returns 임베드 URL 또는 빈 문자열
 */
export function getFigmaEmbedUrl(url: string): string {
  // URL이 비어있으면 빈 문자열 반환
  if (!url || !url.trim()) {
    return ""
  }

  // URL 유효성 검사
  if (!isValidFigmaUrl(url)) {
    return ""
  }

  // 이미 임베드 URL이면 그대로 반환
  if (isAlreadyEmbedUrl(url)) {
    return url
  }

  // 표준 Figma 임베드 형식으로 변환
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
}

/**
 * Figma 임베드 URL에서 원본 URL을 추출합니다.
 * @param embedUrl - 임베드 URL
 * @returns 원본 URL 또는 입력 URL 그대로
 */
export function extractOriginalUrlFromEmbed(embedUrl: string): string {
  try {
    const urlObj = new URL(embedUrl)

    // www.figma.com/embed?url=... 형식에서 원본 URL 추출
    if (urlObj.pathname.startsWith("/embed")) {
      const originalUrl = urlObj.searchParams.get("url")
      if (originalUrl) {
        return originalUrl
      }
    }

    // embed.figma.com 형식인 경우 원본 URL 추출 시도
    if (urlObj.hostname === "embed.figma.com") {
      // embed.figma.com/{type}/{fileKey} 형식에서 원본 URL 재구성
      const pathMatch = urlObj.pathname.match(/^\/([^/]+)\/([a-zA-Z0-9]+)/)
      if (pathMatch) {
        const [, type, fileKey] = pathMatch
        return `https://www.figma.com/${type}/${fileKey}`
      }
    }

    // 추출 실패 시 원본 반환
    return embedUrl
  } catch {
    return embedUrl
  }
}
