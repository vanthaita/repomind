import { SidebarProvider } from '@/components/ui/sidebar';
import React, { Suspense } from 'react';
import ContentProvider from '@/provider/ContentProvider';
import RippleLoader from '@/app/loading';
import DashboardProjectHeader from './DashboardHeader';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <ContentProvider>
      <Suspense fallback={<RippleLoader />}>
        <DashboardProjectHeader>
          {children}
        </DashboardProjectHeader>
      </Suspense>
    </ContentProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;