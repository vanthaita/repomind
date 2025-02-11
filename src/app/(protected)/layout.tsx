import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from './app-sidebar'
import { Toaster } from "@/components/ui/toaster"
type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({children}: Props) => {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main className='w-full'>
          <div className='overflow-y-scroll h-full scroll-custom bg-[#282828] font-sans antialiased'>
            {children}
            <Toaster />
          </div>
        </main>
    </SidebarProvider>
  )
}

export default SidebarLayout