'use client'
import React, { useEffect, useState } from 'react';
import { FiGitCommit, FiGitPullRequest, FiMessageSquare } from 'react-icons/fi';
import { motion, Variants } from 'framer-motion';
import UseProject from '@/hooks/use-project';
import { Octokit } from 'octokit';
import CommitLog from './commit';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  color: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  gradient: string;
}

interface ActivityItemProps {
  type: 'commit' | 'pr' | 'comment';
  title: string;
  author: string;
  time: string;
}

interface RepoData {
  stargazers_count: number;
  forks_count: number;
  // add more fields if needed
}

const DashBoardPage: React.FC = () => {
  const { project } = UseProject();
  const [repoData, setRepoData] = useState<RepoData | null>(null);

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

  return (
    <section className="h-screen flex flex-col bg-[#282828] text-white overflow-hidden">
      <header className="w-full h-20 border-b border-[#383838] flex items-center px-8 bg-[#282828]/90 backdrop-blur-sm">
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {project?.name || 'New Project'}
          </h1>
          <p className="text-sm text-[#888] mt-1">
            {project?.githubUrl || 'No repository selected'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-[#888]">
            <span className="px-3 py-1 rounded-full bg-[#383838] text-sm">
              ⭐ {repoData ? repoData.stargazers_count : '1.2k'}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#383838] text-sm">
              🚀 {repoData ? repoData.forks_count : '234'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-2 overflow-y-auto scroll-custom">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="p-4"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FiMessageSquare className="w-6 h-6" />}
              title="Ask Question"
              description="Get instant answers about project details"
              linkText="Ask Now"
              gradient="from-green-600/30 to-green-700/30"
            />
            <FeatureCard
              icon={<FiGitPullRequest className="w-6 h-6" />}
              title="Pull Request Insights"
              description="Review and manage ongoing code integrations"
              linkText="View PRs"
              gradient="from-[#424242]/30 to-[#282828]/30"
            />
            
          </motion.div>
          <CommitLog />
        </motion.div>
      </main>
    </section>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, linkText, gradient }) => (
  <div className={`group bg-gradient-to-br ${gradient} p-6 rounded-xl border border-[#484848] hover:border-[#585858] transition-all duration-300`}>
    <div className="mb-4 text-green-400 group-hover:text-green-300 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-[#888] mb-4">{description}</p>
    <button className="text-green-400 hover:text-green-300 font-medium flex items-center space-x-2 transition-colors">
      <span>{linkText}</span>
      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
    </button>
  </div>
);

export default DashBoardPage;