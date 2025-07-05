import React, { useState } from 'react';
import UseProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight } from 'react-feather';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionLoading, PullRequestSkeleton } from '@/components/ui/loading';

interface AIAnalysisData {
    summary?: string[];
    analysis?: {
      issues?: string[];
      security_concerns?: string[];
      quality_assessment?: string;
      improvements?: string[];
    };
}

interface AiAnalysisProps {
    analysis: string;
}
function removeCodeBlockMarkers(text: string): string {
  return text.replace(/^\s*```json\s*/, '').replace(/\s*```\s*$/, '');
}
const AiAnalysis: React.FC<AiAnalysisProps> = ({ analysis }) => {
    try {
      let data: AIAnalysisData;
      try {
        analysis = removeCodeBlockMarkers(analysis);
        data = JSON.parse(analysis);
        
        console.log(analysis);
      } catch (error) {
        console.error("Error parsing analysis JSON:", error);
        return <div>Error parsing analysis data.</div>;
      }
      console.log(typeof data);
      return (
        <div className="space-y-4 bg-[#424242] p-4 rounded-md border border-[#282828]">
          {data.summary && Array.isArray(data.summary) && (
            <div>
              <h4 className="font-semibold text-lg mb-1 text-green-500">Summary</h4>
              <ul className="list-disc list-inside pl-4 text-gray-200">
                {data.summary.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {data.analysis && (
            <div className="space-y-3">
              {data.analysis.issues && Array.isArray(data.analysis.issues) && (
                <div>
                  <h4 className="font-semibold text-lg mb-1">Issues</h4>
                  <ul className="list-disc list-inside pl-4">
                    {data.analysis.issues.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.analysis.security_concerns &&
                Array.isArray(data.analysis.security_concerns) && (
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Security Concerns</h4>
                    <ul className="list-disc list-inside pl-4">
                      {data.analysis.security_concerns.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              {data.analysis.quality_assessment && (
                <div>
                  <h4 className="font-semibold text-lg mb-1">Quality Assessment</h4>
                  <p>{data.analysis.quality_assessment}</p>
                </div>
              )}
              {data.analysis.improvements &&
                Array.isArray(data.analysis.improvements) && (
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Improvements</h4>
                    <ul className="list-disc list-inside pl-4">
                      {data.analysis.improvements.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>
      );
    } catch (err) {
      return (
        <pre className="whitespace-pre-wrap p-4 bg-gray-50 rounded-md border border-gray-200">
          {analysis}
        </pre>
      );
    }
};
const PullRequest: React.FC = () => {
  const { projectId } = UseProject();
  const { data: pullRequestsResponse, isLoading } = api.project.getPullRequests.useQuery({ 
    projectId,
    page: 1,
    limit: 20,
  });
  const pullRequests = pullRequestsResponse?.data || [];
  const [selectedPrId, setSelectedPrId] = useState<string | null>(null);

  if (isLoading) return (
    <div className="p-4 bg-[#282828] min-h-screen">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-green-500">Open Pull Requests</h2>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <PullRequestSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-green-500">Closed Pull Requests</h2>
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <PullRequestSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!pullRequestsResponse) return <div className="p-6">No pull requests found.</div>;

  const selectedPr = pullRequests.find(pr => pr.id === selectedPrId);
  console.log(pullRequests[0]?.aiAnalysis)
  return (
    <div className="p-4 bg-[#282828] min-h-screen">
      {selectedPr ? (
        <div className="space-y-3 z-[9999]">
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent text-green-500 hover:text-green-400 "
            onClick={() => setSelectedPrId(null)}
          >
            ← Back to Pull Requests
          </Button>
          <div className="border border-[#424242] rounded-lg">
            <div className="p-6 border-b border-[#424242]">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedPr.authorAvatar ?? ''} alt={selectedPr.authorName ?? ''} />
                </Avatar>
                {selectedPr.title}
              </h1>
              <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
                <span>Status: {selectedPr.status}</span>
                <span>•</span>
                <span>Base: {selectedPr.baseBranch}</span>
                <span>•</span>
                <span>Head: {selectedPr.headBranch}</span>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="p-6 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {selectedPr.body || 'No description provided'}
                  </p>
                </div>

                <div>
                  {/* <h3 className="text-lg font-semibold mb-2">AI Analysis</h3> */}
                  <AiAnalysis analysis={selectedPr.aiAnalysis ?? ''} />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <PullRequestSection
            title="Open Pull Requests"
            prs={pullRequests.filter(pr => pr.status === 'open')}
            onSelect={setSelectedPrId}
          />
          
          <PullRequestSection
            title="Closed Pull Requests"
            prs={pullRequests.filter(pr => pr.status === 'closed')}
            onSelect={setSelectedPrId}
          />
        </div>
      )}
    </div>
  );
};

const PullRequestSection: React.FC<{
  title: string;
  prs: any[];
  onSelect: (id: string) => void;
}> = ({ title, prs, onSelect }) => {
  if (prs.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-green-500">{title}</h2>
      <div className="space-y-2">
        {prs.map(pr => (
          <div
            key={pr.id}
            onClick={() => onSelect(pr.id)}
            className="flex items-center justify-between p-4 border border-[#424242] rounded-lg hover:bg-[#282828] hover:border-green-500 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6 border border-green-500">
                <AvatarImage src={pr.authorAvatar ?? ''} alt={pr.authorName ?? ''} />
              </Avatar>
              <span className="font-medium text-gray-200 group-hover:text-green-400">{pr.title}</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-green-500" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default PullRequest;