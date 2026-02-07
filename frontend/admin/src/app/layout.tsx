import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin | Proposal Service",
  description: "Proposal 서비스 어드민",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
