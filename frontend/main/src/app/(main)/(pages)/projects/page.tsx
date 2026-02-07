'use client';

import { useAppTheme } from '@/app/(main)/(shared)/context/AppThemeContext';
import { ProjectCrawling } from '@/components/ProjectCrawling';

export default function ProjectsPage() {
  const { theme } = useAppTheme();

  return (
    <div className="min-h-full">
      <ProjectCrawling theme={theme} />
    </div>
  );
}
