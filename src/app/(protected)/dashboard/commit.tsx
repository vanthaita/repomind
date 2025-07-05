'use client';

import { api } from '@/trpc/react';
import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import UseProject from '@/hooks/use-project';
import { SectionLoading, CommitSkeleton } from '@/components/ui/loading';

const CommitLog = () => {
  const { projectId, project } = UseProject();
  const { data: commitsResponse, isLoading } = api.project.getCommits.useQuery({ 
    projectId,
    page: 1,
    limit: 20,
  });
  const commits = commitsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="mt-4 text-white mb-4">
        <h1 className="text-xl font-semibold mb-4 text-green-500">Summary Commit Log</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <CommitSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!commitsResponse) {
    return <div className="text-white mt-4">Loading commits...</div>;
  }

  return (
    <div className="mt-4 text-white mb-4">
      <h1 className="text-xl font-semibold mb-4 text-green-500">Summary Commit Log</h1>
      <ul className="space-y-4">
        {commits.map((commit, index) => (
          <li 
            className="relative flex gap-x-4 min-h-[160px]" 
            key={commit.id}
          >
            <div className={cn(
              index === commits.length - 1 ? 'h-6' : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}>
              <div className="w-px translate-x-1 bg-[#424242] h-full" />
            </div>
            <Avatar className="size-8 mt-4 relative flex-none">
              <AvatarImage src={commit.commitAuthorAvatar} alt={commit.commitAuthorName} />
            </Avatar>
            <div className="flex-1 p-4 border border-[#424242] rounded-lg shadow-sm hover:shadow-md transition-shadow h-full min-h-[160px] bg-[#424242]">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{commit.commitAuthorName}</p>
                      <p className="text-sm text-gray-300 mt-1">
                        {commit.commitDate.toDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 shrink-0 bg-[#424242] text-white border-[#424242] hover:bg-[#282828] hover:text-white"
                        asChild
                      >
                        <a
                          href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>GitHub</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </Button>
                      {/* <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5 shrink-0 bg-[#424242] text-white border-[#424242] hover:bg-[#282828] hover:text-white"
                          >
                            <Code className="w-4 h-4" />
                            <span>View Changes</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent 
                          side="right" 
                          className="w-[800px] z-50 pointer-events-auto bg-[#282828] text-white"
                        >
                          <SheetHeader>
                            <SheetTitle>Code Changes</SheetTitle>
                          </SheetHeader>
                          <ScrollArea className="w-full p-4 h-full">
                            <pre className="text-sm" tabIndex={0} autoFocus>
                              HELEDƯKDJWLKDJSLAKDJ;LKDJSLAKDJL
                            </pre>
                          </ScrollArea>
                        </SheetContent>
                      </Sheet> */}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">{commit.commitMessage}</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">
                      {commit.summary}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-300 font-mono truncate">
                      Commit: {commit.commitHash}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitLog;