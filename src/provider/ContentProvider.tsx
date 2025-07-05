'use client';

import AppSidebar from "@/app/(protected)/appSidebar";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

const ContentProvider = ({ children }: Props) => {
  return (
    <div className="flex w-full"> 
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <div className={cn('w-full transition-all duration-300 ')}>
        {children}
      </div>
    </div>
  );
};

export default ContentProvider;