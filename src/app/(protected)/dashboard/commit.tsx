'use client';

import { api } from '@/trpc/react';
import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import UseProject from '@/hooks/use-project';
// import { 
//   Sheet, 
//   SheetContent, 
//   SheetHeader, 
//   SheetTitle, 
//   SheetTrigger 
// } from '@/components/ui/sheet';
// import { ScrollArea } from '@/components/ui/scroll-area';
const CommitLog = () => {
  const { projectId, project } = UseProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  if (!commits) {
    return <div>Loading commits...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Commit Log</h1>
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
              <div className="w-px translate-x-1 bg-gray-300 h-full" />
            </div>
            <Avatar className="size-8 mt-4 relative flex-none">
              <AvatarImage src={commit.commitAuthorAvatar} alt={commit.commitAuthorName} />
            </Avatar>
            <div className="flex-1 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow h-full min-h-[160px]">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{commit.commitAuthorName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {/* Uncomment and format date */}
                        {/* {format(new Date(commit.commitDate), 'MMM dd, yyyy HH:mm')} */}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 shrink-0"
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
                            className="flex items-center gap-1.5 shrink-0"
                          >
                            <Code className="w-4 h-4" />
                            <span>View Changes</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent 
                          side="right" 
                          className="w-[800px] z-50 pointer-events-auto"
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
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {commit.summary}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground font-mono truncate">
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