'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useRefetch from '@/hooks/use-refresh';
import { api } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EmojiConfetti from '@/components/Emoji';
import { motion } from 'framer-motion';
import { FaGithub, FaKey, FaProjectDiagram, FaArrowLeft, FaLightbulb, FaRobot, FaCodeBranch, FaShieldAlt, FaRocket, FaBrain, FaChartLine, FaUsers, FaLock, FaEye } from 'react-icons/fa';
import { RiGitRepositoryLine, RiVerifiedBadgeFill, RiCheckLine } from 'react-icons/ri';
import { SiOpenai } from 'react-icons/si';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const NewProjectPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>();
  const refetch = useRefetch();
  const createProject = api.project.createProject.useMutation();
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormInput) => {
    await createProject.mutateAsync({
      name: data.projectName,
      githubUrl: data.repoUrl,
      githubToken: data.githubToken,
    }, {
      onSuccess: () => {
        toast.success('Project created successfully!');
        refetch();
        reset();
        setShowConfetti(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create project. Please try again.');
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#282828]">
      {/* Header */}
      <header className="border-b border-[#383838] bg-[#424242]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors group"
            >
              <div className="p-2 bg-[#383838] rounded-lg group-hover:bg-green-500/10 transition-colors">
                <FaArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <RiVerifiedBadgeFill className="w-3 h-3 mr-1" />
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column - Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Form Card */}
            <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <RiGitRepositoryLine className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">Connect Repository</CardTitle>
                      <p className="text-gray-400 text-sm mt-1">Import your GitHub repository to get started</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="github" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#383838] p-1 rounded-lg">
                    <TabsTrigger 
                      value="github" 
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400"
                    >
                      <FaGithub className="w-4 h-4 mr-2" />
                      GitHub
                    </TabsTrigger>
                    <TabsTrigger 
                      value="manual" 
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400"
                    >
                      <FaProjectDiagram className="w-4 h-4 mr-2" />
                      Manual Setup
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="github" className="mt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <FaGithub className="text-green-400" />
                          GitHub Repository URL
                        </label>
                        <Input
                          {...register('repoUrl', { 
                            required: 'Repository URL is required',
                            pattern: {
                              value: /github\.com\/[^\/]+\/[^\/]+/,
                              message: 'Please enter a valid GitHub URL'
                            }
                          })}
                          className="bg-[#383838] border-[#383838] text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-lg"
                          placeholder="https://github.com/username/repo"
                        />
                        {errors.repoUrl && (
                          <p className="text-sm text-red-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                            {errors.repoUrl.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <FaProjectDiagram className="text-green-400" />
                          Project Name
                        </label>
                        <Input
                          {...register('projectName', { 
                            required: 'Project name is required',
                            minLength: {
                              value: 3,
                              message: 'Project name must be at least 3 characters'
                            }
                          })}
                          className="bg-[#383838] border-[#383838] text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-lg"
                          placeholder="My Awesome Project"
                        />
                        {errors.projectName && (
                          <p className="text-sm text-red-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                            {errors.projectName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <FaKey className="text-green-400" />
                          GitHub Token (Optional)
                        </label>
                        <Input
                          type="password"
                          {...register('githubToken')}
                          className="bg-[#383838] border-[#383838] text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-lg"
                          placeholder="••••••••••••"
                        />
                        <div className="flex items-start gap-2 p-3 bg-[#383838] rounded-lg">
                          <FaShieldAlt className="text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-400">
                            Required for private repositories. We use tokens securely and never store them permanently.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent border-[#383838] text-gray-300 hover:text-white hover:border-[#383838] hover:bg-[#383838]"
                          onClick={() => router.push('/dashboard')}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-green-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                          disabled={createProject.isPending}
                        >
                          {createProject.isPending ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Connecting...
                            </span>
                          ) : (
                            <>
                              <FaGithub className="w-4 h-4" />
                              Connect Repository
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="manual" className="mt-6">
                    <div className="space-y-6">
                      <div className="bg-[#383838] p-6 rounded-xl border border-[#383838]">
                        <h3 className="text-lg font-semibold text-white mb-3">Manual Project Setup</h3>
                        <p className="text-gray-400 mb-4">
                          Upload your code directly or connect via other version control systems.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-[#383838] text-gray-400"
                          disabled
                        >
                          Coming Soon
                        </Button>
                      </div>
                      <div className="text-center text-gray-500 text-sm">
                        <p>GitHub integration provides the best experience with AI-powered insights</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Security Information Card */}
            <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-white">Security Information</CardTitle>
                    <p className="text-gray-400 text-sm">Your data is protected with enterprise-grade security</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-[#383838] rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink0">
                      <FaLock className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Encrypted Connections</h4>
                      <p className="text-gray-400 text-xs">All data transmitted over secure, encrypted connections</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-[#383838] rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink0">
                      <FaKey className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Secure Token Handling</h4>
                      <p className="text-gray-400 text-xs">Tokens used temporarily and never stored permanently</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-[#383838] rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink0">
                      <FaEye className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Read-Only Access</h4>
                      <p className="text-gray-400 text-xs">We only request read permissions for repositories</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Features */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-8 space-y-8"
            >
              {/* AI Features Card */}
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                        <FaRobot className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <SiOpenai className="w-3 h-3 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-green-400">AI-Powered Development</CardTitle>
                      <p className="text-gray-400 text-sm">Advanced AI analysis for your codebase</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink0">
                      <FaBrain className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Intelligent Code Analysis</h4>
                      <p className="text-gray-300 text-xs">AI examines your codebase structure, dependencies, and patterns</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink0">
                      <FaCodeBranch className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Pull Request Assistant</h4>
                      <p className="text-gray-300 text-xs">AI-generated recommendations for improving pull requests</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink0">
                      <FaLightbulb className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">Natural Language Query</h4>
                      <p className="text-gray-300 text-xs">Ask questions about your codebase in plain English</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works Card */}
              <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <FaRocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">How It Works</CardTitle>
                      <p className="text-gray-400 text-sm">Simple 3-step process to get started</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">Connect Repository</h4>
                        <p className="text-gray-300 text-xs">Link any GitHub repository (public or private)</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">AI Indexing</h4>
                        <p className="text-gray-300 text-xs">System analyzes your codebase using advanced RAG technology</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">Get Insights</h4>
                        <p className="text-gray-300 text-xs">Access comprehensive analysis and chat features</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <FaChartLine className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">Platform Stats</CardTitle>
                      <p className="text-gray-400 text-sm">Trusted by developers worldwide</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="text-2xl font-bold text-green-400">10K+</div>
                      <div className="text-xs text-gray-400">Projects Analyzed</div>
                    </div>
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="text-2xl font-bold text-green-400">50M+</div>
                      <div className="text-xs text-gray-400">Lines of Code</div>
                    </div>
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="text-2xl font-bold text-green-400">99.9%</div>
                      <div className="text-xs text-gray-400">Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-[#383838] rounded-lg">
                      <div className="text-2xl font-bold text-green-400">24/7</div>
                      <div className="text-xs text-gray-400">Support</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <FaUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">Need Help?</CardTitle>
                      <p className="text-gray-400 text-sm">We're here to support you</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Our documentation covers everything from token generation to advanced features.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-[#383838] border-[#383838] text-gray-300 hover:text-white hover:bg-[#383838]"
                      onClick={() => window.open('https://docs.repomind.ai', '_blank')}
                    >
                      Documentation
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-[#383838] border-[#383838] text-gray-300 hover:text-white hover:bg-[#383838]"
                      onClick={() => window.open('mailto:support@repomind.ai', '_blank')}
                    >
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {showConfetti && <EmojiConfetti trigger={showConfetti} />}
    </div>
  );
};

export default NewProjectPage;