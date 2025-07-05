import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface RealtimeData {
  projectId: string;
  timestamp: string;
  [key: string]: any;
}

export function useRealtime(projectId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<RealtimeData | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      path: '/api/socket',
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      
      // Join project room
      socketInstance.emit('join-project', projectId);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    // Listen for realtime updates
    socketInstance.on('new-commit', (data: RealtimeData) => {
      console.log('New commit received:', data);
      setLastUpdate(data);
      // You can trigger a refetch here or update local state
    });

    socketInstance.on('new-pull-request', (data: RealtimeData) => {
      console.log('New pull request received:', data);
      setLastUpdate(data);
    });

    socketInstance.on('new-issue', (data: RealtimeData) => {
      console.log('New issue received:', data);
      setLastUpdate(data);
    });

    socketInstance.on('pull-request-update', (data: RealtimeData) => {
      console.log('Pull request update received:', data);
      setLastUpdate(data);
    });

    socketInstance.on('issue-update', (data: RealtimeData) => {
      console.log('Issue update received:', data);
      setLastUpdate(data);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.emit('leave-project', projectId);
      socketInstance.disconnect();
    };
  }, [projectId]);

  return {
    socket,
    isConnected,
    lastUpdate,
  };
} 