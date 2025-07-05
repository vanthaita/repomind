'use client'
import UseProject from '@/hooks/use-project';
import React, { useEffect, useState, useMemo } from 'react'
import { Octokit } from 'octokit';
import { useRouter } from 'next/navigation';
import { 
  FiGithub, FiStar, FiGitBranch, FiEye, FiCode, FiPlus, FiFolder, 
  FiClock, FiUsers, FiSearch, FiFilter, FiGrid, FiList, FiTrendingUp,
  FiCalendar, FiActivity, FiZap, FiBookmark, FiMoreVertical
} from 'react-icons/fi';
import Link from 'next/link';
import { SectionLoading, ProjectCardSkeleton } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'updated' | 'stars' | 'forks' | 'created';

const DashboardPage = () => {
  const { projectId, projects, setProjectId } = UseProject();
  const [repoData, setRepoData] = useState<Record<string, RepoData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const router = useRouter();

  const handleProjectChange = (newProjectId: string) => {
    setProjectId(newProjectId);
    router.push(`/dashboard/${newProjectId}`);
  };

  useEffect(() => {
    const fetchAllReposData = async () => {
      if (!projects || projects.length === 0) {
        setIsLoading(false);
        return;
      }

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
      setIsLoading(false);
    };

    fetchAllReposData();
  }, [projects]);

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

  const getRepoData = (githubUrl: string) => {
    if (!githubUrl) return null;
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubUrl.match(regex);
    if (!match) return null;
    const owner = match[1];
    const repo = match[2];
    return repoData[`${owner}/${repo}`];
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

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    if (!projects) return [];

    let filtered = projects.filter(project => {
      const repoData = getRepoData(project.githubUrl as string);
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           repoData?.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (selectedFilter === 'public' && repoData?.private) return false;
      if (selectedFilter === 'private' && !repoData?.private) return false;
      if (selectedFilter === 'archived' && !repoData?.archived) return false;
      if (selectedFilter === 'fork' && !repoData?.fork) return false;
      
      return true;
    });

    // Sort projects
    filtered.sort((a, b) => {
      const aData = getRepoData(a.githubUrl as string);
      const bData = getRepoData(b.githubUrl as string);
      
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'updated':
          aValue = aData?.updated_at || a.updated_at || '';
          bValue = bData?.updated_at || b.updated_at || '';
          break;
        case 'created':
          aValue = aData?.created_at || a.created_at || '';
          bValue = bData?.created_at || b.created_at || '';
          break;
        case 'stars':
          aValue = aData?.stargazers_count || 0;
          bValue = bData?.stargazers_count || 0;
          break;
        case 'forks':
          aValue = aData?.forks_count || 0;
          bValue = bData?.forks_count || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [projects, searchTerm, sortBy, sortOrder, selectedFilter]);

  const getProjectStats = () => {
    if (!projects) return { total: 0, public: 0, private: 0, archived: 0 };
    
    const stats = projects.reduce((acc, project) => {
      const repoData = getRepoData(project.githubUrl as string);
      acc.total++;
      if (repoData?.private) acc.private++;
      else acc.public++;
      if (repoData?.archived) acc.archived++;
      return acc;
    }, { total: 0, public: 0, private: 0, archived: 0 });
    
    return stats;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#282828] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FiFolder className="w-7 h-7 text-green-400" />
            <h1 className="text-2xl font-semibold text-green-400">Your Projects</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = getProjectStats();

  return (
    <div className="min-h-screen bg-[#282828] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <FiFolder className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-green-400">Your Projects</h1>
              <p className="text-gray-400 text-sm">Manage and analyze your repositories</p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/new-project')}
            className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#282828] rounded-lg hover:bg-green-500 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
          >
            <FiPlus className="w-5 h-5" />
            <span className="font-medium">New Project</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#424242] border-[#383838] hover:border-green-500/50 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FiFolder className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#424242] border-[#383838] hover:border-green-500/50 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Public</p>
                  <p className="text-2xl font-bold text-white">{stats.public}</p>
                </div>
                <FiUsers className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#424242] border-[#383838] hover:border-green-500/50 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Private</p>
                  <p className="text-2xl font-bold text-white">{stats.private}</p>
                </div>
                <FiBookmark className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#424242] border-[#383838] hover:border-green-500/50 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Archived</p>
                  <p className="text-2xl font-bold text-white">{stats.archived}</p>
                </div>
                <FiActivity className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#424242] border-[#383838] text-white placeholder-gray-400 focus:border-green-500"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#424242] border-[#383838] text-white hover:bg-[#383838]">
                  <FiFilter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#424242] border-[#383838]">
                <DropdownMenuItem 
                  onClick={() => setSelectedFilter('all')}
                  className="text-white hover:bg-[#383838]"
                >
                  All Projects
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSelectedFilter('public')}
                  className="text-white hover:bg-[#383838]"
                >
                  Public Only
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSelectedFilter('private')}
                  className="text-white hover:bg-[#383838]"
                >
                  Private Only
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSelectedFilter('archived')}
                  className="text-white hover:bg-[#383838]"
                >
                  Archived
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSelectedFilter('fork')}
                  className="text-white hover:bg-[#383838]"
                >
                  Forks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#424242] border-[#383838] text-white hover:bg-[#383838]">
                  <FiTrendingUp className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#424242] border-[#383838]">
                <DropdownMenuItem 
                  onClick={() => setSortBy('name')}
                  className="text-white hover:bg-[#383838]"
                >
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('updated')}
                  className="text-white hover:bg-[#383838]"
                >
                  Last Updated
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('created')}
                  className="text-white hover:bg-[#383838]"
                >
                  Created Date
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('stars')}
                  className="text-white hover:bg-[#383838]"
                >
                  Stars
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('forks')}
                  className="text-white hover:bg-[#383838]"
                >
                  Forks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-[#424242] border-[#383838] text-white hover:bg-[#383838]"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
            
            <div className="flex border border-[#383838] rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-400 text-[#282828]' : 'bg-[#424242] text-white hover:bg-[#383838]'}`}
              >
                <FiGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-400 text-[#282828]' : 'bg-[#424242] text-white hover:bg-[#383838]'}`}
              >
                <FiList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProjects.map((project) => {
              const data = getRepoData(project.githubUrl as string);
              const isLoading = project.githubUrl ? loading[project.githubUrl] : false;
              
              return (
                <Card 
                  key={project.id}
                  className="relative overflow-hidden bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] hover:border-green-500 cursor-pointer"
                  onClick={() => handleProjectChange(project.id)}
                >
                  {/* Status Indicators */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    {data?.private && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    )}
                    {data?.archived && (
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    )}
                    {data?.fork && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </div>

                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                            <FiFolder className="w-4 h-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-bold text-white truncate">
                            {project.name}
                          </CardTitle>
                        </div>
                        
                        {/* Repository Info */}
                        {data && (
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <FiUsers className="w-3 h-3" />
                              {data.private ? 'Private' : 'Public'}
                            </span>
                            {data.fork && (
                              <span className="flex items-center gap-1">
                                <FiGitBranch className="w-3 h-3" />
                                Fork
                              </span>
                            )}
                            {data.archived && (
                              <span className="flex items-center gap-1">
                                <FiActivity className="w-3 h-3" />
                                Archived
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {data?.html_url && (
                        <Link 
                          href={data.html_url} 
                          target="_blank" 
                          onClick={e => e.stopPropagation()}
                          className="text-gray-400 hover:text-green-400 p-2 hover:bg-green-500/10 rounded-lg"
                        >
                          <FiGithub className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 relative z-10">
                    {isLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-[#383838] rounded"></div>
                        <div className="h-4 bg-[#383838] rounded w-3/4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-[#383838] rounded w-16"></div>
                          <div className="h-6 bg-[#383838] rounded w-20"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-[#383838] rounded w-12"></div>
                          <div className="h-4 bg-[#383838] rounded w-16"></div>
                          <div className="h-4 bg-[#383838] rounded w-12"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {data?.description && (
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {data.description}
                          </p>
                        )}
                        
                        {data?.language && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-[#383838] rounded-full">
                              <span className={`w-3 h-3 rounded-full ${getLanguageColor(data.language)} shadow-lg`}></span>
                              <span className="text-sm text-gray-300 font-medium">{data.language}</span>
                            </div>
                          </div>
                        )}
                        
                        {data && (
                          <div className="space-y-4">
                            {/* Stats with Icons */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center p-2 bg-[#383838] rounded-lg">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <FiStar className="w-4 h-4 text-yellow-400" />
                                  <span className="text-sm font-semibold text-white">
                                    {data.stargazers_count.toLocaleString()}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">Stars</span>
                              </div>
                              
                              <div className="text-center p-2 bg-[#383838] rounded-lg">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <FiGitBranch className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm font-semibold text-white">
                                    {data.forks_count.toLocaleString()}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">Forks</span>
                              </div>
                              
                              <div className="text-center p-2 bg-[#383838] rounded-lg">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <FiEye className="w-4 h-4 text-green-400" />
                                  <span className="text-sm font-semibold text-white">
                                    {data.watchers_count.toLocaleString()}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">Watching</span>
                              </div>
                            </div>
                            
                            {/* Additional Info */}
                            <div className="space-y-2">
                              {data.open_issues_count > 0 && (
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <FiActivity className="w-3 h-3" />
                                    Open Issues
                                  </span>
                                  <span className="font-medium">{data.open_issues_count}</span>
                                </div>
                              )}
                              
                              {data.size > 0 && (
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <FiCode className="w-3 h-3" />
                                    Size
                                  </span>
                                  <span className="font-medium">
                                    {data.size > 1024 ? `${(data.size / 1024).toFixed(1)} MB` : `${data.size} KB`}
                                  </span>
                                </div>
                              )}
                              
                              {data.updated_at && (
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#383838]">
                                  <span className="flex items-center gap-1">
                                    <FiClock className="w-3 h-3" />
                                    Last Updated
                                  </span>
                                  <span className="font-medium">{formatDate(data.updated_at)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {!data && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-[#383838] rounded-full flex items-center justify-center mx-auto mb-4">
                              <FiCode className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">No GitHub data available</p>
                            <p className="text-xs text-gray-600">This project may not be connected to GitHub</p>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {/* New Project Card */}
            <Card 
              className="relative overflow-hidden bg-gradient-to-br from-[#424242] to-[#383838] border-2 border-dashed border-[#383838] hover:border-green-500 cursor-pointer"
              onClick={() => router.push('/new-project')}
            >
              <CardContent className="flex flex-col items-center justify-center py-16 text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
                  <FiPlus className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Create New Project
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  Import a GitHub repository to start analyzing your codebase with AI-powered insights
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedProjects.map((project) => {
              const data = getRepoData(project.githubUrl as string);
              const isLoading = project.githubUrl ? loading[project.githubUrl] : false;
              
              return (
                <Card 
                  key={project.id}
                  className="relative overflow-hidden bg-gradient-to-r from-[#424242] to-[#383838] border-[#383838] hover:border-green-500 cursor-pointer"
                  onClick={() => handleProjectChange(project.id)}
                >
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                          <FiFolder className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-white truncate">
                              {project.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              {data?.private && (
                                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs border-purple-500/30">
                                  Private
                                </Badge>
                              )}
                              {data?.archived && (
                                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 text-xs border-orange-500/30">
                                  Archived
                                </Badge>
                              )}
                              {data?.fork && (
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs border-blue-500/30">
                                  Fork
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {data?.description && (
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                              {data.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            {data?.language && (
                              <div className="flex items-center gap-2 px-3 py-1 bg-[#383838] rounded-full">
                                <span className={`w-3 h-3 rounded-full ${getLanguageColor(data.language)} shadow-lg`}></span>
                                <span className="font-medium">{data.language}</span>
                              </div>
                            )}
                            
                            {data && (
                              <>
                                <div className="flex items-center gap-1">
                                  <FiStar className="w-4 h-4 text-yellow-400" />
                                  <span className="font-semibold">{data.stargazers_count.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiGitBranch className="w-4 h-4 text-blue-400" />
                                  <span className="font-semibold">{data.forks_count.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiEye className="w-4 h-4 text-green-400" />
                                  <span className="font-semibold">{data.watchers_count.toLocaleString()}</span>
                                </div>
                                {data.open_issues_count > 0 && (
                                  <div className="flex items-center gap-1">
                                    <FiActivity className="w-4 h-4 text-red-400" />
                                    <span className="font-semibold">{data.open_issues_count}</span>
                                  </div>
                                )}
                              </>
                            )}
                            
                            {data?.updated_at && (
                              <div className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                <span>Updated {formatDate(data.updated_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {data?.html_url && (
                          <Link 
                            href={data.html_url} 
                            target="_blank" 
                            onClick={e => e.stopPropagation()}
                            className="text-gray-400 hover:text-green-400 p-2 hover:bg-green-500/10 rounded-lg"
                          >
                            <FiGithub className="w-5 h-5" />
                          </Link>
                        )}
                        <div className="p-2 hover:bg-[#383838] rounded-lg">
                          <FiMoreVertical className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* New Project Card - List View */}
            <Card 
              className="relative overflow-hidden bg-gradient-to-r from-[#424242] to-[#383838] border-2 border-dashed border-[#383838] hover:border-green-500 cursor-pointer"
              onClick={() => router.push('/new-project')}
            >
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <FiPlus className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Create New Project
                    </h3>
                    <p className="text-sm text-gray-400">
                      Import a GitHub repository to start analyzing your codebase with AI-powered insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {(!projects || projects.length === 0) && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#424242] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFolder className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No projects yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Get started by creating your first project. Import a GitHub repository to begin analyzing your codebase.
            </p>
            <Button
              onClick={() => router.push('/new-project')}
              className="flex items-center gap-2 px-6 py-3 bg-green-400 text-[#282828] rounded-lg hover:bg-green-500 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span className="font-medium">Create Your First Project</span>
            </Button>
          </div>
        )}

        {/* No Results State */}
        {projects && projects.length > 0 && filteredAndSortedProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#424242] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No projects found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-green-400 text-[#282828] rounded-lg hover:bg-green-500 transition-colors"
            >
              <FiZap className="w-5 h-5" />
              <span className="font-medium">Clear Filters</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;