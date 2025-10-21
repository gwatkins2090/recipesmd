# GitHub Issues Summary: Cookbook Canvas Project

**Date Created:** 2025-10-21
**Total Issues:** 47
**Total Story Points:** ~192
**Timeline:** ~4 weeks (5 sprints)

---

## Overview

All 47 GitHub Issues have been successfully created from the user stories breakdown. Each issue is labeled with its sprint and category (frontend/backend/documentation) for easy filtering and organization.

### Issue Distribution

| Sprint | Count | Type | Status |
|--------|-------|------|--------|
| Sprint 1: Foundation | 12 | Auth, DB, DevOps | Ready to Start |
| Sprint 2: Canvas Core | 14 | TLDraw, Persistence, UI | Depends on Sprint 1 |
| Sprint 3: User Uploads | 7 | File Upload, Validation | Depends on Sprint 2 |
| Sprint 4: Card Interactions | 6 | Resize, Delete, Polish | Depends on Sprint 3 |
| Sprint 5: Drawing & Export | 8 | Drawing, Export, Testing | Depends on Sprint 4 |

**Total: 47 issues across 5 sprints**

---

## GitHub URL

View all issues here: https://github.com/gwatkins2090/recipesmd/issues

---

## Sprint 1: Foundation (12 Issues)

**Goal:** Set up infrastructure for authentication and database

### Backend (7 issues)
- T1.1.1.1: Create Supabase Project
- T1.1.1.2: Deploy Database Schema
- T1.1.1.3: Configure Row Level Security (RLS) Policies
- T1.1.1.4: Configure Supabase Storage Bucket
- T1.1.3.1: Create Auth Middleware
- T1.2.1.1: Set Up Environment Variables
- T1.2.1.2: Update Vercel Deployment Secrets

### Frontend (3 issues)
- T1.1.2.1: Create Sign Up Page
- T1.1.2.2: Create Sign In Page
- T1.1.2.3: Create Sign Out Functionality
- T1.1.3.2: Create Protected Layout

### Documentation (1 issue)
- T1.3.1.1: Create Supabase Setup Guide

**Sprint Points:** 31
**Deliverable:** Users can create account and access protected /cookbook page

---

## Sprint 2: Canvas Core (14 Issues)

**Goal:** Render working infinite canvas with recipe cards

### Frontend (10 issues)
- T2.1.1.1: Install & Configure TLDraw
- T2.1.1.2: Create Custom Recipe Card Shape
- T2.1.2.3: Implement Frontend Canvas Persistence Hook
- T2.2.1.1: Create Recipe Card Component
- T2.2.1.2: Implement Expand/Collapse Toggle
- T2.3.1.1: Create Recipe Selector Sidebar
- T2.3.1.3: Connect Selector to Canvas
- T2.4.1.1: Create Main Cookbook Page
- T2.4.1.2: Create Toolbar & Navigation
- T2.4.1.3: Create Toast Notification Component

### Backend (4 issues)
- T2.1.2.1: Create Canvas Save API Endpoint
- T2.1.2.2: Create Canvas Load API Endpoint
- T2.2.1.3: Create Recipe Parser Utility
- T2.3.1.2: Fetch & Display Main Library Recipes

**Sprint Points:** 62 (consider splitting into 2a/2b)
**Deliverable:** Users can add recipes to canvas that persists across sessions

---

## Sprint 3: User Uploads (7 Issues)

**Goal:** Enable users to upload personal recipe files

### Frontend (3 issues)
- T3.1.1.1: Create File Upload Component
- T3.1.1.2: Create Recipe Preview Modal
- T3.1.3.2: Update Recipe Selector with User Recipes
- T3.2.1.2: Display Upload Errors to User

### Backend (4 issues)
- T3.1.2.1: Create Recipe Upload Endpoint
- T3.1.2.2: Implement Rate Limiting
- T3.1.3.1: Create User Recipes List Endpoint
- T3.2.1.1: Create Recipe Validation Utility

**Sprint Points:** 32
**Deliverable:** Users can upload .md recipes and add them to canvas

---

## Sprint 4: Card Interactions (6 Issues)

**Goal:** Make cards interactive, beautiful, and performant

### Frontend (6 issues)
- T4.1.1.1: Implement Card Resize Functionality
- T4.1.1.2: Implement Card Delete
- T4.1.2.1: Display Rich Metadata
- T4.2.1.1: Enhance Markdown Rendering
- T4.3.1.1: Implement Canvas Virtualization
- T4.3.2.1: Polish UI Styling

**Sprint Points:** 30
**Deliverable:** Canvas is performant, beautiful, and ready for MVP

---

## Sprint 5: Drawing & Export (8 Issues)

**Goal:** Enable markup, testing, and production deployment

### Frontend (3 issues)
- T5.1.1.1: Enable Drawing Tools
- T5.1.1.2: Implement Z-Order Management
- T5.2.1.1: Implement Canvas Export to PNG
- T5.2.1.2: Implement Canvas Export to PDF

### Backend (3 issues)
- T5.3.1.1: Write Unit Tests
- T5.3.1.2: Integration Testing
- T5.3.2.2: Deploy to Production

### Documentation (1 issue)
- T5.3.2.1: Write User Documentation

**Sprint Points:** 37
**Deliverable:** Cookbook Canvas MVP complete, tested, documented, and deployed

---

## How to Use These Issues

### For Sprint Planning
1. Go to https://github.com/gwatkins2090/recipesmd/issues
2. Filter by sprint label (sprint-1, sprint-2, etc.)
3. Assign issues to developers based on skills
4. Update story points if your team estimates differently

### For Developers
1. Filter by your assigned issues
2. Read the acceptance criteria
3. Move issue to "In Progress" when starting
4. Link your PR to the issue
5. Request code review
6. Close issue when merged and deployed

### For Product/Project Managers
1. Track issues by sprint
2. Monitor progress (Open → In Progress → Done)
3. Collect metrics: velocity (points completed per sprint)
4. Adjust future sprints based on velocity
5. Gather user feedback after each sprint

### Label Filters

Filter issues by label:
- **by Sprint:** `sprint-1`, `sprint-2`, `sprint-3`, `sprint-4`, `sprint-5`
- **by Type:** `frontend`, `backend`, `documentation`
- **by Domain:** `auth`, `database`, `storage`, `supabase`, `security`, `devops`

---

## Key Metrics

### Story Point Distribution

```
Sprint 1:  31 points (31%)
Sprint 2:  62 points (32%) ← Largest, consider splitting
Sprint 3:  32 points (17%)
Sprint 4:  30 points (16%)
Sprint 5:  37 points (19%)
────────────────────────
Total:   192 points
```

### Team Distribution

| Type | Issues | % |
|------|--------|---|
| Frontend | 26 | 55% |
| Backend | 18 | 38% |
| Documentation | 3 | 6% |

---

## Dependencies & Sequencing

**Critical Path:**
```
Sprint 1 (Auth/DB) ──→ Must complete before Sprint 2
    ↓
Sprint 2 (Canvas) ──→ Must complete before Sprint 3
    ↓
Sprint 3 (Uploads) ──→ Must complete before Sprint 4
    ↓
Sprint 4 (Polish) ──→ Must complete before Sprint 5
    ↓
Sprint 5 (Testing/Deploy) ──→ Production Release
```

**Parallel Work Possible:**
- Within each sprint, frontend and backend can work in parallel
- Example: Sprint 2 - Backend can work on Canvas APIs while Frontend builds TLDraw integration

---

## Acceptance Criteria Template

Every issue includes detailed acceptance criteria. Example:

```
✅ Frontend can be built independently
✅ API endpoints respond with correct data
✅ Database queries perform efficiently
✅ Tests pass with > 80% coverage
✅ No console errors or warnings
✅ Mobile responsive (verified on tablet)
✅ Accessibility meets WCAG standards
```

---

## Next Steps

1. **Review Issues** - Team reviews all 47 issues
2. **Estimate Points** - Adjust story points based on your team's experience
3. **Assign Issues** - Distribute to developers
4. **Schedule Sprints** - Decide sprint dates and capacity
5. **Setup Automation** - Configure GitHub Actions for CI/CD
6. **Start Sprint 1** - Begin database and auth work

---

## Useful GitHub Commands

```bash
# List issues by sprint
gh issue list --label sprint-1

# List open issues assigned to you
gh issue list --assignee @me

# Create pull request linked to issue
gh pr create --title "Fix issue #42" --body "Fixes #42"

# Close issue automatically
# (In PR description) "Closes #42"

# View issue details
gh issue view 1
```

---

## Related Documents

- **PRD-COOKBOOK-CANVAS.md** - Product requirements and goals
- **TECH-SPEC-COOKBOOK-CANVAS.md** - Architecture and technical details
- **USER-STORIES-COOKBOOK-CANVAS.md** - Detailed user stories and acceptance criteria

---

## Quick Links

- **Repository:** https://github.com/gwatkins2090/recipesmd
- **Issues:** https://github.com/gwatkins2090/recipesmd/issues
- **Project Board:** https://github.com/gwatkins2090/recipesmd/projects (if configured)

---

**Document Created:** 2025-10-21
**Status:** Ready for Sprint Planning
**Next Action:** Import issues into sprint planning tool and assign to team

