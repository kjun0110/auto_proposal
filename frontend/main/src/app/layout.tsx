import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design System Integration",
  description: "ERP 프로젝트용 디자인 시스템 데모",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

