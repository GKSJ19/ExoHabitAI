// src/app/dashboard/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import with no SSR to avoid Three.js SSR issues
const MissionControl = dynamic(
  () => import('@/components/dashboard/MissionControl'),
  { ssr: false }
);

export default function DashboardPage() {
  return <MissionControl />;
}