import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "오시는 길 | 학교 소개 | 도담도담 한글학교",
};

export default function DirectionsLayout({ children }: { children: ReactNode }) {
  return children;
}
