# Realtime Sync Setup Guide

## Overview
Hệ thống realtime sync cho phép nhận thông báo realtime khi có thay đổi từ GitHub (commits, pull requests, issues) thông qua WebSocket và GitHub Webhooks.

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install socket.io socket.io-client
```

### 2. Cấu hình Environment Variables
Tạo file `.env.local` với các biến sau:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/repomind"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# GitHub
NEXT_PUBLIC_GITHUB_TOKEN="your-github-personal-access-token"
GITHUB_WEBHOOK_SECRET="your-github-webhook-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Setup GitHub Personal Access Token
1. Vào GitHub Settings > Developer settings > Personal access tokens
2. Tạo token mới với quyền:
   - `repo` (full control of private repositories)
   - `read:user` (read user profile)
3. Copy token vào `NEXT_PUBLIC_GITHUB_TOKEN`

### 4. Setup GitHub Webhook
1. Vào repository GitHub > Settings > Webhooks
2. Click "Add webhook"
3. Cấu hình:
   - **Payload URL**: `https://your-domain.com/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Tạo secret và copy vào `GITHUB_WEBHOOK_SECRET`
   - **Events**: Chọn "Let me select individual events"
     - ✅ Push
     - ✅ Pull requests
     - ✅ Issues
4. Click "Add webhook"

### 5. Chạy ứng dụng
```bash
npm run dev
```

## Cách hoạt động

### WebSocket Connection
- Client kết nối WebSocket khi vào trang project
- Join vào room theo `projectId`
- Nhận realtime updates khi có thay đổi

### GitHub Webhook
- GitHub gửi webhook khi có push, PR, issue
- Server xử lý và lưu vào database
- Emit WebSocket event để thông báo cho client

### Components
- `RealtimeStatus`: Hiển thị trạng thái kết nối và last update
- `useRealtime`: Hook để quản lý WebSocket connection
- WebSocket server: Xử lý realtime communication

## Troubleshooting

### WebSocket không kết nối
- Kiểm tra `NEXT_PUBLIC_APP_URL` có đúng không
- Kiểm tra console browser có lỗi gì không
- Đảm bảo server đang chạy

### GitHub Webhook không hoạt động
- Kiểm tra `GITHUB_WEBHOOK_SECRET` có đúng không
- Kiểm tra webhook URL có accessible không
- Xem logs server có nhận được webhook không

### Không nhận được updates
- Kiểm tra project có `githubUrl` đúng không
- Kiểm tra GitHub token có quyền đọc repo không
- Xem logs server có lỗi gì không

## API Endpoints

### WebSocket
- `GET /api/socket`: Khởi tạo WebSocket server

### GitHub Webhook
- `POST /api/webhooks/github`: Nhận webhook từ GitHub

### Events
- `new-commit`: Commit mới
- `new-pull-request`: Pull request mới
- `new-issue`: Issue mới
- `pull-request-update`: PR được update
- `issue-update`: Issue được update 