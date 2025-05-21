import { SidebarProvider } from '@/components/ui/sidebar';
import React, { Suspense } from 'react';
import ContentProvider from '@/provider/ContentProvider';
import RippleLoader from '@/app/loading';
import DashboardProjectHeader from './DashboardHeader';
import DashboardProvider from '@/provider/DashboardProvider';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <main suppressHydrationWarning>
      <SidebarProvider>
        <ContentProvider>
          <Suspense fallback={<RippleLoader />}>
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