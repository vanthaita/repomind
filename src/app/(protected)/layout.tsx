import React, { Suspense } from 'react';
import RippleLoader from '../loading';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <main className='bg-[#282828]' suppressHydrationWarning>
    <Suspense fallback={<RippleLoader />}>
      {children}
    </Suspense>  
    </main>
    
  );
};

export default DashboardLayout;