'use client'
import React, { useEffect, useState } from 'react';
import UseProject from '@/hooks/use-project';
import { Octokit } from 'octokit';
import { usePathname } from 'next/navigation';
import { FiGitBranch, FiStar } from 'react-icons/fi';

interface RepoData {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  watchers_count: number;
  language: string;
}

const DashboardProjectHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { project } = UseProject();
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchRepoData() {
      if (!project?.githubUrl) return;

      const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = project.githubUrl.match(regex);
      if (!match) return;
      const owner = match[1] as string;
      const repo = match[2] as string;

      const octokit = new Octokit();
      try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}', {
          owner,
          repo,
        });
        setRepoData(data as RepoData);
      } catch (error) {
        console.error('Error fetching repository data:', error);
      }
    }
    fetchRepoData();
  }, [project?.githubUrl]);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[4.3rem] border-b border-[#383838] flex items-center justify-between px-6 bg-[#252525]/90 backdrop-blur-sm">
          <div>
            <h2 className="text-lg font-semibold">
              {project?.name}
            </h2>
            <p className='text-sm text-neutral-500 cursor-pointer hover:underline'>{project?.githubUrl}</p>
          </div>
          
          {repoData && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <FiStar className="text-green-400" />
                <span>{repoData.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FiGitBranch className="text-blue-400" />
                <span>{repoData.forks_count}</span>
              </div>
              {repoData.language && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>{repoData.language}</span>
                </div>
              )}
            </div>
          )}
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardProjectHeader;