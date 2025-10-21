# Savor Recipe Book - Project Overview

**Generated:** 2025-10-21
**Project Name:** recipesmd (Savor Recipe Book)
**Version:** 1.0.0
**Description:** "Savor - Every recipe tells a story. A modern recipe website built with Next.js"

---

## Executive Summary

Savor is a modern, full-stack recipe website built with Next.js 15, React 19, and TypeScript. The application serves 113 recipes (104 family recipes + 9 examples) with comprehensive features including recipe browsing, categorization, search, favorites management, and shopping list generation. The project uses a file-based markdown recipe system with YAML frontmatter, providing a flexible and maintainable content structure.

### Key Statistics

- **Total Recipes:** 113 recipes
- **Primary Pages:** 10 main routes
- **UI Components:** 14+ Radix UI components + custom components
- **Architecture:** Next.js App Router with Server Components
- **Deployment:** Vercel-optimized

---

## Technology Stack

### Core Framework

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 15.4.6 | React framework with App Router |
| Runtime | React | 19.1.1 | UI library |
| Language | TypeScript | 5.9.2 | Type-safe development |
| Styling | Tailwind CSS | 3.4.17 | Utility-first CSS framework |

### UI & Design

| Category | Technology | Purpose |
|----------|-----------|---------|
| Component Library | Radix UI | Accessible, unstyled component primitives |
| Icons | Lucide React | Icon library |
| Animation | Framer Motion | Animation library |
| Theme | next-themes | Dark mode support |
| Color Manipulation | chroma-js | Dynamic color generation |

### Data & Content

| Category | Technology | Purpose |
|----------|-----------|---------|
| Markdown Parser | gray-matter | YAML frontmatter parsing |
| Markdown to HTML | remark + remark-html | Markdown processing |
| Drag & Drop | @dnd-kit | Shopping list reordering |
| Forms | react-hook-form | Form state management |
| Date Handling | date-fns | Date formatting |

### Development & Testing

| Category | Technology | Purpose |
|----------|-----------|---------|
| Testing | Jest + Testing Library | Unit and integration testing |
| Linting | ESLint + TypeScript ESLint | Code quality |
| Formatting | Prettier | Code formatting |
| Type Checking | TypeScript | Static type checking |

---

## Project Structure

### Repository Type
**Monolith** - Single cohesive codebase

### Directory Structure

```
recipesmd/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── (pages)/
│   │   │   ├── about/         # About page
│   │   │   ├── categories/    # Categories listing & dynamic category pages
│   │   │   ├── cookbook/      # User cookbook dashboard
│   │   │   ├── favorites/     # Favorites management
│   │   │   ├── recipes/       # Recipe listing & detail pages
│   │   │   ├── search/        # Search functionality
│   │   │   └── shopping-list/ # Shopping list generator
│   │   ├── api/               # API routes
│   │   │   └── recipes/       # Recipe data API
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Homepage
│   │   ├── global-error.tsx   # Global error boundary
│   │   └── not-found.tsx      # 404 page
│   ├── components/
│   │   ├── ui/                # Radix UI components + custom UI
│   │   ├── layout/            # Header, Footer, Theme Toggle
│   │   ├── home/              # Homepage sections
│   │   ├── recipe/            # Recipe display components
│   │   ├── recipes/           # Recipe list components
│   │   ├── categories/        # Category components
│   │   ├── cookbook/          # Cookbook features
│   │   ├── search/            # Search components
│   │   ├── shopping-list/     # Shopping list components
│   │   └── seo/               # SEO & structured data
│   ├── lib/
│   │   ├── markdown.ts        # Recipe markdown parsing
│   │   ├── recipe-utils.ts    # Recipe utility functions
│   │   ├── recipe-server-utils.ts  # Server-side recipe utilities
│   │   └── utils.ts           # General utilities
│   ├── types/
│   │   ├── index.ts           # Type exports
│   │   └── recipe.ts          # Recipe type definitions
│   ├── hooks/                 # Custom React hooks (if any)
│   └── __tests__/            # Test files
├── recipes/                   # Markdown recipe files
│   └── family/               # Family recipe collection
├── public/                   # Static assets
│   └── images/              # Recipe images
├── docs/                     # Project documentation (this folder)
├── bmad/                     # BMAD methodology files
├── convert/                  # Recipe conversion utilities
├── examples/                 # Example files
└── [config files]           # Various configuration files

```

---

## Application Architecture

### Pattern: Next.js App Router with Server Components

The application follows the Next.js 15 App Router architecture pattern, leveraging:

- **Server Components** - Default for all components, improving performance
- **File-based Routing** - Routes defined by folder structure in `src/app/`
- **API Routes** - RESTful API in `src/app/api/`
- **TypeScript Path Aliases** - Simplified imports via `@/*` aliases

### Key Architectural Decisions

1. **File-based Recipe Storage**
   - Recipes stored as Markdown files with YAML frontmatter
   - Located in `/recipes` directory
   - Parsed server-side using gray-matter
   - ISO 8601 duration format (PT10M, PT1H30M)

2. **Server-Side Rendering**
   - Recipe data fetched and rendered on server
   - Improved SEO and initial load performance
   - Structured data for search engines

3. **Client-Side Interactivity**
   - Favorites stored in localStorage
   - Shopping list with drag-and-drop reordering
   - Search filtering and pagination
   - Dark mode toggle

4. **Design System**
   - Custom Savor brand colors (Saffron, Sage, Cream, Paprika, Charcoal, Mint)
   - Radix UI for accessible components
   - Tailwind for utility styling
   - Responsive design with custom breakpoints

---

## Application Pages & Routes

### Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Homepage with featured recipes, categories showcase |
| `/about` | `src/app/about/page.tsx` | About the Savor project |
| `/recipes` | `src/app/recipes/page.tsx` | Recipe listing with filters |
| `/recipes/[slug]` | `src/app/recipes/[slug]/page.tsx` | Individual recipe detail page |
| `/categories` | `src/app/categories/page.tsx` | Categories listing |
| `/categories/[category]` | `src/app/categories/[category]/page.tsx` | Recipes by category |
| `/search` | `src/app/search/page.tsx` | Search functionality |
| `/favorites` | `src/app/favorites/page.tsx` | User's favorited recipes |
| `/cookbook` | `src/app/cookbook/page.tsx` | Personal cookbook dashboard |
| `/shopping-list` | `src/app/shopping-list/page.tsx` | Generated shopping list from recipes |

### API Routes

| Endpoint | File | Method | Description |
|----------|------|--------|-------------|
| `/api/recipes` | `src/app/api/recipes/route.ts` | GET | Returns all recipes with metadata |

---

## Data Layer

### Recipe Data Model

Recipes are defined using TypeScript interfaces in `src/types/recipe.ts`:

**Core Types:**
- `Recipe` - Complete recipe with all data
- `RecipeMeta` - Metadata (title, description, times, etc.)
- `RecipeIngredient` - Ingredient with amount, unit, name
- `RecipeInstruction` - Step-by-step instructions
- `RecipeNutrition` - Nutritional information
- `RecipeTimes` - Prep, cook, total, rest times
- `RecipeCategory` - Category metadata
- `RecipeSearchFilters` - Search and filter params

### Data Flow

1. **Recipe Loading** (`src/lib/markdown.ts`)
   - `getAllRecipes()` - Loads all recipes from `/recipes` directory
   - `getRecipeBySlug()` - Loads single recipe by slug
   - `parseFrontmatter()` - Parses YAML frontmatter
   - `parseISODuration()` - Converts PT10M → "10 min"
   - `parseYield()` - Parses servings ("6-8 servings" → 7)

2. **Server-Side Processing**
   - Recipes parsed at build time and request time
   - Cached by Next.js for performance
   - Server Components fetch data directly

3. **Client-Side State**
   - Favorites: localStorage
   - Shopping list: React state + localStorage
   - Theme: next-themes (localStorage)
   - Filters: URL search params

---

## UI Component Inventory

### Radix UI Components (`src/components/ui/`)

| Component | Purpose | Usage |
|-----------|---------|-------|
| `badge.tsx` | Category/tag badges | Recipe metadata display |
| `button.tsx` | Interactive buttons | CTAs, actions |
| `card.tsx` | Content containers | Recipe cards, sections |
| `checkbox.tsx` | Selection inputs | Filters, shopping list |
| `dropdown-menu.tsx` | Dropdown menus | User actions, filters |
| `input.tsx` | Text inputs | Search, forms |
| `label.tsx` | Form labels | Accessibility |
| `select.tsx` | Select dropdowns | Category selection |
| `separator.tsx` | Visual dividers | Content separation |
| `slider.tsx` | Range inputs | Time filters |
| `tabs.tsx` | Tab navigation | Cookbook sections |
| `textarea.tsx` | Multi-line input | Notes, comments |

### Custom Components

**Layout Components** (`src/components/layout/`)
- `header.tsx` - Main navigation with mobile menu
- `footer.tsx` - Site footer
- `theme-toggle.tsx` - Dark/light mode switcher

**Recipe Components** (`src/components/recipe/`)
- `recipe-hero.tsx` - Recipe header with image
- `recipe-ingredients.tsx` - Ingredients list
- `recipe-instructions.tsx` - Step-by-step instructions
- `recipe-notes.tsx` - Recipe notes and tips
- `recipe-nutrition.tsx` - Nutritional information
- `recipe-page-wrapper.tsx` - Recipe page layout
- `related-recipes.tsx` - Related recipe suggestions

**Feature Components**
- `recipe-card.tsx` - Recipe preview card
- `search-bar.tsx` - Search input component
- `recipe-filters.tsx` - Filter controls
- `shopping-list-manager.tsx` - Shopping list interface
- `structured-data.tsx` - JSON-LD for SEO

---

## Development Workflow

### Prerequisites

- Node.js (version in `.nvmrc` or compatible with Next.js 15)
- npm or pnpm package manager

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Development Commands

```bash
# Development server
npm run dev              # Standard Next.js dev server
npm run dev:turbo        # Dev server with Turbopack (faster)

# Build & Production
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run type-check       # TypeScript type checking

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Deployment
npm run deploy           # Deploy to Vercel
npm run deploy:prod      # Deploy to production

# Utilities
npm run clean            # Remove build artifacts
```

### Environment Variables

Check for `.env` or `.env.local` files (not tracked in git) for:
- API keys (if any)
- Environment-specific configuration
- Feature flags

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (images, ESLint, logging) |
| `tailwind.config.ts` | Tailwind CSS configuration (colors, fonts, plugins) |
| `tsconfig.json` | TypeScript configuration (paths, compiler options) |
| `eslint.config.mjs` | ESLint rules and plugins |
| `.prettierrc.json` | Code formatting rules |
| `jest.config.js` | Jest testing configuration |
| `postcss.config.mjs` | PostCSS plugins |
| `components.json` | shadcn/ui components configuration |

---

## Build & Deployment

### Build Process

1. TypeScript compilation
2. Next.js optimization (code splitting, image optimization)
3. Static page generation where applicable
4. Bundle analysis (optional with `@next/bundle-analyzer`)

### Deployment Target

**Vercel** (optimized deployment)
- Configured in `package.json` with deploy scripts
- ESLint errors ignored during builds (`next.config.ts`)
- Image optimization for external domains (Google, Pexels, Unsplash)

### Build Configuration

- **React Strict Mode**: Enabled
- **Trailing Slashes**: Enabled
- **ESLint**: Warnings only during build
- **Image Domains**: Whitelisted for external images

---

## Testing Strategy

### Test Setup

- **Framework**: Jest with jsdom environment
- **Library**: React Testing Library
- **Test Location**: `src/__tests__/`
- **Configuration**: `jest.config.js` + `jest.setup.js`

### Test Coverage Areas

- Component rendering tests
- Integration tests for recipe flow
- Utility function tests

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

---

## Recent Changes & Project History

Based on documentation files in the repository:

1. **Recipe Consolidation** (Oct 2025)
   - Merged 104 family recipes into main `/recipes` page
   - Deprecated `/family-recipes` route (redirects to `/recipes`)
   - Standardized all recipes with YAML frontmatter
   - Enhanced 100+ recipe descriptions

2. **Dark Mode Implementation**
   - Added `next-themes` for theme switching
   - Theme toggle in header
   - Dark mode color variants

3. **Favorites Feature**
   - Client-side favorites using localStorage
   - Favorites page at `/favorites`
   - Toggle functionality on recipe cards

4. **Recipe Standardization**
   - Converted recipes to consistent YAML format
   - ISO 8601 duration format (PT10M)
   - Placeholder images for all recipes
   - Enhanced metadata (15+ fields per recipe)

---

## Entry Points

### Main Application Entry
- **File**: `src/app/layout.tsx`
- **Purpose**: Root layout with providers (theme, fonts, metadata)

### Data Entry Point
- **File**: `src/lib/markdown.ts`
- **Function**: `getAllRecipes()`
- **Purpose**: Primary data loading function

### API Entry Point
- **File**: `src/app/api/recipes/route.ts`
- **Endpoint**: `GET /api/recipes`
- **Purpose**: JSON API for recipe data

---

## Key Features

1. **Recipe Browsing**
   - 113 recipes organized by category
   - Filterable by difficulty, time, tags, cuisine
   - Search functionality
   - Related recipes suggestions

2. **Personal Cookbook**
   - Favorites management
   - Shopping list generation
   - Printable recipes
   - Custom recipe upload (planned)

3. **Search & Discovery**
   - Full-text search
   - Category browsing
   - Tag filtering
   - Generation filter (Grandma, Great Grandma, Modern)

4. **User Experience**
   - Dark/light mode
   - Responsive design
   - Accessible components
   - Fast page loads (Server Components)

5. **SEO Optimization**
   - Structured data (JSON-LD)
   - Meta tags
   - Open Graph support
   - Sitemap generation

---

## Future Enhancements (from documentation)

1. Add nutrition data using USDA calculator
2. Replace placeholder images with real recipe photos
3. Add user ratings and reviews
4. Add recipe variations and substitutions
5. Enhanced social sharing
6. User-generated content support

---

## Development Notes

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`

### Styling Approach

- **Utility-first**: Tailwind CSS
- **Component library**: Radix UI (unstyled primitives)
- **Brand colors**: Custom Savor palette
- **Typography**: Inter (headings), Open Sans (body), Dancing Script (accent)
- **Dark mode**: Class-based (`dark:` prefix)

### Performance Considerations

- Server Components by default
- Image optimization via Next.js
- Code splitting automatic
- Recipe data cached by Next.js
- Minimal client-side JavaScript

---

## Support & Documentation

### Additional Documentation Files

- `RECIPE_CONSOLIDATION_COMPLETE.md` - Recipe migration details
- `QUICK_REFERENCE.md` - Quick reference guide
- `TESTING_CHECKLIST.md` - Testing guidelines
- `STANDARDIZATION_SUMMARY.md` - Standardization process
- Various other `.md` files in project root

### Getting Help

1. Review existing documentation in project root
2. Check `src/types/` for data structure definitions
3. Review component implementations in `src/components/`
4. Check `src/lib/` for utility functions

---

**Last Updated:** 2025-10-21
**Documentation Version:** 1.0
**Project Version:** 1.0.0
