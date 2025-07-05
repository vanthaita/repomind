'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useRefetch from '@/hooks/use-refresh';
import { api } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EmojiConfetti from '@/components/Emoji';
import { motion } from 'framer-motion';
import { FaGithub, FaKey, FaProjectDiagram, FaArrowLeft, FaLightbulb, FaRobot, FaCodeBranch, FaShieldAlt } from 'react-icons/fa';
import { RiGitRepositoryLine, RiVerifiedBadgeFill } from 'react-icons/ri';
import { SiOpenai } from 'react-icons/si';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@/components/ui/loading';

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
  const [activeTab, setActiveTab] = useState<'github' | 'manual'>('github');

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
    <div className="min-h-screen">
      <header className="">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors group">
            <FaArrowLeft className="text-lg transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
              <RiVerifiedBadgeFill /> Beta
            </span>
          </div>
        </div>
      </header>

      <main className="px-6 py-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7">
            <div className=" rounded-2xl p-8 border border-gray-700 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <RiGitRepositoryLine className="text-green-400 text-2xl" />
                  <h2 className="text-2xl font-bold text-green-400">Connect Repository</h2>
                </div>
                <div className="flex rounded-lg bg-gray-900 p-1">
                  <button
                    onClick={() => setActiveTab('github')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'github' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    GitHub
                  </button>
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'manual' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    Manual Setup
                  </button>
                </div>
              </div>

              {activeTab === 'github' ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
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
                      className="border-2 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-lg py-3 px-4 w-full"
                      placeholder="https://github.com/username/repo"
                    />
                    {errors.repoUrl && (
                      <p className="mt-1 text-sm text-red-400">{errors.repoUrl.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
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
                      className="border-2 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-lg py-3 px-4 w-full"
                      placeholder="My Awesome Project"
                    />
                    {errors.projectName && (
                      <p className="mt-1 text-sm text-red-400">{errors.projectName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className=" text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <FaKey className="text-green-400" />
                      GitHub Token (Optional)
                    </label>
                    <Input
                      type="password"
                      {...register('githubToken')}
                      className="border-2 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 rounded-lg py-3 px-4 w-full"
                      placeholder="••••••••••••"
                    />
                    <p className="mt-2 text-xs text-gray-400 flex items-start gap-1">
                      <FaShieldAlt className="flex-shrink-0 mt-0.5 text-green-400" />
                      Required for private repositories. We use tokens securely and never store them permanently.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:hover:text-white hover:border-gray-500 transition-all"
                      onClick={() => router.push('/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2 group"
                      disabled={createProject.isPending}
                    >
                      {createProject.isPending ? (
                        <span className="animate-pulse flex items-center gap-2">
                          <FaGithub className="animate-spin" />
                          Connecting...
                        </span>
                      ) : (
                        <>
                          <FaGithub className="transition-transform group-hover:scale-110" />
                          <span className="transition-transform group-hover:translate-x-0.5">
                            Connect Repository
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Manual Project Setup</h3>
                    <p className="text-gray-400 mb-4">
                      Upload your code directly or connect via other version control systems.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:hover:text-white"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </div>
                  <div className="text-center text-gray-500 text-sm">
                    <p>GitHub integration provides the best experience with AI-powered insights</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8  rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <FaShieldAlt />
                Security Information
              </h3>
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                  <div>
                    <strong className="text-white">Encrypted Connections</strong>
                    <p className="text-gray-400">All data is transmitted over secure, encrypted connections</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                  <div>
                    <strong className="text-white">Token Handling</strong>
                    <p className="text-gray-400">GitHub tokens are used temporarily and never stored permanently</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                  <div>
                    <strong className="text-white">Read-Only Access</strong>
                    <p className="text-gray-400">We only request read permissions for your repositories</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8 sticky top-8"
            >
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl p-8 border border-green-800/50 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <FaRobot className="text-3xl text-green-400" />
                    <SiOpenai className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-400">AI-Powered Development</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-800/30 p-3 rounded-lg flex-shrink-0">
                      <FaLightbulb className="text-green-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Intelligent Code Analysis</h3>
                      <p className="text-gray-300 text-sm">Our AI examines your codebase structure, dependencies, and patterns to provide meaningful insights.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-green-800/30 p-3 rounded-lg flex-shrink-0">
                      <FaCodeBranch className="text-green-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Pull Request Assistant</h3>
                      <p className="text-gray-300 text-sm">Get AI-generated recommendations for improving your pull requests before merging.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-green-800/30 p-3 rounded-lg flex-shrink-0">
                      <FaLightbulb className="text-green-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Natural Language Query</h3>
                      <p className="text-gray-300 text-sm">Ask questions about your codebase in plain English and get precise answers.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-green-400 mb-6">How It Works</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-green-900/30 text-green-400 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Connect Your Repository</h4>
                      <p className="text-gray-300 text-sm">Link any GitHub repository (public or private with token)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-green-900/30 text-green-400 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">AI Indexing</h4>
                      <p className="text-gray-300 text-sm">Our system analyzes your codebase using advanced RAG technology</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-green-900/30 text-green-400 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Get Insights</h4>
                      <p className="text-gray-300 text-sm">Access comprehensive analysis, documentation, and chat features</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Need Help?</h3>
                <p className="text-gray-300 mb-4">
                  Our documentation covers everything from token generation to advanced features.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 text-black"
                    onClick={() => window.open('https://docs.repomind.ai', '_blank')}
                  >
                    Documentation
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-black"
                    onClick={() => window.open('mailto:support@repomind.ai', '_blank')}
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {showConfetti && <EmojiConfetti trigger={showConfetti} />}
    </div>
  );
};

export default NewProjectPage;