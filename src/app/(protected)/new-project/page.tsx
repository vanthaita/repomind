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
    <div className="min-h-screen bg-[#232323]">
      {/* Header */}
      <header className="border-b border-[#353535]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors group"
            >
              <div className="p-2 bg-[#353535] rounded-lg group-hover:bg-green-500/10 transition-colors">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 flex flex-col gap-0">
            <section className="pb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                  <RiGitRepositoryLine className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Connect Repository</h2>
                  <p className="text-gray-400 text-lg mt-2">Import your GitHub repository to get started</p>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 mt-10">
                <div className="space-y-3">
                  <label className="text-xl font-semibold text-gray-300 flex items-center gap-2">
                    <FaGithub className="text-green-400 w-6 h-6" />
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
                    className="bg-[#232323] border-[#353535] text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-2xl py-4 px-6 text-xl min-h-[56px]"
                    placeholder="https://github.com/username/repo"
                  />
                  {errors.repoUrl && (
                    <p className="text-base text-red-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      {errors.repoUrl.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-xl font-semibold text-gray-300 flex items-center gap-2">
                    <FaProjectDiagram className="text-green-400 w-6 h-6" />
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
                    className="bg-[#232323] border-[#353535] text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-2xl py-4 px-6 text-xl min-h-[56px]"
                    placeholder="My Awesome Project"
                  />
                  {errors.projectName && (
                    <p className="text-base text-red-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      {errors.projectName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-xl font-semibold text-gray-300 flex items-center gap-2">
                    <FaKey className="text-green-400 w-6 h-6" />
                    GitHub Token (Optional)
                  </label>
                  <Input
                    type="password"
                    {...register('githubToken')}
                    className="bg-[#232323] border-[#353535] text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-2xl py-4 px-6 text-xl min-h-[56px]"
                    placeholder="••••••••••••"
                  />
                  <div className="flex items-start gap-3 p-4 bg-[#353535] rounded-2xl">
                    <FaShieldAlt className="text-green-400 mt-0.5 flex-shrink-0 w-6 h-6" />
                    <p className="text-base text-gray-400">
                      Required for private repositories. We use tokens securely and never store them permanently.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 pt-10">
                  <Button
                    type="submit"
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-8 text-xl min-h-[56px] rounded-2xl shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                    disabled={createProject.isPending}
                  >
                    {createProject.isPending ? (
                      <span className="flex items-center gap-3">
                        <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connecting...
                      </span>
                    ) : (
                      <>
                        <FaGithub className="w-7 h-7" />
                        Connect Repository
                      </>
                    )}
                  </Button>
                  <span className="text-center text-gray-500 text-base pt-2">Manual setup <span className="italic">(coming soon)</span></span>
                </div>
              </form>
            </section>
            <div className="border-b border-[#353535] mb-0" />
            <section className="py-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <FaShieldAlt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Security Information</h3>
                  <p className="text-gray-400 text-sm">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-[#353535] rounded-lg">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink0">
                    <FaLock className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">Encrypted Connections</h4>
                    <p className="text-gray-400 text-xs">All data transmitted over secure, encrypted connections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#353535] rounded-lg">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink0">
                    <FaKey className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">Secure Token Handling</h4>
                    <p className="text-gray-400 text-xs">Tokens used temporarily and never stored permanently</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#353535] rounded-lg">
                  <div className="w-8 h-8  rounded-lg flex items-center justify-center flex-shrink0">
                    <FaEye className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">Read-Only Access</h4>
                    <p className="text-gray-400 text-xs">We only request read permissions for repositories</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Right Column - Features */}
          <div className="lg:col-span-5 flex flex-col gap-0">
            <section className="pb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <FaRobot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <SiOpenai className="w-3 h-3 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-400">AI-Powered Development</h3>
                  <p className="text-gray-400 text-sm">Advanced AI analysis for your codebase</p>
                </div>
              </div>
              <div className="space-y-6">
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
              </div>
            </section>
            <div className="border-b border-[#353535] mb-0" />
            <section className="py-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <FaRocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">How It Works</h3>
                  <p className="text-gray-400 text-sm">Simple 3-step process to get started</p>
                </div>
              </div>
              <div className="space-y-6">
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
            </section>
            <div className="border-b border-[#353535] mb-0" />
            <section className="py-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <FaChartLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Platform Stats</h3>
                  <p className="text-gray-400 text-sm">Trusted by developers worldwide</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#353535] rounded-lg">
                  <div className="text-2xl font-bold text-green-400">10K+</div>
                  <div className="text-xs text-gray-400">Projects Analyzed</div>
                </div>
                <div className="text-center p-4 bg-[#353535] rounded-lg">
                  <div className="text-2xl font-bold text-green-400">50M+</div>
                  <div className="text-xs text-gray-400">Lines of Code</div>
                </div>
                <div className="text-center p-4 bg-[#353535] rounded-lg">
                  <div className="text-2xl font-bold text-green-400">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
                <div className="text-center p-4 bg-[#353535] rounded-lg">
                  <div className="text-2xl font-bold text-green-400">24/7</div>
                  <div className="text-xs text-gray-400">Support</div>
                </div>
              </div>
            </section>
            <div className="border-b border-[#353535] mb-0" />
            <section className="py-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <FaUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Need Help?</h3>
                  <p className="text-gray-400 text-sm">We're here to support you</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Our documentation covers everything from token generation to advanced features.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-[#353535] border-[#353535] text-gray-300 hover:text-white hover:bg-[#353535] py-4 px-8 text-xl min-h-[56px] rounded-2xl"
                    onClick={() => window.open('https://docs.repomind.ai', '_blank')}
                  >
                    Documentation
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-[#353535] border-[#353535] text-gray-300 hover:text-white hover:bg-[#353535] py-4 px-8 text-xl min-h-[56px] rounded-2xl"
                    onClick={() => window.open('mailto:support@repomind.ai', '_blank')}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      {showConfetti && <EmojiConfetti trigger={showConfetti} />}
    </div>
  );
};

export default NewProjectPage;