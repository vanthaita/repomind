import { api } from '@/trpc/react'
import React from 'react'
import {useLocalStorage} from 'usehooks-ts';
const UseProject = () => {
    const {data: projectsResponse} = api.project.getProjects.useQuery({
      page: 1,
      limit: 20,
    });
    const projects = projectsResponse?.data || [];
    const [projectId, setProjectId] = useLocalStorage('projectId', ' ');
    const project = projects.find((project: any) => project.id === projectId);
    return {
        projects,
        project,
        projectId,
        setProjectId
    };
}

export default UseProject