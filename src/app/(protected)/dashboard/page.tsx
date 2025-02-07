'use client'
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import CommitLog from './commit';

const DashBoardPage = () => {
  return (
    <div className="p-6">
      <Tabs defaultValue="ask-repo" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ask-repo">Ask Repo</TabsTrigger>
          <TabsTrigger value="commit">Commit</TabsTrigger>
          <TabsTrigger value="pull-request">Pull Request</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="todo">Todo</TabsTrigger>
        </TabsList>

        <TabsContent value="ask-repo" className="mt-4">
          <div className="p-4 border rounded-lg">Ask Repo Content</div>
        </TabsContent>
        <TabsContent value="commit" className="mt-4">
          <CommitLog />
        </TabsContent>
        <TabsContent value="pull-request" className="mt-4">
          <div className="p-4 border rounded-lg">Pull Request Content</div>
        </TabsContent>
        <TabsContent value="issues" className="mt-4">
          <div className="p-4 border rounded-lg">Issues Content</div>
        </TabsContent>
        <TabsContent value="todo" className="mt-4">
          <div className="p-4 border rounded-lg">Todo Content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashBoardPage;