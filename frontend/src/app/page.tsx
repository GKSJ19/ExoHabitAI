// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#050810]">
      <div className="text-slate-600 font-mono text-sm uppercase tracking-wider">
        Loading...
      </div>
    </div>
  );
}