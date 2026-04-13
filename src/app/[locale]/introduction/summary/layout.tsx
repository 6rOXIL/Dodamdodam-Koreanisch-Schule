import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "학교소개 | 학교 소개 | 도담도담 한글학교",
};

export default function SummaryLayout({ children }: { children: ReactNode }) {
  return children;
}
