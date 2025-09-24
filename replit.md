# PromptPay Payment System

## Overview

This is a full-stack TypeScript application that implements a Thai PromptPay payment system for digital products/services. The system features a React frontend with shadcn/ui components, an Express backend with in-memory storage, and QR code generation for PromptPay transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Thai payment system color scheme
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

## Key Components

### Data Models
- **Products**: Digital services/products with pricing, categories, and visual styling
- **Transactions**: Payment records with PromptPay integration and status tracking
- **Schema Validation**: Drizzle-zod integration for type-safe data validation

### Payment System
- **PromptPay Integration**: Custom implementation of EMV QR Code specification
- **QR Code Generation**: Server-side QR code creation for payment requests
- **Transaction Status**: Real-time polling for payment completion
- **Demo Mode**: Simulated payment completion for development/testing

### UI Components
- **Product Cards**: Interactive product selection with visual styling
- **Payment Modal**: Real-time transaction status with QR code display
- **Admin Panel**: Product management interface with form validation
- **Transaction List**: Historical payment records with filtering

## Data Flow

1. **Product Display**: Frontend fetches products from `/api/products` endpoint
2. **Product Selection**: User selects product and enters PromptPay ID
3. **Transaction Creation**: POST to `/api/checkout` creates transaction and QR code
4. **Payment Processing**: Modal displays QR code and polls transaction status
5. **Status Updates**: Backend simulates payment completion (demo mode)
6. **Transaction History**: All transactions stored and displayable

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, TanStack Query for state management
- **UI Components**: Radix UI primitives, Lucide React icons
- **Form Management**: React Hook Form, Hookform Resolvers
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS, class-variance-authority for component variants

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- **QR Generation**: qrcode library for PromptPay QR codes
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Strict configuration with path mapping
- **Code Quality**: ESLint configuration (implied by tsconfig)
- **Replit Integration**: Special plugins for Replit environment

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with HMR and React Fast Refresh
- **Backend**: tsx with watch mode for automatic restarts
- **Database**: In-memory storage with default product seeding
- **Environment**: Replit-specific middleware and error handling

### Production Build
- **Frontend**: Vite production build with optimized assets
- **Backend**: esbuild compilation to ESM format
- **Static Assets**: Served from Express with proper caching headers
- **Database**: Configured for PostgreSQL via Drizzle (environment-dependent)

### Key Architectural Decisions

**In-Memory Storage vs Database**: Currently uses in-memory storage for simplicity and demo purposes, but includes full Drizzle configuration for easy PostgreSQL migration when needed.

**PromptPay Implementation**: Custom implementation following EMV QR Code specification rather than using third-party services, providing full control over payment flow.

**Polling vs WebSocket**: Uses simple HTTP polling for transaction status updates instead of WebSockets, keeping the architecture simple while maintaining real-time feel.

**Demo Payment Flow**: Includes simulated payment completion for demonstration purposes, easily replaceable with real payment gateway integration.

**Component Architecture**: Uses shadcn/ui pattern of copied components rather than installed library, providing full customization control while maintaining consistency.

## Recent Changes: Latest modifications with dates

### 2025-07-25: Advanced Feature Catalog System Implementation
- **Added comprehensive feature catalog system** with 20+ categories and 1000+ planned features
- **Implemented feature management database** with categories, features, and client request tracking
- **Created advanced features page** with filtering, search, code examples, and request system
- **Added feature request workflow** allowing clients to request custom development with quotes
- **Integrated real-time feature status tracking** (planned, in_progress, completed, archived)
- **Enhanced navigation** with new "คลังฟีเจอร์" (Feature Catalog) link in main menu