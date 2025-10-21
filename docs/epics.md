# recipesmd - Epic Breakdown

**Author:** GW
**Date:** 2025-10-21
**Project Level:** 2
**Target Scale:** MVP - Foundation

---

## Overview

This document provides the detailed epic breakdown for the Cookbook Canvas feature, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: Foundation - Authentication & Database Setup

**Expanded Goal:** Establish core infrastructure for user authentication and secure data storage. Users should be able to create accounts, sign in, and access a protected `/cookbook` page. Database and storage infrastructure ready for recipe and canvas data.

**Value Delivery:** Enables multi-user support with personalized canvases. Row Level Security ensures data isolation. Foundation for all future work.

**Estimated Stories:** 5
**Estimated Effort:** ~1 week

---

### Story 1.1: Set Up Supabase Project & Database Schema

As a **developer**,
I want **Supabase project created with database schema initialized**,
So that **we have infrastructure to store user recipes and canvas state**.

**Acceptance Criteria:**
1. Supabase project created with PostgreSQL database
2. Environment variables configured (.env.local)
3. `user_recipes` table created with columns: id, user_id, filename, storage_path, title, metadata, created_at, updated_at
4. `canvas_state` table created with columns: id, user_id, tldraw_document, last_updated
5. UNIQUE constraints applied (one canvas per user)
6. Foreign key relationships established with auth.users
7. Migration files created and version controlled
8. Database accessible from Next.js application via Supabase client

**Prerequisites:** None

---

### Story 1.2: Configure Row Level Security (RLS) Policies

As a **developer**,
I want **RLS policies enforced on both tables**,
So that **users can only access their own data**.

**Acceptance Criteria:**
1. RLS enabled on `user_recipes` table
2. RLS enabled on `canvas_state` table
3. SELECT policy: Users can only see their own recipes
4. INSERT policy: Users can only insert their own recipes
5. UPDATE policy: Users can only update their own recipes
6. DELETE policy: Users can only delete their own recipes (for canvas_state, UPDATE/DELETE consolidated)
7. Test queries verify policies work (user sees only their data, not others')
8. Policies documented in code comments

**Prerequisites:** Story 1.1 complete

---

### Story 1.3: Configure Supabase Auth & Create Sign Up Flow

As a **user**,
I want **to create an account with email and password**,
So that **I can access my personal cookbook canvas**.

**Acceptance Criteria:**
1. Supabase Auth configured for email/password method
2. `/auth/signup` page created with email and password inputs
3. Form validation: email format, password strength (min 8 chars)
4. Sign up handler creates user account via Supabase Auth
5. Error handling for duplicate email, weak password
6. Success redirects to `/cookbook` page
7. User session automatically created after signup
8. No console errors or unhandled exceptions

**Prerequisites:** Story 1.1 complete

---

### Story 1.4: Create Sign In & Authentication Flow

As a **user**,
I want **to sign in with my email and password**,
So that **I can access my saved canvas and recipes**.

**Acceptance Criteria:**
1. `/auth/signin` page created with email and password inputs
2. Form validation: email format required
3. Sign in handler authenticates with Supabase Auth
4. Error handling: invalid email, wrong password, user not found
5. Successful sign in creates session and redirects to `/cookbook`
6. Session persists across page refreshes
7. Auth state accessible in React context/hook
8. Logout button signs out user and clears session

**Prerequisites:** Story 1.3 complete

---

### Story 1.5: Protect `/cookbook` Route & Create Auth Middleware

As a **user**,
I want **unauthenticated users redirected to sign in**,
So that **only registered users can access the canvas**.

**Acceptance Criteria:**
1. Auth middleware protects `/cookbook` route
2. Unauthenticated users redirected to `/auth/signin`
3. Authenticated users can access `/cookbook` page
4. Auth state loads correctly on page refresh
5. Sign out clears session and redirects to home page
6. Navigation shows sign in/sign up links when unauthenticated
7. Navigation shows user email and sign out button when authenticated
8. No flash of unprotected content before redirect

**Prerequisites:** Story 1.4 complete

---

## Epic 2: Canvas Core - Infinite Workspace & Recipe Cards

**Expanded Goal:** Implement the infinite pan/zoom canvas powered by TLDraw. Users can add existing recipes to the canvas and see them persist across sessions. Multi-device sync enables users to access the same canvas from different devices.

**Value Delivery:** Users can now visually arrange and organize recipes. Canvas state is saved automatically and syncs across devices. Foundation for drawing and advanced features.

**Estimated Stories:** 7
**Estimated Effort:** ~1.5 weeks

---

### Story 2.1: Install TLDraw & Create Canvas Page

As a **developer**,
I want **TLDraw installed and integrated into Next.js project**,
So that **we have the infinite canvas component ready**.

**Acceptance Criteria:**
1. `tldraw` npm package installed (latest stable version)
2. `/cookbook` page created with TLDraw editor component
3. Canvas renders with TLDraw default UI
4. Pan works (mouse drag)
5. Zoom works (scroll wheel / trackpad)
6. No console errors or warnings
7. Canvas responsive to window resize
8. TLDraw toolbar visible with drawing tools

**Prerequisites:** Story 1.5 complete

---

### Story 2.2: Load Existing Recipes & Create Recipe Selector Sidebar

As a **user**,
I want **to see a list of existing recipes and add them to my canvas**,
So that **I can organize library recipes for meal planning**.

**Acceptance Criteria:**
1. Sidebar component created (toggle-able with hamburger menu)
2. Load existing recipes from `/recipes/*.md` directory
3. Display "All Recipes" section with all 113 recipes
4. Show recipe title and basic metadata (prep time, difficulty)
5. Search functionality: full-text search across title and description
6. Category filter dropdown with options: Breakfast, Dessert, Main, Sides, Soups, etc.
7. Clicking recipe card shows recipe details in preview panel
8. "Add to Canvas" button adds recipe as card to canvas
9. Visual feedback: toast message "Added recipe to canvas"
10. Sidebar doesn't obstruct canvas (stays on side or slide-out)

**Prerequisites:** Story 2.1 complete

---

### Story 2.3: Create Custom Recipe Card Shape for TLDraw

As a **developer**,
I want **custom TLDraw shape defined for recipe cards**,
So that **recipe data can be stored and rendered in the canvas**.

**Acceptance Criteria:**
1. TypeScript interface defined for RecipeCardShape
2. Shape includes: recipeSlug, recipeType ('main' | 'user'), isExpanded, width, height
3. TLDraw shape creator registered
4. Shape can be created programmatically
5. Shape renders with recipe title visible
6. Shape is draggable within canvas
7. Shape is resizable with TLDraw handles
8. No console errors when rendering

**Prerequisites:** Story 2.1 complete

---

### Story 2.4: Implement Canvas State Persistence to Database

As a **user**,
I want **my canvas state saved automatically every 5 seconds**,
So that **my recipes and their positions persist even if I close the browser**.

**Acceptance Criteria:**
1. Debounced auto-save implemented (5 second intervals)
2. Canvas state serialized to JSON and sent to `/api/canvas/save` endpoint
3. `/api/canvas/save` endpoint stores canvas to `canvas_state` table
4. RLS policy enforces user can only save own canvas
5. `last_updated` timestamp recorded
6. Error handling: toast shows "Save failed" if API fails
7. Save completes in < 500ms (debounced)
8. No repeated saves if canvas hasn't changed

**Prerequisites:** Stories 1.2 and 2.3 complete

---

### Story 2.5: Load Canvas State on Page Mount

As a **user**,
I want **my canvas state loaded when I open the page**,
So that **I see my recipes in the same positions I left them**.

**Acceptance Criteria:**
1. `/api/canvas/load` endpoint retrieves canvas state from database
2. RLS policy enforces user can only load own canvas
3. Canvas loads on page mount
4. Loading spinner shown while canvas loads
5. If no canvas exists, show empty canvas with "Add your first recipe" prompt
6. If canvas exists, populate TLDraw with saved state
7. Zoom/pan position restored to last saved state
8. Load time < 2 seconds including API call

**Prerequisites:** Story 2.4 complete

---

### Story 2.6: Implement Multi-Device Canvas Sync

As a **user**,
I want **to open my canvas on a different device and see the same recipes**,
So that **I can continue meal planning from tablet or phone**.

**Acceptance Criteria:**
1. Canvas state loaded from same database record regardless of device
2. Test: Add recipe on Device A, refresh on Device B, recipe appears
3. Test: Move recipe on Device A, refresh on Device B, position synced
4. Conflict resolution: last-write-wins (latest timestamp takes precedence)
5. No merge conflicts or data corruption
6. Multi-device sync documented in README

**Prerequisites:** Stories 2.4 and 2.5 complete

---

### Story 2.7: Render Recipe Cards with Title & Metadata

As a **user**,
I want **recipe cards to display title, prep time, cook time, and difficulty**,
So that **I can see key information at a glance on the canvas**.

**Acceptance Criteria:**
1. Recipe card component created
2. Displays recipe title prominently
3. Shows difficulty badge (Easy | Medium | Hard)
4. Shows prep time with icon (e.g., "15 min")
5. Shows cook time with icon (e.g., "30 min")
6. Shows servings (e.g., "4 servings")
7. Shows tags as small pills (if available)
8. Cards render correctly in compact view
9. No styling issues or text overflow
10. Responsive to card resize (scale text appropriately)

**Prerequisites:** Stories 2.3 and 2.2 complete

---

## Epic 3: User Recipe Uploads - File Management

**Expanded Goal:** Enable users to upload personal markdown recipe files. System validates frontmatter, parses metadata, stores files in Supabase Storage, and makes user recipes available in the recipe selector.

**Value Delivery:** Users can now bring their own recipes into the platform. Family recipes and personal collections become accessible and usable in the canvas.

**Estimated Stories:** 6
**Estimated Effort:** ~1 week

---

### Story 3.1: Create File Upload UI Component

As a **user**,
I want **a drag-and-drop zone to upload my recipe files**,
So that **I can add personal recipes to my canvas**.

**Acceptance Criteria:**
1. Upload component created with drag-and-drop zone
2. Visual indication when dragging files over zone (highlight border)
3. "Browse Files" button provides file picker as alternative
4. Accept only `.md` files
5. Max file size: 500KB per file
6. Show error if file is wrong type or too large
7. Loading spinner while upload in progress
8. Clear error messages for validation failures
9. Component accessible and keyboard navigable

**Prerequisites:** Story 1.5 complete

---

### Story 3.2: Implement Recipe Markdown Validation & Parsing

As a **developer**,
I want **to validate and parse markdown recipe files**,
So that **only properly formatted recipes are accepted**.

**Acceptance Criteria:**
1. Use `gray-matter` library to parse YAML frontmatter
2. Validate required fields: title, description, ingredients, instructions
3. Optional fields: category, difficulty, prepTime, cookTime, yield, tags
4. Validate field formats (e.g., prepTime must be ISO 8601 duration)
5. Return clear error messages for invalid formats
6. Return parsed metadata object if valid
7. Handle malformed YAML gracefully
8. Test with sample recipe files

**Prerequisites:** Story 3.1 complete

---

### Story 3.3: Create Recipe Preview Modal

As a **user**,
I want **to preview my recipe before uploading**,
So that **I can verify it parsed correctly**.

**Acceptance Criteria:**
1. Modal displays parsed recipe metadata
2. Modal shows formatted recipe content (ingredients, instructions)
3. Modal allows user to confirm or cancel upload
4. If confirmed, proceed to upload
5. If cancelled, return to upload screen
6. Modal styled consistently with app design
7. Close button and escape key dismiss modal

**Prerequisites:** Story 3.2 complete

---

### Story 3.4: Upload File to Supabase Storage

As a **developer**,
I want **user recipe files uploaded to Supabase Storage**,
So that **files are securely stored and accessible**.

**Acceptance Criteria:**
1. Supabase Storage bucket `user-recipes` created (private)
2. File uploaded to `user-recipes/{userId}/{filename}` path
3. File permissions restrict access to owner only
4. Return storage path for metadata storage
5. Handle upload errors (network, storage full, etc.)
6. Show progress indicator if possible
7. Success response includes storage_path
8. Rate limiting: 10 uploads per hour per user (return error if exceeded)

**Prerequisites:** Story 3.3 complete

---

### Story 3.5: Save Recipe Metadata to Database

As a **developer**,
I want **recipe metadata saved to the user_recipes table**,
So that **we can track and query user recipes**.

**Acceptance Criteria:**
1. After successful file upload, metadata saved to `user_recipes` table
2. Record includes: user_id, filename, storage_path, title, metadata (JSONB), created_at, updated_at
3. Auto-inject metadata: userUploaded: true, userId: {uuid}, uploadedAt: {timestamp}
4. Metadata JSONB includes all parsed fields from frontmatter
5. Ensure uniqueness constraint: one filename per user
6. RLS policy enforces user can only insert own recipes
7. Timestamps recorded accurately
8. Database insert errors handled gracefully

**Prerequisites:** Story 3.4 complete

---

### Story 3.6: Display User Recipes in Recipe Selector

As a **user**,
I want **my uploaded recipes to appear in the recipe selector**,
So that **I can add them to my canvas alongside library recipes**.

**Acceptance Criteria:**
1. "My Recipes" section added to recipe selector sidebar
2. Load user recipes from `user_recipes` table via `/api/recipes/user` endpoint
3. Query respects RLS (only user's own recipes returned)
4. Display user recipes with same UI as library recipes
5. Search and filter work across user recipes
6. "User Recipe" badge or indicator shown on user-uploaded recipes
7. Can add user recipe to canvas just like library recipes
8. Error handling if API fails to fetch recipes
9. Empty state if user has no recipes yet

**Prerequisites:** Stories 3.5 and 2.2 complete

---

## Epic 4: Card Interactions - Expand, Resize, Polish

**Expanded Goal:** Make recipe cards interactive and visually polished. Users can resize cards, expand to see full recipes, and interact smoothly with markdown-rendered content.

**Value Delivery:** Cards are now fully functional and beautiful. Users can easily view any recipe detail and organize cards precisely. Creates a satisfying, polished experience.

**Estimated Stories:** 6
**Estimated Effort:** ~1 week

---

### Story 4.1: Implement Card Resize Functionality

As a **user**,
I want **to resize recipe cards on the canvas**,
So that **I can adjust card sizes to suit my layout**.

**Acceptance Criteria:**
1. TLDraw resize handles appear on card selection
2. Dragging handles resizes card smoothly
3. Min size constraint: 200px width, 150px height (readable)
4. Max size constraint: 600px width, 800px height (reasonable)
5. Aspect ratio optional (user can stretch or maintain)
6. Resize animation smooth, no jank
7. Auto-save triggered after resize complete
8. No console errors during resize

**Prerequisites:** Story 2.3 complete

---

### Story 4.2: Implement Expand/Collapse Card Toggle

As a **user**,
I want **to see a compact view of recipes, then expand to full details**,
So that **I can scan recipes quickly or dive deep**.

**Acceptance Criteria:**
1. Compact view shows: title, difficulty, prep/cook time, servings (minimal)
2. Full view shows: title + all metadata + full recipe content
3. Toggle button on card to switch views
4. Smooth animation when toggling
5. Auto-save triggered when toggling expand state
6. Card size expands if needed to show full content
7. Full view has scrollbar if content exceeds card height
8. Compact view is readable without scrolling

**Prerequisites:** Story 2.7 complete

---

### Story 4.3: Render Full Markdown Recipe Content

As a **user**,
I want **recipe content rendered beautifully with proper formatting**,
So that **ingredients and instructions are easy to read**.

**Acceptance Criteria:**
1. Use existing `remark` + `remark-html` from codebase
2. Parse recipe markdown and render HTML
3. Apply Tailwind styling for typography (headings, lists, paragraphs)
4. Ingredients section rendered as bulleted list
5. Instructions section rendered as numbered list
6. Test with various recipe formats (sample recipes from codebase)
7. No missing or broken content
8. Links (if any) are clickable
9. Code blocks (if any) render properly

**Prerequisites:** Story 4.2 complete

---

### Story 4.4: Add Card Metadata Display Polish

As a **user**,
I want **metadata clearly displayed with icons and badges**,
So that **recipe info is at a glance**.

**Acceptance Criteria:**
1. Prep time icon (clock) + time displayed (e.g., "⏱ 15 min")
2. Cook time icon (flame/stove) + time displayed
3. Difficulty badge styled (Easy=green, Medium=yellow, Hard=red)
4. Servings displayed (e.g., "👥 4 servings")
5. Tags displayed as small pills with subtle background color
6. "User Recipe" badge shown on user-uploaded recipes
7. All metadata positioned consistently on cards
8. Responsive sizing (scale on smaller cards)
9. Consistent styling with Savor design system

**Prerequisites:** Story 2.7 complete

---

### Story 4.5: Implement Card Deletion

As a **user**,
I want **to remove recipes from my canvas**,
So that **I can clean up and reorganize as needed**.

**Acceptance Criteria:**
1. Delete button or menu option on recipe card
2. Optional confirmation dialog ("Are you sure?")
3. Card removed from canvas and TLDraw state
4. Canvas auto-saved after deletion
5. Visual feedback (animation or toast)
6. No console errors on deletion
7. Deleted card doesn't reappear on page refresh

**Prerequisites:** Story 2.3 complete

---

### Story 4.6: Mobile Responsive Card Display

As a **user**,
I want **recipe cards to display correctly on tablets**,
So that **I can use the canvas on multiple devices**.

**Acceptance Criteria:**
1. Cards render correctly at 768px width (tablet)
2. Cards render correctly at 1024px width (large tablet)
3. Text remains readable on smaller cards
4. Metadata doesn't overflow
5. Expand/collapse works on touch devices
6. Touch scroll within long recipes works smoothly
7. No horizontal scroll on canvas at standard tablet widths
8. Test on iPad, Android tablet, or browser emulation

**Prerequisites:** Story 4.4 complete

---

## Epic 5: Drawing & Export - Markup Tools & Canvas Export

**Expanded Goal:** Enable TLDraw drawing tools for markup and annotation. Allow users to export canvas as PNG or PDF. Finalize UX with loading states, empty states, and polish.

**Value Delivery:** Users can annotate and draw over recipes, making the canvas perfect for meal planning and family sharing. Export enables sharing and offline reference.

**Estimated Stories:** 5
**Estimated Effort:** ~1 week

---

### Story 5.1: Enable Drawing Tools in TLDraw

As a **user**,
I want **pen, highlighter, and shape tools to draw on my canvas**,
So that **I can annotate and highlight recipes**.

**Acceptance Criteria:**
1. Pen tool enabled (freehand drawing)
2. Highlighter tool enabled (semi-transparent strokes)
3. Shape tools enabled (rectangle, circle, line, arrow)
4. Text tool enabled (add text annotations)
5. Eraser tool enabled (remove drawings)
6. Toolbar shows all tools clearly
7. Drawing doesn't interfere with card drag/resize
8. Undo/Redo works for drawing actions
9. Keyboard shortcuts available (Z for pen, etc.)

**Prerequisites:** Story 2.1 complete

---

### Story 5.2: Implement Z-Order Management

As a **user**,
I want **to bring drawings forward or send them behind cards**,
So that **I can control layering**.

**Acceptance Criteria:**
1. Right-click menu on drawings shows "Bring to Front" / "Send to Back"
2. Drawings can layer above recipe cards
3. Drawings can layer below recipe cards
4. Z-order persists in saved canvas
5. Default: drawings render above cards
6. Keyboard shortcuts available (Ctrl+[ / Ctrl+])
7. No visual glitches when changing z-order

**Prerequisites:** Story 5.1 complete

---

### Story 5.3: Export Canvas to PNG Image

As a **user**,
I want **to export my canvas as a PNG image**,
So that **I can save and share it**.

**Acceptance Criteria:**
1. Export button in canvas toolbar
2. Export menu offers PNG option
3. PNG includes all visible cards and drawings
4. PNG respects current zoom/pan (export visible area) OR exports entire canvas
5. Resolution options: 72dpi, 150dpi, 300dpi
6. File named `cookbook-{date}.png`
7. Export completes in reasonable time (< 5 seconds)
8. File downloads to user's device
9. Success toast shown

**Prerequisites:** Story 5.1 complete

---

### Story 5.4: Export Canvas to PDF

As a **user**,
I want **to export my canvas as a PDF for printing**,
So that **I can print and share physical copies**.

**Acceptance Criteria:**
1. Export menu offers PDF option
2. PDF includes all visible cards and drawings
3. PDF respects current zoom/pan (export visible area) OR exports entire canvas
4. Resolution options available
5. File named `cookbook-{date}.pdf`
6. PDF is printable (proper formatting)
7. Export completes in reasonable time (< 5 seconds)
8. File downloads to user's device
9. Success toast shown

**Prerequisites:** Story 5.1 complete

---

### Story 5.5: Polish UI/UX - Empty States, Loading, & Error Handling

As a **user**,
I want **clear feedback for loading, empty, and error states**,
So that **I understand what's happening**.

**Acceptance Criteria:**
1. Empty state: "Add your first recipe to get started!" with visual guide
2. Loading spinner while canvas loads with "Loading your canvas..."
3. Loading spinner while file uploading with progress
4. Error toast for save failures with retry button
5. Error toast for upload failures with clear reason
6. Error toast for API failures
7. Help text and tooltips on buttons
8. Keyboard shortcuts documented (Ctrl+Z, Ctrl+Shift+Z, etc.)
9. All states tested manually

**Prerequisites:** All previous stories in Epic 5 complete

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

## Implementation Summary

| Epic | Title | Stories | Effort |
|------|-------|---------|--------|
| 1 | Foundation | 5 | 1 week |
| 2 | Canvas Core | 7 | 1.5 weeks |
| 3 | User Uploads | 6 | 1 week |
| 4 | Card Interactions | 6 | 1 week |
| 5 | Drawing & Export | 5 | 1 week |
| **Total** | **Cookbook Canvas MVP** | **29 stories** | **~5.5 weeks** |

---

**For implementation:** Use the developer agent and `dev-story` workflow to work through stories in order. Maintain story sequence to avoid dependencies.

**Document Status:** Ready for Implementation
**Last Updated:** 2025-10-21
**Next Phase:** Development queue population and story implementation
