'use client';

import Link from 'next/link';
import { LayoutDashboard, ExternalLink, Shield } from 'lucide-react';

export default function AdminMainPage() {
  const mainAppUrl =
    process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000';

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 flex flex-col">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold">Admin</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Proposal 서비스 어드민
            </h2>
            <p className="text-gray-600">
              메인 서비스 관리용 어드민 페이지입니다.
            </p>
          </div>

          <Link
            href={mainAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            메인 서비스 열기
            <ExternalLink className="w-4 h-4" />
          </Link>

          <p className="text-sm text-gray-500">
            메인 앱: <span className="font-mono">{mainAppUrl}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
