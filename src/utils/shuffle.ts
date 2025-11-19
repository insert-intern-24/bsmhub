/**
 * Fisher-Yates 알고리즘을 사용하여 배열을 랜덤하게 셔플합니다.
 * 원본 배열은 변경되지 않으며, 셔플된 새 배열을 반환합니다.
 *
 * @template T 배열 요소의 타입
 * @param array 셔플할 배열
 * @returns 셔플된 새 배열
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
