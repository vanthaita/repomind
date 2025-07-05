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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UseProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import CreatePage from "./dashboard/NewProject";
import { usePathname } from "next/navigation";
import { 
  FiGitCommit, 
  FiGitPullRequest, 
  FiMessageSquare,
  FiCode,
  FiTrendingUp,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiGitBranch,
  FiPlus,
  FiCreditCard,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiFolder,
  FiStar,
  FiEye,
  FiClock,
  FiActivity,
  FiZap,
  FiBookOpen,
  FiShield,
  FiPlay,
  FiAlertCircle
} from "react-icons/fi";
import { FaRobot, FaBrain } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useCollapsed from "@/hooks/use-collapsed";
import { MessageCircleCode } from "lucide-react";
import { api } from "@/trpc/react";

const AppSidebar = () => {
  const { projectId } = UseProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useCollapsed();

  const { data: projectResponse } = api.project.getProject.useQuery(
    { projectId: projectId || '' },
    { enabled: !!projectId }
  );
  const project = projectResponse?.data;

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.includes(path);
  };

  return (
    <div className={cn("transition-all duration-500 bg-white", 
      isCollapsed ? "w-20 bg-white z-10" : "w-64"
    )}>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className={cn(
          "px-2 py-2 border-r border-[#383838] overflow-hidden transition-all duration-300 fixed h-full z-50 bg-[#252525]",
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

        <SidebarContent className="flex flex-col h-[calc(100%-60px)]">
          <div className="flex-1 overflow-y-auto scroll-custom">
            <div className="mb-2 p-1">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-[#666] text-[11px] uppercase font-semibold mb-1 px-2">
                  Repository
                </SidebarGroupLabel>
              )}
              <SidebarMenu className="space-y-0.5">
                <NavItem 
                  icon={<FiMessageSquare size={18} />} 
                  href={`/dashboard/${projectId}`} 
                  active={isActive(`/dashboard/${projectId}`, true)}
                  collapsed={isCollapsed}
                  title="Project Overview"
                  badge={project ? "Active" : undefined}
                />
                <NavItem 
                  icon={<MessageCircleCode size={18} />} 
                  href={`/dashboard/${projectId}/chats`} 
                  active={isActive(`/dashboard/${projectId}/chats`)}
                  collapsed={isCollapsed}
                  title="AI Chat"
                  badge="AI"
                />
                <NavItem 
                  icon={<FiGitCommit size={18} />} 
                  href={`/dashboard/${projectId}/commits`} 
                  active={isActive(`/dashboard/${projectId}/commits`)}
                  collapsed={isCollapsed}
                  title="Commits"
                />
                <NavItem 
                  icon={<FiGitPullRequest size={18} />} 
                  href={`/dashboard/${projectId}/pull-requests`} 
                  active={isActive(`/dashboard/${projectId}/pull-requests`)}
                  collapsed={isCollapsed}
                  title="Pull Requests"
                />
                <NavItem 
                  icon={<FiAlertCircle size={18} />} 
                  href={`/dashboard/${projectId}/issues`} 
                  active={isActive(`/dashboard/${projectId}/issues`)}
                  collapsed={isCollapsed}
                  title="Issues"
                />
                <NavItem 
                  icon={<FiCode size={18} />} 
                  href={`/dashboard/${projectId}/code`} 
                  active={isActive(`/dashboard/${projectId}/code`)}
                  collapsed={isCollapsed}
                  title="Code Reference"
                />
              </SidebarMenu>
            </div>

            <div className="mb-2 p-1">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-[#666] text-[11px] uppercase font-semibold mb-1 px-2">
                  AI Features
                </SidebarGroupLabel>
              )}
              <SidebarMenu className="space-y-0.5">
                <NavItem 
                  icon={<FaRobot size={18} />} 
                  href={`/dashboard/${projectId}/ask`} 
                  active={isActive(`/dashboard/${projectId}/ask`)}
                  collapsed={isCollapsed}
                  title="Ask Questions"
                  badge="New"
                />
                <NavItem 
                  icon={<FaBrain size={18} />} 
                  href={`/dashboard/${projectId}/analysis`} 
                  active={isActive(`/dashboard/${projectId}/analysis`)}
                  collapsed={isCollapsed}
                  title="Code Analysis"
                />
                <NavItem 
                  icon={<FiZap size={18} />} 
                  href={`/dashboard/${projectId}/suggestions`} 
                  active={isActive(`/dashboard/${projectId}/suggestions`)}
                  collapsed={isCollapsed}
                  title="AI Suggestions"
                />
              </SidebarMenu>
            </div>

            {/* Insights Section */}
            <div className="mb-2 p-1">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-[#666] text-[11px] uppercase font-semibold mb-1 px-2">
                  Insights
                </SidebarGroupLabel>
              )}
              <SidebarMenu className="space-y-0.5">
                <NavItem 
                  icon={<FiTrendingUp size={18} />} 
                  href={`/dashboard/${projectId}/metrics`} 
                  active={isActive(`/dashboard/${projectId}/metrics`)}
                  collapsed={isCollapsed}
                  title="Metrics"
                />
                <NavItem 
                  icon={<FiBarChart2 size={18} />} 
                  href={`/dashboard/${projectId}/patterns`} 
                  active={isActive(`/dashboard/${projectId}/patterns`)}
                  collapsed={isCollapsed}
                  title="Patterns"
                />
                <NavItem 
                  icon={<FiGitBranch size={18} />} 
                  href={`/dashboard/${projectId}/branches`} 
                  active={isActive(`/dashboard/${projectId}/branches`)}
                  collapsed={isCollapsed}
                  title="Branches"
                />
                <NavItem 
                  icon={<FiUsers size={18} />} 
                  href={`/dashboard/${projectId}/collaboration`} 
                  active={isActive(`/dashboard/${projectId}/collaboration`)}
                  collapsed={isCollapsed}
                  title="Team"
                />
              </SidebarMenu>
            </div>

            <div className="mb-2 p-1">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-[#666] text-[11px] uppercase font-semibold mb-1 px-2">
                  Documentation
                </SidebarGroupLabel>
              )}
              <SidebarMenu className="space-y-0.5">
                <NavItem 
                  icon={<FiBookOpen size={18} />} 
                  href={`/dashboard/${projectId}/docs`} 
                  active={isActive(`/dashboard/${projectId}/docs`)}
                  collapsed={isCollapsed}
                  title="Documentation"
                />
                <NavItem 
                  icon={<FiShield size={18} />} 
                  href={`/dashboard/${projectId}/security`} 
                  active={isActive(`/dashboard/${projectId}/security`)}
                  collapsed={isCollapsed}
                  title="Security"
                />
                <NavItem 
                  icon={<FiPlay size={18} />} 
                  href={`/dashboard/${projectId}/deployment`} 
                  active={isActive(`/dashboard/${projectId}/deployment`)}
                  collapsed={isCollapsed}
                  title="Deployment"
                />
              </SidebarMenu>
            </div>
          </div>

          {!isCollapsed && (
            <div className="p-3 border-t border-[#383838]">
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative">
                      <FaRobot className="w-4 h-4 text-green-400" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-white rounded-full flex items-center justify-center">
                        <SiOpenai className="w-1 h-1 text-emerald-600" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-400">AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Online & Ready</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="p-1 border-t border-[#383838]">
            <SidebarMenu className="space-y-0.5">
              <NavItem 
                icon={<FiPlus size={18} />} 
                onClick={() => setIsModalOpen(true)}
                collapsed={isCollapsed}
                title="New Project"
              />
              <NavItem 
                icon={<FiSettings size={18} />} 
                href={`/dashboard/${projectId}/settings`} 
                active={isActive(`/dashboard/${projectId}/settings`)}
                collapsed={isCollapsed}
                title="Settings"
              />
              <NavItem 
                icon={<FiCreditCard size={18} />} 
                href="/billing" 
                active={isActive("/billing")}
                collapsed={isCollapsed}
                title="Billing"
              />
              <NavItem 
                icon={<FiInfo size={18} />} 
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
          className="absolute top-5 right-0 transform translate-x-1/2 bg-[#252525] p-1 rounded-full border border-[#383838] hover:bg-[#383838] transition-colors duration-200 z-50"
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
  onClick,
  badge
}: { 
  icon: React.ReactNode, 
  href?: string,
  active?: boolean,
  collapsed: boolean,
  title: string,
  onClick?: () => void,
  badge?: string
}) => {
  const content = (
    <div
      className={cn(
        'flex items-center p-2 rounded-md transition-colors duration-200 relative',
        {
          'bg-[#383838] text-white': active,
          'hover:bg-[#333] text-[#aaa]': !active,
        },
        collapsed ? 'justify-center' : 'justify-start'
      )}
      title={title}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <div className="flex items-center justify-between flex-1 ml-2">
          <span className="text-sm truncate">{title}</span>
          {badge && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs px-1.5 py-0.5",
                badge === "AI" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                badge === "New" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                "bg-gray-500/20 text-gray-400 border-gray-500/30"
              )}
            >
              {badge}
            </Badge>
          )}
        </div>
      )}
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