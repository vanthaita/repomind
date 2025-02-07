'use client'

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import UseProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"

const AppSidebar = () => {
    const {projectId, projects, setProjectId} = UseProject();
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                Logo
            </SidebarHeader>
            <SidebarContent>
                <Button className="w-fit ml-2" variant={'outline'}>
                    Create Project
                </Button>
                <SidebarGroupLabel>
                    Your Project
                </SidebarGroupLabel>
                <SidebarContent>
                    <SidebarMenu>
                        {projects?.map(project => {
                            return (
                                <SidebarMenuItem key={project.name} className="cursor-pointer">
                                    <SidebarMenuButton asChild > 
                                        <div onClick={() => setProjectId(project.id)}>
                                        <div className={cn(
                                                'rounded-md border size-6 flex items-center justify-center text-sm bg-white text-primary', {
                                                    'bg-primary text-white' : project.id === projectId
                                                }
                                            )}>
                                                {project.name[0]}
                                            </div>
                                            <span>{project.name}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                    
                </SidebarContent>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar