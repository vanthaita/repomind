import { NextRequest, NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

let io: SocketIOServer | null = null;

export async function GET(request: NextRequest) {
  try {
    // Initialize WebSocket server if not already done
    if (!io) {
      console.log('Initializing Socket.IO server...');
      
      // Create a simple HTTP server for Socket.IO
      const httpServer = new NetServer();
      
      io = new SocketIOServer(httpServer, {
        cors: {
          origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          methods: ["GET", "POST"]
        }
      });

      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Join project room
        socket.on('join-project', (projectId: string) => {
          socket.join(`project-${projectId}`);
          console.log(`Client ${socket.id} joined project ${projectId}`);
        });

        // Leave project room
        socket.on('leave-project', (projectId: string) => {
          socket.leave(`project-${projectId}`);
          console.log(`Client ${socket.id} left project ${projectId}`);
        });

        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
    }

    return new Response('WebSocket server ready', { status: 200 });
  } catch (error) {
    console.error('WebSocket initialization error:', error);
    return new Response('WebSocket initialization failed', { status: 500 });
  }
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