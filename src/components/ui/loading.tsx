import React from 'react';
import { Loader2, MessageCircle, GitBranch, Code, FileText, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import {  LogoText } from './logo';

// Spinner component
export const Spinner = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <Loader2 className={cn('animate-spin', className)} size={size} />
);

// Page loading component
export const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#282828]">
    <div className="text-center">
      <div className="relative mb-6">
       
        <div className="mb-4">
          <LogoText size="lg" />
        </div>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      <p className="text-gray-400 text-lg font-medium">Loading your workspace...</p>
    </div>
  </div>
);

// Section loading component
export const SectionLoading = ({ title = "Loading..." }: { title?: string }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
     
      <p className="text-gray-400 font-medium">{title}</p>
    </div>
  </div>
);

// Skeleton components
export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-md bg-gradient-to-r from-[#424242] via-[#4a4a4a] to-[#424242] bg-[length:200%_100%]',
      'animate-shimmer',
      className
    )}
    {...props}
  />
);

// Project card skeleton
export const ProjectCardSkeleton = () => (
  <div className="border border-[#383838] rounded-lg p-4 bg-[#282828] animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-4 rounded" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <div className="flex items-center mb-3">
      <Skeleton className="h-3 w-3 rounded-full mr-2" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex justify-between">
      <div className="flex space-x-3">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

// Conversation skeleton
export const ConversationSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-[#424242] rounded-lg animate-pulse">
    <Skeleton className="h-5 w-5 rounded" />
    <div className="flex-1">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-5 w-5 rounded" />
  </div>
);

// Message skeleton
export const MessageSkeleton = ({ isUser = false }: { isUser?: boolean }) => (
  <div className={`flex items-start gap-2 mb-4 w-full ${
    isUser ? 'justify-end' : 'justify-start'
  }`}>
    {!isUser && (
      <Skeleton className="w-10 h-10 rounded-full" />
    )}
    <div className={`flex flex-col w-full max-w-[80%] ${
      isUser ? 'items-end' : 'items-start'
    }`}>
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  </div>
);

// Commit skeleton
export const CommitSkeleton = () => (
  <div className="relative flex gap-x-4 min-h-[160px] animate-pulse">
    <div className="absolute left-0 top-0 flex w-6 justify-center">
      <div className="w-px bg-[#424242] h-full" />
    </div>
    <Skeleton className="size-8 mt-4 relative flex-none rounded-full" />
    <div className="flex-1 p-4 border border-[#424242] rounded-lg bg-[#424242]">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

// Pull request skeleton
export const PullRequestSkeleton = () => (
  <div className="flex items-center justify-between p-4 border border-[#424242] rounded-lg animate-pulse">
    <div className="flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div>
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton className="h-6 w-16" />
  </div>
);

// Route transition loading
export const RouteLoading = () => (
  <div className="fixed inset-0 bg-[#282828]/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-6">

        <div className="mb-4">
          <LogoText size="lg" />
        </div>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      <p className="text-gray-400 text-lg font-medium">Navigating to new page...</p>
    </div>
  </div>
);

// Loading overlay
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = "Loading..." 
}: { 
  isLoading: boolean; 
  children: React.ReactNode; 
  message?: string;
}) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-[#282828]/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center">
          <LogoText size="lg" />
          <p className="text-gray-400 font-medium">{message}</p>
        </div>
      </div>
    )}
  </div>
);

// Button loading state
export const LoadingButton = ({ 
  isLoading, 
  children, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  isLoading?: boolean; 
}) => (
  <button 
    {...props} 
    disabled={isLoading || props.disabled}
    className={cn(
      'flex items-center gap-2',
      props.className
    )}
  >
    {isLoading && (
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            <Code className="w-2 h-2 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
            <Github className="w-1 h-1 text-white" />
          </div>
        </div>
        <span className="text-sm font-medium">Loading...</span>
      </div>
    )}
    {!isLoading && children}
  </button>
); 