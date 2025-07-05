'use client';

import React from 'react';
import { useRealtime } from '@/hooks/use-realtime';
import { Badge } from '@/components/ui/badge';
import { FiWifi, FiWifiOff, FiGitCommit, FiGitPullRequest, FiActivity } from 'react-icons/fi';

interface RealtimeStatusProps {
  projectId: string;
}

export function RealtimeStatus({ projectId }: RealtimeStatusProps) {
  const { isConnected, lastUpdate } = useRealtime(projectId);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'new-commit':
        return <FiGitCommit className="w-3 h-3" />;
      case 'new-pull-request':
      case 'pull-request-update':
        return <FiGitPullRequest className="w-3 h-3" />;
      case 'new-issue':
      case 'issue-update':
        return <FiActivity className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getEventText = (eventType: string) => {
    switch (eventType) {
      case 'new-commit':
        return 'New commit';
      case 'new-pull-request':
        return 'New PR';
      case 'pull-request-update':
        return 'PR updated';
      case 'new-issue':
        return 'New issue';
      case 'issue-update':
        return 'Issue updated';
      default:
        return 'Update';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Connection Status */}
      <Badge 
        variant={isConnected ? "default" : "secondary"}
        className={`flex items-center gap-1 ${
          isConnected 
            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border-red-500/30'
        }`}
      >
        {isConnected ? <FiWifi className="w-3 h-3" /> : <FiWifiOff className="w-3 h-3" />}
        {isConnected ? 'Live' : 'Offline'}
      </Badge>

      {/* Last Update */}
      {lastUpdate && (
        <Badge 
          variant="secondary"
          className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1"
        >
          {getEventIcon(Object.keys(lastUpdate).find(key => key.startsWith('new-') || key.includes('update')) || '')}
          {getEventText(Object.keys(lastUpdate).find(key => key.startsWith('new-') || key.includes('update')) || '')}
          <span className="text-xs">
            {new Date(lastUpdate.timestamp).toLocaleTimeString()}
          </span>
        </Badge>
      )}
    </div>
  );
} 