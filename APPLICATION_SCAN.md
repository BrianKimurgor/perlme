# Perlme Application - Comprehensive Scan Report

**Repository:** perlme  
**Current Branch:** route-fixing  
**Default Branch:** master  
**Workspace Path:** c:\Users\BrianKimurgor\Desktop\mine\perlme

---

## 📋 Overview

**Perlme** is a full-stack social networking application with location-based features. It's a multi-platform application consisting of three main parts:
- **Backend:** Node.js + Express + TypeScript
- **Frontend (Mobile):** React Native + Expo
- **Frontend (Web):** Next.js + React

---

## 🏗️ Architecture

### Tech Stack

| Component | Technology | Key Packages |
|-----------|-----------|--------------|
| **Backend** | Node.js, Express, TypeScript | express, drizzle-orm, pg, socket.io, jsonwebtoken, bcrypt |
| **Database** | PostgreSQL | drizzle-kit, drizzle-orm (Neon) |
| **Mobile App** | React Native, Expo | expo-router, redux-toolkit, axios, socket.io-client |
| **Web App** | Next.js 16 | next, react-redux, tailwindcss, lucide-react |
| **Real-time** | Socket.IO | socket.io (backend & client) |

---

## 📱 Application Structure

### Backend (`/backend`)

**Main Files:**
- `src/app.ts` - Express app configuration with middleware and routes
- `src/server.ts` - Server entry point
- `drizzle.config.ts` - Database configuration
- `src/drizzle/schema.ts` - Database schema (502 lines)

**Middleware:**
- `BearAuth.ts` - JWT authentication
- `checkUserActivity.ts` - User activity verification
- `GoogleMailer.ts` - Email service
- `GroupAuthoraization.ts` - Group access control
- `Logger.ts` - Request logging
- `rateLimiter.ts` - Rate limiting
- `schedule.ts` - Scheduled tasks (cron jobs)

**Core Services:**
1. **Auth Service** (`/Auth`)
   - Authentication & registration
   - Password management
   - Email verification
   - JWT token handling

2. **Users Service** (`/Services/Users`)
   - User profile management
   - User search & discovery
   - Account settings

3. **Posts Service** (`/Services/posts`)
   - Post creation, editing, deletion
   - Media uploads
   - Post metrics (likes, comments, shares)

4. **Messages Service** (`/Services/Messages`)
   - Direct messaging
   - Message status tracking (SENT, DELIVERED, READ)

5. **Groups Service** (`/Services/Groups`)
   - Group chat creation & management
   - Group member roles (ADMIN, MODERATOR, MEMBER)
   - Group messaging

6. **Block Service** (`/Services/Block`)
   - User blocking functionality

7. **Explore & Recommendations** (`/Services/Explore and Recommendations`)
   - Discovery feed
   - User recommendations

8. **Reports Service** (`/Services/Reports`)
   - User & content reporting
   - Moderation system

**WebSocket Service** (`/socket`)
- Real-time messaging
- User presence tracking
- Event handling with SocketResponseHandler
- JWT authentication for socket connections

**Database Layer:**
- `src/drizzle/db.ts` - Database connection
- `src/drizzle/migrate.ts` - Migration runner
- `src/drizzle/seed.ts` - Database seeding
- `src/drizzle/migrations/` - Migration files

---

### Database Schema

**Core Tables:**

1. **Users** - User accounts with profile info, verification status, roles
   - Fields: id, username, email, passwordHash, dateOfBirth, gender, orientation, bio, avatarUrl, etc.
   - Enums: user_role (REGULAR, CREATOR, MODERATOR, ADMIN)
   - Enums: gender, orientation, visibility

2. **Relationships:**
   - `users ↔ interests` (many-to-many via userInterests)
   - `users ↔ users` (follows)
   - `users ↔ users` (blocks)

3. **Posts** - User-generated content
   - Associated: media, comments, likes, tags, postMetrics

4. **Messages** - Direct messaging
   - Status: SENT, DELIVERED, READ
   - Supports media attachments

5. **Group Chats** - Group messaging
   - groupChats, groupMembers, groupMessages
   - Role-based access (GROUP_ADMIN, GROUP_MODERATOR, GROUP_MEMBER)

6. **Reports** - Moderation system
   - Report types: USER, POST, COMMENT, MESSAGE, GROUP_MESSAGE
   - Status: PENDING, REVIEWED, RESOLVED, DISMISSED
   - Moderation actions: NONE, REMOVE_CONTENT

7. **Locations** - User location tracking
   - Latitude/longitude coordinates
   - Visibility control (VISIBLE, HIDDEN)

8. **Metrics:**
   - postMetrics - Post engagement (likes, comments, shares, views, trending score)
   - userMetrics - User stats (followers, following, posts count, engagement score)

**Enums:**
- `user_role`: REGULAR, CREATOR, MODERATOR, ADMIN
- `gender`: MALE, FEMALE, NON_BINARY, OTHER
- `orientation`: STRAIGHT, GAY, LESBIAN, BISEXUAL, ASEXUAL, PANSEXUAL, OTHER
- `visibility`: PUBLIC, PRIVATE, FRIENDS_ONLY
- `message_status`: SENT, DELIVERED, READ
- `report_status`: PENDING, REVIEWED, RESOLVED, DISMISSED
- `notification_type`: MESSAGE, LIKE, COMMENT, REPOST, FOLLOW, TIP, SUBSCRIPTION, ADMIN_MESSAGE, MATCH
- `group_role`: GROUP_ADMIN, GROUP_MODERATOR, GROUP_MEMBER, GROUP_REMOVED
- `report_type`: USER, POST, COMMENT, MESSAGE, GROUP_MESSAGE
- `report_action`: NONE, REMOVE_CONTENT

---

### Frontend - Mobile (`/frontend`)

**Stack:** React Native + Expo + Redux + TypeScript

**Entry Point:** `app/_layout.tsx`
- Redux Provider setup
- Stack Navigator configuration

**Tab Navigation** (`app/(tabs)/_layout.tsx`):
- 🏠 **Home** - Feed/discovery
- ❤️ **Matches** - Match/connection management
- 💬 **Chats** - Direct messaging
- 👤 **Profile** - User profile
- ⋯ **More** - Additional options

**Authentication:**
- `Auth/Login.tsx` - Login screen
- Store: `src/store/AuthSlice.ts`
- Hook: `hooks/useAuth.tsx`

**Core Screens:**
- `index.tsx` - Home/discovery feed
- `chats.tsx` - Chat list & messaging
- `profile.tsx` - User profile
- `matches.tsx` - Matches view

**Components:**
- `ChatInput.tsx` - Message input
- `ChatListItem.tsx` - Chat list items
- `MessageBubble.tsx` - Message display
- `ThemedText.tsx`, `ThemedView.tsx` - Theme-aware components
- `Collapsible.tsx` - Expandable sections
- Theme system with light/dark modes

**State Management:**
- Redux store with slices:
  - `AuthSlice.ts` - Authentication state
  - `themeSlice.ts` - Theme preferences

**Services:**
- `socketService.ts` - WebSocket client for real-time messaging
- API integration via axios

---

### Frontend - Web (`/next-frontend`)

**Stack:** Next.js 16 + React + Redux + Tailwind CSS + TypeScript

**Entry Points:**
- `app/layout.tsx` - Root layout with metadata
- `app/providers.tsx` - Redux provider wrapper
- `app/page.tsx` - Home page

**Structure:**
- `app/` - Page routes
  - `about/` - About page
- `components/` - Reusable components
  - `header.tsx`
  - `hero-section.tsx`
  - `logo.tsx`
  - `ui/` - UI component library (shadcn/ui style)
- `services/`
  - `api.ts` - API client setup
  - `authApi.ts` - Auth API endpoints
- `store/` - Redux store
  - `store.ts` - Store configuration
  - `hooks.ts` - Redux hooks

**Styling:**
- Tailwind CSS v4
- PostCSS configuration
- shadcn/ui components

**Key Libraries:**
- lucide-react - Icons
- motion - Animation library
- clsx - Conditional classnames
- @reduxjs/toolkit - State management

---

## 🔐 Security & Authentication

**Authentication Flow:**
1. JWT-based authentication
2. Password hashing with bcrypt
3. Email verification with confirmation codes
4. Token middleware in routes (`anyAuth`)
5. User activity checking (`checkUserActive`)
6. Socket.IO JWT authentication for real-time features

**Authorization:**
- Role-based access control (REGULAR, CREATOR, MODERATOR, ADMIN)
- Group-based authorization
- Block/privacy checking

**Security Middleware:**
- Helmet.js - Security headers
- CORS - Cross-origin resource sharing
- Rate limiting - Request throttling

---

## 🔌 Real-Time Features

**Socket.IO Implementation:**
- Namespace: `/` (default)
- Events for:
  - Direct messaging (send, receive, read receipts)
  - Typing indicators
  - User presence (online/offline)
  - Group chat notifications
  - Match notifications
  - Real-time updates

**Connection Details:**
- CORS configured for client URLs
- JWT authentication required
- Suspended account check
- Ping/pong for connection health
- Supports WebSocket + fallback to polling

---

## 📊 API Routes

**Public Routes:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/discover` - Explore/recommendations
- `GET /api/health` - Health check

**Protected Routes (require JWT):**
- `/api/users` - User management
- `/api/posts` - Post CRUD operations
- `/api/messages` - Direct messaging
- `/api/blocks` - Block management
- `/api/reports` - Report submission
- `/api/groups` - Group management

**Route Duplication Note:** 
- Some routes are registered twice in app.ts (lines 44 and 52) - needs consolidation

---

## 📦 Dependencies

### Backend
- **Framework:** express, helmet, cors
- **Database:** drizzle-orm, pg, @neondatabase/serverless
- **Security:** bcrypt, jsonwebtoken
- **Real-time:** socket.io, socket.io-client
- **Email:** nodemailer
- **Validation:** zod
- **Utilities:** dotenv, uuid, node-cron, rate-limiter-flexible

### Mobile Frontend
- **Framework:** expo, expo-router
- **UI:** react-native, expo-blur, expo-linear-gradient
- **State:** @reduxjs/toolkit, react-redux
- **Forms:** react-hook-form, zod
- **HTTP:** axios
- **Real-time:** socket.io-client
- **Storage:** @react-native-async-storage/async-storage, expo-secure-store

### Web Frontend
- **Framework:** next, react
- **Styling:** tailwindcss, tailwind-merge
- **State:** @reduxjs/toolkit, react-redux
- **UI:** lucide-react, motion (animation)
- **Utilities:** clsx

---

## 🎯 Key Features

1. **User Management**
   - Registration, login, profile editing
   - Email verification
   - Account suspension
   - User preferences (age, distance, gender)
   - Location tracking

2. **Social Networking**
   - Create/edit/delete posts
   - Comment on posts
   - Like posts
   - Follow users
   - User discovery/recommendations
   - Block users

3. **Messaging**
   - Direct 1-to-1 messaging
   - Message status tracking
   - Media attachments
   - Real-time delivery via Socket.IO

4. **Groups**
   - Create group chats
   - Manage group members
   - Group messaging
   - Role-based permissions

5. **Moderation**
   - Report users/posts/comments/messages
   - Admin review system
   - Suspension management
   - Action tracking

6. **Discovery**
   - User recommendations
   - Interest-based discovery
   - Gender/orientation preferences
   - Location-based features

7. **Metrics & Analytics**
   - Post engagement tracking
   - User engagement scoring
   - Follow/follower counts

---

## 📝 Database Scripts

**Available Commands:**
- `npm run dev` - Development server with hot reload
- `npm run build` - TypeScript compilation
- `npm run start` - Production server
- `npm run gen` - Generate migrations
- `npm run migrate` - Run migrations
- `npm run studio` - Drizzle Studio (DB viewer)
- `npm run push` - Generate + migrate + seed
- `npm run seed` - Seed database with test data

---

## 🚀 Development Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Mobile Frontend:**
```bash
cd frontend
npm install
npm start
```

**Web Frontend:**
```bash
cd next-frontend
npm install
npm run dev
```

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - Frontend URL for CORS
- Google Mail credentials (for email service)

---

## 📂 File Structure Summary

```
perlme/
├── backend/
│   ├── src/
│   │   ├── Auth/ (registration, login, verification)
│   │   ├── Middlewares/ (auth, logging, rate limiting)
│   │   ├── Services/ (business logic)
│   │   │   ├── Block/
│   │   │   ├── Explore and Recommendations/
│   │   │   ├── Groups/
│   │   │   ├── Messages/
│   │   │   ├── posts/
│   │   │   ├── Reports/
│   │   │   └── Users/
│   │   ├── Validators/ (input validation)
│   │   ├── Types/ (TypeScript types)
│   │   ├── socket/ (WebSocket handlers)
│   │   ├── utils/ (helpers)
│   │   ├── drizzle/ (DB schema, migrations)
│   │   ├── app.ts (Express setup)
│   │   └── server.ts (Entry point)
│   └── [config files]
├── frontend/ (React Native + Expo)
│   ├── app/
│   │   ├── (tabs)/ (tab navigation)
│   │   ├── Auth/ (login screens)
│   │   └── settings/
│   ├── components/ (UI components)
│   ├── services/ (API, socket)
│   ├── src/store/ (Redux)
│   └── [config files]
├── next-frontend/ (Next.js Web)
│   ├── app/ (pages)
│   ├── components/ (UI)
│   ├── services/ (API)
│   ├── store/ (Redux)
│   └── [config files]
└── pnpm-lock.yaml (workspaces lock file)
```

---

## ⚠️ Notable Issues/Observations

1. **Route Duplication in app.ts:** 
   - Lines 44 and 52 duplicate some routes (authRouter, postRouter)
   - Lines 47 and 53 duplicate userRouter registration
   - Suggest consolidation to prevent conflicts

2. **Socket Implementation:** 
   - Located in `/socket/socket.ts` but may need full exploration of all event handlers

3. **Database Seeding:** 
   - Uses `seed.ts` - verify it matches schema expectations

4. **Next.js Setup:** 
   - Layout metadata is generic ("Create Next App") - should be updated

5. **Branch:** 
   - Currently on `route-fixing` branch - indicates recent route-related changes

---

## 🔗 Integration Points

- **Backend-to-Frontend:** REST APIs + Socket.IO WebSocket
- **Mobile-to-Web:** Share Redux store patterns
- **Database:** PostgreSQL via Drizzle ORM (Neon serverless)
- **Real-time:** Socket.IO for instant updates
- **Authentication:** JWT across all services

---

## 📊 Component Count

- **Backend Services:** 6 major services
- **Backend Middleware:** 7 middleware functions
- **Mobile Screens:** 5+ main screens
- **Web Pages:** Basic structure (home, about)
- **Database Tables:** 20+ core tables
- **DB Enums:** 10+ enumerated types

---

**Generated:** December 16, 2025  
**Status:** Application ready for development/deployment

