# User Stories & Sprint Breakdown: Cookbook Canvas

**Document Version:** 1.0
**Date:** 2025-10-21
**Status:** Ready for Sprint Planning
**Related Documents:** PRD-COOKBOOK-CANVAS.md, TECH-SPEC-COOKBOOK-CANVAS.md

---

## What Are User Stories?

**User stories** are short, focused descriptions of a feature from the user's perspective. They follow this format:

```
As a [user type]
I want to [action/capability]
So that [benefit/outcome]
```

**Why user stories?**
- Shift focus from *what the code does* to *what the user needs*
- Break large features into smaller, testable pieces
- Enable faster development cycles
- Easier to estimate and prioritize
- Clear acceptance criteria prevent misunderstandings

**Example:**
```
As a meal planner
I want to expand a recipe card to see full ingredients and instructions
So that I can review complete recipes without leaving the canvas
```

---

## Tickets vs. User Stories

- **User Story** = The requirement from user perspective (what/why)
- **Ticket/Task** = A specific piece of work to complete (how)
- **Sprint** = A 1-2 week time box where a team completes selected tickets

This document breaks down the PRD and Tech Spec into **user stories** and **tickets** organized into **5 sprints** (one per phase).

---

## Story Points & Estimation

Each ticket gets a **story point estimate** (complexity + effort):

| Points | Complexity | Time (1 Dev) |
|--------|-----------|-------------|
| 1 | Trivial | < 1 hour |
| 2 | Very small | 1-2 hours |
| 3 | Small | 2-4 hours |
| 5 | Medium | 4-8 hours |
| 8 | Large | 1-2 days |
| 13 | Very large | 2-3 days |

**Sprint capacity:** Assume 40 story points per developer per sprint (2-week sprint)

---

## Sprint Structure

```
Sprint 1 (Week 1): Foundation
  └─ Auth setup, DB schema, route protection
     ↓
Sprint 2 (Week 1-2): Canvas Core
  └─ TLDraw integration, recipe cards, persistence
     ↓
Sprint 3 (Week 2-3): User Uploads
  └─ File upload, validation, storage
     ↓
Sprint 4 (Week 3-4): Card Interactions
  └─ Expand/collapse, resize, delete, Polish
     ↓
Sprint 5 (Week 4): Drawing & Export
  └─ Drawing tools, export PNG/PDF, final polish
```

---

# SPRINT 1: Foundation (Week 1)

**Goal:** Set up infrastructure so authentication works and database is ready

**Sprint Capacity:** 40 points
**Team Size:** 1-2 developers

---

## Epic 1.1: Authentication Infrastructure

### Story 1.1.1: Set Up Supabase Project

**Story Description:**
```
As a developer
I want to create and configure a Supabase project
So that we have a backend infrastructure for auth, database, and storage
```

**Tickets:**

#### T1.1.1.1: Create Supabase Project
- **Estimate:** 2 points
- **Owner:** Backend Dev
- **Description:**
  - Create new Supabase project
  - Save project URL and API keys
  - Configure project settings (CORS, rate limits)
- **Acceptance Criteria:**
  - ✅ Supabase project created
  - ✅ Project URL accessible
  - ✅ API keys (anon + service role) saved securely in 1Password
  - ✅ CORS configured for local dev (localhost:3000)
  - ✅ CORS configured for production (vercel domain)
- **Dependencies:** None
- **References:** TECH-SPEC section 2.1

---

#### T1.1.1.2: Deploy Database Schema
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Create SQL migration file with full schema
  - Deploy schema to Supabase
  - Verify tables, indexes, and constraints
- **Acceptance Criteria:**
  - ✅ `user_recipes` table created with correct columns
  - ✅ `canvas_state` table created
  - ✅ Indexes created for performance
  - ✅ Foreign key constraints working
  - ✅ Constraints validated (UNIQUE, CHECK)
  - ✅ Tables appear in Supabase dashboard
- **Dependencies:** T1.1.1.1
- **References:** TECH-SPEC section 2.1
- **SQL File:** `scripts/schema.sql`

---

#### T1.1.1.3: Configure Row Level Security (RLS) Policies
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Create RLS policies for `user_recipes` table
  - Create RLS policies for `canvas_state` table
  - Test policies with authenticated and unauthenticated requests
- **Acceptance Criteria:**
  - ✅ RLS enabled on both tables
  - ✅ SELECT policy: users see only own recipes
  - ✅ INSERT policy: users can only insert own recipes
  - ✅ UPDATE policy: users can only update own recipes
  - ✅ DELETE policy: users can only delete own recipes
  - ✅ Unauthenticated users get 401 errors
  - ✅ Authenticated users get their own data only
  - ✅ Cross-user access test fails as expected
- **Dependencies:** T1.1.1.2
- **References:** TECH-SPEC section 2.1
- **Test Queries:** `scripts/test-rls.sql`

---

#### T1.1.1.4: Configure Supabase Storage Bucket
- **Estimate:** 2 points
- **Owner:** Backend Dev
- **Description:**
  - Create `user-recipes` private bucket
  - Configure storage policies
  - Test file upload/download
- **Acceptance Criteria:**
  - ✅ Bucket `user-recipes` created and private
  - ✅ Policy: users can upload to `/user-recipes/{userId}/`
  - ✅ Policy: users can read own files
  - ✅ Policy: users can delete own files
  - ✅ Test file upload successful
  - ✅ Test unauthorized access rejected
  - ✅ Bucket appears in Storage tab
- **Dependencies:** T1.1.1.1
- **References:** TECH-SPEC section 2.2

---

### Story 1.1.2: Implement Email/Password Authentication

**Story Description:**
```
As a new user
I want to create an account with email and password
So that I can access my personal cookbook canvas
```

**Tickets:**

#### T1.1.2.1: Create Sign Up Page
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Create `src/app/auth/signup/page.tsx`
  - Build sign-up form (email, password, confirm password)
  - Integrate with Supabase Auth
  - Add form validation and error messages
- **Acceptance Criteria:**
  - ✅ Form renders with email, password, confirm password fields
  - ✅ Email validation (required, valid format)
  - ✅ Password validation (required, min 8 chars)
  - ✅ Confirm password must match
  - ✅ Submit button disabled while loading
  - ✅ Success: user created in Supabase Auth
  - ✅ Error messages display for failures
  - ✅ Redirect to verify email page after signup
  - ✅ Form styled consistently with Savor design
- **Dependencies:** T1.1.1.1
- **References:** TECH-SPEC section 3.2.2
- **Component:** `src/components/auth/SignUpForm.tsx`

---

#### T1.1.2.2: Create Sign In Page
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Create `src/app/auth/signin/page.tsx`
  - Build sign-in form (email, password)
  - Integrate with Supabase Auth session
  - Redirect to `/cookbook` on success
- **Acceptance Criteria:**
  - ✅ Form renders with email and password fields
  - ✅ Email and password required
  - ✅ Submit button disabled while loading
  - ✅ Success: user authenticated, session stored
  - ✅ Redirect to `/cookbook` on successful signin
  - ✅ Error message for invalid credentials
  - ✅ "Forgot password" link (placeholder for future)
  - ✅ "Sign Up" link to signup page
  - ✅ Form styled consistently with Savor design
- **Dependencies:** T1.1.1.1, T1.1.2.1
- **References:** TECH-SPEC section 3.2.2
- **Component:** `src/components/auth/SignInForm.tsx`

---

#### T1.1.2.3: Create Sign Out Functionality
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Create sign out endpoint
  - Add sign out button to navigation
  - Clear session on sign out
- **Acceptance Criteria:**
  - ✅ Sign out button appears in navbar
  - ✅ Clicking button calls sign out endpoint
  - ✅ Session cleared from browser
  - ✅ Redirect to home page
  - ✅ Subsequent requests to protected routes redirect to signin
- **Dependencies:** T1.1.2.2
- **References:** TECH-SPEC section 3.2
- **Route:** `src/app/auth/signout/route.ts`

---

### Story 1.1.3: Implement Auth Middleware

**Story Description:**
```
As a product owner
I want to protect the /cookbook route
So that only authenticated users can access their canvas
```

**Tickets:**

#### T1.1.3.1: Create Auth Middleware
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Implement Next.js middleware
  - Check authentication on `/cookbook` routes
  - Redirect unauthenticated users to signin
- **Acceptance Criteria:**
  - ✅ Middleware intercepts `/cookbook` requests
  - ✅ Authenticated users pass through
  - ✅ Unauthenticated users redirected to `/auth/signin`
  - ✅ Session refresh happens on middleware run
  - ✅ No infinite redirect loops
  - ✅ Works with API routes too (`/api/canvas/*`, `/api/recipes/*`)
- **Dependencies:** T1.1.2.2
- **References:** TECH-SPEC section 3.2.1
- **File:** `src/middleware.ts`

---

#### T1.1.3.2: Create Protected Layout
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Create layout wrapper for protected routes
  - Display navbar with user info and sign out button
  - Show loading state while checking auth
- **Acceptance Criteria:**
  - ✅ Layout appears on `/cookbook` page
  - ✅ Navbar displays user email
  - ✅ Sign out button functional
  - ✅ Loading indicator shows while checking session
  - ✅ Styled consistently with Savor
- **Dependencies:** T1.1.3.1
- **References:** TECH-SPEC section 3.1
- **File:** `src/app/cookbook/layout.tsx`

---

## Epic 1.2: Environment & Tooling

### Story 1.2.1: Configure Development Environment

**Story Description:**
```
As a developer
I want to have environment variables configured
So that the app can connect to Supabase
```

**Tickets:**

#### T1.2.1.1: Set Up Environment Variables
- **Estimate:** 1 point
- **Owner:** Backend Dev / DevOps
- **Description:**
  - Create `.env.local` file with Supabase keys
  - Create `.env.example` for documentation
  - Document which variables are required
- **Acceptance Criteria:**
  - ✅ `.env.local` has all required variables
  - ✅ `.env.example` documents all variables
  - ✅ `.env.local` in `.gitignore` (not committed)
  - ✅ App boots without console errors
  - ✅ Can authenticate successfully
- **Dependencies:** T1.1.1.1
- **References:** TECH-SPEC section 8
- **File:** `.env.local` and `.env.example`

---

#### T1.2.1.2: Update Vercel Deployment Secrets
- **Estimate:** 1 point
- **Owner:** DevOps
- **Description:**
  - Add Supabase env vars to Vercel project
  - Test deployment connects to Supabase
- **Acceptance Criteria:**
  - ✅ Vercel environment variables configured
  - ✅ Deployment succeeds without env errors
  - ✅ Signin/signup work on production
  - ✅ CORS works for production domain
- **Dependencies:** T1.2.1.1
- **References:** TECH-SPEC section 9

---

## Epic 1.3: Documentation & Knowledge

### Story 1.3.1: Create Developer Documentation

**Story Description:**
```
As a new developer
I want documentation on the auth setup
So that I can understand how authentication works
```

**Tickets:**

#### T1.3.1.1: Create Supabase Setup Guide
- **Estimate:** 2 points
- **Owner:** Tech Lead
- **Description:**
  - Document Supabase project setup steps
  - Include database schema explanation
  - Explain RLS policies
- **Acceptance Criteria:**
  - ✅ Guide in `docs/SUPABASE-SETUP.md`
  - ✅ Step-by-step instructions for new dev
  - ✅ Screenshots of Supabase dashboard
  - ✅ Explains RLS and why it's important
  - ✅ Troubleshooting section included
- **Dependencies:** All T1.1.* completed
- **File:** `docs/SUPABASE-SETUP.md`

---

## Sprint 1 Summary

| Ticket | Story | Points | Owner | Status |
|--------|-------|--------|-------|--------|
| T1.1.1.1 | Create Supabase Project | 2 | Backend | - |
| T1.1.1.2 | Deploy Database Schema | 3 | Backend | - |
| T1.1.1.3 | Configure RLS Policies | 3 | Backend | - |
| T1.1.1.4 | Configure Storage Bucket | 2 | Backend | - |
| T1.1.2.1 | Create Sign Up Page | 5 | Frontend | - |
| T1.1.2.2 | Create Sign In Page | 5 | Frontend | - |
| T1.1.2.3 | Create Sign Out | 2 | Frontend | - |
| T1.1.3.1 | Auth Middleware | 3 | Backend | - |
| T1.1.3.2 | Protected Layout | 2 | Frontend | - |
| T1.2.1.1 | Environment Variables | 1 | Backend | - |
| T1.2.1.2 | Vercel Secrets | 1 | DevOps | - |
| T1.3.1.1 | Supabase Setup Guide | 2 | Tech Lead | - |

**Total: 31 points** (under 40 capacity, allows for scope creep/bugs)

**Sprint Goal:** "Users can create accounts, sign in, and access a protected `/cookbook` page"

---

# SPRINT 2: Canvas Core (Week 1-2)

**Goal:** Render working infinite canvas with recipe cards

**Sprint Capacity:** 40 points
**Team Size:** 1-2 developers

---

## Epic 2.1: TLDraw Integration

### Story 2.1.1: Integrate TLDraw Library

**Story Description:**
```
As a developer
I want TLDraw integrated into the project
So that we have an infinite canvas component ready to use
```

**Tickets:**

#### T2.1.1.1: Install & Configure TLDraw
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Install `tldraw` package
  - Set up default editor configuration
  - Test basic pan and zoom
- **Acceptance Criteria:**
  - ✅ Package installed
  - ✅ CSS imports working
  - ✅ No TypeScript errors
  - ✅ Pan/zoom works smoothly
  - ✅ Can create default shapes
- **Dependencies:** Sprint 1 complete
- **References:** TECH-SPEC section 3.3
- **Command:** `npm install tldraw`

---

#### T2.1.1.2: Create Custom Recipe Card Shape
- **Estimate:** 8 points
- **Owner:** Frontend Dev
- **Description:**
  - Extend TLDraw BaseBoxShapeUtil
  - Define recipe card shape properties
  - Implement render component
  - Add resize handles
- **Acceptance Criteria:**
  - ✅ Custom shape type `recipe-card` recognized
  - ✅ Shape has required properties (recipeSlug, recipeType, isExpanded, etc.)
  - ✅ Shape renders custom component
  - ✅ Resize handles work
  - ✅ Can drag shape
  - ✅ No console errors
- **Dependencies:** T2.1.1.1
- **References:** TECH-SPEC section 3.3.2
- **File:** `src/lib/tldraw-shapes.ts`

---

### Story 2.1.2: Implement Canvas Persistence

**Story Description:**
```
As a user
I want my canvas to save automatically
So that I don't lose my work
```

**Tickets:**

#### T2.1.2.1: Create Canvas Save API Endpoint
- **Estimate:** 5 points
- **Owner:** Backend Dev
- **Description:**
  - Implement `POST /api/canvas/save`
  - Validate user authentication
  - UPSERT canvas state to database
  - Return success response
- **Acceptance Criteria:**
  - ✅ Endpoint accepts TLDraw document JSON
  - ✅ Requires authentication (returns 401 if not)
  - ✅ Validates document structure
  - ✅ Saves to `canvas_state` table
  - ✅ RLS enforces user isolation
  - ✅ Returns 200 with `lastUpdated` timestamp
  - ✅ Error responses have clear messages
  - ✅ Tested with Postman/curl
- **Dependencies:** Sprint 1 complete, T2.1.1.1
- **References:** TECH-SPEC section 4.1
- **File:** `src/app/api/canvas/save/route.ts`

---

#### T2.1.2.2: Create Canvas Load API Endpoint
- **Estimate:** 5 points
- **Owner:** Backend Dev
- **Description:**
  - Implement `GET /api/canvas/load`
  - Query user's canvas state
  - Return empty canvas for new users
  - Handle errors gracefully
- **Acceptance Criteria:**
  - ✅ Endpoint returns canvas state
  - ✅ Requires authentication
  - ✅ Returns empty canvas for new users (no 404)
  - ✅ Loads viewport position and zoom
  - ✅ RLS enforces user isolation
  - ✅ Returns 200 with canvas JSON
  - ✅ Tested with new user flow
- **Dependencies:** T2.1.2.1
- **References:** TECH-SPEC section 4.2
- **File:** `src/app/api/canvas/load/route.ts`

---

#### T2.1.2.3: Implement Frontend Canvas Persistence Hook
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Create `useCanvasPersistence` hook
  - Implement debounced save (500ms)
  - Load canvas on mount
  - Handle save errors
- **Acceptance Criteria:**
  - ✅ Canvas loads from API on page mount
  - ✅ Changes debounced (not saving on every keystroke)
  - ✅ Save triggers after 500ms of inactivity
  - ✅ Save on page unload (`beforeunload`)
  - ✅ Error shows toast notification
  - ✅ Loading state managed
  - ✅ No duplicate saves
- **Dependencies:** T2.1.2.1, T2.1.2.2
- **References:** TECH-SPEC section 5.1
- **File:** `src/lib/canvas-persistence.ts`

---

## Epic 2.2: Recipe Card Display

### Story 2.2.1: Recipe Card Rendering

**Story Description:**
```
As a user
I want to see recipe information on cards
So that I can quickly see what recipes are on my canvas
```

**Tickets:**

#### T2.2.1.1: Create Recipe Card Component
- **Estimate:** 8 points
- **Owner:** Frontend Dev
- **Description:**
  - Build React component for recipe card display
  - Show compact view: title + metadata
  - Show full view: complete recipe
  - Handle loading and error states
- **Acceptance Criteria:**
  - ✅ Compact view shows: title, prep time, cook time, difficulty, servings
  - ✅ Full view shows: all metadata + ingredients + instructions
  - ✅ Beautiful markdown rendering
  - ✅ Scrollable content for long recipes
  - ✅ Styled consistently with Savor design
  - ✅ Loads recipe data asynchronously
  - ✅ Spinner while loading
  - ✅ Error message if recipe not found
- **Dependencies:** T2.1.1.2
- **References:** TECH-SPEC section 3.3.2
- **File:** `src/components/cookbook/RecipeCard.tsx`

---

#### T2.2.1.2: Implement Expand/Collapse Toggle
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - Add expand/collapse button to card
  - Toggle between compact and full view
  - Smooth animation on state change
  - Update shape props when toggled
- **Acceptance Criteria:**
  - ✅ Button visible on card
  - ✅ Click toggles expanded state
  - ✅ Smooth transition animation
  - ✅ Full view displays complete recipe
  - ✅ Compact view shows metadata only
  - ✅ State persisted (saved in canvas)
- **Dependencies:** T2.2.1.1
- **References:** TECH-SPEC section 4.3.3

---

#### T2.2.1.3: Create Recipe Parser Utility
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Parse markdown with frontmatter
  - Extract ingredients and instructions
  - Validate recipe structure
  - Support existing recipe format
- **Acceptance Criteria:**
  - ✅ Parses YAML frontmatter
  - ✅ Extracts ingredients list
  - ✅ Extracts instructions
  - ✅ Converts ISO 8601 times to readable format
  - ✅ Handles missing optional fields
  - ✅ Tests pass with sample recipes
- **Dependencies:** None
- **References:** TECH-SPEC section 5.2
- **File:** `src/lib/recipe-parser.ts`

---

## Epic 2.3: Recipe Selector

### Story 2.3.1: Build Recipe Selection UI

**Story Description:**
```
As a user
I want to browse and select recipes to add to my canvas
So that I can build my meal plan
```

**Tickets:**

#### T2.3.1.1: Create Recipe Selector Sidebar
- **Estimate:** 8 points
- **Owner:** Frontend Dev
- **Description:**
  - Build sidebar component with recipe list
  - Implement search functionality
  - Add category filtering
  - Show "All Recipes" and "My Recipes" sections (empty for now)
- **Acceptance Criteria:**
  - ✅ Sidebar renders on left side of canvas
  - ✅ Search bar functional (searches by title, description, tags)
  - ✅ Category filter dropdown works
  - ✅ Recipe list shows: title + metadata
  - ✅ Click recipe adds to canvas
  - ✅ "My Recipes" section visible (empty until Phase 3)
  - ✅ Scrollable if many recipes
  - ✅ Mobile: sidebar collapsible (hamburger menu)
- **Dependencies:** T2.2.1.3
- **References:** TECH-SPEC section 4.4
- **File:** `src/components/cookbook/RecipeSelector.tsx`

---

#### T2.3.1.2: Fetch & Display Main Library Recipes
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Create API endpoint to list main library recipes
  - Return recipe metadata for selector
  - Implement search and filtering server-side
- **Acceptance Criteria:**
  - ✅ API endpoint `GET /api/recipes/main` returns all recipes
  - ✅ Returns: title, description, category, difficulty, slug
  - ✅ Supports search query parameter
  - ✅ Supports category filter parameter
  - ✅ Paginated response (50 per page)
  - ✅ Performance tested (< 200ms)
- **Dependencies:** None (uses existing recipes)
- **References:** TECH-SPEC section 4.1
- **File:** `src/app/api/recipes/main/route.ts`

---

#### T2.3.1.3: Connect Selector to Canvas
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - When user clicks recipe in selector, add to canvas
  - Place card at center of current viewport
  - Show success toast notification
  - Prevent duplicate cards (or allow with unique IDs)
- **Acceptance Criteria:**
  - ✅ Click recipe adds card to canvas
  - ✅ Card appears at viewport center
  - ✅ Toast shows "Recipe added to canvas"
  - ✅ Card is immediately selectable
  - ✅ Multiple copies of same recipe allowed
  - ✅ Multiple clicks don't crash app
- **Dependencies:** T2.3.1.1
- **References:** TECH-SPEC section 3.3
- **Component:** `src/components/cookbook/CookbookCanvas.tsx`

---

## Epic 2.4: Main Canvas Page

### Story 2.4.1: Create Cookbook Page

**Story Description:**
```
As a user
I want to open /cookbook and see a blank canvas
So that I can start building my recipe collection
```

**Tickets:**

#### T2.4.1.1: Create Main Cookbook Page
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Create `src/app/cookbook/page.tsx`
  - Layout with sidebar and canvas area
  - Load canvas on mount
  - Handle empty state
- **Acceptance Criteria:**
  - ✅ Page loads protected (auth required)
  - ✅ Sidebar on left with recipe selector
  - ✅ TLDraw canvas on right (full height)
  - ✅ Empty state message: "Add your first recipe!"
  - ✅ Responsive layout (sidebar collapses on mobile)
  - ✅ Loading spinner while canvas loads
  - ✅ Error message if canvas fails to load
- **Dependencies:** Sprint 1 complete, T2.1.1.2, T2.3.1.1
- **References:** TECH-SPEC section 3.1
- **File:** `src/app/cookbook/page.tsx`

---

#### T2.4.1.2: Create Toolbar & Navigation
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - Add toolbar with export/undo/redo buttons (non-functional for now)
  - Add user menu with sign out
  - Add help icon with shortcuts
- **Acceptance Criteria:**
  - ✅ Toolbar visible above canvas
  - ✅ Buttons visible (not functional yet)
  - ✅ Sign out button in user menu
  - ✅ Styled consistently
  - ✅ Responsive on mobile
- **Dependencies:** T2.4.1.1
- **References:** TECH-SPEC section 4.8
- **File:** `src/components/cookbook/CanvasToolbar.tsx`

---

#### T2.4.1.3: Create Toast Notification Component
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Build reusable Toast component
  - Support success, error, info types
  - Auto-dismiss after 3 seconds
  - Allow manual close
- **Acceptance Criteria:**
  - ✅ Toast component renders
  - ✅ Different colors for types (success=green, error=red)
  - ✅ Auto-dismisses after 3 seconds
  - ✅ Can close manually
  - ✅ Multiple toasts queue properly
  - ✅ Positioned in bottom-right
- **Dependencies:** None
- **References:** TECH-SPEC section 3.1
- **File:** `src/components/ui/Toast.tsx`

---

## Sprint 2 Summary

| Ticket | Story | Points | Owner | Status |
|--------|-------|--------|-------|--------|
| T2.1.1.1 | Install TLDraw | 2 | Frontend | - |
| T2.1.1.2 | Custom Recipe Shape | 8 | Frontend | - |
| T2.1.2.1 | Canvas Save API | 5 | Backend | - |
| T2.1.2.2 | Canvas Load API | 5 | Backend | - |
| T2.1.2.3 | Persistence Hook | 5 | Frontend | - |
| T2.2.1.1 | Recipe Card Component | 8 | Frontend | - |
| T2.2.1.2 | Expand/Collapse | 3 | Frontend | - |
| T2.2.1.3 | Recipe Parser | 3 | Backend | - |
| T2.3.1.1 | Recipe Selector Sidebar | 8 | Frontend | - |
| T2.3.1.2 | Main Recipes API | 3 | Backend | - |
| T2.3.1.3 | Connect Selector to Canvas | 3 | Frontend | - |
| T2.4.1.1 | Main Cookbook Page | 5 | Frontend | - |
| T2.4.1.2 | Toolbar & Navigation | 3 | Frontend | - |
| T2.4.1.3 | Toast Component | 2 | Frontend | - |

**Total: 62 points** (exceeds 40, may need to split into Sprint 2a/2b or reduce scope)

**Alternative:** Split into two 2-week sprints or reduce non-critical items (toolbar, toast) to Sprint 5

**Sprint Goal:** "Users can add recipes to an infinite canvas that persists across sessions"

---

# SPRINT 3: User Uploads (Week 2-3)

**Goal:** Enable users to upload personal recipe files

**Sprint Capacity:** 40 points
**Team Size:** 1-2 developers

---

## Epic 3.1: File Upload Infrastructure

### Story 3.1.1: Build File Upload UI

**Story Description:**
```
As a user
I want to drag and drop .md files onto the canvas
So that I can add my personal recipes
```

**Tickets:**

#### T3.1.1.1: Create File Upload Component
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Build drag-and-drop zone
  - File picker button
  - Handle file selection
  - Validate file type/size
- **Acceptance Criteria:**
  - ✅ Drag & drop zone visible in sidebar
  - ✅ Accepts .md files only
  - ✅ Shows error if not .md
  - ✅ File picker works
  - ✅ Max 500KB enforced
  - ✅ Error messages clear
  - ✅ Loading spinner during upload
- **Dependencies:** Sprint 2 complete
- **References:** TECH-SPEC section 4.3.2
- **File:** `src/components/cookbook/RecipeUpload.tsx`

---

#### T3.1.1.2: Create Recipe Preview Modal
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Parse uploaded file
  - Show recipe preview before confirmation
  - Display extracted metadata
  - Show validation errors if any
- **Acceptance Criteria:**
  - ✅ Modal shows after file selection
  - ✅ Displays parsed title, description, metadata
  - ✅ Shows ingredients and instructions preview
  - ✅ "Confirm" and "Cancel" buttons
  - ✅ Shows error if frontmatter invalid
  - ✅ Beautiful markdown preview
- **Dependencies:** T3.1.1.1, T2.2.1.3 (parser)
- **References:** TECH-SPEC section 4.5
- **File:** `src/components/cookbook/RecipePreviewModal.tsx`

---

### Story 3.1.2: Implement Upload API

**Story Description:**
```
As a developer
I want a robust file upload endpoint
So that user recipes are validated and stored safely
```

**Tickets:**

#### T3.1.2.1: Create Recipe Upload Endpoint
- **Estimate:** 8 points
- **Owner:** Backend Dev
- **Description:**
  - Implement `POST /api/recipes/upload`
  - Validate authentication
  - Validate file format and frontmatter
  - Check rate limits
  - Upload to Supabase Storage
  - Save metadata to database
- **Acceptance Criteria:**
  - ✅ Requires authentication
  - ✅ Validates file type (.md only)
  - ✅ Validates file size (max 500KB)
  - ✅ Rate limits: 10 uploads/hour per user
  - ✅ Validates required frontmatter fields
  - ✅ Checks for ## Ingredients and ## Instructions
  - ✅ Uploads to Supabase Storage
  - ✅ Saves metadata to `user_recipes` table
  - ✅ RLS enforces user isolation
  - ✅ Cleans up storage if DB insert fails
  - ✅ Returns clear error messages
  - ✅ Tested with valid and invalid files
- **Dependencies:** Sprint 1 & 2 complete
- **References:** TECH-SPEC section 4.3
- **File:** `src/app/api/recipes/upload/route.ts`

---

#### T3.1.2.2: Implement Rate Limiting
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Add rate limit check to upload endpoint
  - Count uploads in last hour
  - Return 429 if limit exceeded
- **Acceptance Criteria:**
  - ✅ Counts uploads per user per hour
  - ✅ Returns 429 after 10 uploads
  - ✅ Resets after 1 hour
  - ✅ Error message tells user when they can try again
- **Dependencies:** T3.1.2.1
- **References:** TECH-SPEC section 4.5

---

### Story 3.1.3: List User Recipes

**Story Description:**
```
As a user
I want to see all my uploaded recipes
So that I can add them to the canvas
```

**Tickets:**

#### T3.1.3.1: Create User Recipes List Endpoint
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Implement `GET /api/recipes/user`
  - Query user's recipes from database
  - Return recipe metadata
  - Support pagination
- **Acceptance Criteria:**
  - ✅ Returns list of user's recipes
  - ✅ Includes: title, description, category, difficulty
  - ✅ Includes: createdAt, updatedAt
  - ✅ Paginated (50 per page)
  - ✅ Supports sort options
  - ✅ RLS enforces user isolation
  - ✅ Performance tested
- **Dependencies:** T3.1.2.1
- **References:** TECH-SPEC section 4.1
- **File:** `src/app/api/recipes/user/route.ts`

---

#### T3.1.3.2: Update Recipe Selector with User Recipes
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - Fetch user recipes from API
  - Display in separate "My Recipes" section
  - Show badge for user-uploaded recipes
  - Allow adding to canvas
- **Acceptance Criteria:**
  - ✅ "My Recipes" section appears
  - ✅ Lists user's uploaded recipes
  - ✅ Shows "User Recipe" badge
  - ✅ Can search within user recipes
  - ✅ Click to add to canvas
  - ✅ Empty message if no recipes yet
- **Dependencies:** T3.1.3.1, T2.3.1.1
- **References:** TECH-SPEC section 4.4

---

## Epic 3.2: Recipe Validation & Error Handling

### Story 3.2.1: Frontmatter Validation

**Story Description:**
```
As a user
I want clear error messages when my recipe format is wrong
So that I can fix it and upload successfully
```

**Tickets:**

#### T3.2.1.1: Create Recipe Validation Utility
- **Estimate:** 3 points
- **Owner:** Backend Dev
- **Description:**
  - Validate frontmatter structure
  - Check required fields
  - Validate field formats (ISO 8601 times, etc.)
  - Generate helpful error messages
- **Acceptance Criteria:**
  - ✅ Checks for: title, description, category
  - ✅ Validates ISO 8601 time formats
  - ✅ Checks for ## Ingredients section
  - ✅ Checks for ## Instructions section
  - ✅ Error messages list missing fields
  - ✅ Error messages suggest fixes
- **Dependencies:** T2.2.1.3 (parser)
- **References:** TECH-SPEC section 4.5
- **File:** `src/lib/recipe-upload.ts`

---

#### T3.2.1.2: Display Upload Errors to User
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Show validation errors in upload component
  - Highlight problematic fields
  - Provide copy-paste template for correct format
- **Acceptance Criteria:**
  - ✅ Error messages appear clearly
  - ✅ Lists which fields are wrong
  - ✅ Shows valid format example
  - ✅ User can see in preview modal
  - ✅ Styled for readability
- **Dependencies:** T3.2.1.1
- **References:** TECH-SPEC section 4.5

---

## Sprint 3 Summary

| Ticket | Story | Points | Owner | Status |
|--------|-------|--------|-------|--------|
| T3.1.1.1 | File Upload Component | 5 | Frontend | - |
| T3.1.1.2 | Preview Modal | 5 | Frontend | - |
| T3.1.2.1 | Recipe Upload API | 8 | Backend | - |
| T3.1.2.2 | Rate Limiting | 3 | Backend | - |
| T3.1.3.1 | User Recipes API | 3 | Backend | - |
| T3.1.3.2 | Update Selector | 3 | Frontend | - |
| T3.2.1.1 | Validation Utility | 3 | Backend | - |
| T3.2.1.2 | Display Errors | 2 | Frontend | - |

**Total: 32 points** (under 40 capacity)

**Sprint Goal:** "Users can upload .md recipe files and see them in their canvas"

---

# SPRINT 4: Card Interactions (Week 3-4)

**Goal:** Make cards interactive and beautiful

**Sprint Capacity:** 40 points
**Team Size:** 1-2 developers

---

## Epic 4.1: Card Controls

### Story 4.1.1: Card Resize & Drag

**Story Description:**
```
As a user
I want to resize and reposition recipe cards on the canvas
So that I can organize them to fit my layout
```

**Tickets:**

#### T4.1.1.1: Implement Card Resize Functionality
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - Add resize handles to recipe cards
  - Implement drag-to-resize
  - Apply min/max size constraints
- **Acceptance Criteria:**
  - ✅ Resize handles visible on card corners/edges
  - ✅ Drag to resize works smoothly
  - ✅ Min size: 200px width, 300px height
  - ✅ Max size: 600px width, 900px height
  - ✅ Maintains aspect ratio (optional)
  - ✅ No content overflow
  - ✅ Saves resize to canvas state
- **Dependencies:** Sprint 3 complete, T2.1.1.2
- **References:** TECH-SPEC section 4.3.1

---

#### T4.1.1.2: Implement Card Delete
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Add delete button to card
  - Confirm before deletion (optional)
  - Remove from canvas
- **Acceptance Criteria:**
  - ✅ Delete button visible on card
  - ✅ Click removes card
  - ✅ Canvas auto-saves
  - ✅ Can undo delete (TLDraw undo)
  - ✅ No confirmation dialog for now
- **Dependencies:** T4.1.1.1
- **References:** TECH-SPEC section 4.3.1

---

### Story 4.1.2: Card Metadata Display

**Story Description:**
```
As a user
I want to see recipe metadata at a glance
So that I can understand key info without expanding
```

**Tickets:**

#### T4.1.2.1: Display Rich Metadata
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - Show icons for prep time, cook time
  - Display difficulty as styled badge
  - Show servings information
  - Add tags display
- **Acceptance Criteria:**
  - ✅ Prep time with ⏱️ icon
  - ✅ Cook time with 🔥 icon
  - ✅ Difficulty badge (Easy=green, Medium=yellow, Hard=red)
  - ✅ Servings display
  - ✅ Tags as small pills
  - ✅ Responsive on small cards
  - ✅ No text overflow
- **Dependencies:** T2.2.1.1
- **References:** TECH-SPEC section 4.3.2

---

#### T4.1.2.2: Add "User Recipe" Badge
- **Estimate:** 1 point
- **Owner:** Frontend Dev
- **Description:**
  - Show badge on user-uploaded recipes
  - Distinguish from main library
- **Acceptance Criteria:**
  - ✅ Badge appears on user recipes
  - ✅ Different color/style
  - ✅ Doesn't appear on main recipes
- **Dependencies:** T3.1.3.2
- **References:** TECH-SPEC section 4.3.2

---

## Epic 4.2: Markdown Rendering Polish

### Story 4.2.1: Beautiful Recipe Display

**Story Description:**
```
As a user
I want recipes to render beautifully with nice formatting
So that they're easy to read on the canvas
```

**Tickets:**

#### T4.2.1.1: Enhance Markdown Rendering
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Use remark + remark-html for proper parsing
  - Apply Tailwind styling to rendered HTML
  - Handle lists, headings, bold/italic
  - Proper typography and spacing
- **Acceptance Criteria:**
  - ✅ Markdown renders correctly
  - ✅ Headings properly sized
  - ✅ Lists render with bullets/numbers
  - ✅ Bold and italic work
  - ✅ Code blocks formatted
  - ✅ Links clickable
  - ✅ Typography matches Savor design
  - ✅ Good spacing/padding
- **Dependencies:** T2.2.1.1, T2.2.1.3
- **References:** TECH-SPEC section 4.3.3

---

#### T4.2.1.2: Handle Long Content with Scrolling
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Make expanded card content scrollable
  - Show scrollbar when content overflows
  - Maintain readable line lengths
- **Acceptance Criteria:**
  - ✅ Content scrolls within card
  - ✅ Scrollbar appears when needed
  - ✅ Scroll is smooth
  - ✅ No cut-off content
  - ✅ Works on all recipe sizes
- **Dependencies:** T4.2.1.1
- **References:** TECH-SPEC section 4.3.3

---

## Epic 4.3: Performance & Polish

### Story 4.3.1: Optimize Performance

**Story Description:**
```
As a developer
I want the canvas to remain fast with many cards
So that users have a smooth experience
```

**Tickets:**

#### T4.3.1.1: Implement Canvas Virtualization
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Only render visible cards
  - Unload off-screen cards
  - Improve pan/zoom performance
- **Acceptance Criteria:**
  - ✅ Canvas smooth with 50+ recipes
  - ✅ Load time < 2 seconds
  - ✅ Pan/zoom at 60fps
  - ✅ Memory usage reasonable
  - ✅ Tested on lower-end devices
- **Dependencies:** T2.1.1.2
- **References:** TECH-SPEC section 6.1

---

#### T4.3.1.2: Lazy Load Recipe Content
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - Load recipe data only when expanded
  - Don't fetch all ingredients until needed
  - Cache fetched recipes
- **Acceptance Criteria:**
  - ✅ Recipe data loads on expand
  - ✅ Spinner shows while loading
  - ✅ Data cached to avoid refetch
  - ✅ Error handled gracefully
- **Dependencies:** T2.2.1.2
- **References:** TECH-SPEC section 5.1

---

### Story 4.3.2: UI Polish & UX

**Story Description:**
```
As a user
I want a polished, intuitive experience
So that the app feels professional and easy to use
```

**Tickets:**

#### T4.3.2.1: Polish UI Styling
- **Estimate:** 3 points
- **Owner:** Design/Frontend Dev
- **Description:**
  - Review all components for consistency
  - Fix spacing and alignment
  - Ensure accessible colors
  - Add hover/focus states
- **Acceptance Criteria:**
  - ✅ Consistent spacing throughout
  - ✅ Buttons have hover states
  - ✅ Focus states visible for accessibility
  - ✅ Color contrast meets WCAG standards
  - ✅ No visual glitches
  - ✅ Typography consistent
- **Dependencies:** All previous
- **References:** TECH-SPEC section 4.3

---

#### T4.3.2.2: Add Loading & Empty States
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Loading spinner for canvas load
  - Empty state message: "Add your first recipe!"
  - Error state with retry button
- **Acceptance Criteria:**
  - ✅ Spinner shows while loading
  - ✅ Empty state helpful and clear
  - ✅ Error state shows error message
  - ✅ Retry button functional
  - ✅ Styled consistently
- **Dependencies:** T2.4.1.1
- **References:** TECH-SPEC section 4.3

---

#### T4.3.2.3: Keyboard Shortcuts Documentation
- **Estimate:** 1 point
- **Owner:** Frontend Dev
- **Description:**
  - Document available keyboard shortcuts
  - Add help button that shows shortcuts
  - Display common actions (Ctrl+Z, Ctrl+S, etc.)
- **Acceptance Criteria:**
  - ✅ Help menu accessible
  - ✅ Shows keyboard shortcuts
  - ✅ Common actions listed
  - ✅ Modal or sidebar display
- **Dependencies:** T2.4.1.2
- **References:** TECH-SPEC section 4.3

---

## Sprint 4 Summary

| Ticket | Story | Points | Owner | Status |
|--------|-------|--------|-------|--------|
| T4.1.1.1 | Card Resize | 3 | Frontend | - |
| T4.1.1.2 | Card Delete | 2 | Frontend | - |
| T4.1.2.1 | Rich Metadata | 3 | Frontend | - |
| T4.1.2.2 | User Recipe Badge | 1 | Frontend | - |
| T4.2.1.1 | Enhanced Markdown | 5 | Frontend | - |
| T4.2.1.2 | Scrollable Content | 2 | Frontend | - |
| T4.3.1.1 | Canvas Virtualization | 5 | Frontend | - |
| T4.3.1.2 | Lazy Load Content | 3 | Frontend | - |
| T4.3.2.1 | UI Polish | 3 | Design | - |
| T4.3.2.2 | Loading States | 2 | Frontend | - |
| T4.3.2.3 | Keyboard Shortcuts | 1 | Frontend | - |

**Total: 30 points** (under 40 capacity)

**Sprint Goal:** "Canvas is performant, beautiful, and production-ready for core features"

---

# SPRINT 5: Drawing & Export (Week 4)

**Goal:** Enable markup and finalize MVP

**Sprint Capacity:** 40 points
**Team Size:** 1-2 developers

---

## Epic 5.1: Drawing Tools

### Story 5.1.1: Enable Drawing Features

**Story Description:**
```
As a user
I want to draw and annotate over recipe cards
So that I can markup my meal plans
```

**Tickets:**

#### T5.1.1.1: Enable Drawing Tools
- **Estimate:** 3 points
- **Owner:** Frontend Dev
- **Description:**
  - Activate TLDraw drawing tools
  - Pen, highlighter, shapes, text, eraser
  - Add toolbar to select tools
- **Acceptance Criteria:**
  - ✅ Drawing tools available in toolbar
  - ✅ Pen tool works (freehand drawing)
  - ✅ Highlighter tool works (semi-transparent)
  - ✅ Shapes work (rectangle, circle, arrow)
  - ✅ Text tool works for annotations
  - ✅ Eraser tool works
  - ✅ Can switch between tools
  - ✅ No interference with card interaction
- **Dependencies:** Sprint 4 complete
- **References:** TECH-SPEC section 4.7

---

#### T5.1.1.2: Implement Z-Order Management
- **Estimate:** 2 points
- **Owner:** Frontend Dev
- **Description:**
  - Add context menu with "Bring to Front" / "Send to Back"
  - Ensure drawings can be above/below cards
  - Manage z-index properly
- **Acceptance Criteria:**
  - ✅ Right-click shows context menu
  - ✅ "Bring to Front" moves drawing to front
  - ✅ "Send to Back" moves to back
  - ✅ Drawings can be layered
  - ✅ Cards always visible
- **Dependencies:** T5.1.1.1
- **References:** TECH-SPEC section 4.7

---

#### T5.1.1.3: Implement Undo/Redo
- **Estimate:** 1 point
- **Owner:** Frontend Dev
- **Description:**
  - Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
  - Add buttons to toolbar
  - Limit undo history
- **Acceptance Criteria:**
  - ✅ Ctrl+Z undoes last action
  - ✅ Ctrl+Shift+Z redoes action
  - ✅ Buttons functional
  - ✅ History limited to last 50 actions
  - ✅ Works with cards and drawings
- **Dependencies:** T5.1.1.1
- **References:** TECH-SPEC section 4.7

---

## Epic 5.2: Canvas Export

### Story 5.2.1: Export Canvas

**Story Description:**
```
As a user
I want to export my canvas as PNG or PDF
So that I can print it or share with others
```

**Tickets:**

#### T5.2.1.1: Implement Canvas Export to PNG
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Export canvas (visible area or all) to PNG
  - High resolution options (72dpi, 150dpi, 300dpi)
  - Include all cards and drawings
  - File naming: `cookbook-{date}.png`
- **Acceptance Criteria:**
  - ✅ Export button in toolbar
  - ✅ PNG exports successfully
  - ✅ Resolution options available
  - ✅ File names correctly
  - ✅ All content visible in export
  - ✅ File size reasonable (< 10MB)
  - ✅ Tested on different browsers
- **Dependencies:** T5.1.1.1
- **References:** TECH-SPEC section 4.8

---

#### T5.2.1.2: Implement Canvas Export to PDF
- **Estimate:** 5 points
- **Owner:** Frontend Dev
- **Description:**
  - Export canvas to PDF
  - Optimize for printing
  - Include title and date
  - Multi-page if needed
- **Acceptance Criteria:**
  - ✅ Export to PDF button works
  - ✅ PDF creates successfully
  - ✅ Optimized for printing
  - ✅ Title and date included
  - ✅ Multi-page handling works
  - ✅ File size reasonable
  - ✅ Tested in multiple PDF readers
- **Dependencies:** T5.2.1.1
- **References:** TECH-SPEC section 4.8

---

## Epic 5.3: Final Polish & Testing

### Story 5.3.1: Comprehensive Testing

**Story Description:**
```
As a developer
I want comprehensive tests
So that the feature works reliably
```

**Tickets:**

#### T5.3.1.1: Write Unit Tests
- **Estimate:** 5 points
- **Owner:** QA/Frontend Dev
- **Description:**
  - Test recipe parser
  - Test validation utilities
  - Test persistence logic
- **Acceptance Criteria:**
  - ✅ > 80% code coverage
  - ✅ Parser tests pass
  - ✅ Validation tests pass
  - ✅ Persistence tests pass
  - ✅ All tests run in CI/CD
- **Dependencies:** All previous
- **References:** TECH-SPEC section 7.1

---

#### T5.3.1.2: Integration Testing
- **Estimate:** 5 points
- **Owner:** QA/Backend Dev
- **Description:**
  - Test end-to-end user flows
  - Test API endpoints
  - Test database operations
  - Test RLS policies
- **Acceptance Criteria:**
  - ✅ Signup flow works end-to-end
  - ✅ Upload flow works end-to-end
  - ✅ Canvas save/load works
  - ✅ RLS prevents cross-user access
  - ✅ API errors handled correctly
- **Dependencies:** All previous
- **References:** TECH-SPEC section 7.2

---

#### T5.3.1.3: Manual QA & Bug Fixes
- **Estimate:** 5 points
- **Owner:** QA
- **Description:**
  - Full manual testing
  - Cross-browser testing
  - Mobile testing
  - Document bugs
  - Fix critical issues
- **Acceptance Criteria:**
  - ✅ Chrome, Firefox, Safari tested
  - ✅ Mobile (iOS, Android) responsive
  - ✅ No console errors
  - ✅ No memory leaks
  - ✅ Performance meets targets
  - ✅ Accessibility checked
- **Dependencies:** All previous
- **References:** TECH-SPEC section 9

---

### Story 5.3.2: Documentation & Release

**Story Description:**
```
As a user/developer
I want clear documentation and release notes
So that I understand how to use and deploy this feature
```

**Tickets:**

#### T5.3.2.1: Write User Documentation
- **Estimate:** 3 points
- **Owner:** Tech Writer / PM
- **Description:**
  - Getting started guide
  - Feature tutorials
  - Troubleshooting guide
- **Acceptance Criteria:**
  - ✅ Guide explains all features
  - ✅ Screenshots included
  - ✅ Clear step-by-step instructions
  - ✅ Common issues addressed
  - ✅ Published on docs site
- **Dependencies:** All previous
- **References:** TECH-SPEC section 10

---

#### T5.3.2.2: Deploy to Production
- **Estimate:** 2 points
- **Owner:** DevOps
- **Description:**
  - Deploy to Vercel production
  - Verify all systems working
  - Monitor for errors
  - Run smoke tests
- **Acceptance Criteria:**
  - ✅ Deployed successfully
  - ✅ All pages load
  - ✅ Auth works
  - ✅ Canvas works
  - ✅ Upload works
  - ✅ No 500 errors
  - ✅ Performance acceptable
- **Dependencies:** T5.3.1.3
- **References:** TECH-SPEC section 9

---

#### T5.3.2.3: Write Release Notes
- **Estimate:** 1 point
- **Owner:** PM / Marketing
- **Description:**
  - Document new feature
  - List known limitations
  - Provide roadmap for future enhancements
- **Acceptance Criteria:**
  - ✅ Release notes published
  - ✅ Feature explained clearly
  - ✅ Screenshots included
  - ✅ Known issues listed
  - ✅ Future plans outlined
- **Dependencies:** All previous
- **References:** PRD section 9

---

## Sprint 5 Summary

| Ticket | Story | Points | Owner | Status |
|--------|-------|--------|-------|--------|
| T5.1.1.1 | Enable Drawing Tools | 3 | Frontend | - |
| T5.1.1.2 | Z-Order Management | 2 | Frontend | - |
| T5.1.1.3 | Undo/Redo | 1 | Frontend | - |
| T5.2.1.1 | Export to PNG | 5 | Frontend | - |
| T5.2.1.2 | Export to PDF | 5 | Frontend | - |
| T5.3.1.1 | Unit Tests | 5 | QA | - |
| T5.3.1.2 | Integration Tests | 5 | QA | - |
| T5.3.1.3 | Manual QA | 5 | QA | - |
| T5.3.2.1 | User Documentation | 3 | Tech Writer | - |
| T5.3.2.2 | Production Deployment | 2 | DevOps | - |
| T5.3.2.3 | Release Notes | 1 | PM | - |

**Total: 37 points** (under 40 capacity)

**Sprint Goal:** "Cookbook Canvas MVP complete, tested, documented, and deployed"

---

# Summary: All Sprints

| Sprint | Goal | Points | Weeks |
|--------|------|--------|-------|
| Sprint 1 | Foundation (Auth, DB) | 31 | Week 1 |
| Sprint 2 | Canvas Core (TLDraw, Cards) | 62* | Week 1-2 |
| Sprint 3 | User Uploads | 32 | Week 2-3 |
| Sprint 4 | Card Interactions & Polish | 30 | Week 3-4 |
| Sprint 5 | Drawing & Export | 37 | Week 4 |

**Total: 192 story points over ~4 weeks**

*Sprint 2 exceeds capacity and may need to be split

---

# How to Use This Document

## For Sprint Planning

1. **Copy tickets into your project management tool** (Jira, Linear, GitHub Projects, etc.)
2. **Assign story points** using your team's velocity
3. **Assign tickets to developers** based on skills
4. **Schedule into sprints** following the phases
5. **Review at sprint planning meeting** with team

## For Developers

1. **Read the acceptance criteria** - this is what done looks like
2. **Check dependencies** - complete other tickets first if needed
3. **Reference the tech spec** for implementation details
4. **Link related PRs/commits** to ticket when work starts
5. **Move ticket to "In Progress"** when you start
6. **Link PR to ticket** when submitting code review
7. **Move to "Done"** when acceptance criteria met and tested

## For QA/Testing

1. **Review acceptance criteria** before testing
2. **Follow the user stories** to understand context
3. **Test the flows** described in PRD section 11
4. **Report bugs against specific acceptance criteria**
5. **Verify fixes** before closing tickets

## For Product/Project Managers

1. **Use story points** to track velocity and predict timeline
2. **Adjust scope** if sprints exceed capacity
3. **Collect user feedback** after each sprint
4. **Reprioritize** future sprints based on learnings
5. **Track metrics** from success criteria in PRD

---

# Appendix A: Ticket Template (for your project management tool)

```
Title: [T#.#.#.#] [Story Name]

Story:
As a [user type]
I want to [action]
So that [benefit]

Acceptance Criteria:
- ✅ [Criterion 1]
- ✅ [Criterion 2]
- ✅ [Criterion 3]

Estimate: [X] points

Owner: [Developer Name]

Dependencies: [T#.#.#.# if any]

Related Files:
- `src/path/to/file.tsx`
- `docs/TECH-SPEC.md` section X

Links:
- PR: [link when started]
- Related: [link to related issues]

Notes:
- [Any additional context]
```

---

# Appendix B: Definition of Done Checklist

**For each ticket marked complete:**

- [ ] Code written and peer-reviewed
- [ ] All acceptance criteria met
- [ ] Unit tests written (if applicable)
- [ ] Integration tests passing
- [ ] No new console errors
- [ ] No TypeScript errors
- [ ] Performance acceptable
- [ ] Code styled consistently
- [ ] Accessibility checked
- [ ] Mobile responsive verified
- [ ] Documentation updated
- [ ] Merged to main branch
- [ ] Deployed to staging environment
- [ ] QA tested and approved
- [ ] Ready for production release

---

**Document Status:** Ready for Sprint Planning
**Last Updated:** 2025-10-21
**Next Steps:** Import tickets into project management tool, assign to developers, schedule sprints
