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
import { Plus, Settings, CreditCard, Info, ChevronLeft, ChevronRight, FolderOpenDotIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { persistConversation } from "./dashboard/action";
import useRefetch from "@/hooks/use-refresh";
import useCollapsed from "@/hooks/use-collapsed";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AppSidebar = () => {
  const { projectId, projects, setProjectId } = UseProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversations } = UseConversation();
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/');
  const id = segments[segments.length - 1];
  const [isLoading, setIsLoading] = useState(false);
  const refetch = useRefetch();
  const isChatPage = pathname.startsWith("/dashboard/chat");
  const { isCollapsed, toggleSidebar } = useCollapsed();

  const handleProjectChange = (newProjectId: string) => {
    setProjectId(newProjectId);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const newConversationID = await persistConversation('Untitled', projectId);
      delay(2000);
      refetch();
      router.push(`/dashboard/chat/${newConversationID}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(" transition-all duration-500", 
      isCollapsed ? "w-20" : "w-64"
    )}>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className={cn(
          "px-2 py-2 border-r-[#424242] transition-all duration-300 fixed h-full z-50 bg-[#282828]",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarHeader className="text-white">
          <Link href="/dashboard/" className={`font-extrabold text-[1.6rem] leading-[3rem] cursor-pointer text-white flex ${isCollapsed ? "justify-center" : "justify-start"}`}>
            {isCollapsed ? <>
              <p className="text-center"><strong className="bg-green-500 text-white px-1.5 rounded">R</strong></p>
              </> : (
              <>
                <span>Repo<strong className="bg-green-500 text-white px-0.5 rounded">Mind</strong></span>
              </>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent className="overflow-hidden">
          {!isCollapsed ? (
            <SidebarGroupLabel className="text-gray-300/50 text-sm font-medium uppercase tracking-wider">
              Your Project
            </SidebarGroupLabel>
          ) : (
            <SidebarGroupLabel className="text-gray-300/90 text-4xl text-center justify-center font-medium uppercase tracking-wider">
              <FolderOpenDotIcon className="w-10 h-10"/> 
            </SidebarGroupLabel>
          )}
          <SidebarContent className={cn('h-[calc(100vh-300px)] overflow-y-auto scroll-custom')}>
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
                        },
                        isCollapsed && 'justify-center w-8 h-8 p-0 mx-auto'
                      )}
                      title={project.name}  
                    >
                      {isCollapsed ? (
                        <span className="text-white text-xl font-medium uppercase">
                          {project.name.charAt(0)}
                        </span>
                      ) : (
                        <span className="text-white">{project.name}</span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          {isChatPage && (
            <>
              <SidebarGroupLabel className="text-gray-300/50 text-sm font-medium uppercase tracking-wider border-t border-t-[#424242] pt-4 mt-4 w-full">
                Chats
              </SidebarGroupLabel>
              <SidebarContent className={cn("h-[calc(100vh-300px)] overflow-y-auto scroll-custom")}>
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
                            },
                            isCollapsed && 'justify-center w-8 h-8 p-0 mx-auto'
                          )}
                          title={conversation.title || "Untitled Conversation"}  
                        >
                          {isCollapsed ? (
                            <span className="text-white text-sm font-medium uppercase">
                              {(conversation.title || "Untitled").charAt(0)}
                            </span>
                          ) : (
                            <span className="text-white">{conversation.title || "Untitled Conversation"}</span>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              
              <Button
                className={cn(
                  "text-white hover:bg-[#424242] hover:text-white transition-colors duration-200 bg-transparent",
                  isCollapsed ? "w-10 h-10 p-0 mx-auto" : "w-full"
                )}
                variant="outline"
                onClick={onSubmit}
                disabled={isLoading}
                title="New Chat"  
              >
                {isCollapsed ? (
                  <Plus className="w-5 h-5" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">New Chat</span>
                  </>
                )}
              </Button>
            </>
          )}

          {!isCollapsed && (
            <SidebarGroupLabel className="text-gray-300/50 text-sm font-medium uppercase tracking-wider border-t border-t-[#424242] pt-4">
              Menu
            </SidebarGroupLabel>
          )}
          
          <SidebarMenu className="mb-16 space-y-1">
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div
                  onClick={() => setIsModalOpen(true)}
                  className={cn(
                    'flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                  title="New Project"  
                >
                  <Plus className="w-4 h-4" />
                  {!isCollapsed && <span className="ml-2">New Project</span>}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className={cn(
                  'flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                title="Settings"  
                >
                  <Settings className="w-4 h-4" />
                  {!isCollapsed && <span className="ml-2">Settings</span>}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className={cn(
                  'flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                title="Billing"  
                >
                  <CreditCard className="w-4 h-4" />
                  {!isCollapsed && <span className="ml-2">Billing</span>}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className={cn(
                  'flex items-center p-2 rounded-md text-white hover:bg-[#424242] transition-colors duration-200',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                title="About"  
                >
                  <Info className="w-4 h-4" />
                  {!isCollapsed  && <span className="ml-2">About</span>}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {!isCollapsed && (
            <SidebarGroupLabel className="rounded-none w-full">
              <h6 className="cursor-pointer text-gray-300/50 text-sm">
                @2025 Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
              </h6>
            </SidebarGroupLabel>
          )}
        </SidebarContent>

        <Button
          onClick={toggleSidebar}
          className="absolute top-5 right-0 transform translate-x-1/2 bg-[#282828] p-2 rounded-full border border-[#424242] hover:bg-[#424242] transition-colors duration-200"
          title={isCollapsed ? "Expand" : "Collapse"}  
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
        </Button>
      </Sidebar>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <CreatePage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
      )}
    </div>
  );
}

export default AppSidebar;