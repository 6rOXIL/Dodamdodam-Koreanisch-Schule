import type { ClassesContent } from "./types";

export const classesEn: ClassesContent = {
  kindergarten: {
    scheduleTitle: "Kindergarten class schedule",
    scheduleGroupLabel: "Kindergarten",
    schedule: [
      { className: "Seed class: born 2023 (ages 2–3)", time: "Tue, Wed 4–5 pm" },
      { className: "Seed class: born 2022 (ages 3–4)", time: "Mon, Thu 4–5:30 pm" },
      { className: "Sprout class: born 2021 (ages 4–5)", time: "Thu, Fri 4–6 pm" },
    ],
    title: "Kindergarten — Seed & Sprout classes",
    location: "Pangea Haus e.V.\nTrautenaustraße 5, 10717 Berlin",
    lead: "Korean education tailored to your child’s stage of development!",
    paragraphs: [
      "From around 18 months, children enter a “language explosion.” They grasp word meanings more precisely and learn new words at peak speed.",
      "The right brain develops strongly in early childhood and begins to decline after about age six. Before age seven, sensory-rich language learning that engages the right brain is more valuable than left-brain-focused letter drills.",
    ],
    bullets: [
      "Engaging read-alouds and follow-up activities for free expression",
      "Korean workbooks, word-play cards, songs, and hand games to build fluency",
      "Sensory play and performance activities that stimulate neural pathways",
      "Play-based exposure to Hangul through Korean language games",
    ],
    textbooks: [
      "Materials: a new picture book each month",
      "Annyeong Hangul for overseas Koreans — introductory Korean through play",
    ],
    note: "※ No separate textbook fee.",
  },
  elementary: {
    scheduleTitle: "Elementary & middle school classes and times",
    schedule: [
      { group: "Elementary", className: "Stem class: Grade 1 (G1)", time: "Wed 4–6 pm" },
      { group: "Elementary", className: "Stem class: Grade 1 (G1)", time: "Sat 12:15–2:15 pm" },
      { group: "Elementary", className: "Stem class: Grade 2 (G2)", time: "Mon 4–6 pm" },
      { group: "Elementary", className: "Stem class: Grade 2 (G2)", time: "Thu 4–6 pm" },
      { group: "Elementary", className: "Petal class: Grades 3–4 (G3–4)", time: "Wed 4–6 pm" },
      { group: "Elementary", className: "Fruit class: Grades 5–6 (G5–6)", time: "Sat 10 am–12 pm" },
      { group: "Elementary", className: "Elementary foundation: Grades 2–6 (G2–6)", time: "Mon 4–6 pm" },
      { group: "Middle school", className: "Middle school class", time: "Sat 10 am–12 pm" },
    ],
    petalSection: {
      title: "Elementary — Petal class",
      location: "Ruppin-Grundschule\nOffenbacher Str. 5A, 14197 Berlin",
      lead: "Still teaching Hangul by rote — giyeok, nieun, digeut…?",
      paragraphs: [
        "At Dodam Dodam we teach Hangul based on the principles of Hunminjeongeum Haerye: basic letters shaped like speech organs (ㄱ, ㄴ, ㅁ, ㅅ, ㅇ), with strokes added according to sound relationships and strength so children grasp the logic of the script quickly.",
        "Language involves listening, speaking, reading, and writing—but development does not always follow that order. In a whole-language approach, the four skills are interconnected in communication. We help children acquire them naturally, in an integrated way.",
      ],
      bullets: [
        "Stem and Petal classes focus on learning consonants and vowels and acquiring Hangul step by step",
        "Integrated language program centered on textbooks: listening, speaking, reading, writing",
        "Picture books and follow-up activities supporting five developmental areas (language, cognition, emotion, physical, social)",
        "Creative art exploring Korean culture and history (calligraphy, tea ceremony, traditional games, etc.)",
        "Special activities: Berlin Children’s Choir or creative art",
      ],
      textbooks: [
        "Materials: a new storybook each month",
        "Korean for overseas Koreans 1-1, 1-2 / 2-1, 2-2",
        "Reference: Hangul Narasa (Gaon Korean)",
      ],
      note: "※ Textbooks are provided by level; no separate textbook fee.",
    },
    fruitSection: {
      title: "Elementary / middle — Fruit class",
      location: "Pangea Haus e.V.\nTrautenaustraße 5, 10717 Berlin",
      paragraphs: [
        "The Fruit class is for elementary students who can listen, speak, read, and write. Language and thinking are closely linked. Beyond decoding, children need rich vocabulary and expression.",
        "Even from a single book, we guide students to make it their own, think broadly, and express ideas logically.",
      ],
      bullets: [
        "Hangul education building expression and thinking — idioms, native words, Sino-Korean compounds, neologisms",
        "Current affairs vocabulary and news language as a base for thinking and writing",
        "Picture books and follow-up activities for expansive thinking and self-expression",
        "Creative art exploring Korean culture and history (calligraphy, tea ceremony, traditional games, etc.)",
        "Special activities: Berlin Children’s Choir, creative art",
      ],
      textbooks: [
        "Materials: a new traditional tale book each month",
        "Korean for overseas Koreans 3-1, 3-2 / 4-1, 4-2",
      ],
      note: "※ Textbooks are provided by level; no separate textbook fee.",
    },
  },
  adults: {
    title: "Adult classes",
    tiers: [
      {
        name: "Beginner",
        schedule: "Every Friday 4:30–6:00 pm (20 sessions total)",
        tuition: "€70 per month",
        textbook: "Customized Korean (Germany edition) vols. 1–2",
      },
      {
        name: "Intermediate",
        schedule: "Every Saturday 10:00 am–1:00 pm",
        tuition: "€70 per month",
        textbook: "Customized Korean (Germany edition) vols. 3–4",
      },
      {
        name: "Advanced",
        schedule: "Every Saturday 10:00 am–1:00 pm",
        tuition: "€70 per month",
        textbook: "Customized Korean (Germany edition) vols. 5–6",
      },
    ],
  },
};
