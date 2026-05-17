export type CalendarRow = {
  month: string;
  w1: string;
  w2: string;
  w3: string;
  w4: string;
  w5: string;
};

export type IntroductionContent = {
  greeting: { paragraphs: string[] };
  schoolOrganization: {
    name: string;
    principal: string;
    officeAddress: string;
    elementaryAddress: string;
    phone: string;
    email: string;
  };
  educationGoals: {
    purpose: { title: string; text: string };
    goals: { title: string; items: string[] };
    direction: {
      title: string;
      paragraphs: string[];
      quoteIntro: string;
      quote: string;
      closing: { before: string; highlight: string; after: string };
    };
  };
  history: { period: string; lines: string[] }[];
  calendar: {
    title: string;
    monthWeekHeader: string;
    rows: CalendarRow[];
    footnotes: string[];
    schoolHolidaysTitle: string;
    schoolHolidays: { label: string; range: string }[];
    publicHolidaysTitle: string;
    holidayNameHeader: string;
    holidayDateHeader: string;
    publicHolidays: { name: string; date: string; note?: string }[];
  };
  directions: {
    titlePrimary: string;
    titleSecondary: string;
    teachingSitesLabel: string;
    lines: string[];
    phones: string[];
    emailLine: string;
    mapLabel: string;
    mapPangea: string;
    mapRuppin: string;
  };
};
