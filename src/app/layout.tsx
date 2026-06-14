import type { Metadata, Viewport } from "next";
import { getImagePath } from "@/lib/utils/imagePath";
import "./globals.css";

export const metadata: Metadata = {
  title: "도담도담 한글학교 | Dodamdodam Korean Language School",
  description:
    "한글과 한국 문화를 함께 배우는 도담도담 한글학교 공식 페이지입니다.",
  icons: {
    icon: getImagePath("/images/logo.png"),
    apple: getImagePath("/images/logo.png"),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-[100dvh] touch-manipulation antialiased">{children}</body>
    </html>
  );
}
