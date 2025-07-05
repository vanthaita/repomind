'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FiArrowLeft, FiFolder, FiGithub, FiStar, FiGitBranch, FiEye, FiClock, 
  FiUsers, FiActivity, FiCode, FiMessageSquare, FiGitPullRequest, FiGitCommit,
  FiTrendingUp, FiZap, FiSettings, FiBarChart, FiBookOpen, FiShield, FiPlay,
  FiCalendar, FiDownload, FiUpload, FiRefreshCw
} from 'react-icons/fi';
import { FaRobot, FaBrain, FaChartLine, FaRocket } from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { Octokit } from 'octokit';
import { useToast } from '@/hooks/use-toast';
import { RealtimeStatus } from '@/components/RealtimeStatus';
import { RealtimeTest } from '@/components/RealtimeTest';

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
  created_at: string;
  private: boolean;
  archived: boolean;
  fork: boolean;
  default_branch: string;
  topics: string[];
  license?: {
    name: string;
  };
}

const DashboardProjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { toast } = useToast();
  
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: projectResponse } = api.project.getProject.useQuery(
    { projectId },
    { enabled: !!projectId }
  );

  const importCommitsMutation = api.project.importCommits.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Imported ${data.data.importedCount} commits successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const importPullRequestsMutation = api.project.importPullRequests.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Imported ${data.data.importedCount} pull requests successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const project = projectResponse?.data;

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (!project?.githubUrl) {
        setIsLoading(false);
        return;
      }

      try {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = project.githubUrl.match(regex);
        if (!match) {
          setIsLoading(false);
          return;
        }

        const owner = match[1];
        const repo = match[2];
        const octokit = new Octokit();
        const { data } = await octokit.request('GET /repos/{owner}/{repo}', {
          owner: owner as string,
          repo: repo as string,
        });
        setRepoData(data as RepoData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, [project?.githubUrl]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays - 1} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-400',
      'TypeScript': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'C++': 'bg-pink-500',
      'C#': 'bg-purple-500',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-500',
      'PHP': 'bg-indigo-500',
      'Ruby': 'bg-red-600',
      'Swift': 'bg-orange-400',
      'Kotlin': 'bg-purple-400',
      'Dart': 'bg-blue-400',
      'Vue': 'bg-green-400',
      'React': 'bg-cyan-400',
      'HTML': 'bg-orange-500',
      'CSS': 'bg-blue-600',
      'SCSS': 'bg-pink-400',
      'Sass': 'bg-pink-400',
      'Less': 'bg-blue-400',
    };
    return colors[language] || 'bg-gray-500';
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#383838] rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFolder className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Project not found</h3>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-green-500 hover:bg-green-600">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282828]">
      <main className="max-w-9xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-4">
          <RealtimeStatus projectId={projectId} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                        <FiFolder className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-white mb-1">{project.name}</CardTitle>
                        {repoData?.description && (
                          <p className="text-gray-300 text-sm leading-relaxed">{repoData.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {repoData?.private && (
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          Private
                        </Badge>
                      )}
                      {repoData?.archived && (
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          Archived
                        </Badge>
                      )}
                      {repoData?.fork && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          Fork
                        </Badge>
                      )}
                      {repoData?.license && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                          {repoData.license.name}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {repoData?.language && (
                        <div className="flex items-center gap-2 p-3 bg-[#383838] rounded-lg">
                          <span className={`w-3 h-3 rounded-full ${getLanguageColor(repoData.language)} shadow-lg`}></span>
                          <span className="text-sm font-medium text-white">{repoData.language}</span>
                        </div>
                      )}
                      {repoData?.default_branch && (
                        <div className="flex items-center gap-2 p-3 bg-[#383838] rounded-lg">
                          <FiGitBranch className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">{repoData.default_branch}</span>
                        </div>
                      )}
                      {repoData?.size && repoData.size > 0 && (
                        <div className="flex items-center gap-2 p-3 bg-[#383838] rounded-lg">
                          <FiCode className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">
                            {repoData.size > 1024 ? `${(repoData.size / 1024).toFixed(1)} MB` : `${repoData.size} KB`}
                          </span>
                        </div>
                      )}
                      {repoData?.updated_at && (
                        <div className="flex items-center gap-2 p-3 bg-[#383838] rounded-lg">
                          <FiClock className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">Updated {formatDate(repoData.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {repoData && (
              <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <FiTrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">GitHub Statistics</CardTitle>
                      <p className="text-gray-400 text-sm">Repository metrics and activity</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FiStar className="w-5 h-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">{repoData.stargazers_count.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-gray-400">Stars</span>
                    </div>
                    
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FiGitBranch className="w-5 h-5 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{repoData.forks_count.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-gray-400">Forks</span>
                    </div>
                    
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FiEye className="w-5 h-5 text-green-400" />
                        <span className="text-2xl font-bold text-white">{repoData.watchers_count.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-gray-400">Watching</span>
                    </div>
                    
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FiActivity className="w-5 h-5 text-red-400" />
                        <span className="text-2xl font-bold text-white">{repoData.open_issues_count.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-gray-400">Open Issues</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {repoData?.topics && repoData.topics.length > 0 && (
              <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <FiBookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">Topics</CardTitle>
                      <p className="text-gray-400 text-sm">Repository topics and categories</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {repoData.topics.map((topic, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-[#383838] text-gray-300 border-[#383838] hover:bg-[#333]"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <FiActivity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">Recent Activity</CardTitle>
                    <p className="text-gray-400 text-sm">Latest updates and changes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-[#383838] rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FiGitCommit className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">New commit pushed</p>
                      <p className="text-xs text-gray-400">Updated README.md</p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-[#383838] rounded-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FiGitPullRequest className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Pull request opened</p>
                      <p className="text-xs text-gray-400">Feature: Add new API endpoint</p>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-[#383838] rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Repository starred</p>
                      <p className="text-xs text-gray-400">By developer123</p>
                    </div>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">Quick Actions</CardTitle>
                    <p className="text-gray-400 text-sm">Access project features</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/dashboard/${projectId}/chats`}>
                  <Button className="w-full justify-start bg-[#383838] hover:bg-[#333] text-white border-[#383838] mb-2">
                    <FiMessageSquare className="w-4 h-4 mr-3" />
                    AI Chat
                  </Button>
                </Link>
                <Link href={`/dashboard/${projectId}/commits`}>
                  <Button className="w-full justify-start bg-[#383838] hover:bg-[#333] text-white border-[#383838] mb-2">
                    <FiGitCommit className="w-4 h-4 mr-3" />
                    Commits
                  </Button>
                </Link>
                <Link href={`/dashboard/${projectId}/pull-requests`}>
                  <Button className="w-full justify-start bg-[#383838] hover:bg-[#333] text-white border-[#383838] mb-2">
                    <FiGitPullRequest className="w-4 h-4 mr-3" />
                    Pull Requests
                  </Button>
                </Link>
                <Link href={`/dashboard/${projectId}/issues`}>
                  <Button className="w-full justify-start bg-[#383838] hover:bg-[#333] text-white border-[#383838] mb-2">
                    <FiActivity className="w-4 h-4 mr-3" />
                    Issues
                  </Button>
                </Link>
                <Separator className="my-2" />
                <Button 
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white border-green-600 mb-2"
                  onClick={() => importCommitsMutation.mutate({ projectId })}
                  disabled={importCommitsMutation.isPending}
                >
                  <FiDownload className="w-4 h-4 mr-3" />
                  {importCommitsMutation.isPending ? 'Importing...' : 'Import Commits'}
                </Button>
                <Button 
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white border-blue-600 mb-2"
                  onClick={() => importPullRequestsMutation.mutate({ projectId })}
                  disabled={importPullRequestsMutation.isPending}
                >
                  <FiDownload className="w-4 h-4 mr-3" />
                  {importPullRequestsMutation.isPending ? 'Importing...' : 'Import Pull Requests'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <FaRobot className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <SiOpenai className="w-2 h-2 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-green-400">AI Features</CardTitle>
                    <p className="text-gray-400 text-sm">Powered by advanced AI</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#383838] rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FaBrain className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Code Analysis</h4>
                    <p className="text-gray-400 text-xs">AI-powered code insights</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-[#383838] rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FiMessageSquare className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Smart Chat</h4>
                    <p className="text-gray-400 text-xs">Ask questions about your code</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-[#383838] rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FiGitPullRequest className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">PR Assistant</h4>
                    <p className="text-gray-400 text-xs">AI review suggestions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Health Card */}
            <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <FiShield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">Project Health</CardTitle>
                    <p className="text-gray-400 text-sm">Code quality and security</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Code Quality</span>
                    <span className="text-sm font-semibold text-green-400">92%</span>
                  </div>
                  <Progress value={92} className="h-2 bg-[#383838]" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Security Score</span>
                    <span className="text-sm font-semibold text-green-400">95%</span>
                  </div>
                  <Progress value={95} className="h-2 bg-[#383838]" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Test Coverage</span>
                    <span className="text-sm font-semibold text-yellow-400">78%</span>
                  </div>
                  <Progress value={78} className="h-2 bg-[#383838]" />
                </div>
              </CardContent>
            </Card>

            {/* Project Info Card */}
            <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <FiFolder className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">Project Info</CardTitle>
                    <p className="text-gray-400 text-sm">Basic project details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Project ID</span>
                  <span className="text-sm text-white font-mono">{project.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Created</span>
                  <span className="text-sm text-white">{formatDate(project.created_at.toString())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Last Updated</span>
                  <span className="text-sm text-white">{formatDate(project.updated_at.toString())}</span>
                </div>
                {project.githubUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">GitHub URL</span>
                    <Link 
                      href={project.githubUrl} 
                      target="_blank"
                      className="text-sm text-green-400 hover:text-green-300 truncate ml-2"
                    >
                      View Repository
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Realtime Test Card */}
            <RealtimeTest projectId={projectId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardProjectPage;