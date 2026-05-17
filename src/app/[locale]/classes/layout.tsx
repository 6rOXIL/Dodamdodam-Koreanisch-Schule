import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClassesLayoutClient from "@/features/classes/ClassesLayoutClient";

export const metadata: Metadata = {
  title: "학급 소개 | 도담도담 한글학교",
  description: "유치반, 초등반, 성인반 수업 구성과 시간표를 안내합니다.",
};

export default function ClassesLayout({ children }: { children: ReactNode }) {
  return <ClassesLayoutClient>{children}</ClassesLayoutClient>;
}
