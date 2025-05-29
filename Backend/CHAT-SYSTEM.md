# Real-time Chat System

This document explains the real-time chat system implementation using Socket.io.

## Features

- Real-time one-to-one messaging
- Online/offline status tracking
- Message read receipts
- Typing indicators
- Message history persistence in MongoDB

## Implementation

The chat system consists of:

1. **Socket Service** (`src/services/socket.service.ts`)
   - Handles real-time connections and message delivery
   - Authenticates connections with JWT tokens
   - Tracks online users

2. **Message Controller** (`src/controllers/Chat/message.controller.ts`)
   - Provides HTTP fallback for sending messages when socket is unavailable

3. **Socket Controller** (`src/controllers/Chat/socket.controller.ts`)
   - Contains endpoints for marking messages as read, deleting messages, etc.

4. **Message Model** (`src/models/message.model.ts`)
   - Stores messages in MongoDB

## Socket Events

### Client to Server Events
- `privateMessage` - Send a message to another user
- `markAsRead` - Mark messages from a user as read
- `typing` - Indicate that user is typing
- `stopTyping` - Indicate that user has stopped typing

### Server to Client Events
- `newMessage` - When a new message is received
- `messageSent` - When a message is successfully sent
- `messagesRead` - When messages are read by recipient
- `userStatus` - When a user's online/offline status changes
- `userTyping` / `userStopTyping` - When a user starts/stops typing

## HTTP Endpoints

The following REST endpoints are available as an alternative to socket communication:

- `POST /api/v1/chats/messages` - Send a message
- `GET /api/v1/chats/messages?id=userId&page=1` - Get messages with a user
- `PATCH /api/v1/chats/messages/read/:senderId` - Mark messages from a user as read
- `DELETE /api/v1/chats/messages/:messageId` - Delete a message
- `GET /api/v1/chats/messages/unread` - Get counts of unread messages by sender

## Testing

You can test the socket implementation using the test script at `src/tests/socket-test.js`.
Before running it, replace the placeholder values with actual JWT token and user IDs.

```bash
# First compile TypeScript
npm run build

# Then run the test script
node dist/tests/socket-test.js
```
