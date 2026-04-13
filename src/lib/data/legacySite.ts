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

/** 공지사항 — 목록 1페이지 기준 (코리안넷 게시판) */
export const LEGACY_NOTICES: LegacyPost[] = [
  {
    title:
      "[공지사항] 2024년 제7, 8차 차세대동포 모국 초청연수 참가자 선정 명단",
    date: "2024-11-22",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1237&pkid=335&board_no=1406`,
  },
  {
    title: "[공지사항] 개인정보처리방침 변경 공지",
    date: "2024-11-20",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1236&pkid=334&board_no=1405`,
  },
  {
    title: "[공지사항] 개인정보처리방침 변경 공지",
    date: "2024-11-18",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1235&pkid=333&board_no=1404`,
  },
  {
    title: "[2024년 재외동포정책 만족도 조사 참여 요청]",
    date: "2024-11-11",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1234&pkid=332&board_no=1403`,
  },
  {
    title: "[공지사항] 재외동포청 SNS채널 안내",
    date: "2024-11-07",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1233&pkid=331&board_no=1402`,
  },
  {
    title: "[공지사항] 국내 조사연구활동 지원사업 관련 공지",
    date: "2024-11-04",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1232&pkid=330&board_no=1401`,
  },
  {
    title: "[공지사항] 2024년 제7, 8차 차세대동포 모국 초청연수 참가자 선정 명단",
    date: "2024-10-17",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1231&pkid=329&board_no=1400`,
  },
  {
    title: "[공지사항] 2024년도 재외동포단체 및 사업 지원 관련 공지",
    date: "2024-10-15",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1230&pkid=328&board_no=1399`,
  },
  {
    title: "[유관기관소식] [인천광역시] 재외동포 관련 안내",
    date: "2024-10-15",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1229&pkid=327&board_no=1398`,
  },
  {
    title: "[유관기관소식] 2024 재외동포 현장 연구·정책 관련 소식",
    date: "2024-10-02",
    url: `${LEGACY_SITE_BASE}curriculum/Notice/read.htm?bn=notice&fmlid=1228&pkid=326&board_no=1383`,
  },
];

/** 이 달의 커리큘럼 — 목록 1페이지 기준 */
export const LEGACY_CURRICULUM: LegacyPost[] = [
  {
    title: "2026년 3월 초등기초반",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1510&pkid=282&board_no=1510`,
  },
  {
    title: "2026년 3월 열매반(토요)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1509&pkid=281&board_no=1509`,
  },
  {
    title: "2026년 3월 꽃잎반(수요)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1508&pkid=280&board_no=1508`,
  },
  {
    title: "2026년 2월 줄기반(월,목)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1507&pkid=279&board_no=1507`,
  },
  {
    title: "2026년 3월 줄기반(수,토)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1506&pkid=278&board_no=1506`,
  },
  {
    title: "2026년 3월 새싹반(목,금)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1505&pkid=277&board_no=1505`,
  },
  {
    title: "2026년 3월 씨앗반(월,목)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1504&pkid=276&board_no=1504`,
  },
  {
    title: "2026년 3월 씨앗반(화,수)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1503&pkid=275&board_no=1503`,
  },
  {
    title: "2026년 2월 줄기반(수,토)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1502&pkid=274&board_no=1502`,
  },
  {
    title: "2026년 2월 열매반(토)",
    date: "2026-03-09",
    url: `${LEGACY_SITE_BASE}curriculum/curriculum/read.htm?bn=curriculum&fmlid=1501&pkid=273&board_no=1501`,
  },
];
