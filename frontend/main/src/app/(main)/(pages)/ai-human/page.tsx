'use client';

import { useAppTheme } from '@/app/(main)/(shared)/context/AppThemeContext';
import { AIHuman } from '@/components/AIHuman';

export default function AIHumanPage() {
  const { theme } = useAppTheme();

  return (
    <div className="h-full min-h-0 flex flex-col">
      <AIHuman theme={theme} />
    </div>
  );
}
