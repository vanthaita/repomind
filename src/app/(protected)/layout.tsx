import { SidebarProvider } from '@/components/ui/sidebar';
import React, { Suspense } from 'react';
import AppSidebar from './appSidebar';
import ContentProvider from '@/provider/ContentProvider';

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
          <ContentProvider>
          {children}
        </ContentProvider>
    </SidebarProvider>
  );
};

export default SidebarLayout;