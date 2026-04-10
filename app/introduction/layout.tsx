import type { Metadata } from "next";
import type { ReactNode } from "react";
import IntroductionLayoutClient from "./IntroductionLayoutClient";

export const metadata: Metadata = {
  title: "학교 소개 | 도담도담 한글학교",
  description:
    "인사말, 학교 소개, 학사일정, 오시는 길 — 도담도담 한글학교 안내입니다.",
};

export default function IntroductionLayout({ children }: { children: ReactNode }) {
  return <IntroductionLayoutClient>{children}</IntroductionLayoutClient>;
}
