'use client'
import React from 'react';
import { api } from '@/trpc/react';
import { useParams } from 'next/navigation';

const IssuesPage = () => {
  const params = useParams();
  const projectId = params.id as string;
  const { data, isLoading } = api.project.getIssues.useQuery({ projectId, page: 1, limit: 20 });
  const issues = data?.data || [];

  return (
    <div className="min-h-screen bg-[#282828] p-8">
      <h1 className="text-2xl font-bold text-green-400 mb-6">Project Issues</h1>
      {isLoading ? (
        <div className="text-white">Loading...</div>
      ) : issues.length === 0 ? (
        <div className="text-gray-400">No issues found.</div>
      ) : (
        <div className="space-y-4">
          {issues.map(issue => (
            <div key={issue.id} className="bg-[#383838] rounded-lg p-4 border border-[#333]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{issue.title}</h2>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">{issue.body}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${issue.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-300'}`}>{issue.status}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                {issue.labels && (
                  <span>Labels: {JSON.parse(issue.labels).join(', ')}</span>
                )}
                {issue.assignee && (
                  <span>Assignee: {issue.assignee}</span>
                )}
                <span>Created: {new Date(issue.createdAt).toLocaleString()}</span>
                {issue.closedAt && <span>Closed: {new Date(issue.closedAt).toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesPage; 