# Brainstorming Session: Cookbook Canvas Revamp

**Date:** 2025-10-21
**Participant:** GW
**Facilitator:** Mary (Business Analyst Agent)
**Session Type:** Focused Ideation
**Duration:** ~30 minutes

---

## 🎯 Session Goal

Revamp the `/cookbook` page from a placeholder into a fully-fledged feature with an Obsidian-style infinite canvas for visual recipe organization.

---

## 💡 Core Vision

Transform `/cookbook` into a **visual workspace** where users can:
- Arrange recipe cards spatially on an infinite canvas
- Drag/drop/upload .md recipe files
- Beautiful markdown rendering on cards
- Personal organization through spatial arrangement
- Draw and markup over recipe cards

**Inspiration:** Obsidian Canvas - "an infinite space to research, brainstorm, diagram and lay out your ideas"

---

## ✅ Key Decisions Made

### **1. Canvas Behavior**
- ✅ **Single canvas** per user (no multiple canvases for MVP)
- ✅ **No boundaries or connections** between cards (keep it simple)
- ✅ **Infinite pan/zoom** workspace

### **2. Card Interactions**
- ✅ **Resizable cards** - Like resizing windows
- ✅ **Expandable/collapsible** - Compact view ↔ full recipe view
- ✅ **Metadata visible** - Show prep time, difficulty, tags on cards
- ✅ **Full view** - Complete recipe visible when expanded
- ✅ **Read-only for MVP** - Editing recipes = future enhancement

### **3. Drawing & Markup**
- ✅ **Pen/drawing tools** - Draw over and markup recipe cards
- ✅ **TLDraw built-in tools** - Pen, highlighter, shapes, arrows
- ✅ **Annotations** - Add notes, circles, highlights to recipes

### **4. Recipe Sources**
- ✅ **Select from existing** - Browse 113 existing recipes, add to canvas
- ✅ **Drag/drop upload** - Drop .md files onto canvas
- ✅ **File upload** - Standard file picker for .md files
- ✅ **User recipes separate** - Uploaded recipes go to `/recipes/useruploaded/{userId}/`
- ✅ **Manual approval** - Admin (GW) manually moves approved recipes to main library
- ✅ **Tagged** - User recipes tagged with `userUploaded: true` in frontmatter

### **5. Authentication & Persistence**
- ✅ **Account required** - Canvas saving requires user account
- ✅ **Multi-device sync** - Canvas state syncs across devices
- ✅ **Auto-save** - Save canvas state every 5 seconds (debounced)
- ✅ **No offline mode** - Must be online to use canvas

### **6. Technical Stack**

**Final Architecture Decision:**

✅ **Supabase All-In-One**
- **Supabase Auth** - Email/password authentication (no SSO for MVP)
- **Supabase Database** - PostgreSQL with Row Level Security
- **Supabase Storage** - 1GB free for user-uploaded .md files
- **TLDraw** - Open source infinite canvas library
- **Next.js 15 + React 19** - Existing app stack
- **Vercel** - Hosting (unchanged)

**Why Supabase:**
- Better free tier (500MB DB vs 256MB Vercel)
- File storage included (1GB)
- Built-in auth (one less service)
- Better documentation and community
- Real-time capabilities (future feature: live collaboration)
- Row Level Security (automatic data isolation)

**Why Not Vercel Postgres + Clerk:**
- More services to manage
- Smaller free tier
- No file storage included
- More expensive at scale

**Free Tier Limits:**
- 500MB database
- 1GB file storage
- 2GB bandwidth
- 50,000 monthly active users
- Unlimited API requests
- Projects pause after 1 week inactivity (auto-resumes)

---

## 📐 Architecture Details

### **Database Schema**

```sql
-- User recipes metadata
CREATE TABLE user_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Supabase Storage path
  title TEXT,
  metadata JSONB, -- parsed frontmatter
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Canvas state (one per user)
CREATE TABLE canvas_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  tldraw_document JSONB NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_state ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own recipes" ON user_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON user_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON user_recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own canvas" ON canvas_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own canvas" ON canvas_state
  FOR ALL USING (auth.uid() = user_id);
```

### **File Storage Structure**

**Supabase Storage Buckets:**
```
user-recipes (private bucket)
└── {userId}/
    ├── chocolate-chip-cookies.md
    ├── moms-lasagna.md
    └── grandmas-apple-pie.md
```

**File System (Next.js public recipes):**
```
/recipes/
├── chocolate-chess-pie.md      # Main library (113 recipes)
├── chicken-spaghetti.md
├── ...
└── useruploaded/                # User uploads (reference only)
    └── {userId}/
        ├── my-recipe.md
        └── ...
```

**Note:** User recipes stored in **Supabase Storage**, not file system. The `/recipes/useruploaded/` path is for reference/admin review, not runtime access.

### **Recipe Frontmatter for User Uploads**

```yaml
---
title: "My Amazing Recipe"
description: "A family favorite"
category: "Main Dishes"
difficulty: "Medium"
prepTime: "PT15M"
cookTime: "PT30M"
totalTime: "PT45M"
yield: "4 servings"
tags: ["dinner", "comfort food"]
userUploaded: true          # ← Identifies user recipe
userId: "uuid-123-456"      # ← User who uploaded
uploadedAt: "2025-10-21"    # ← Upload timestamp
---

## Ingredients
...
```

### **TLDraw Custom Shape**

```typescript
// Custom recipe card shape for TLDraw
interface RecipeCardShape extends TLDraw.Shape {
  type: 'recipe-card'
  props: {
    recipeSlug: string      // Slug of the recipe
    recipeType: 'main' | 'user'  // Main library or user uploaded
    isExpanded: boolean     // Compact vs full view
    showMetadata: boolean   // Show prep time, difficulty, etc.
    width: number          // Card width
    height: number         // Card height
  }
}
```

---

## 🚀 MVP Implementation Phases

### **Phase 1: Foundation (Week 1)**
**Goal:** Set up core infrastructure

1. ✅ Create Supabase project
2. ✅ Set up Supabase Auth (email/password)
3. ✅ Create database schema with RLS
4. ✅ Set up Supabase Storage bucket (`user-recipes`)
5. ✅ Install Supabase Next.js SDK
6. ✅ Create auth pages (sign up, sign in, sign out)
7. ✅ Protect `/cookbook` route (require authentication)

**Deliverable:** Users can create account and sign in

---

### **Phase 2: Canvas Core (Week 1-2)**
**Goal:** Basic infinite canvas with recipe cards

8. ✅ Install TLDraw (`npm install tldraw`)
9. ✅ Create canvas page at `/cookbook`
10. ✅ Integrate TLDraw editor
11. ✅ Create custom `RecipeCard` shape
12. ✅ Build recipe selector sidebar
    - Search existing recipes
    - Filter by category
    - Click to add to canvas
13. ✅ Implement canvas persistence
    - Auto-save to `canvas_state` table every 5s
    - Load canvas on page mount
    - Multi-device sync
14. ✅ Basic card rendering
    - Recipe title
    - Metadata (prep time, difficulty)
    - Thumbnail/placeholder image

**Deliverable:** Users can add existing recipes to canvas and it saves

---

### **Phase 3: User Recipe Uploads (Week 2-3)**
**Goal:** Allow users to upload their own .md recipe files

15. ✅ Create file upload UI component
    - Drag/drop zone
    - File picker button
    - Accept `.md` files only
16. ✅ Implement upload handler
    - Validate .md format
    - Parse frontmatter
    - Add `userUploaded` metadata
    - Upload to Supabase Storage
    - Save metadata to `user_recipes` table
17. ✅ Parse and validate recipes
    - gray-matter for frontmatter
    - Validate required fields
    - Show errors if invalid
18. ✅ Add user recipes to selector
    - Separate "My Recipes" section
    - Display user-uploaded recipes
    - Add to canvas like main recipes
19. ✅ Markdown preview
    - Preview before uploading
    - Show parsed metadata

**Deliverable:** Users can upload .md files and add them to canvas

---

### **Phase 4: Card Interactions (Week 3-4)**
**Goal:** Make cards interactive and beautiful

20. ✅ Implement card resize
    - TLDraw resize handles
    - Maintain aspect ratio (optional)
    - Min/max size constraints
21. ✅ Expand/collapse functionality
    - **Compact view:** Title + metadata only
    - **Full view:** Complete recipe (ingredients, instructions)
    - Toggle button on card
    - Smooth transition
22. ✅ Metadata display
    - Prep time icon + time
    - Cook time icon + time
    - Difficulty badge
    - Servings
    - Tags (if expanded)
23. ✅ Beautiful markdown rendering
    - Use existing `remark` + `remark-html` from codebase
    - Style recipe sections (ingredients, instructions)
    - Render in TLDraw shape
    - Handle long content (scroll within card)

**Deliverable:** Recipe cards are interactive and visually polished

---

### **Phase 5: Drawing & Polish (Week 4)**
**Goal:** Enable markup and finalize UX

24. ✅ Enable TLDraw drawing tools
    - Pen tool for freehand
    - Highlighter for emphasis
    - Shapes (rectangle, circle, arrow)
    - Text annotations
25. ✅ Drawing over cards
    - Ensure drawings render above/below cards
    - Z-index management
    - "Bring to front" / "Send to back"
26. ✅ Canvas export
    - Export as PNG image
    - Export as PDF (print cookbook)
    - Include drawings and annotations
27. ✅ UI/UX polish
    - Loading states
    - Empty states ("Add your first recipe!")
    - Tooltips and help text
    - Keyboard shortcuts
    - Mobile responsive (view only, no editing)
28. ✅ Performance optimization
    - Lazy load recipe content
    - Virtualize off-screen cards
    - Debounce save operations

**Deliverable:** Full-featured cookbook canvas ready for users

---

## 🎨 User Workflows

### **Workflow 1: New User Creating Cookbook**

1. User signs up (email/password)
2. Navigates to `/cookbook`
3. Sees empty canvas with tutorial overlay
4. Clicks "Add Recipe" button
5. Sidebar opens with recipe selector
6. Searches for "lasagna"
7. Clicks recipe → card appears on canvas
8. Drags card to desired position
9. Clicks expand button → sees full recipe
10. Uses pen tool to circle key ingredients
11. Adds more recipes to plan weekly meals
12. Canvas auto-saves every 5 seconds
13. Signs out, returns next day → canvas loads with all cards

### **Workflow 2: Uploading Personal Recipe**

1. User has family recipe as .md file
2. Opens `/cookbook`
3. Clicks "Upload Recipe" button
4. Drags `grandmas-cookies.md` into drop zone
5. System parses frontmatter and validates
6. Preview modal shows parsed recipe
7. User confirms upload
8. Recipe saves to Supabase Storage
9. "My Recipes" section now shows new recipe
10. User adds it to canvas like any other recipe
11. Recipe card shows "User Uploaded" badge

### **Workflow 3: Meal Planning with Markup**

1. User opens cookbook canvas
2. Arranges 7 recipe cards in week layout
3. Labels each with text tool ("Monday", "Tuesday"...)
4. Uses highlighter to mark recipes tried before
5. Draws arrows between complementary recipes
6. Circles ingredients common to multiple recipes
7. Exports canvas as PNG for shopping list reference
8. Shares image with family via text/email

---

## 📊 Success Metrics

### **Engagement Metrics**
- Number of recipes added to canvas per user
- Average canvas session duration
- Frequency of canvas access (daily/weekly)
- Number of user-uploaded recipes
- Drawing tool usage rate

### **Technical Metrics**
- Canvas load time
- Save operation latency
- File upload success rate
- Database query performance
- Storage usage per user

### **User Satisfaction**
- Feature adoption rate
- User retention (30-day, 90-day)
- Net Promoter Score (future survey)
- Feature request themes

---

## 🔮 Future Enhancements (Post-MVP)

### **Phase 6: Editing & Enhancement**
- ✅ Edit recipes directly on canvas
- ✅ Inline markdown editor
- ✅ Auto-save edits to user recipes
- ✅ Version history (using Supabase)

### **Phase 7: Multiple Canvases**
- ✅ Create multiple canvases ("Meal Plans", "Holiday Recipes")
- ✅ Canvas templates (weekly grid, dinner party flow)
- ✅ Duplicate canvas feature
- ✅ Archive old canvases

### **Phase 8: Collaboration**
- ✅ Share canvas with read-only link
- ✅ Collaborative editing (real-time with Supabase)
- ✅ See other users' cursors
- ✅ Comments on recipe cards
- ✅ Family/group canvases

### **Phase 9: Smart Features**
- ✅ AI recipe suggestions based on canvas
- ✅ "Complete the meal" (suggest sides for mains)
- ✅ Grocery list generation from canvas recipes
- ✅ Nutrition aggregation across canvas

### **Phase 10: Advanced Canvas**
- ✅ Card connections/relationships
- ✅ Group cards with boundaries
- ✅ Color-coded categories
- ✅ Recipe dependency arrows
- ✅ Timeline view (sequential cooking)

---

## 🚨 Technical Risks & Mitigation

### **Risk 1: TLDraw Performance with Many Cards**
**Impact:** Canvas could become slow with 50+ recipe cards

**Mitigation:**
- Implement virtualization (only render visible cards)
- Lazy load recipe content (load on expand)
- Set reasonable limits (e.g., 100 cards max per canvas)
- Provide "archive" feature for old recipes

### **Risk 2: Supabase Free Tier Limits**
**Impact:** Users could hit 500MB database or 1GB storage limits

**Mitigation:**
- Monitor usage with Supabase dashboard
- Compress canvas JSON (remove whitespace)
- Implement storage quotas per user (e.g., 10MB max)
- Clear old canvas history (keep last 30 days)
- Upgrade to paid tier if needed ($25/month)

### **Risk 3: File Upload Abuse**
**Impact:** Users upload large/invalid files, spam system

**Mitigation:**
- File size limit: 500KB per .md file (reasonable for recipes)
- Rate limiting: 10 uploads per hour per user
- File validation: Must be valid markdown with required frontmatter
- Malware scanning (use Supabase Storage security rules)
- Admin review queue for user recipes

### **Risk 4: Complex State Management**
**Impact:** Canvas state + user recipes + auth = complex syncing

**Mitigation:**
- Use TLDraw's built-in persistence
- Leverage Supabase RLS for automatic security
- Keep state simple: Canvas = TLDraw JSON, Recipes = separate table
- Use React Query for data fetching/caching
- Comprehensive error handling and retry logic

### **Risk 5: Mobile Experience**
**Impact:** Infinite canvas is desktop-optimized, mobile is challenging

**Mitigation:**
- MVP: Desktop-first, mobile as read-only viewer
- Touch gestures: Pan with one finger, zoom with pinch
- Simplified mobile UI (no drawing tools)
- Future: Dedicated mobile app with native canvas

---

## 💰 Cost Projections

### **Free Tier (First ~500 Users)**
- Supabase: FREE
- Vercel: FREE (100GB bandwidth)
- **Total: $0/month**

### **Paid Tier (500-10,000 Users)**
- Supabase Pro: $25/month
  - 8GB database
  - 100GB storage
  - 250GB bandwidth
  - Daily backups
- Vercel Pro: $20/month (if needed)
  - 1TB bandwidth
  - Better performance
- **Total: $25-45/month**

### **Growth Tier (10,000+ Users)**
- Supabase Pro + overages: ~$50-100/month
- Vercel Pro: $20/month
- CDN for recipe images: ~$10/month
- **Total: $80-130/month**

---

## 🎯 Definition of Done (MVP)

### **Phase 1-4 Complete When:**
- ✅ Users can sign up/sign in with email/password
- ✅ Users can access protected `/cookbook` page
- ✅ Users can add existing recipes to infinite canvas
- ✅ Users can upload .md recipe files
- ✅ Recipe cards are resizable and expandable
- ✅ Metadata is visible on cards
- ✅ Markdown renders beautifully
- ✅ Canvas auto-saves and syncs across devices
- ✅ User recipes stored in Supabase
- ✅ Row Level Security enforces data isolation
- ✅ All within free tier limits

### **Phase 5 Complete When:**
- ✅ Drawing tools work over/under cards
- ✅ Canvas exports to PNG/PDF
- ✅ UI is polished and intuitive
- ✅ Performance is acceptable (< 2s load time)
- ✅ Mobile is usable (view-only acceptable)
- ✅ Error handling is comprehensive
- ✅ Help documentation exists

---

## 📚 Technical Documentation Needed

### **For Developers:**
1. **Supabase Setup Guide**
   - Database schema creation
   - RLS policy configuration
   - Storage bucket setup
   - Auth configuration

2. **TLDraw Integration Guide**
   - Custom shape creation
   - Event handlers
   - Persistence strategy
   - Performance optimization

3. **Recipe Upload Guide**
   - Frontmatter validation
   - File processing pipeline
   - Error handling

4. **Canvas State Management**
   - Auto-save mechanism
   - Multi-device sync
   - Conflict resolution

### **For Users:**
1. **Getting Started with Cookbook**
   - Creating account
   - Adding first recipe
   - Basic canvas navigation

2. **Uploading Recipes**
   - Markdown format requirements
   - Frontmatter structure
   - Common errors and fixes

3. **Canvas Tips & Tricks**
   - Keyboard shortcuts
   - Drawing tools
   - Organizing recipes
   - Exporting canvas

---

## 🎉 Session Outcome

**Status:** ✅ **Complete and Ready for Implementation**

**Key Achievements:**
1. ✅ Clear vision for cookbook canvas feature
2. ✅ Technical architecture decided (Supabase all-in-one)
3. ✅ MVP scope defined (5 phases over 4 weeks)
4. ✅ User workflows mapped
5. ✅ Technical risks identified with mitigations
6. ✅ Success metrics defined
7. ✅ Future enhancements cataloged

**Next Steps:**
1. Create PRD (Product Requirements Document) with PM agent
2. Create Technical Specification with detailed implementation
3. Break down into user stories for development
4. Begin Phase 1 implementation

---

## 📝 Notes & Decisions Log

**Decision 1: Supabase vs Vercel Postgres**
- **Context:** Need database + file storage + auth
- **Options:** Vercel Postgres + Clerk + Blob Storage vs Supabase all-in-one
- **Decision:** Supabase all-in-one
- **Rationale:** Better free tier, file storage included, simpler architecture, better docs

**Decision 2: Clerk vs Supabase Auth**
- **Context:** Authentication provider choice
- **Options:** Clerk (better UX) vs Supabase Auth (all-in-one)
- **Decision:** Supabase Auth
- **Rationale:** Fewer services, all-in-one solution, sufficient for MVP (email/password only)

**Decision 3: File Storage Strategy**
- **Context:** Where to store user-uploaded .md files
- **Options:** Database BLOB vs Supabase Storage vs Vercel Blob
- **Decision:** Supabase Storage
- **Rationale:** Included in free tier, proper file storage, easy to access

**Decision 4: Canvas Library**
- **Context:** Infinite canvas implementation
- **Options:** React Flow, TLDraw, Excalidraw, custom
- **Decision:** TLDraw
- **Rationale:** User requested, excellent TypeScript support, drawing tools built-in, active development

**Decision 5: MVP Scope**
- **Context:** What to build first
- **Decision:** 5 phases over ~4 weeks, prioritizing core canvas before advanced features
- **Rationale:** Get to usable product quickly, iterate based on feedback

**Decision 6: Authentication Type**
- **Context:** What auth methods to support initially
- **Decision:** Email/password only (no SSO)
- **Rationale:** Simplest to implement, sufficient for MVP, can add OAuth later

---

**Brainstorming Session Completed: 2025-10-21**
**Facilitated by:** Mary (Business Analyst Agent)
**Next Action:** Proceed to PRD creation with PM agent
