'use client'

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UseProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import CreatePage from "./dashboard/NewProject";
import { usePathname, useRouter } from "next/navigation";
import UseConversation from "@/hooks/use-conversation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, CreditCard, Info } from "lucide-react"; // Import icons
import Link from "next/link";

const AppSidebar = () => {
  const { projectId, projects, setProjectId } = UseProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversations } = UseConversation();
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/');
  const id = segments[segments.length - 1];

  const isChatPage = pathname.startsWith("/dashboard/chat");

  const handleProjectChange = (newProjectId: string) => {
    setProjectId(newProjectId);
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="bg-[#282828] px-2 py-2 border-r-[#424242]"
      >
        <SidebarHeader className="text-white" >
          <Link href='/dashboard/' className="font-extrabold text-[1.7rem] leading-[3rem] cursor-pointer text-white">
            Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroupLabel className="text-gray-300/50 text-sm font-medium uppercase tracking-wider">
            Your Project
          </SidebarGroupLabel>
          <SidebarContent className='h-[calc(100vh-300px)] overflow-y-auto scroll-custom'>
            <SidebarMenu className="space-y-1">
              {projects?.map(project => (
                <SidebarMenuItem key={project.name} className="cursor-pointer">
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() => handleProjectChange(project.id)}
                      className={cn(
                        'flex items-center p-2 rounded-md transition-colors duration-200',
                        {
                          'bg-green-500 text-black': project.id === projectId,
                          'hover:bg-[#424242]': project.id !== projectId,
                        }
                      )}
                    >
                      <span className="text-white">{project.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          {isChatPage && (
            <>
              <SidebarGroupLabel className="text-gray-300/50 text-sm font-medium uppercase tracking-wider border-t border-t-[#424242] pt-4 mt-4">
                Conversations
              </SidebarGroupLabel>
              <SidebarContent className="h-[calc(100vh-300px)] overflow-y-auto scroll-custom">
                <SidebarMenu className="space-y-1">
                  {conversations?.map(conversation => (
                    <SidebarMenuItem key={conversation.id} className="cursor-pointer">
                      <SidebarMenuButton asChild>
                        <div
                          onClick={() => router.push(`/dashboard/chat/${conversation.id}`)}
                          className={cn(
                            'flex items-center p-2 rounded-md transition-colors duration-200',
                            {
                              'bg-green-500 text-black': conversation.id === id,
                              'hover:bg-[#424242]': conversation.id !== id,
                            }
                          )}
                        >
                          <span className="text-white">{conversation.title || "Untitled Conversation"}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </>
          )}

          <SidebarGroupLabel className="text-gray-300/50 text-sm font-medium uppercase tracking-wider border-t border-t-[#424242] pt-4 mt-4">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu className="mb-16 space-y-1">
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className="flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className="flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className="flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200">
                  <Info className="w-4 h-4 mr-2" />
                  About
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupLabel className="rounded-none w-full">
            <h6 className="cursor-pointer text-gray-300/50 text-sm">
              @2025 Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
            </h6>
          </SidebarGroupLabel>
        </SidebarContent>
      </Sidebar>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <CreatePage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
      )}
    </>
  );
}

export default AppSidebar;