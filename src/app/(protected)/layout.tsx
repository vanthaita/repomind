import { SidebarProvider } from '@/components/ui/sidebar'
import React, { Suspense } from 'react'
import AppSidebar from './appSidebar'
import { Toaster } from "@/components/ui/toaster"
import RippleLoader from '../loading'

type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <div className='overflow-y-scroll h-full scroll-custom bg-[#282828] font-sans antialiased'>
          <Suspense fallback={<RippleLoader />}>
            {children}
          </Suspense>
          <Toaster />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default SidebarLayout
