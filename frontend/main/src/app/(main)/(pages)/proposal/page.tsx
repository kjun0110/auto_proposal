'use client';

import { useAppTheme } from '@/app/(main)/(shared)/context/AppThemeContext';
import { ProposalGenerator } from '@/components/ProposalGenerator';

export default function ProposalPage() {
  const { theme } = useAppTheme();

  return (
    <div className="min-h-full">
      <ProposalGenerator theme={theme} />
    </div>
  );
}
