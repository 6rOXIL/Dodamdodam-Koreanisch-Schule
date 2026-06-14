/**
 * http://homepy.korean.net/~dodamdodam/www/ 에서 이전한 메타·게시판 목록
 * (베를린 어린이 합창단 Kinderchor 경로는 제외)
 */

export const LEGACY_SITE_BASE = "http://homepy.korean.net/~dodamdodam/www/";

export const LEGACY_BOARDS = {
  noticeList: `${LEGACY_SITE_BASE}curriculum/Notice/list.htm?bn=notice`,
  curriculumList: `${LEGACY_SITE_BASE}curriculum/curriculum/list.htm?bn=curriculum`,
} as const;

/** 구 홈페이지 푸터 기준 주소 (Google Maps 검색) */
export const LEGACY_MAPS_SEARCH_URL =
  "https://www.google.com/maps/search/?api=1&query=Blissestr.+58,+10713+Berlin";

export type LegacyPost = {
  /** 표시용 제목 */
  title: string;
  date: string;
  /** 원문(첨부 포함) 보기 */
  url: string;
};
