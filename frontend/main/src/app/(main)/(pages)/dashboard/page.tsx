'use client';

import { useAppTheme } from '@/app/(main)/(shared)/context/AppThemeContext';
import { DashboardOverview } from '@/components/DashboardOverview';

export default function DashboardPage() {
  const { theme } = useAppTheme();

  return <DashboardOverview theme={theme} />;
}
