# recipesmd Product Requirements Document (PRD)

**Author:** GW
**Date:** 2025-10-21
**Project Level:** 2
**Target Scale:** MVP - Foundation

---

## Goals and Background Context

### Goals

- **Increase User Engagement** - Drive deeper interaction with recipe collection through active organization (not passive browsing)
- **Enable Meal Planning** - Provide visual tool for weekly/seasonal meal arrangement
- **Support Family Recipes** - Allow users to upload and manage personal/family recipe collections
- **Differentiate Product** - Move beyond standard recipe app → specialized "digital cookbook" experience

### Background Context

The Cookbook Canvas transforms the existing `/cookbook` page from a placeholder into a fully-featured visual workspace inspired by Obsidian Canvas. Users will be able to arrange recipe cards on an infinite pan/zoom canvas, upload personal recipes in markdown format, markup ingredients with drawing tools, and organize meal planning in an intuitive spatial interface.

This addresses a critical user need: moving from passive recipe browsing into active meal planning and recipe organization. The Savor platform currently has 113 recipes in the main library, and users need a better way to organize, plan, and manage both library and personal recipes beyond simple bookmarking.

---

## Requirements

### Functional Requirements

**FR-Authentication & Access Control**
- FR001: Users must create accounts (email/password) to use Cookbook Canvas
- FR002: Authentication is required to access the `/cookbook` page
- FR003: Canvas state persists across multiple devices (multi-device sync)
- FR004: Users can sign out, clearing their session

**FR-Infinite Canvas Core**
- FR005: Infinite pan/zoom workspace powered by TLDraw
- FR006: Pan navigation via mouse drag
- FR007: Zoom navigation via scroll wheel/trackpad
- FR008: Canvas remembers last zoom/pan position on page reload
- FR009: Touch gestures supported on tablets (pinch to zoom, swipe to pan)

**FR-Recipe Cards**
- FR010: Users can add recipes from main library to canvas
- FR011: Recipe cards are draggable to new positions on canvas
- FR012: Recipe cards are resizable with corner handles
- FR013: Cards can expand to show full recipe or collapse to compact view
- FR014: Compact view shows: title, difficulty badge, prep time, cook time, servings, tags
- FR015: Full view shows: complete recipe with ingredients list and numbered instructions
- FR016: Cards display markdown-rendered recipe content with proper typography
- FR017: Long recipes scroll within the card (don't overflow canvas)
- FR018: Users can delete cards from canvas

**FR-Recipe Selector Sidebar**
- FR019: Search bar supports full-text search across recipe titles, descriptions, and tags
- FR020: Category filter allows filtering by Breakfast, Dessert, Main, Sides, Soups, etc.
- FR021: Two sections: "All Recipes" (113 main library) and "My Recipes" (user-uploaded)
- FR022: Clicking recipe adds card to canvas near center or random position
- FR023: Visual feedback ("Added to canvas" toast) when recipe is added
- FR024: Sidebar can be toggled (hamburger menu or toggle button)

**FR-File Upload & User Recipes**
- FR025: Drag & drop zone accepts .md files
- FR026: File picker button ("Browse Files" / "Upload Recipe") available
- FR027: Only .md files accepted, max 500KB per file
- FR028: Loading spinner and feedback during upload
- FR029: System validates markdown has required frontmatter (title, description, ingredients, instructions)
- FR030: Preview modal displays parsed recipe before confirming upload
- FR031: File uploaded to Supabase Storage (`user-recipes/{userId}/{filename}`)
- FR032: Metadata saved to `user_recipes` database table
- FR033: Success feedback shown ("Recipe uploaded! Add it to your canvas")
- FR034: Clear error messages for invalid format, missing fields, file too large, upload failures
- FR035: Rate limiting enforced (10 uploads per hour per user)

**FR-Canvas Persistence & Sync**
- FR036: Canvas state auto-saves every 5 seconds (debounced)
- FR037: Canvas saves immediately when user leaves page (`beforeunload` event)
- FR038: Same canvas state loads on different device (multi-device sync)
- FR039: Simultaneous edits handled with last-write-wins conflict resolution
- FR040: Canvas renders while data loads (progressive rendering with spinner)

**FR-Drawing & Markup Tools**
- FR041: Pen tool for freehand drawing over canvas
- FR042: Highlighter tool for semi-transparent strokes
- FR043: Shape tools: rectangle, circle, arrow for drawing connections
- FR044: Text tool for adding annotations and labels
- FR045: Eraser tool for correcting mistakes
- FR046: Drawings can be layered above/below recipe cards
- FR047: Z-order menu: "Bring to Front" / "Send to Back" options
- FR048: Undo/Redo with Ctrl+Z / Ctrl+Shift+Z keyboard shortcuts

**FR-Canvas Export**
- FR049: Export canvas visible area as PNG image
- FR050: Export canvas as PDF for printing
- FR051: Export options for different resolutions (72dpi, 150dpi, 300dpi)
- FR052: Exported files named as `cookbook-{date}.png` or `.pdf`
- FR053: Exports include all cards and drawings with current styling

### Non-Functional Requirements

**NFR-Performance**
- NFR001: Canvas loads in less than 2 seconds
- NFR002: Auto-save operations complete in less than 500ms (debounced)
- NFR003: Pan/zoom interactions remain smooth with 50+ recipe cards
- NFR004: File upload success rate exceeds 99%
- NFR005: Database queries perform in less than 100ms (p95)

**NFR-Reliability & Data**
- NFR006: Row Level Security enforced at database layer (users can only access own data)
- NFR007: Canvas state protected against data loss with auto-save
- NFR008: User recipes isolated in storage (only accessible by owner)

**NFR-Scalability**
- NFR009: Recommend limit of 100 cards per canvas for optimal performance
- NFR010: Virtualization implemented (only render visible cards in viewport)
- NFR011: Lazy loading of recipe content (load on expand)

---

## User Journeys

### Journey 1: New User Creating Cookbook

1. User signs up for account with email/password
2. Navigates to `/cookbook` page
3. Sees empty canvas with tutorial overlay ("Add your first recipe!")
4. Clicks "Add Recipe" button
5. Sidebar opens showing recipe selector
6. Searches for "lasagna" or browses by category
7. Clicks desired recipe → card appears on canvas
8. Drags card to position
9. Clicks expand button → sees full recipe with ingredients and instructions
10. Uses pen tool to circle key ingredients or draw notes
11. Adds more recipes to canvas for meal planning
12. Canvas auto-saves changes every 5 seconds
13. Signs out
14. Returns next day, navigates to `/cookbook` → canvas loads with all cards in same positions

### Journey 2: Uploading Personal Family Recipe

1. User has family recipe as .md file (e.g., `grandmas-cookies.md`)
2. Opens `/cookbook` page
3. Clicks "Upload Recipe" button or drags file to drop zone
4. System parses markdown frontmatter and validates required fields
5. Preview modal shows parsed recipe metadata and content
6. User reviews and confirms upload
7. Recipe saved to Supabase Storage
8. "My Recipes" section in sidebar now shows new recipe
9. User clicks recipe and adds it to canvas like any library recipe
10. Card displays "User Recipe" badge to distinguish from library recipes

### Journey 3: Meal Planning with Drawing & Markup

1. User opens canvas with several recipes already added
2. Arranges 7 recipe cards in week-based layout
3. Uses text tool to label each card with day of week ("Monday", "Tuesday", etc.)
4. Uses highlighter to mark recipes already tried
5. Draws arrows between recipes that pair well together
6. Circles ingredients common to multiple recipes
7. Uses eraser to fix mistakes
8. Exports canvas as PNG for shopping list reference
9. Shares exported image with family via text/email

---

## UX Design Principles

- **Intuitive spatial layout** - Drag, drop, arrange recipes like physical recipe cards
- **Progressive disclosure** - Compact view by default, full recipe on demand (expand)
- **Visual feedback** - Loading states, success toasts, error messages are clear
- **Accessibility** - Keyboard shortcuts, touch support, color-blind friendly markup
- **Empty state guidance** - Tutorial overlay and helpful hints for new users
- **Mobile-first viewing** - View-only acceptable on mobile; full editing on desktop

---

## User Interface Design Goals

- **Recipe cards prominently featured** - Large, readable titles, clear metadata (prep/cook time, difficulty)
- **Distraction-free canvas** - Clean background, subtle grid, focus on content
- **Sidebar integrated smoothly** - Toggle-able, doesn't obstruct main canvas
- **Drawing tools accessible** - Toolbar visible but not overwhelming
- **Responsive design** - Works on desktop (1920px), tablets (768px), mobile (375px)
- **Consistent with Savor design system** - Use existing Tailwind styles, typography, color palette

---

## Epic List

**Epic 1: Foundation - Authentication & Database Setup**
- Goal: Establish infrastructure for authentication and persistent data storage
- Estimated Stories: 4-5

**Epic 2: Canvas Core - Infinite Workspace & Recipe Cards**
- Goal: Implement infinite canvas with recipe card placement and persistence
- Estimated Stories: 6-8

**Epic 3: User Recipe Uploads - File Management**
- Goal: Enable users to upload personal markdown recipes
- Estimated Stories: 5-6

**Epic 4: Card Interactions - Expand, Resize, Polish**
- Goal: Make recipe cards interactive and visually polished
- Estimated Stories: 5-6

**Epic 5: Drawing & Export - Markup Tools & Canvas Export**
- Goal: Enable drawing tools and export functionality
- Estimated Stories: 4-5

> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

**For MVP (will be future enhancements):**
- OAuth / SSO authentication (email/password only for MVP)
- Real-time collaboration (single user per canvas for MVP)
- Multiple canvases per user (one canvas per user for MVP)
- Inline recipe editing (read-only for MVP)
- Mobile app (web-only for MVP)
- Advanced features: meal plan templates, grocery list generation, nutrition aggregation
- Recipe recommendation engine
- Sharing/permissions system
- Canvas connections or relationship lines between cards
- Color-coded categories or tagging system for cards
- Recipe versioning or history

**Technical limitations:**
- No offline support (requires internet connection)
- Recommend maximum 100 cards per canvas for performance
- File uploads limited to 500KB per file
- Rate limiting: 10 uploads per hour per user

---

**Document Status:** Ready for Implementation
**Last Updated:** 2025-10-21
**Next Phase:** Epic breakdown and story development in epics.md
