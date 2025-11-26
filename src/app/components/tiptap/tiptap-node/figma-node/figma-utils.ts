/**
 * Figma URL을 임베드 URL로 변환하는 유틸리티 함수
 */

const ALLOWED_FIGMA_HOSTS = ["figma.com", "www.figma.com", "embed.figma.com"]
const ALLOWED_PROTOCOLS = ["https:"]

/**
 * URL이 유효한 Figma URL인지 확인합니다.
 * 프로토콜과 호스트 모두 검증하여 보안을 강화합니다.
 * @param url - 확인할 URL
 * @returns 유효한 Figma URL이면 true, 아니면 false
 */
export function isValidFigmaUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // 프로토콜 검증: javascript:, data: 등 위험한 프로토콜 차단
    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      return false
    }
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
 * URL이 iframe src에 사용하기 안전한 Figma 임베드 URL인지 확인합니다.
 * XSS 공격을 방지하기 위해 프로토콜과 호스트를 엄격하게 검증합니다.
 * @param url - 확인할 URL
 * @returns 안전한 URL이면 해당 URL, 아니면 빈 문자열
 */
export function getSafeEmbedUrl(url: string): string {
  if (!url || !url.trim()) {
    return ""
  }
  
  try {
    const urlObj = new URL(url)
    
    // HTTPS 프로토콜만 허용
    if (urlObj.protocol !== "https:") {
      return ""
    }
    
    // Figma 도메인만 허용
    if (!ALLOWED_FIGMA_HOSTS.includes(urlObj.hostname)) {
      return ""
    }
    
    // 유효한 URL 반환
    return urlObj.href
  } catch {
    return ""
  }
}

/**
 * Figma 임베드 URL에서 원본 URL을 추출합니다.
 * 추출된 URL도 유효성 검사를 수행하여 안전한 URL만 반환합니다.
 * @param embedUrl - 임베드 URL
 * @returns 유효한 원본 Figma URL 또는 빈 문자열
 */
export function extractOriginalUrlFromEmbed(embedUrl: string): string {
  try {
    const urlObj = new URL(embedUrl)

    // www.figma.com/embed?url=... 형식에서 원본 URL 추출
    if (urlObj.pathname.startsWith("/embed")) {
      const originalUrl = urlObj.searchParams.get("url")
      if (originalUrl && isValidFigmaUrl(originalUrl)) {
        return originalUrl
      }
    }

    // embed.figma.com 형식인 경우 원본 URL 추출 시도
    if (urlObj.hostname === "embed.figma.com") {
      // embed.figma.com/{type}/{fileKey} 형식에서 원본 URL 재구성
      const pathMatch = urlObj.pathname.match(/^\/([^/]+)\/([a-zA-Z0-9_-]+)/)
      if (pathMatch) {
        const [, type, fileKey] = pathMatch
        const reconstructedUrl = `https://www.figma.com/${type}/${fileKey}`
        // 재구성된 URL도 유효성 검사 수행
        if (isValidFigmaUrl(reconstructedUrl)) {
          return reconstructedUrl
        }
      }
    }

    // 입력이 유효한 Figma URL이면 그대로 반환, 아니면 빈 문자열 반환
    if (isValidFigmaUrl(embedUrl)) {
      return embedUrl
    }
    return ""
  } catch {
    return ""
  }
}
