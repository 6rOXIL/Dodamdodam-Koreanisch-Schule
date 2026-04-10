/**
 * GitHub Pages의 basePath를 고려한 이미지 경로 생성 유틸리티
 */
export function getImagePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // basePath가 있으면 앞에 추가, 없으면 그대로 사용
  return `${basePath}${path}`;
}
