# Overview

Al-Matbakh Ar-Raqami (Digital Kitchen) is a bilingual restaurant POS system with support for English and Arabic (RTL). The system handles multiple order types (Dine-In, Take Away, Delivery) and integrates aggregator orders from services like Talabat and Snoonu. Built with modern web technologies, it features touch-optimized interfaces for both Point-of-Sale operations and Kitchen Display Systems.

The application follows an offline-first architecture with real-time synchronization capabilities, supporting various payment methods including cash, card, and credit transactions. It includes comprehensive order management, kitchen coordination, and back-office settlement functionality for aggregator orders.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built using React with TypeScript, utilizing a modern component-based architecture. The UI framework leverages shadcn/ui components built on Radix UI primitives for accessibility and consistency. Styling is handled through Tailwind CSS with custom design tokens for theming.

State management is implemented using a custom React Context pattern with useReducer for POS operations, providing predictable state updates for cart management, language switching, and order source selection. The application uses TanStack Query for server state management, caching, and background synchronization.

## Internationalization & RTL Support
The system implements comprehensive bilingual support using a custom i18n solution. All translatable content is stored as objects with `{ en: string, ar: string }` structure in the database. The frontend dynamically applies RTL styling using CSS logical properties and directional selectors. Arabic text rendering is handled through the Noto Sans Arabic font family.

## Component Structure
- **POS Layout**: Main container orchestrating left panel (categories/items) and right panel (cart/payment)
- **Touch-Optimized Interface**: Components designed with minimum 44px touch targets and gesture support
- **Modal System**: Size and modifier selection using Radix Dialog primitives
- **Kitchen Display**: Real-time order tracking with bump/recall functionality

## Backend Architecture
The server is built with Express.js and TypeScript, providing a RESTful API layer. The application uses a layered architecture with clear separation between routes, business logic, and data access layers.

Database operations are handled through Drizzle ORM with PostgreSQL as the primary database. The storage layer implements a repository pattern with comprehensive interfaces for data access operations including orders, items, categories, and payment processing.

## Database Design
The schema supports multi-tenant architecture with stores, comprehensive menu management (categories, items, sizes, modifiers), order processing, and payment tracking. Key design decisions include:

- JSONB columns for bilingual content storage
- UUID primary keys for distributed system compatibility
- Comprehensive audit logging for all transactions
- Separate tables for order items and modifiers for flexibility

## Real-time Features
The system implements real-time kitchen display updates using polling mechanisms. Orders are automatically refreshed every 5 seconds on the kitchen display, providing live status updates for food preparation workflow.

## Payment Processing
The application supports multiple payment methods with extensible architecture:
- Cash transactions with drawer management
- Card payment integration ready for terminal handoff
- Credit/aggregator payments for delivery service orders
- Split tender capabilities for complex transactions

## Offline-First Strategy
While the current implementation focuses on online operations, the architecture is designed to support offline functionality through:
- Local state management for cart operations
- Query caching for menu items and categories
- Optimistic updates for immediate user feedback

# External Dependencies

## Database
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL for scalability
- **Drizzle ORM**: Type-safe database operations with schema migrations

## Frontend Libraries
- **React**: Core UI framework with hooks-based architecture
- **TypeScript**: Type safety across the entire application
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

## UI Components
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Font Awesome**: Icon system for UI elements
- **Google Fonts**: Inter for English text, Noto Sans Arabic for Arabic content

## Development Tools
- **Vite**: Fast development server and build tool
- **ESBuild**: JavaScript bundling for production
- **Drizzle Kit**: Database migration and introspection tools

## Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting
- **WebSocket Support**: Real-time communication infrastructure ready for implementation

The system is architected for future expansion including payment terminal integration, receipt printing via ESC/POS, and enhanced offline synchronization capabilities.