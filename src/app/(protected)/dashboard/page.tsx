'use client'
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CommitLog from './commit';
import PullRequest from './pullRequest';
import { FiCode, FiGitCommit, FiGitPullRequest, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import AskQuestion from './askQuestion';

const DashBoardPage = () => {
  return (
    <div className="p-6">
      <Tabs defaultValue="ask-repo" className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-2">
          <TabsTrigger value="ask-repo" className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 transition-colors">
            <FiCode className="w-5 h-5" />
            <span>Ask Repo</span>
          </TabsTrigger>
          <TabsTrigger value="commit" className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 transition-colors">
            <FiGitCommit className="w-5 h-5" />
            <span>Commit</span>
          </TabsTrigger>
          <TabsTrigger value="pull-request" className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 transition-colors">
            <FiGitPullRequest className="w-5 h-5" />
            <span>Pull Request</span>
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 transition-colors">
            <FiAlertCircle className="w-5 h-5" />
            <span>Issues</span>
          </TabsTrigger>
          <TabsTrigger value="todo" className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 transition-colors">
            <FiCheckCircle className="w-5 h-5" />
            <span>Todo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ask-repo" className="mt-8 transition-opacity duration-300 ease-in-out">
          <AskQuestion />
        </TabsContent>
        <TabsContent value="commit" className="mt-8 transition-opacity duration-300 ease-in-out">
          <CommitLog />
        </TabsContent>
        <TabsContent value="pull-request" className="mt-8 transition-opacity duration-300 ease-in-out">
          <PullRequest />
        </TabsContent>
        <TabsContent value="issues" className="mt-8 transition-opacity duration-300 ease-in-out">
          <div className="p-4 border rounded-lg shadow-sm">Issues Content</div>
        </TabsContent>
        <TabsContent value="todo" className="mt-8 transition-opacity duration-300 ease-in-out">
          <div className="p-4 border rounded-lg shadow-sm">Todo Content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashBoardPage;