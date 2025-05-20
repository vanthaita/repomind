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
import { 
  FiGitCommit, 
  FiGitPullRequest, 
  FiMessageSquare,
  FiCode,
  FiTrendingUp,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiStar,
  FiGitBranch,
  FiPlus,
  FiCreditCard,
  FiInfo,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
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

  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className={cn("transition-all duration-500 bg-white", 
      isCollapsed ? "w-20 bg-white z-10" : "w-64"
    )}>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className={cn(
          "px-2 py-2 border-r border-[#383838] transition-all duration-300 fixed h-full z-50 bg-[#252525]",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarHeader className="text-white p-4 border-b border-[#383838]">
          <Link href="/dashboard/" className={`font-extrabold text-xl cursor-pointer text-white flex ${isCollapsed ? "justify-center" : "justify-start"}`}>
            {isCollapsed ? (
              <span className="bg-green-500 text-white px-1.5 rounded">R</span>
            ) : (
              <span>Repo<strong className="bg-green-500 text-white px-0.5 rounded">Mind</strong></span>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent className="overflow-hidden flex flex-col h-full">
          <div className="mb-4 p-2">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[#666] text-xs uppercase font-semibold mb-2">
                Repository
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="space-y-1">
              <NavItem 
                icon={<FiMessageSquare />} 
                href={`/project/${projectId}`} 
                active={isActive(`/project/${projectId}`)}
                collapsed={isCollapsed}
                title="Discussion"
              />
              <NavItem 
                icon={<FiGitCommit />} 
                href={`/project/${projectId}/commits`} 
                active={isActive(`/project/${projectId}/commits`)}
                collapsed={isCollapsed}
                title="Commits"
              />
              <NavItem 
                icon={<FiGitPullRequest />} 
                href={`/project/${projectId}/pull-requests`} 
                active={isActive(`/project/${projectId}/pull-requests`)}
                collapsed={isCollapsed}
                title="Pull Requests"
              />
              <NavItem 
                icon={<FiCode />} 
                href={`/project/${projectId}/code`} 
                active={isActive(`/project/${projectId}/code`)}
                collapsed={isCollapsed}
                title="Code Analysis"
              />
            </SidebarMenu>
          </div>

          {/* Insights Section */}
          <div className="mb-4 p-2">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-[#666] text-xs uppercase font-semibold mb-2">
                Insights
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="space-y-1">
              <NavItem 
                icon={<FiTrendingUp />} 
                href={`/project/${projectId}/metrics`} 
                active={isActive(`/project/${projectId}/metrics`)}
                collapsed={isCollapsed}
                title="Code Metrics"
              />
              <NavItem 
                icon={<FiBarChart2 />} 
                href={`/project/${projectId}/patterns`} 
                active={isActive(`/project/${projectId}/patterns`)}
                collapsed={isCollapsed}
                title="Commit Patterns"
              />
              <NavItem 
                icon={<FiGitBranch />} 
                href={`/project/${projectId}/branches`} 
                active={isActive(`/project/${projectId}/branches`)}
                collapsed={isCollapsed}
                title="Branch Management"
              />
              <NavItem 
                icon={<FiUsers />} 
                href={`/project/${projectId}/collaboration`} 
                active={isActive(`/project/${projectId}/collaboration`)}
                collapsed={isCollapsed}
                title="Team Collaboration"
              />
            </SidebarMenu>
          </div>

          {isChatPage && (
            <div className="mb-4 p-2 border-t border-[#383838] pt-4">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-[#666] text-xs uppercase font-semibold mb-2">
                  Chats
                </SidebarGroupLabel>
              )}
              <SidebarMenu className="space-y-1">
                {conversations?.map(conversation => (
                  <SidebarMenuItem key={conversation.id} className="cursor-pointer">
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => router.push(`/dashboard/chat/${conversation.id}`)}
                        className={cn(
                          'flex items-center p-2 rounded-md transition-colors duration-200',
                          {
                            'bg-[#383838] text-white': conversation.id === id,
                            'hover:bg-[#333] text-[#aaa]': conversation.id !== id,
                          },
                          isCollapsed && 'justify-center'
                        )}
                        title={conversation.title || "Untitled Conversation"}  
                      >
                        {isCollapsed ? (
                          <span className="text-white font-medium uppercase">
                            {(conversation.title || "U").charAt(0)}
                          </span>
                        ) : (
                          <span className="text-white truncate">{conversation.title || "Untitled Conversation"}</span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              
              <Button
                className={cn(
                  "mt-2 text-white hover:bg-[#383838] transition-colors duration-200 bg-transparent w-full",
                  isCollapsed ? "p-2" : "p-2 justify-start"
                )}
                variant="ghost"
                onClick={onSubmit}
                disabled={isLoading}
                title="New Chat"  
              >
                <FiPlus className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">New Chat</span>}
              </Button>
            </div>
          )}

          <div className="mt-auto p-2 border-t border-[#383838]">
            <SidebarMenu className="space-y-1">
              <NavItem 
                icon={<FiPlus />} 
                onClick={() => setIsModalOpen(true)}
                collapsed={isCollapsed}
                title="New Project"
              />
              <NavItem 
                icon={<FiSettings />} 
                href={`/project/${projectId}/settings`} 
                active={isActive(`/project/${projectId}/settings`)}
                collapsed={isCollapsed}
                title="Settings"
              />
              <NavItem 
                icon={<FiCreditCard />} 
                href="/billing" 
                active={isActive("/billing")}
                collapsed={isCollapsed}
                title="Billing"
              />
              <NavItem 
                icon={<FiInfo />} 
                href="/about" 
                active={isActive("/about")}
                collapsed={isCollapsed}
                title="About"
              />
            </SidebarMenu>
          </div>

          {!isCollapsed && (
            <div className="p-2 text-center text-xs text-[#666]">
              @2025 Repo<strong className="bg-green-500 text-white px-0.5 rounded">Mind</strong>
            </div>
          )}
        </SidebarContent>

        <Button
          onClick={toggleSidebar}
          className="absolute top-5 right-0 transform translate-x-1/2 bg-[#252525] p-1 rounded-full border border-[#383838] hover:bg-[#383838] transition-colors duration-200"
          title={isCollapsed ? "Expand" : "Collapse"}  
        >
          {isCollapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
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

const NavItem = ({ 
  icon, 
  href, 
  active, 
  collapsed, 
  title,
  onClick 
}: { 
  icon: React.ReactNode, 
  href?: string,
  active?: boolean,
  collapsed: boolean,
  title: string,
  onClick?: () => void
}) => {
  const content = (
    <div
      className={cn(
        'flex items-center p-2 rounded-md transition-colors duration-200',
        {
          'bg-[#383838] text-white': active,
          'hover:bg-[#333] text-[#aaa]': !active,
        },
        collapsed ? 'justify-center' : 'justify-start'
      )}
      title={title}
      onClick={onClick}
    >
      {icon}
      {!collapsed && <span className="ml-2">{title}</span>}
    </div>
  );

  return href ? (
    <Link href={href} passHref>
      <SidebarMenuItem className="cursor-pointer">
        <SidebarMenuButton asChild>
          {content}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </Link>
  ) : (
    <SidebarMenuItem className="cursor-pointer">
      <SidebarMenuButton asChild>
        {content}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AppSidebar;