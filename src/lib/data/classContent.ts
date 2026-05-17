/** 학급 소개 본문 (한국어 원문, homepy CLASS/*.htm 이전) */

export type ClassScheduleRow = {
  /** 표의 첫 열 그룹(초등반·중등반 등). 연속 동일 값은 셀 병합 */
  group?: string;
  className: string;
  time: string;
};

export type ClassLevelBlock = {
  title: string;
  schedule?: ClassScheduleRow[];
  location?: string;
  lead?: string;
  paragraphs?: string[];
  bullets?: string[];
  textbooks?: string[];
  note?: string;
};

export const kindergartenClass: ClassLevelBlock & {
  scheduleTitle: string;
  scheduleGroupLabel: string;
} = {
  scheduleTitle: "유치반 수업시간표",
  scheduleGroupLabel: "유치반",
  schedule: [
    { className: "씨앗반: 2023년생 (2-3J)", time: "화,수 Di,Mi 16-17Uhr" },
    { className: "씨앗반: 2022년생 (3-4J)", time: "월,목 Mo,Do 16-17:30 Uhr" },
    { className: "새싹반: 2021년생 (4-5J)", time: "목,금 Do,Fr 16-18Uhr" },
  ],
  title: "유치 씨앗반 · 새싹반",
  location: "Pangea Haus e.V.\nTrautenaustraße 5, 10717 Berlin",
  lead: "한국어 교육! 이젠 우리 아이 발달단계를 고려해 똑똑하게 교육하세요~~",
  paragraphs: [
    "아이들은 생후 18개월이 지나면서 '언어폭발기'에 접어듭니다. 이 시기 아이들은 단어의 뜻을 정확하게 알게 되며, 단어 학습능력이 최고조에 달하게 됩니다.",
    "또한 뇌의 발달은 우뇌가 발달하기 시작하여 6세 이후부터 퇴보하기 시작합니다. 따라서 7세 이전에는 좌뇌를 키우는 글자 공부보다 우뇌를 키우는 다양한 감각 자극을 통한 언어학습이 더 필요합니다.",
  ],
  bullets: [
    "흥미로운 책읽기와 다양한 독후 활동으로 나만의 자유로운 표현 활동",
    "한글 교재와 말놀이카드, 동요, 손유희로 한국말 트이기",
    "신경회로를 자극하는 오감놀이 퍼포먼스 두뇌 발달 활동",
    "놀이를 통해 한글에 노출시키는 한글놀이 활동",
  ],
  textbooks: [
    "교재: 매 달 새로운 그림동화책",
    "재외동포를 위한 안녕 한글 — 놀이로 배우는 한글 입문",
  ],
  note: "※ 별도 교재비는 없습니다.",
};

export const elementaryClass = {
  scheduleTitle: "초등/중등 반 구성과 수업시간",
  schedule: [
    { group: "초등반", className: "줄기반: 초 1학년 (G1)", time: "수 Mi 16-18Uhr" },
    { group: "초등반", className: "줄기반: 초 1학년 (G1)", time: "토 Sa. 12:15-14:15Uhr" },
    { group: "초등반", className: "줄기반: 초 2학년 (G2)", time: "월 Mo.16-18Uhr" },
    { group: "초등반", className: "줄기반: 초 2학년 (G2)", time: "목 Do.16-18Uhr" },
    { group: "초등반", className: "꽃잎반: 초 3-4학년 (G3-4)", time: "수 Mi. 16-18Uhr" },
    { group: "초등반", className: "열매반: 초 5-6학년 (G5-6)", time: "토 Sa. 10-12Uhr" },
    { group: "초등반", className: "초등기초반: 초 2~6학년 (G2-6)", time: "월 Mo.16~18Uhr" },
    { group: "중등반", className: "중등반", time: "토 Sa. 10-12Uhr" },
  ],
  petalSection: {
    title: "초등 꽃잎반",
    location: "Ruppin-Grundschule\nOffenbacher Str. 5A, 14197 Berlin",
    lead: "한글공부! 기억, 니은, 디귿.... 아직도 이렇게 가르치시나요?",
    paragraphs: [
      "저희 도담도담에서는 훈민정음 해레본에 근거하여 발음기관의 모양을 본떠서 만든 기본자(ㄱ, ㄴ, ㅁ, ㅅ, ㅇ)에 발음의 연관성과 강약에 따라 획을 추가하는 원리로 과학적인 한글원리로 한글을 쉽고 빠르게 터득할 수 있도록 하고 있습니다.",
      "언어는 듣기, 말하기, 읽기, 쓰기의 네 단계로 이루어집니다. 그러나 언어 발달도 같은 순서로 발달되는 것은 아닙니다. '총체적 언어 접근법'에서는 네 기능을 따로 분리해서 볼 수 없으며 의사소통의 과정 속에서 상호 연관되어진다고 이야기하고 있습니다. 따라서 듣기, 말하기, 읽기, 쓰기를 통합하여 자연스럽게 터득할 수 있도록 돕습니다.",
    ],
    bullets: [
      "줄기반과 꽃잎반은 본격적으로 자음, 모음익히기부터 한글을 습득하는 과정입니다.",
      "교재를 중심으로 한 듣기, 말하기, 읽기, 쓰기를 통합교육하는 언어 프로그램",
      "동화책을 읽고 다양한 독후 활동으로 아이의 5가지 발달영역(언어, 인지, 정서, 신체, 사회성)을 촉진",
      "창작 미술활동으로 한국 문화와 역사 배우기 (붓글씨, 다도체험, 전통놀이 등)",
      "특별활동: 베를린 어린이 합창단 합창 또는 창작 미술활동",
    ],
    textbooks: [
      "교재: 매 달 새로운 동화 책",
      "재외동포를 위한 한국어 1-1, 1-2 / 2-1, 2-2",
      "참고 도서: 한글이 나르샤 (가온한국어)",
    ],
    note: "※ 교재는 학생 수준에 따라 단계별로 제공되며, 별도 교재비는 없습니다.",
  },
  fruitSection: {
    title: "초등/중등 열매반",
    location: "Pangea Haus e.V.\nTrautenaustraße 5, 10717 Berlin",
    paragraphs: [
      "열매반은 듣기, 말하기, 읽기, 쓰기가 가능한 초등학생들을 위한 반입니다. 언어와 사고는 매우 밀접한 관계를 가지고 있습니다. 문자를 익히는 것 외에 풍부한 어휘력과 표현력을 키울 수 있는 한글 교육 방식이 필요합니다.",
      "한 권의 책을 읽더라도 온전히 자신의 것을 만들어 확산적 사고와 논리적으로 자신의 생각을 표현할 수 있도록 지도합니다.",
    ],
    bullets: [
      "표현력과 사고력을 키우는 한글교육 — 관용표현, 고유어/사자성어, 신조어",
      "시사용어, 뉴스말을 기초로 사고력과 논술의 기초 쌓기",
      "동화책을 읽고 다양한 독후 활동으로 확산적 사고와 자신의 생각표현",
      "창작 미술활동으로 한국 문화와 역사 배우기 (붓글씨, 다도체험, 전통놀이 등)",
      "특별활동: 베를린 어린이 합창단 합창, 창작 미술활동",
    ],
    textbooks: [
      "교재: 매 달 새로운 전래동화책",
      "재외동포를 위한 한국어 3-1, 3-2 / 4-1, 4-2",
    ],
    note: "※ 교재는 학생 수준에 따라 단계별로 제공되며, 별도 교재비는 없습니다.",
  },
} as const;

export type AdultClassTier = {
  name: string;
  schedule: string;
  tuition: string;
  textbook: string;
};

export const adultsClass = {
  title: "성인반",
  tiers: [
    {
      name: "기초반",
      schedule: "매 주 금요일 16시 30분~18시 (총 20회)",
      tuition: "매 월 70유로",
      textbook: "맞춤 한국어 (독일권) 1~2권",
    },
    {
      name: "중급반",
      schedule: "매 주 토요일 10–13시",
      tuition: "매 월 70유로",
      textbook: "맞춤 한국어 (독일권) 3~4권",
    },
    {
      name: "상급반",
      schedule: "매 주 토요일 10–13시",
      tuition: "매 월 70유로",
      textbook: "맞춤 한국어 (독일권) 5~6권",
    },
  ] satisfies AdultClassTier[],
} as const;
