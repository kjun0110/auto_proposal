'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, Bot, Settings, LogOut, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const menuItems = [
  { path: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { path: '/projects', label: '공모사업', icon: Briefcase },
  { path: '/proposal', label: '제안서 작성', icon: FileText },
  { path: '/ai-human', label: 'AI 휴먼', icon: Bot },
];

export function Sidebar({ theme, onThemeToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`w-64 h-screen backdrop-blur-xl bg-opacity-80 border-r flex flex-col shrink-0 ${
      theme === 'dark' 
        ? 'bg-[#1C1C1E] border-white/10' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Logo Section */}
      <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <h1 className={`text-2xl font-semibold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Proposal
        </h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 ease-out
                ${theme === 'dark'
                  ? isActive 
                    ? 'bg-white/10 text-white shadow-lg shadow-white/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  : isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className={`p-4 border-t space-y-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <button 
          onClick={onThemeToggle}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{theme === 'dark' ? '라이트 모드' : '다크 모드'}</span>
        </button>
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          theme === 'dark'
            ? 'text-gray-400 hover:text-white hover:bg-white/5'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}>
          <Settings className="w-5 h-5" />
          <span className="font-medium">설정</span>
        </button>
        <Link
          href="/"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            theme === 'dark'
              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
              : 'text-red-600 hover:text-red-700 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">로그아웃</span>
        </Link>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              John Doe
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
