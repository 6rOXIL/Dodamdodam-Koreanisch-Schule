import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "초등반 | 학급 소개 | 도담도담 한글학교",
};

export default function ElementaryClassLayout({ children }: { children: ReactNode }) {
  return children;
}
