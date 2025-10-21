# Savor Recipe Book - Documentation Index

**Generated:** 2025-10-21
**Scan Level:** Deep
**Project:** recipesmd (Level 2 Brownfield Software)

---

## 📋 Project Overview

- **Name:** Savor Recipe Book (recipesmd)
- **Type:** Monolith Web Application
- **Architecture:** Next.js 15 App Router with Server Components
- **Primary Language:** TypeScript
- **Framework:** Next.js 15.4.6 + React 19.1.1
- **Styling:** Tailwind CSS 3.4.17
- **UI Library:** Radix UI

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev              # Standard dev server
npm run dev:turbo        # Faster with Turbopack
```

### Build & Deploy
```bash
npm run build            # Production build
npm run start            # Start production server
npm run deploy           # Deploy to Vercel
```

---

## 📚 Generated Documentation

### Core Documentation
- **[Project Overview](./project-overview.md)** - Comprehensive project documentation
  - Technology stack
  - Architecture patterns
  - Directory structure
  - Data models
  - Component inventory
  - Development workflow
  - Deployment process

### Additional Documentation (To Be Generated)
- [Architecture Document](./architecture.md) _(To be generated)_
- [API Contracts](./api-contracts.md) _(To be generated)_
- [Data Models Reference](./data-models.md) _(To be generated)_
- [Component Catalog](./component-catalog.md) _(To be generated)_
- [Development Guide](./development-guide.md) _(To be generated)_

---

## 🗂️ Quick Reference

### Technology Stack Summary

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 15.4.6 |
| Runtime | React | 19.1.1 |
| Language | TypeScript | 5.9.2 |
| Styling | Tailwind CSS | 3.4.17 |
| UI Components | Radix UI | Various |
| Forms | react-hook-form | 7.62.0 |
| Animation | Framer Motion | 12.23.12 |
| Testing | Jest + Testing Library | 30.0.0 |

### Project Statistics

- **Total Recipes:** 113 (104 family + 9 examples)
- **Pages:** 10 main routes
- **API Endpoints:** 1 (GET /api/recipes)
- **Components:** 14+ UI components + feature components
- **Tests:** Integration and unit tests

### Key Directories

```
src/
├── app/              # Next.js App Router (pages & API)
├── components/       # React components (UI, layout, features)
├── lib/              # Utility functions & data processing
├── types/            # TypeScript type definitions
└── __tests__/        # Test files

recipes/              # Markdown recipe files (113 total)
public/               # Static assets
docs/                 # Project documentation (you are here)
```

---

## 🎯 Application Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured recipes |
| `/recipes` | All recipes with filters |
| `/recipes/[slug]` | Individual recipe detail |
| `/categories` | Category listing |
| `/categories/[category]` | Recipes by category |
| `/search` | Search functionality |
| `/favorites` | User favorites |
| `/cookbook` | Personal cookbook dashboard |
| `/shopping-list` | Shopping list generator |
| `/about` | About page |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recipes` | GET | Fetch all recipes |

---

## 📦 Data Models

### Recipe Structure

```typescript
interface Recipe {
  slug: string;
  meta: RecipeMeta;              // Title, description, times, etc.
  ingredients: RecipeIngredient[]; // Amount, unit, ingredient, notes
  instructions: RecipeInstruction[]; // Step-by-step instructions
  nutrition?: RecipeNutrition;    // Nutritional info
  notes?: string[];               // Additional notes
  variations?: string[];          // Recipe variations
  storage?: string;               // Storage instructions
}
```

**Full Type Definitions:** `src/types/recipe.ts`

---

## 🧩 Component Structure

### UI Components (`src/components/ui/`)
- `badge`, `button`, `card`, `checkbox`
- `dropdown-menu`, `input`, `label`, `select`
- `separator`, `slider`, `tabs`, `textarea`
- `recipe-card`, `search-bar`

### Feature Components
- **Layout:** `header`, `footer`, `theme-toggle`
- **Recipe:** `recipe-hero`, `recipe-ingredients`, `recipe-instructions`, `recipe-notes`, `recipe-nutrition`
- **Lists:** `recipe-grid`, `recipe-filters`, `related-recipes`
- **Cookbook:** `cookbook-dashboard`, `favorites-section`, `shopping-list-manager`
- **SEO:** `structured-data`

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev:turbo        # Dev with Turbopack

# Code Quality
npm run lint             # Lint code
npm run lint:fix         # Auto-fix lint issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript validation

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Build & Deploy
npm run build            # Production build
npm run start            # Start production server
npm run deploy           # Deploy to Vercel
npm run deploy:prod      # Deploy to production
```

---

## 📂 Key File Locations

### Configuration Files
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint rules
- `.prettierrc.json` - Prettier configuration
- `jest.config.js` - Jest test configuration

### Entry Points
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Homepage
- `src/lib/markdown.ts` - Recipe data loader

### Type Definitions
- `src/types/recipe.ts` - Recipe types
- `src/types/index.ts` - Type exports

---

## 🏗️ Architecture Highlights

### Pattern: Next.js App Router

- **Server Components** - Default rendering mode
- **File-based Routing** - Routes defined by folder structure
- **API Routes** - RESTful endpoints in `app/api/`
- **Server Actions** - Not currently used (could be added)

### Data Architecture

- **Storage:** Markdown files with YAML frontmatter
- **Location:** `/recipes` directory (113 files)
- **Parser:** gray-matter + remark
- **Format:** ISO 8601 durations (PT10M, PT1H30M)
- **Caching:** Next.js automatic caching

### State Management

- **Server State:** React Server Components
- **Client State:** React useState, useEffect
- **Persistent State:** localStorage (favorites, theme, shopping list)
- **URL State:** Search params for filters

---

## 🎨 Styling & Design

### Design System

**Brand Colors (Savor):**
- Saffron: `#F4A261` (primary accent)
- Sage: `#2A9D8F` (secondary)
- Cream: `#FFFEF7` (light background)
- Paprika: `#E76F51` (highlight)
- Charcoal: `#264653` (dark text)
- Mint: `#A8DADC` (light accent)

**Typography:**
- Headings: Inter
- Body: Open Sans
- Accent: Dancing Script (cursive)

**Features:**
- Dark mode support (next-themes)
- Responsive breakpoints (xs, sm, md, lg, xl, xxl)
- Accessible components (Radix UI)

---

## 🔍 Searching the Codebase

### Finding Components
```bash
# UI components
src/components/ui/*.tsx

# Feature components
src/components/{feature-name}/*.tsx

# Page components
src/app/**/page.tsx
```

### Finding Types
```bash
# All types
src/types/**/*.ts

# Recipe-specific
src/types/recipe.ts
```

### Finding Utilities
```bash
# All utilities
src/lib/*.ts

# Recipe utilities
src/lib/markdown.ts
src/lib/recipe-utils.ts
src/lib/recipe-server-utils.ts
```

---

## 📖 Existing Project Documentation

The following documentation files exist in the project root:

- `RECIPE_CONSOLIDATION_COMPLETE.md` - Recipe migration summary
- `QUICK_REFERENCE.md` - Quick reference guide
- `TESTING_CHECKLIST.md` - Testing checklist
- `STANDARDIZATION_SUMMARY.md` - Recipe standardization
- `DARK_MODE_AND_FAVORITES_IMPLEMENTATION.md` - Feature implementation notes
- `FAMILY_RECIPES_DEPRECATION_COMPLETE.md` - Deprecation details
- Various other implementation docs

---

## 🚦 Getting Started with Development

### For New Features

1. **Review This Index** - Understand project structure
2. **Check Project Overview** - Understand architecture and patterns
3. **Review Type Definitions** - `src/types/recipe.ts` for data models
4. **Explore Components** - `src/components/` for existing patterns
5. **Check Similar Features** - Look for related implementations

### For Bug Fixes

1. **Locate the Issue** - Use routes/components structure above
2. **Check Related Types** - Ensure type safety
3. **Review Tests** - Check `src/__tests__/` for existing coverage
4. **Test Changes** - Run `npm test` before committing

### For Understanding Data Flow

1. **Recipe Loading:** `src/lib/markdown.ts` → `getAllRecipes()`
2. **API Layer:** `src/app/api/recipes/route.ts`
3. **Page Rendering:** `src/app/**/page.tsx` files
4. **Component Props:** Type definitions in `src/types/`

---

## 🎯 Next Steps for Brownfield PRD

When creating a PRD for new features:

1. **Reference this index** as the primary documentation source
2. **Review project-overview.md** for architectural constraints
3. **Check existing patterns** in similar features
4. **Consider:**
   - Recipe data model compatibility
   - Component library (Radix UI) consistency
   - Tailwind/brand color usage
   - Server vs. Client Component decisions
   - SEO implications (structured data)

---

## 📊 Project Workflow Status

**BMM Status File:** [`bmm-workflow-status.md`](./bmm-workflow-status.md)

Check the status file for:
- Current workflow phase
- Next recommended actions
- Story tracking (once in implementation)
- Project milestones

---

## 🔗 Useful Links

- **Next.js Docs:** https://nextjs.org/docs
- **React 19 Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Radix UI:** https://www.radix-ui.com
- **TypeScript:** https://www.typescriptlang.org

---

## ⚙️ AI Development Context

This documentation is optimized for AI-assisted development. When working with AI agents:

- **Point to this index** as the primary context source
- **Reference project-overview.md** for detailed information
- **Use type definitions** in `src/types/` for accurate code generation
- **Follow existing patterns** found in similar components/pages
- **Maintain consistency** with the architecture described

---

**Last Updated:** 2025-10-21
**Documentation Version:** 1.0
**Scan Mode:** Deep (critical files read)
**Status:** Initial documentation complete

_For questions or updates, regenerate documentation using the BMad document-project workflow._
