'use client'
import React, { useEffect, useState } from 'react';
import { FiGitCommit, FiGitPullRequest, FiMessageSquare } from 'react-icons/fi';
import { motion, Variants } from 'framer-motion';
import UseProject from '@/hooks/use-project';
import { Octokit } from 'octokit';
import CommitLog from './commit';
import AskQuestion from './askQuestion';
import PullRequest from './pullRequest';
import AskList from './askList';
import Link from 'next/link';

interface RepoData {
  stargazers_count: number;
  forks_count: number;
}

const DashBoardPage: React.FC = () => {
  const { project } = UseProject();
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('ask');

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
        console.log('Fetched repository data:', data);
      } catch (error) {
        console.error('Error fetching repository data:', error);
      }
    }
    fetchRepoData();
  }, [project?.githubUrl]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const handleSectionChange = (section: string) => {
    if (activeSection === section) {
      setActiveSection('ask');
    } else {
      setActiveSection(section);
    }
  };

  return (
    <section className="h-screen flex flex-col bg-[#282828] w-auto text-white overflow-hidden">
      <header className="w-full h-20 border-b border-[#383838] flex items-center px-4 bg-[#282828]/90 backdrop-blur-sm">
        <div className="flex-1">
          <div className='flex items-end gap-2'>
              <h1 className="text-xl font-bold bg-green-500 bg-clip-text text-transparent break-words">
                {project?.name || 'New Project'}{' '}
              </h1>
            <span className="text-xs text-gray-500">{project?.updated_at.toDateString()}</span>
          </div>
          {project ? (
            <Link className='' href={project.githubUrl || '#'}>
              <p className="text-sm text-[#888] mt-1">
                {project.githubUrl || 'No repository selected'}
              </p>
            </Link>
          ) : (
            <p className="text-sm text-[#888] mt-1">No project data available</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="items-center space-x-2 text-[#888] hidden md:flex">
            <span className="px-3 py-1 rounded-full bg-[#383838] text-sm">
              ⭐ {repoData ? repoData.stargazers_count : '1.2k'}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#383838] text-sm">
              🚀 {repoData ? repoData.forks_count : '234'}
            </span>
          </div>
          <button
            className={`p-2 rounded-lg ${activeSection === 'ask' ? 'bg-green-600/30' : 'bg-[#383838]'} hover:bg-green-600/30 transition-colors`}
            onClick={() => handleSectionChange('ask')}
          >
            <FiMessageSquare className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-lg ${activeSection === 'pr' ? 'bg-[#424242]/30' : 'bg-[#383838]'} hover:bg-[#424242]/30 transition-colors`}
            onClick={() => handleSectionChange('pr')}
          >
            <FiGitPullRequest className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-lg ${activeSection === 'commits' ? 'bg-blue-600/30' : 'bg-[#383838]'} hover:bg-blue-600/30 transition-colors`}
            onClick={() => handleSectionChange('commits')}
          >
            <FiGitCommit className="w-5 h-5" />
          </button>
        </div>
      </header>
      {activeSection === 'commits' && <div className="flex-1 w-full h-full px-2 overflow-y-auto scroll-custom">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="px-4"
        >
          <CommitLog />
        </motion.div>
      </div>}
      {activeSection === 'ask' && (
        <div className="flex-1 w-full h-full overflow-y-auto scroll-custom mb-4">
          <motion.div initial="hidden" animate="show" variants={containerVariants} className="w-full h-full">
            <AskList />
          </motion.div>
        </div>
      )}

      {activeSection === 'pr' && <div className="flex-1 w-full h-full overflow-y-auto scroll-custom">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className=""
        >
         <PullRequest />
        </motion.div>
      </div>}
    </section>
  );
};

export default DashBoardPage;