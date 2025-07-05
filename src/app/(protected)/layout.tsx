import React, { Suspense } from 'react';
import RippleLoader from '../loading';
import { PageLoading } from '@/components/ui/loading';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <main className='bg-[#282828]' suppressHydrationWarning>
    <Suspense fallback={<PageLoading />}>
      {children}
    </Suspense>  
    </main>
    
  );
};

export default DashboardLayout;