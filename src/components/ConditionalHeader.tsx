'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/page';

export const ConditionalHeader = () => {
  const pathname = usePathname();
  
  // Don't show header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  // Don't show header on unauthorized page
  if (pathname === '/unauthorized') {
    return null;
  }
  
  return (
    <Header />
  );
};
