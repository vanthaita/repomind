'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtime } from '@/hooks/use-realtime';
import { FiGitCommit, FiGitPullRequest, FiActivity, FiRefreshCw } from 'react-icons/fi';

interface RealtimeTestProps {
  projectId: string;
}

export function RealtimeTest({ projectId }: RealtimeTestProps) {
  const { isConnected, lastUpdate } = useRealtime(projectId);
  const [testEvents, setTestEvents] = useState<any[]>([]);

  const addTestEvent = (eventType: string, data: any) => {
    const newEvent = {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    };
    setTestEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const simulateCommit = () => {
    addTestEvent('new-commit', {
      commitHash: 'abc123',
      commitMessage: 'Test commit message',
      commitAuthorName: 'Test User',
    });
  };

  const simulatePullRequest = () => {
    addTestEvent('new-pull-request', {
      prNumber: 123,
      title: 'Test Pull Request',
      authorName: 'Test User',
    });
  };

  const simulateIssue = () => {
    addTestEvent('new-issue', {
      title: 'Test Issue',
      status: 'open',
      assignee: 'Test User',
    });
  };

  return (
    <Card className="bg-gradient-to-br from-[#424242] to-[#383838] border-[#383838] shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <FiRefreshCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-white">Realtime Test</CardTitle>
            <p className="text-gray-400 text-sm">Test realtime functionality</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-300">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={simulateCommit}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <FiGitCommit className="w-4 h-4 mr-2" />
            Test Commit
          </Button>
          <Button 
            onClick={simulatePullRequest}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <FiGitPullRequest className="w-4 h-4 mr-2" />
            Test PR
          </Button>
          <Button 
            onClick={simulateIssue}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            size="sm"
          >
            <FiActivity className="w-4 h-4 mr-2" />
            Test Issue
          </Button>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="p-3 bg-[#383838] rounded-lg">
            <h4 className="font-semibold text-white text-sm mb-2">Last Real Update</h4>
            <div className="text-xs text-gray-400">
              <div>Type: {Object.keys(lastUpdate).find(key => key.startsWith('new-') || key.includes('update'))}</div>
              <div>Time: {new Date(lastUpdate.timestamp).toLocaleTimeString()}</div>
              <div>Project: {lastUpdate.projectId}</div>
            </div>
          </div>
        )}

        {/* Test Events */}
        {testEvents.length > 0 && (
          <div>
            <h4 className="font-semibold text-white text-sm mb-2">Test Events</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {testEvents.map((event, index) => (
                <div key={index} className="p-2 bg-[#383838] rounded text-xs">
                  <div className="text-green-400">{event.type}</div>
                  <div className="text-gray-400">{event.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 