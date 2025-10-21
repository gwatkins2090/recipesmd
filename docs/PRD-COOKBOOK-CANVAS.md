# Product Requirements Document: Cookbook Canvas

**Document Version:** 1.0
**Date:** 2025-10-21
**Status:** Ready for Implementation
**Product Manager:** John (PM Agent)
**Project:** Savor Recipe Platform

---

## 1. Executive Summary

The **Cookbook Canvas** transforms the `/cookbook` page from a placeholder into a fully-featured visual workspace inspired by Obsidian Canvas. Users can arrange recipe cards on an infinite pan/zoom canvas, upload personal recipes, markup ingredients, and organize meal planning in an intuitive spatial interface.

**Key Value:** Enables users to move beyond passive recipe browsing into active meal planning and recipe organization with visual freehand markup capabilities.

**MVP Scope:** 5 implementation phases over ~4 weeks, culminating in a production-ready infinite canvas with authentication, recipe management, and drawing tools.

**Target Users:** Savor users who want to organize recipes visually for meal planning and family recipe curation.

---

## 2. Product Vision & Goals

### 2.1 Vision Statement

"A personal infinite canvas where every recipe becomes a draggable, expandable card in a spatial workspace—empowering users to plan meals, organize families' favorites, and annotate recipes with handwritten notes and diagrams."

### 2.2 Strategic Goals

1. **Increase User Engagement** - Drive deeper interaction with recipe collection through active organization (not passive browsing)
2. **Enable Meal Planning** - Provide visual tool for weekly/seasonal meal arrangement
3. **Support Family Recipes** - Allow users to upload and manage personal/family recipe collections
4. **Differentiate Product** - Move beyond standard recipe app → specialized "digital cookbook" experience

### 2.3 Success Metrics

**Engagement:**
- ≥ 40% of registered users create a canvas within 30 days
- Average 5+ recipes per user canvas
- ≥ 25% of users upload personal recipes
- ≥ 15% daily active users returning to canvas

**Technical:**
- Canvas loads in < 2 seconds
- Auto-save completes in < 500ms
- File upload success rate > 99%
- Database queries perform < 100ms p95

**Satisfaction:**
- Feature adoption rate tracked via analytics
- User retention: 70% 7-day, 50% 30-day
- Future NPS survey target: ≥ 40

---

## 3. User Personas & Use Cases

### 3.1 Primary Persona: "Family Recipe Curator"

**Profile:** Sarah, 38, busy parent collecting family recipes
**Goal:** Organize 50+ family recipes from relatives, plan weekly meals
**Pain:** Family recipes scattered across notebooks and emails; meal planning is manual
**Usage:** 2-3 times/week, planning meals and looking for inspiration

**Key Scenario:**
> "I want to create a Sunday afternoon planning session where I arrange 7 dinner ideas on a canvas, mark recipes I've already tried, draw arrows between recipes that share ingredients, then export the image to share with my spouse."

### 3.2 Secondary Persona: "Home Chef"

**Profile:** Marcus, 42, hobby cook, collection of tested recipes
**Goal:** Document personal recipe variations, experiment with new layouts
**Pain:** Can't easily visualize recipe relationships or seasonal collections
**Usage:** 1-2 times/week, light usage with occasional uploads

**Key Scenario:**
> "I want to upload my handwritten recipe cards as markdown files, arrange them spatially by course, then draw connections between recipes that pair well together."

---

## 4. Feature Requirements

### 4.1 Authentication & Access Control

**Requirement:** Users must create accounts to use Cookbook Canvas

| Feature | Requirement | Rationale |
|---------|-------------|-----------|
| **Sign Up** | Email/password registration | Simple MVP, no OAuth required |
| **Sign In** | Email/password authentication | Persistent identity for canvas storage |
| **Protected Route** | `/cookbook` requires auth | Enforce user isolation |
| **Session Persistence** | Multi-device sync | User can return to canvas on different device |
| **Sign Out** | Clear session, logout capability | Standard UX requirement |

**Technical Spec:** Supabase Auth (email/password), Row Level Security policies enforced at database layer

---

### 4.2 Infinite Canvas Core

**Requirement:** Render an interactive infinite pan/zoom workspace powered by TLDraw

| Feature | Requirement | Acceptance Criteria |
|---------|-------------|-------------------|
| **Pan & Zoom** | Users can navigate infinite space | Pan with mouse drag, zoom with scroll wheel/trackpad |
| **Infinite Boundaries** | No limits on canvas size | Users can arrange 100+ recipes without hitting edges |
| **Persistent View State** | Remember zoom/pan position | Canvas returns to last viewed position on reload |
| **Mobile Gestures** | Touch-friendly navigation | Pinch to zoom, swipe to pan (view-only acceptable for MVP) |

**Constraints:**
- Performance: Load time < 2 seconds even with 50+ cards
- Virtualization: Only render cards currently visible in viewport
- Max canvas size: Recommend ≤ 100 cards per canvas (future enhancement: multiple canvases)

---

### 4.3 Recipe Cards

**Requirement:** Display recipes as draggable, resizable, expandable cards

#### 4.3.1 Card Interactions

| Interaction | Behavior | Notes |
|-------------|----------|-------|
| **Drag** | User drags card to new position | Smooth animation, auto-save on drop |
| **Resize** | User resizes card with corner handles | TLDraw-native resize, maintain readable content |
| **Expand/Collapse** | Toggle between compact and full view | Compact: title + metadata; Full: entire recipe |
| **Metadata Display** | Show prep time, cook time, difficulty, servings | Always visible in compact mode; expandable in full view |
| **Delete** | Remove card from canvas | One-click delete, optional confirmation |

#### 4.3.2 Card Content - Compact View

Displayed when card is collapsed:
- **Recipe title** (prominent heading)
- **Difficulty badge** (Easy | Medium | Hard)
- **Prep time** (icon + duration, e.g., 15 min)
- **Cook time** (icon + duration, e.g., 30 min)
- **Servings** (e.g., "4 servings")
- **Tags** (displayed as small pills)
- **Source badge** (if user-uploaded, show "User Recipe" indicator)

#### 4.3.3 Card Content - Full/Expanded View

When card is expanded, display complete recipe:
- All metadata (from compact view)
- **Ingredients list** (formatted with quantities and units)
- **Instructions** (numbered steps)
- **Notes/Tips** section (if present)
- **Markdown rendered beautifully** (proper typography, spacing)
- **Scrollable content area** (if recipe exceeds card height)

**Rendering Spec:** Use existing `remark` + `remark-html` from codebase for markdown parsing; apply Tailwind styling for consistency with Savor design system

#### 4.3.4 Recipe Sources

| Source | Behavior | Storage | Metadata |
|--------|----------|---------|----------|
| **Main Library** (113 recipes) | Select from sidebar, add to canvas | File-based (`/recipes/`) | `recipeType: 'main'` |
| **User Uploaded** | Upload .md files, display in "My Recipes" | Supabase Storage | `recipeType: 'user'`, `userUploaded: true`, `userId: {uuid}` |

---

### 4.4 Recipe Selector Sidebar

**Requirement:** UI to browse and add recipes to canvas

**Components:**
- **Search bar** (full-text search across title, description, tags)
- **Category filter** (dropdown or pills: Breakfast, Dessert, Main, Sides, Soups, etc.)
- **Recipe list** (clickable items showing title + metadata)
- **Two sections:**
  - "All Recipes" (113 main library recipes)
  - "My Recipes" (user-uploaded recipes)
- **Add button** on each recipe (click to place on canvas)

**Behavior:**
- Sidebar can be toggled (hamburger menu or sidebar toggle button)
- Search/filter updates dynamically
- Recipe added to canvas appears near canvas center (or random position to avoid stacking)
- Visual feedback when recipe added ("Added to canvas" toast)

---

### 4.5 File Upload & User Recipes

**Requirement:** Allow users to upload personal .md recipe files

#### 4.5.1 Upload UI

- **Drag & drop zone** (prominent area for "Drop recipes here")
- **File picker button** ("Browse Files" or "Upload Recipe")
- **Accept file type:** `.md` (Markdown) files only
- **Max file size:** 500KB per file
- **Feedback:** Loading spinner during upload, error messages if validation fails

#### 4.5.2 Upload Pipeline

1. **Validate file format** - Must be valid `.md` file with frontmatter
2. **Parse frontmatter** - Extract title, prep time, cook time, difficulty, etc.
3. **Add metadata** - Auto-inject `userUploaded: true`, `userId: {uuid}`, `uploadedAt: {timestamp}`
4. **Validate required fields** - Must have: title, description, ingredients, instructions
5. **Show preview modal** - Display parsed recipe before confirming upload
6. **Upload to storage** - Save .md file to Supabase Storage (`user-recipes/{userId}/{filename}`)
7. **Save metadata** - Insert row into `user_recipes` table with filename, storage_path, metadata
8. **Success feedback** - Toast: "Recipe uploaded! Add it to your canvas"

**Error Handling:**
- Invalid frontmatter → "Recipe format invalid. Check title, prep time format, etc."
- Missing required fields → "Missing: [list fields]. See documentation"
- File too large → "File exceeds 500KB limit"
- File upload failed → "Upload failed. Try again or contact support"
- Rate limiting → "You've uploaded 10 recipes in the last hour. Try again later"

#### 4.5.3 Recipe Format

Required frontmatter fields:

```yaml
---
title: "Recipe Name"
description: "Brief summary (required)"
category: "Main Dishes" # or Breakfast, Dessert, Sides, Soups
difficulty: "Easy" # Easy | Medium | Hard
prepTime: "PT15M" # ISO 8601 duration
cookTime: "PT30M" # ISO 8601 duration
totalTime: "PT45M" # Total time
yield: "4 servings"
tags: ["tag1", "tag2"] # Optional
---
```

**Markdown content** (after frontmatter):

```markdown
## Ingredients
- 2 cups flour
- 1 cup sugar
- ...

## Instructions
1. Mix ingredients
2. Bake at 350°F
...
```

**Auto-injected fields** (added by system):
- `userUploaded: true`
- `userId: "{uuid}"`
- `uploadedAt: "2025-10-21"`

---

### 4.6 Canvas Persistence & Sync

**Requirement:** Auto-save canvas state and sync across devices

| Feature | Requirement | Implementation |
|---------|-------------|-----------------|
| **Auto-save** | Save canvas state every 5 seconds (debounced) | Debounce user interactions, batch updates |
| **Save on blur** | Save immediately when user leaves page | `beforeunload` event handler |
| **Multi-device sync** | Canvas loads same state on different device | Load `canvas_state` from DB on page mount |
| **Conflict handling** | Last-write-wins if simultaneous edits | Accept later timestamp |
| **Load speed** | Canvas renders while data loads | Show spinner, progressive rendering |

**Database Table: `canvas_state`**
```sql
CREATE TABLE canvas_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  tldraw_document JSONB NOT NULL,  -- Full TLDraw state
  last_updated TIMESTAMP DEFAULT NOW(),
  CONSTRAINT one_canvas_per_user UNIQUE(user_id)
);
```

**Row Level Security:**
- Users can only SELECT/UPDATE their own canvas state
- Enforced at database layer via RLS policies

---

### 4.7 Drawing & Markup Tools

**Requirement:** Enable TLDraw drawing tools for markup and annotation

| Tool | Capability | Use Case |
|------|-----------|----------|
| **Pen** | Freehand drawing | Sketch notes, arrows, emphasis |
| **Highlighter** | Semi-transparent strokes | Mark key ingredients or steps |
| **Shapes** | Rectangle, circle, arrow | Draw connections, boxes around items |
| **Text** | Add text annotations | Label days ("Monday"), notes |
| **Eraser** | Erase drawings | Correct mistakes |

**Z-order Management:**
- Drawings can be layered above/below cards
- "Bring to Front" / "Send to Back" menu options
- Cards render at z-index 10, drawings at 5 and 15 (configurable)

**Undo/Redo:**
- Standard keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- Button in toolbar for undo/redo

---

### 4.8 Canvas Export

**Requirement:** Export canvas as image and PDF

| Format | Behavior | Use Case |
|--------|----------|----------|
| **PNG** | Export canvas as high-res PNG image | Share via text/email, save screenshot |
| **PDF** | Export as PDF for printing | Print cookbook section, archive |

**Export behavior:**
- Include all cards and drawings
- Respect current zoom/pan level (export visible area) OR export entire canvas
- Option to export at different resolutions (72dpi, 150dpi, 300dpi)
- File naming: `cookbook-{date}.png` or `.pdf`

---

## 5. Technical Architecture

### 5.1 Technology Stack

**Frontend:**
- Next.js 15.4.6 (existing)
- React 19.1.1 (existing)
- TypeScript 5.9.2 (existing)
- Tailwind CSS 3.4.17 (existing)
- TLDraw (new dependency)
- gray-matter (existing, for markdown parsing)
- remark + remark-html (existing, for rendering)

**Backend & Infrastructure:**
- Supabase (PostgreSQL database + Storage + Auth)
- Vercel (hosting, unchanged)

**Libraries:**
- `@supabase/supabase-js` - Client SDK
- `@supabase/auth-helpers-nextjs` - Auth integration
- `tldraw` - Infinite canvas library
- `react-hook-form` - File upload form
- `react-query` or similar for data fetching

### 5.2 Database Schema

**Table: `user_recipes`**
```sql
CREATE TABLE user_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- e.g., "user-recipes/{userId}/recipe.md"
  title TEXT NOT NULL,
  metadata JSONB NOT NULL, -- Parsed frontmatter
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_recipe UNIQUE(user_id, filename)
);
```

**Table: `canvas_state`**
```sql
CREATE TABLE canvas_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tldraw_document JSONB NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT one_canvas_per_user UNIQUE(user_id)
);
```

**Row Level Security Policies:**
```sql
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_state ENABLE ROW LEVEL SECURITY;

-- user_recipes policies
CREATE POLICY "Users see own recipes" ON user_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own recipes" ON user_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own recipes" ON user_recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own recipes" ON user_recipes
  FOR DELETE USING (auth.uid() = user_id);

-- canvas_state policies
CREATE POLICY "Users see own canvas" ON canvas_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own canvas" ON canvas_state
  FOR ALL USING (auth.uid() = user_id);
```

### 5.3 File Storage

**Supabase Storage Bucket: `user-recipes`** (private)
```
user-recipes/
├── {userId}/
│   ├── recipe-1.md
│   ├── recipe-2.md
│   └── ...
```

**Directory structure:**
- Bucket is private (not publicly accessible)
- Files accessed via authenticated Supabase client
- Path format: `user-recipes/{userId}/{filename}`

### 5.4 API Endpoints

**Authentication endpoints** (Supabase built-in):
- `POST /auth/v1/signup` - Register new user
- `POST /auth/v1/token` - Login
- `POST /auth/v1/logout` - Logout

**Custom API routes** (Next.js):

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/recipes/upload` | POST | Upload user recipe file |
| `/api/recipes/user` | GET | List user's recipes |
| `/api/recipes/user/{id}` | DELETE | Delete user recipe |
| `/api/canvas/save` | POST | Save canvas state |
| `/api/canvas/load` | GET | Load canvas state |
| `/api/canvas/export` | POST | Export canvas to PNG/PDF |

**Canvas save endpoint:**
- Request: `{ tldraw_document: {...} }`
- Response: `{ success: true, last_updated: "2025-10-21T12:00:00Z" }`
- Errors: 401 (unauthorized), 400 (invalid data), 500 (server error)

### 5.5 Custom TLDraw Shape

**RecipeCard Shape Definition:**
```typescript
interface RecipeCardShape extends TLDraw.Shape {
  type: 'recipe-card'
  props: {
    recipeSlug: string              // Slug of recipe or {userId}/{filename}
    recipeType: 'main' | 'user'     // Main library vs user-uploaded
    isExpanded: boolean             // Compact vs full view
    showMetadata: boolean           // Show prep/cook time, difficulty
    width: number                   // Card width (px)
    height: number                  // Card height (px)
    cardContent?: RecipeData        // Cache recipe data in shape
  }
}
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Set up infrastructure for authentication and database

**Tasks:**
1. Create Supabase project and configure
2. Set up Supabase Auth (email/password)
3. Create database schema with RLS policies
4. Configure Supabase Storage bucket
5. Install Supabase Next.js SDK
6. Create auth pages (sign up, sign in)
7. Protect `/cookbook` route with auth middleware
8. Create navigation links for auth (sign up, sign in, sign out)

**Deliverable:** Users can create account, sign in, and access protected `/cookbook` page (blank canvas)

**Acceptance Criteria:**
- ✅ Sign up form creates user account
- ✅ Sign in authenticates user
- ✅ Auth state persists across page refreshes
- ✅ Unauthenticated users redirected to login
- ✅ Sign out clears session
- ✅ Database tables created with proper schema
- ✅ RLS policies enforced (verified with test queries)

---

### Phase 2: Canvas Core (Week 1-2)

**Goal:** Render infinite canvas with recipe card placement

**Tasks:**
1. Install and integrate TLDraw library
2. Create `/cookbook` page with TLDraw editor
3. Create custom RecipeCard shape for TLDraw
4. Build recipe selector sidebar
   - Search existing recipes (full-text)
   - Filter by category
   - Click recipe to add to canvas
5. Implement canvas state persistence
   - Auto-save to `canvas_state` table every 5s
   - Load canvas on page mount
   - Multi-device sync
6. Add card rendering
   - Recipe title, metadata (prep/cook time, difficulty)
   - Placeholder image if available
7. Basic error handling and loading states

**Deliverable:** Users can add recipes to canvas and changes persist

**Acceptance Criteria:**
- ✅ Canvas renders with TLDraw
- ✅ Pan and zoom work smoothly
- ✅ Recipe selector sidebar functional (search, filter)
- ✅ Clicking recipe adds card to canvas
- ✅ Cards show title and basic metadata
- ✅ Canvas auto-saves every 5 seconds
- ✅ Canvas loads on page refresh
- ✅ Multi-device sync works (verify with two sessions)
- ✅ Load time < 2 seconds

---

### Phase 3: User Recipe Uploads (Week 2-3)

**Goal:** Enable users to upload personal .md recipe files

**Tasks:**
1. Create file upload UI component
   - Drag & drop zone
   - File picker button
   - Max file size: 500KB
2. Implement upload handler
   - Validate .md format
   - Parse frontmatter with gray-matter
   - Validate required fields
   - Auto-inject user metadata
3. Upload to Supabase Storage
   - Save file to `user-recipes/{userId}/{filename}`
   - Save metadata to `user_recipes` table
4. Add user recipes to selector
   - Display in separate "My Recipes" section
   - Search and filter across user recipes
5. Create recipe preview modal
   - Show parsed metadata before upload
   - Display markdown preview
   - Confirm or cancel upload
6. Error handling and validation
   - Clear error messages for invalid format
   - File size limit enforcement
   - Rate limiting (10 uploads per hour)

**Deliverable:** Users can upload recipes and add them to canvas

**Acceptance Criteria:**
- ✅ Upload form accepts .md files via drag & drop and picker
- ✅ Frontmatter validation works (required fields enforced)
- ✅ File size validation (reject > 500KB)
- ✅ Preview modal shows parsed recipe
- ✅ File uploaded to Supabase Storage
- ✅ Metadata saved to database
- ✅ "My Recipes" section displays user uploads
- ✅ User recipes can be added to canvas like main recipes
- ✅ User recipes show "User Recipe" badge on card
- ✅ Error messages are clear and actionable
- ✅ Rate limiting works (test with 11 uploads)

---

### Phase 4: Card Interactions (Week 3-4)

**Goal:** Make cards interactive, beautiful, and feature-complete

**Tasks:**
1. Implement card resizing
   - TLDraw resize handles work
   - Min/max size constraints
   - Smooth animation on resize
2. Expand/collapse functionality
   - Compact view: title + metadata only
   - Full view: complete recipe with ingredients, instructions
   - Toggle button on card
   - Smooth transition
3. Metadata display polish
   - Icons for prep time, cook time
   - Difficulty badge styling
   - Servings display
   - Tags in expanded view
4. Markdown rendering
   - Use remark + remark-html (existing)
   - Apply Tailwind styling
   - Handle long content with scroll
   - Test with various recipe formats
5. Card deletion
   - One-click delete option
   - Optional confirmation dialog
   - Auto-save after deletion
6. Mobile responsive
   - Canvas usable on tablet (touch pan/zoom)
   - Drawing tools optional on mobile (MVP acceptable without)

**Deliverable:** Recipe cards are interactive, beautiful, and ready for users

**Acceptance Criteria:**
- ✅ Card resize works smoothly
- ✅ Expand/collapse toggle works
- ✅ Compact view shows: title, prep time, cook time, difficulty, servings
- ✅ Full view shows: all metadata + full recipe markdown
- ✅ Markdown renders with proper typography
- ✅ Long recipes scroll within card
- ✅ Delete button removes card
- ✅ Card styling consistent with Savor design system
- ✅ Touch gestures work on tablet
- ✅ No console errors or warnings

---

### Phase 5: Drawing & Polish (Week 4)

**Goal:** Enable markup tools and finalize UX

**Tasks:**
1. Enable TLDraw drawing tools
   - Pen tool (freehand drawing)
   - Highlighter tool (semi-transparent)
   - Shapes (rectangle, circle, arrow, line)
   - Text tool for annotations
   - Eraser
2. Z-order management
   - Ensure drawings can be above/below cards
   - "Bring to Front" / "Send to Back" options
3. Canvas export
   - Export visible area as PNG
   - Export as PDF (for printing)
   - High-resolution options (72dpi, 150dpi, 300dpi)
   - File naming: `cookbook-{date}.png/pdf`
4. UI/UX polish
   - Empty state: "Add your first recipe!" with tutorial
   - Loading states for canvas/recipes
   - Tooltips on buttons
   - Keyboard shortcuts (help menu)
   - Error boundaries for failed loads
5. Performance optimization
   - Lazy load recipe content (load on expand)
   - Virtualize off-screen cards
   - Debounce save operations
   - Test with 100+ recipes
6. Documentation
   - User guide for keyboard shortcuts
   - Help documentation for features
   - Troubleshooting guide

**Deliverable:** Production-ready Cookbook Canvas feature

**Acceptance Criteria:**
- ✅ All drawing tools work
- ✅ Drawings render above/below cards correctly
- ✅ Z-order menu works
- ✅ Export to PNG works
- ✅ Export to PDF works
- ✅ Empty state displays correctly
- ✅ Loading states clear and informative
- ✅ Keyboard shortcuts work and documented
- ✅ Canvas loads in < 2 seconds
- ✅ Performance acceptable with 100+ recipes
- ✅ No console errors
- ✅ Help documentation complete

---

## 7. Technical Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **TLDraw performance degrades with many cards** | Slow canvas, poor UX with 50+ recipes | Medium | Virtualization, lazy loading, card limits with warnings |
| **Supabase free tier limits exceeded** | Users can't upload or save, service disruption | Low (for MVP) | Monitor usage, per-user quotas, upgrade plan if needed |
| **File upload abuse (large files, spam)** | Storage exhaustion, service abuse | Medium | File size limits, rate limiting, validation, admin review |
| **Complex state management bugs** | Canvas desync, data loss, corruption | Medium | Use TLDraw persistence, RLS for security, comprehensive testing |
| **Mobile UX degradation** | Poor experience on tablets/phones | High | Accept view-only for MVP, touch gestures, consider native app later |
| **Authentication session issues** | Users logged out unexpectedly, access denied | Low | Use Supabase session management best practices, comprehensive error handling |
| **Recipe rendering issues** | Broken markdown display, visual bugs | Low | Test with diverse recipe formats, error boundaries, fallback display |

---

## 8. Constraints & Assumptions

### 8.1 Constraints

- **MVP Scope:** Single canvas per user (multiple canvases = future enhancement)
- **Authentication:** Email/password only (OAuth = future enhancement)
- **Collaboration:** No real-time collaboration for MVP (future enhancement)
- **Mobile:** View-only acceptable; full editing on desktop (dedicated mobile app = future)
- **Recipe Editing:** Read-only for MVP; inline editing = future enhancement
- **Canvas Limits:** Recommend ≤ 100 cards per canvas to maintain performance
- **File Uploads:** 500KB max per file, 10 uploads per hour per user

### 8.2 Assumptions

- Users have Google/email for authentication (no phone auth needed)
- Users have internet connection (no offline mode)
- Recipes are in markdown format with YAML frontmatter (standard format)
- TLDraw remains actively maintained and stable
- Supabase pricing remains within budget
- Vercel continues to provide sufficient bandwidth for file exports

---

## 9. Success Criteria & Definition of Done

### MVP Complete When:

**Authentication & Access:**
- ✅ Users can sign up, sign in, sign out
- ✅ `/cookbook` protected by auth
- ✅ Session persists across refreshes

**Canvas:**
- ✅ Infinite pan/zoom workspace
- ✅ Virtualized rendering (load only visible cards)
- ✅ Smooth performance with 50+ recipes

**Recipe Cards:**
- ✅ Add recipes from main library to canvas
- ✅ Resizable and expandable cards
- ✅ Compact and full views functional
- ✅ Metadata displayed (prep/cook time, difficulty)
- ✅ Markdown rendered beautifully

**User Uploads:**
- ✅ Upload .md files with validation
- ✅ File stored in Supabase Storage
- ✅ Metadata saved to database
- ✅ User recipes displayed in "My Recipes"

**Persistence & Sync:**
- ✅ Canvas auto-saves every 5 seconds
- ✅ Multi-device sync works
- ✅ Load on page refresh shows saved state

**Drawing:**
- ✅ Pen, highlighter, shapes, text, eraser tools
- ✅ Z-order management (above/below cards)
- ✅ Undo/redo functional

**Export:**
- ✅ Export canvas to PNG
- ✅ Export canvas to PDF

**Polish:**
- ✅ Empty state messaging
- ✅ Loading states
- ✅ Error handling comprehensive
- ✅ Keyboard shortcuts documented
- ✅ Canvas load time < 2 seconds
- ✅ All tests passing
- ✅ No console errors

---

## 10. Future Enhancements (Post-MVP)

### Phase 6: Editing & Enhancements
- Edit recipes directly in canvas
- Version history for user recipes
- Advanced metadata (nutrition, allergens)

### Phase 7: Multiple Canvases
- Create multiple canvases ("Weekly Plans", "Holiday Recipes")
- Canvas templates (weekly grid, dinner party flow)
- Duplicate canvas feature

### Phase 8: Collaboration
- Share canvas with read-only link
- Real-time collaborative editing
- Comments and annotations on recipe cards
- Family/group canvases

### Phase 9: Smart Features
- AI recipe suggestions based on canvas
- Meal plan auto-generator
- Grocery list generation with price lookup
- Nutrition aggregation

### Phase 10: Advanced Canvas
- Card connections/relationships
- Group cards with boundaries
- Color-coded categories
- Recipe dependency arrows

---

## 11. Documentation & Handoff

### For Engineering Team

**Setup Documentation:**
1. Supabase project creation and configuration
2. Database schema initialization
3. Environment variables setup
4. TLDraw custom shape implementation

**Development Guides:**
1. Canvas state management patterns
2. Recipe data fetching and caching
3. File upload pipeline
4. Error handling strategy

### For User Documentation (Post-MVP)

1. Getting started with Cookbook Canvas
2. Uploading personal recipes
3. Canvas navigation and shortcuts
4. Drawing tools guide
5. Tips for meal planning

---

## 12. Approval & Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | John (PM Agent) | 2025-10-21 | ✅ |
| Engineering Lead | [TBD] | - | - |
| Design Lead | [TBD] | - | - |

---

## Appendix A: User Workflows

### Workflow 1: New User Creating Cookbook
1. User signs up (email/password)
2. Navigates to `/cookbook`
3. Empty canvas with tutorial overlay
4. Clicks "Add Recipe" → sidebar opens
5. Searches for "lasagna"
6. Clicks recipe → card appears on canvas
7. Drags card to position
8. Clicks expand → sees full recipe
9. Uses pen tool to circle key ingredients
10. Adds more recipes
11. Canvas auto-saves every 5 seconds
12. Signs out, returns next day → canvas loads with all cards

### Workflow 2: Uploading Personal Recipe
1. User opens `/cookbook`
2. Clicks "Upload Recipe" button
3. Drags `grandmas-cookies.md` into drop zone
4. System parses frontmatter and validates
5. Preview modal shows parsed recipe
6. User confirms upload
7. Recipe saves to Supabase Storage
8. "My Recipes" section now shows new recipe
9. User adds it to canvas
10. Recipe card shows "User Recipe" badge

### Workflow 3: Meal Planning with Markup
1. User opens canvas
2. Arranges 7 recipe cards in week layout
3. Labels each with text tool ("Monday", "Tuesday", etc.)
4. Highlights recipes tried before
5. Draws arrows between complementary recipes
6. Circles common ingredients
7. Exports canvas as PNG for shopping reference
8. Shares image with family

---

**Document Status:** Ready for Implementation
**Last Updated:** 2025-10-21
**Next Steps:** Begin Phase 1 implementation with engineering team
