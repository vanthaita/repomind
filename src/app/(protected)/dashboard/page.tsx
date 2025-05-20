'use client'
import UseProject from '@/hooks/use-project';
import React, { useEffect, useState } from 'react'
import { Octokit } from 'octokit';
import { useRouter } from 'next/navigation';
import { FiGithub, FiStar, FiGitBranch, FiEye, FiCode, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface RepoData {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  html_url: string;
  open_issues_count: number;
  size: number;
  updated_at: string;
}

const DashboardPage = () => {
  const { projectId, projects, setProjectId } = UseProject();
  const [repoData, setRepoData] = useState<Record<string, RepoData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const handleProjectChange = (newProjectId: string) => {
    setProjectId(newProjectId);
    router.push(`/dashboard/${newProjectId}`);
  };

  useEffect(() => {
    const fetchAllReposData = async () => {
      if (!projects || projects.length === 0) return;

      const newRepoData: Record<string, RepoData> = {};
      const newLoading: Record<string, boolean> = {};

      for (const project of projects) {
        if (!project.githubUrl) continue;
        
        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = project.githubUrl.match(regex);
        if (!match) continue;
        
        const owner = match[1] as string;
        const repo = match[2] as string;
        const cacheKey = `${owner}/${repo}`;

        if (repoData[cacheKey]) continue;

        newLoading[cacheKey] = true;
        try {
          const octokit = new Octokit();
          const { data } = await octokit.request('GET /repos/{owner}/{repo}', {
            owner,
            repo,
          });
          newRepoData[cacheKey] = data as RepoData;
        } catch (error) {
          console.error(`Error fetching data for ${cacheKey}:`, error);
        } finally {
          newLoading[cacheKey] = false;
        }
      }

      setRepoData(prev => ({ ...prev, ...newRepoData }));
      setLoading(prev => ({ ...prev, ...newLoading }));
    };

    fetchAllReposData();
  }, [projects]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRepoData = (githubUrl: string) => {
    if (!githubUrl) return null;
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubUrl.match(regex);
    if (!match) return null;
    const owner = match[1];
    const repo = match[2];
    return repoData[`${owner}/${repo}`];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects?.map((project) => {
          const data = getRepoData(project.githubUrl as string);
          const isLoading = project.githubUrl ? loading[project.githubUrl] : false;
          return (
            <div 
              key={project.id}
              onClick={() => handleProjectChange(project.id)}
              className="border border-[#383838] rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer bg-[#282828] hover:bg-[#333] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg truncate">{project.name}</h2>
                  {data?.html_url && (
                    <Link href={data.html_url} target="_blank" onClick={e => e.stopPropagation()}>
                      <FiGithub className="text-gray-400 hover:text-white" />
                    </Link>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-[#383838] rounded"></div>
                    <div className="h-4 bg-[#383838] rounded w-3/4"></div>
                  </div>
                ) : (
                  <>
                    {data?.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{data.description}</p>
                    )}
                    
                    {data?.language && (
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        {data.language}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="mt-auto">
                {!isLoading && data && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <div className="flex space-x-3">
                      <span className="flex items-center">
                        <FiStar className="mr-1" /> {data.stargazers_count}
                      </span>
                      <span className="flex items-center">
                        <FiGitBranch className="mr-1" /> {data.forks_count}
                      </span>
                      <span className="flex items-center">
                        <FiEye className="mr-1" /> {data.watchers_count}
                      </span>
                    </div>
                    {data.updated_at && (
                      <span>Updated {formatDate(data.updated_at)}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* New Project Card */}
        <div 
          onClick={() => router.push('/dashboard/new-project')}
          className="border-2 border-dashed border-[#383838] rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer bg-[#282828] hover:bg-[#333] flex flex-col items-center justify-center min-h-[200px]"
        >
          <FiPlus className="text-3xl text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">New Project</h3>
          <p className="text-sm text-gray-400 text-center mt-1">Create a new project to get started</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;