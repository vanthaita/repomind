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
        <main className='w-full m-2'>
          <div className='border-sidebar-border bg-sidebar shadow rounded-md overflow-y-scroll h-full p-4'>
            {children}
            <Toaster />
          </div>
        </main>
    </SidebarProvider>
  )
}

export default SidebarLayout