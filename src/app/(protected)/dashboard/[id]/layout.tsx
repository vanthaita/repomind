import { SidebarProvider } from '@/components/ui/sidebar';
import React, { Suspense } from 'react';
import ContentProvider from '@/provider/ContentProvider';
import RippleLoader from '@/app/loading';
import { PageLoading } from '@/components/ui/loading';
import DashboardProjectHeader from './DashboardHeader';
import DashboardProvider from '@/provider/DashboardProvider';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <main suppressHydrationWarning className='scroll-custom'
    >
      <SidebarProvider>
        <ContentProvider>
          <Suspense fallback={<PageLoading />}>
              <DashboardProvider>
                {children}
              </DashboardProvider>
          </Suspense>
        </ContentProvider>
      </SidebarProvider>
    </main>
  );
};

export default DashboardLayout;