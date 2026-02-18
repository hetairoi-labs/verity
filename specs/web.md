# @kex/web Package Technical Specification

## Overview

**Architectural Intent**: Production-ready full-stack application with type safety, performance optimization, and developer experience as primary concerns.

The `@kex/web` package implements a modern web architecture featuring a Hono.js API backend for type-safe routing and middleware composition, React frontend with file-based routing, and comprehensive TypeScript coverage throughout the stack.

## 1. Overall Configuration

### Build System & Runtime
**Intent**: Fast development cycles and optimized production builds with modern JavaScript features
- **Runtime**: Bun (v1.x) provides high-performance JavaScript runtime and native bundling
- **Module System**: ES Modules enable modern import/export syntax and tree shaking
- **Build Tool**: Custom Bun-based build system with integrated Tailwind CSS compilation
- **Development Server**: Hot-reloading with HMR support for rapid development iteration

### Package Structure
```
packages/web/
├── api/                    # Backend API (Hono framework)
├── src/                    # Frontend React application
├── lib/                    # Shared utilities and build scripts
├── public/                 # Static assets
├── drizzle.config.ts       # Database configuration
├── tsconfig.json          # TypeScript configuration
├── components.json        # shadcn/ui configuration
├── bunfig.toml           # Bun configuration
├── tsr.config.json       # TanStack Router configuration
└── server.ts             # Main server entry point
```

### Key Dependencies & Architectural Intent

**Core Framework:**
- `hono`: Lightweight API framework for type-safe route definitions and middleware composition
- `react`: Component-based UI library for declarative rendering and state management
- `@tanstack/react-router`: File-based routing with full TypeScript integration and nested layouts
- `@tanstack/react-query`: Server state management with caching, background updates, and optimistic UI

**Authentication:**
- `better-auth`: Secure authentication with social providers and JWT session management

**Database & ORM:**
- `drizzle-orm`: Type-safe SQL queries with compile-time validation and schema migration
- `better-sqlite3`: High-performance SQLite driver for development and production

**AI & External Services:**
- `@google/genai`: Google Gemini AI integration for conversational and generative AI features
- `googleapis`: Google Workspace API integration for calendar and conferencing services
- `axios`: Promise-based HTTP client for reliable external API communication

**UI & Styling:**
- `tailwindcss`: Utility-first CSS framework for consistent design system and responsive layouts
- `@shadcn/ui`: Accessible component library built on Radix UI primitives with customization
- `lucide-react`: Consistent icon system with tree-shaking and TypeScript support
- `sonner`: Toast notification system for user feedback and error messaging

**Development Tools:**
- `@tanstack/router-cli`: Automated route tree generation from file structure for type safety
- `drizzle-kit`: Database migration and schema management with type generation
- `biome`: Fast code formatting and linting with TypeScript support

## 2. API Setup

### Server Architecture
**Intent**: Lightweight, performant API server with comprehensive middleware and real-time capabilities
- **Framework**: Hono.js provides lightweight routing with full TypeScript support and middleware composition
- **Server**: Bun's native `serve()` API enables fast startup and WebSocket support for real-time features
- **Base Path**: Versioned `/api/v1` endpoints ensure API evolution and backward compatibility
- **Port**: Environment-configurable port for flexible deployment scenarios

### Middleware Stack
**Intent**: Security, logging, and error handling through composable middleware layers
```typescript
// Applied in order:
1. CORS middleware - Cross-origin request handling
2. Request logging (Pino) - Structured logging for debugging and monitoring
3. Trailing slash trimming - Consistent URL handling
4. Rate limiting (300 requests/minute) - API protection and fair usage
5. Global error handling - Consistent error responses across all endpoints
```

### Database Schema
**Intent**: Type-safe data modeling with audit trails and relational integrity

**Technology**: SQLite with Drizzle ORM enables type-safe queries and soft-delete pattern for data integrity

#### Core Entities
- **Users**: Primary entity with unique identifier validation for user management
- **Courses**: Hierarchical content structure with author relationships for content organization
- **Sessions**: Time-bound content units with external service integration for scheduling
- **Goals**: Measurable objectives with weighted importance for progress tracking

#### Database Views
- Active/deleted view pairs provide clean data access patterns
- Soft-delete pattern with `deletedAt` timestamps enables audit trails and data recovery

### API Routes
**Intent**: RESTful API design with real-time capabilities for comprehensive application functionality

#### REST Endpoints
- **Meet Routes** (`/api/v1/meet`): Calendar and conferencing integration for scheduling features
- **Users Routes** (`/api/v1/users`): CRUD operations with pagination for user management
- **Webhook Routes** (`/api/v1/webhook`): External service callbacks for event-driven architecture

#### Real-time Communication
- **WebSocket Routes** (`/api/v1/ws`): Bidirectional communication channels for live features and updates

### Data Validation
**Intent**: Runtime type safety and comprehensive input validation with developer-friendly error messages
- **Library**: Zod with custom Hono validator provides schema-based validation
- **Input Validation**: Format and checksum validation prevents malformed data entry
- **Error Handling**: Structured error responses with field-level details for debugging
- **Type Safety**: Full TypeScript integration ensures compile-time and runtime type safety

### Authentication & Authorization
**Intent**: Secure, scalable authentication with social providers and stateless session management
- **Method**: Better Auth provides modern authentication with security best practices
- **Types**: Social authentication with Google OAuth for seamless user onboarding
- **Session Management**: JWT-based stateless sessions for scalability and security
- **Rate Limiting**: 300 requests/minute per IP protects against abuse while allowing fair usage

## 3. Frontend Setup

### React Application Structure
```
src/
├── app/                    # Route components (TanStack Router)
├── components/             # Reusable UI components
├── lib/                    # Shared utilities
├── assets/                 # Static assets
├── constants.ts           # Application constants
├── globals.css            # Global styles
├── main.tsx              # Application entry point
└── types.d.ts            # TypeScript declarations
```

### Routing System
**Intent**: Type-safe, file-based routing with automatic code splitting and nested layouts
- **Router**: TanStack Router enables file-based routing with full TypeScript integration
- **Route Structure**: Flat route hierarchy with CLI-generated route tree for maintainability
- **Code Splitting**: Automatic route-based code splitting for optimal bundle sizes
- **Type Safety**: Full type inference from route definitions to components

### State Management
**Intent**: Separation between client state, server state, and global app state
- **Global State**: Zustand for lightweight client-side state management with TypeScript support
- **Server State**: TanStack Query for API data caching, synchronization, and optimistic updates
- **Context Providers**: Theme and authentication providers for app-wide state sharing

### Authentication Integration
- **Provider**: Better Auth authentication service
- **Methods**: Social login with Google OAuth

### UI Component System
**Intent**: Accessible, consistent, and customizable component library with theming
- **Base Library**: shadcn/ui built on Radix UI primitives ensures accessibility and consistency
- **Styling**: Tailwind CSS with custom design tokens for maintainable styling system
- **Icons**: Lucide React provides consistent iconography with tree-shaking support
- **Theme**: Dark/light mode support with CSS variables for seamless theme switching
- **Animations**: GSAP enables complex animations and transitions for enhanced UX

## 4. Tools and Utils

### Build & Development Tools

#### Build System (`lib/utils/build.ts`)
**Intent**: Optimized production builds with development-friendly features
- **Bundler**: Bun's native bundler provides fast builds with modern JavaScript support
- **Entry Points**: Single-page application structure with HTML entry point
- **Plugins**: Tailwind CSS compilation integrated into build pipeline
- **Optimization**: Minification, source maps, and tree shaking for production performance
- **Output**: Clean `dist/` directory with optimized static assets

#### Database Tools
**Intent**: Type-safe database operations with automated migration and schema management
- **Migration**: `drizzle-kit push` synchronizes schema changes across environments
- **Generation**: `drizzle-kit generate` creates migration files from schema definitions
- **Seeding**: Custom scripts populate initial data for development and testing

#### Development Scripts
**Intent**: Comprehensive development tooling for building, testing, and code quality assurance
- `dev`: Parallel development server with route watching for hot reloading
- `build`: Production build with route generation and optimization
- `check`: Code formatting and linting to maintain code quality standards
- `tsc`: TypeScript compilation check for type safety verification

### Utility Libraries

#### API Client (`src/lib/utils/api-client.ts`)
**Intent**: Type-safe API communication with automatic error handling and response typing
- **Client**: Hono client enables end-to-end type safety from API routes to components
- **Base URL**: Environment-based URL configuration for different deployment environments
- **Typed Endpoints**: Full type inference ensures API contract compliance at compile time

#### Error Handling
**Intent**: Consistent error handling across client and server with user-friendly messaging
- **Client**: Global error listener provides centralized error handling and user notifications
- **Server**: Structured error responses with Pino logging for debugging and monitoring
- **Validation**: Zod-based validation ensures data integrity with detailed error messages

#### External Service Integrations
**Intent**: Seamless third-party service integration with proper authentication and error handling

**Google Services**: OAuth2 and Calendar API integration for user authentication and scheduling
**AI Services**: Token-based API authentication and management for AI-powered features
**Bot Services**: External service deployment and content processing for automated workflows

#### Environment Configuration
**Intent**: Secure, type-safe environment variable management across all deployment environments
- **Validation**: Zod schema validation on startup prevents configuration errors
- **Types**: Strict typing for all environment variables ensures compile-time safety
- **Security**: Server-only secrets vs. public client variables maintain security boundaries

### Development Workflow
**Intent**: Streamlined development process with automated tooling and environment consistency
- Environment validation on startup ensures all required configuration is present
- Database schema synchronization keeps development and production databases aligned
- Hot-reloading development server enables fast feedback loops during development
- CLI-based route generation automates TypeScript route tree creation
- Custom deployment automation ensures consistent production deployments

### Code Quality
**Intent**: Consistent code standards and type safety across the entire codebase
- **Formatting**: Biome ensures consistent code style and formatting rules
- **Linting**: Biome rules with TypeScript support for code quality and error prevention
- **Type Checking**: Strict TypeScript configuration catches type errors at compile time
- **Import Resolution**: Path mapping enables clean, relative imports without deep nesting

### Performance Optimizations
**Intent**: Fast loading, efficient caching, and scalable real-time communication
- **Bundle Splitting**: Route-based code splitting reduces initial bundle size and loading times
- **Caching**: TanStack Query provides intelligent API response caching and background updates
- **Static Assets**: Optimized with Bun's bundler for fast asset delivery and compression
- **WebSocket**: Real-time bidirectional communication for live features and updates
- **Rate Limiting**: API protection against abuse while maintaining performance

## 5. Development Guidelines

### Tooling Research & Installation
- **Official Documentation**: Always fetch and review official documentation for any tooling before implementation to learn current best practices and avoid obsolete code patterns
- **Installation Best Practices**: Follow official quickstart guides from documentation when installing new tooling to ensure proper setup and configuration