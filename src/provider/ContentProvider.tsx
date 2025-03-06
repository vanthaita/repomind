'use client';

import AppSidebar from "@/app/(protected)/appSidebar";
import useCollapsed from "@/hooks/use-collapsed";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

const ContentProvider = ({ children }: Props) => {
  const { isCollapsed } = useCollapsed();

  return (
    <div className="flex flex-1"> 
        <AppSidebar />
      <div className={cn('w-full transition-all duration-300')}>
        {children}
      </div>
    </div>
  );
};

export default ContentProvider;