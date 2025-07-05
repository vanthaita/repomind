import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

let io: SocketIOServer | null = null;

// Extend the NextApiResponse type to include socket server
interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

export function initSocketServer(req: NextApiRequest, res: NextApiResponse) {
  // Check if socket server already exists
  const existingIO = (res.socket as any)?.server?.io;
  if (!existingIO) {
    console.log('Initializing Socket.IO server...');
    
    const httpServer: NetServer = (res.socket as any)?.server as any;
    
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      console.log(`Total connected clients: ${io?.sockets.sockets.size}`);

      // Join project room
      socket.on('join-project', (projectId: string) => {
        socket.join(`project-${projectId}`);
        console.log(`Client ${socket.id} joined project ${projectId}`);
        
        // Log room statistics
        const room = io?.sockets.adapter.rooms.get(`project-${projectId}`);
        console.log(`Project ${projectId} now has ${room?.size || 0} active users`);
      });

      // Leave project room
      socket.on('leave-project', (projectId: string) => {
        socket.leave(`project-${projectId}`);
        console.log(`Client ${socket.id} left project ${projectId}`);
        
        // Log room statistics
        const room = io?.sockets.adapter.rooms.get(`project-${projectId}`);
        console.log(`Project ${projectId} now has ${room?.size || 0} active users`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        console.log(`Total connected clients: ${io?.sockets.sockets.size}`);
      });
    });

    // Attach io to the server
    if (res.socket) {
      (res.socket as any).server.io = io;
    }
  }
  
  return (res.socket as any)?.server?.io;
}

export function getIO() {
  if (!io) {
    throw new Error('WebSocket not initialized');
  }
  return io;
}

// Helper functions to emit events
export function emitProjectUpdate(projectId: string, event: string, data: any) {
  const socketIO = getIO();
  socketIO.to(`project-${projectId}`).emit(event, {
    projectId,
    timestamp: new Date().toISOString(),
    ...data
  });
}

export function emitNewCommit(projectId: string, commit: any) {
  emitProjectUpdate(projectId, 'new-commit', { commit });
}

export function emitNewPullRequest(projectId: string, pullRequest: any) {
  emitProjectUpdate(projectId, 'new-pull-request', { pullRequest });
}

export function emitNewIssue(projectId: string, issue: any) {
  emitProjectUpdate(projectId, 'new-issue', { issue });
}

export function emitPullRequestUpdate(projectId: string, pullRequest: any) {
  emitProjectUpdate(projectId, 'pull-request-update', { pullRequest });
}

export function emitIssueUpdate(projectId: string, issue: any) {
  emitProjectUpdate(projectId, 'issue-update', { issue });
} 