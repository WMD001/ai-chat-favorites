# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local to add your Vercel KV configuration
```

## Architecture Overview

This is a React-based AI chat conversation bookmark manager with the following key architectural components:

### Frontend Architecture
- **Framework**: React 19 with Vite build system
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Hooks (useState, useEffect) for local component state
- **Routing**: Single-page application with no client-side routing
- **Authentication**: Simple password-based access control with localStorage persistence

### Data Architecture
- **Storage**: Upstash Redis (Vercel KV) for persistent data storage
- **Data Model**: Simple array-based structure storing chat bookmarks with metadata
- **API Layer**: Direct Redis operations through @upstash/redis SDK

### Component Structure
- **App.jsx**: Main application component handling authentication, state management, and layout
- **AddChatForm.jsx**: Reusable form component for adding/editing chat bookmarks
- **ChatCard.jsx**: (Referenced but not present in current codebase - may be legacy)

### Key Features Implementation
- **Password Protection**: Environment variable-based password with localStorage session management
- **Platform Support**: Color-coded platform tags for major AI services (DeepSeek, ChatGPT, Claude, etc.)
- **Tag System**: Dynamic tag management with filtering capabilities
- **Preview Mode**: Iframe-based preview of bookmarked conversations
- **CRUD Operations**: Full create, read, update, delete functionality for bookmarks

### Data Flow
1. User authenticates with password
2. Application loads bookmarks from Redis on mount
3. User interactions trigger Redis operations through utility functions
4. UI updates optimistically with state management
5. Data persists to Redis and reloads on next session

### Environment Configuration
- **VITE_KV_REST_API_URL**: Upstash Redis endpoint URL
- **VITE_KV_REST_API_TOKEN**: Upstash Redis authentication token
- **VITE_ACCESS_PASSWORD**: Access password (default: 123456)

### Deployment
- **Platform**: Vercel
- **Storage**: Integrated Vercel KV (Upstash Redis)
- **Build**: Vite-based production build
- **Configuration**: Environment variables set in Vercel project settings

## Important Notes

- All data operations go through the Redis utility functions in `src/utils/kv.js`
- The application uses a simple array-based data structure stored under the 'chats' key
- Platform colors are defined in both App.jsx and AddChatForm.jsx for consistency
- The edit functionality works by deleting the old record and creating a new one
- Tag management is dynamic and expands based on user input
- The application is designed for single-user access with password protection