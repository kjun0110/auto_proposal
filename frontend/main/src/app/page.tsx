'use client';

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun, Settings, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isDark ? "bg-[#0a0a0a] text-white" : "bg-[#F5F5F7] text-gray-900"
      }`}
    >
      {/* 우측 상단: 다크모드, 설정, 로그인 */}
      <header className="absolute top-0 right-0 p-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
          aria-label={isDark ? "라이트 모드" : "다크 모드"}
        >
          {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
          aria-label="설정"
        >
          <Settings className="size-5" />
        </Button>
        <Button asChild>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2"
          >
            <LogIn className="size-4" />
            로그인
          </Link>
        </Button>
      </header>

      {/* 가운데: proposal service */}
      <main className="flex-1 flex items-center justify-center">
        <h1
          className={`text-4xl md:text-5xl font-semibold tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          proposal service
        </h1>
      </main>
    </div>
  );
}
