export type ClassScheduleRow = {
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

export type AdultClassTier = {
  name: string;
  schedule: string;
  tuition: string;
  textbook: string;
};

export type ClassesContent = {
  kindergarten: ClassLevelBlock & {
    scheduleTitle: string;
    scheduleGroupLabel: string;
  };
  elementary: {
    scheduleTitle: string;
    schedule: ClassScheduleRow[];
    petalSection: ClassLevelBlock;
    fruitSection: ClassLevelBlock;
  };
  adults: {
    title: string;
    tiers: AdultClassTier[];
  };
};
