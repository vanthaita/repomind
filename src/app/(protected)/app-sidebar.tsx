'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

const AppSidebar = () => {
  const { projectId, projects, setProjectId } = UseProject();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="bg-[#282828] px-2 py-2 border-r-[#424242]"
      >
        <SidebarHeader className="text-white">
          <h1 className="font-extrabold text-[1.7rem] leading-[3rem] cursor-pointer text-white">
            Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
          </h1>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroupLabel className="text-gray-300/50">
            Your Project
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu className="scroll-custom">
              {projects?.map(project => (
                <SidebarMenuItem key={project.name} className="cursor-pointer scroll-custom">
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() => setProjectId(project.id)}
                      className={cn('', {
                        'bg-green-500 text-black': project.id === projectId,
                      })}
                    >
                      <span className="text-white">{project.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarGroupLabel className="text-gray-300/50 border-t border-t-[#424242] rounded-none w-full">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu className="mb-16">
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div onClick={() => setIsModalOpen(true)} className="text-white hover:bg-[#424242] rounded-none">
                  New Project
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className="text-white hover:bg-[#424242] rounded-none">Settings</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className="text-white hover:bg-[#424242] rounded-none">Billing</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="cursor-pointer">
              <SidebarMenuButton asChild>
                <div className="text-white hover:bg-[#424242] rounded-none">About</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupLabel className="rounded-none w-full">
            <h6 className="cursor-pointer text-gray-300/50">
              @2025 Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
            </h6>
          </SidebarGroupLabel>
        </SidebarContent>
      </Sidebar>
      {isModalOpen && <CreatePage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </>
  );
}

export default AppSidebar;
