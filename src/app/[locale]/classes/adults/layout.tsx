import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "성인반 | 학급 소개 | 베를린 도담도담한글학교",
};

export default function AdultsClassLayout({ children }: { children: ReactNode }) {
  return children;
}
