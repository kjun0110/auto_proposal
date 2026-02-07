'use client';

import Link from 'next/link';
import { Briefcase, FileText, Bot, LayoutDashboard, ArrowRight } from 'lucide-react';

interface DashboardOverviewProps {
  theme: 'light' | 'dark';
}

const quickLinks = [
  { path: '/projects', label: '공모사업', description: '공모사업 크롤링 및 현황', icon: Briefcase },
  { path: '/proposal', label: '제안서 작성', description: 'AI 기반 제안서 생성', icon: FileText },
  { path: '/ai-human', label: 'AI 휴먼', description: 'AI 어시스턴트와 대화', icon: Bot },
];

const summaryCards = [
  { label: '진행 중인 공모', value: '12', sub: '이번 달' },
  { label: '작성된 제안서', value: '8', sub: '이번 주' },
  { label: 'AI 대화 수', value: '24', sub: '오늘' },
];

export function DashboardOverview({ theme }: DashboardOverviewProps) {
  const isDark = theme === 'dark';

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          대시보드
        </h2>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          서비스 현황과 빠른 메뉴를 확인하세요
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 border transition-all duration-200 ${
              isDark
                ? 'bg-[#2C2C2E] border-white/10'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {card.label}
            </p>
            <p className={`text-3xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {card.value}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          빠른 메뉴
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 hover:border-opacity-80 ${
                  isDark
                    ? 'bg-[#2C2C2E] border-white/10 hover:bg-[#3C3C3E]'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-white/10' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
                <ArrowRight className={`w-5 h-5 shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
