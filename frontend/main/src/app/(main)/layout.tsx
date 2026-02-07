'use client';

import { AppThemeProvider, useAppTheme } from '@/app/(main)/(shared)/context/AppThemeContext';
import { Sidebar } from '@/components/Sidebar';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-[#000000]' : 'bg-[#F5F5F7]'
      }`}
    >
      <Sidebar theme={theme} onThemeToggle={toggleTheme} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </AppThemeProvider>
  );
}
