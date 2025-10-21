# Technical Specification: Cookbook Canvas

**Document Version:** 1.0
**Date:** 2025-10-21
**Status:** Ready for Development
**Target Audience:** Engineering Team (Full-Stack Developers, Database Engineers)
**Related Document:** PRD-COOKBOOK-CANVAS.md

---

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer (Browser)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Next.js 15 / React 19 Application                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │  Auth Pages  │  │ Cookbook Pg  │  │  API Routes  │  │   │
│  │  │  (Sign up,   │  │  (Canvas,    │  │  (Upload,    │  │   │
│  │  │   Sign in)   │  │   Recipe)    │  │   Save)      │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │         │                  │                │            │   │
│  └─────────┼──────────────────┼────────────────┼────────────┘   │
│            │                  │                │                 │
├────────────┼──────────────────┼────────────────┼─────────────────┤
│            │                  │                │                 │
│  ┌─────────▼──────────────────▼────────────────▼──────────────┐ │
│  │  Supabase Client Library (@supabase/supabase-js)           │ │
│  │  • Auth: Email/password, session management               │ │
│  │  • Database: PostgreSQL client, RLS enforced              │ │
│  │  • Storage: File upload to Supabase Storage               │ │
│  └─────────┬──────────────────┬────────────────┬──────────────┘ │
│            │                  │                │                 │
└────────────┼──────────────────┼────────────────┼─────────────────┘
             │                  │                │
         ┌───▼──────────────────▼────────────────▼───────┐
         │  Supabase Backend (Cloud)                     │
         │  ┌─────────────────────────────────────────┐  │
         │  │  Auth Service (JWT tokens)              │  │
         │  │  PostgreSQL Database (RLS enforced)     │  │
         │  │  Storage Service (Private bucket)       │  │
         │  └─────────────────────────────────────────┘  │
         └─────────────────────────────────────────────────┘
```

### 1.2 Data Flow

**User Recipe Upload Flow:**
```
User selects .md file
    ↓
Frontend validates (file type, size)
    ↓
Parse frontmatter with gray-matter
    ↓
Validate required fields
    ↓
Show preview modal to user
    ↓
User confirms
    ↓
Upload to Supabase Storage (/user-recipes/{userId}/filename)
    ↓
Save metadata to user_recipes table (Supabase PostgreSQL)
    ↓
Add to "My Recipes" selector
    ↓
User can add to canvas
```

**Canvas Save Flow:**
```
User interactions (drag, add, expand, draw)
    ↓
TLDraw detects changes
    ↓
Debounce for 500ms (batch updates)
    ↓
Serialize TLDraw document to JSON
    ↓
POST to /api/canvas/save
    ↓
Backend validates user auth (RLS enforced)
    ↓
UPSERT canvas_state row
    ↓
Return success + last_updated timestamp
    ↓
Frontend shows "Saved" indicator (optional)
```

---

## 2. Database Schema & Implementation

### 2.1 Complete Database Schema

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User recipes metadata table
CREATE TABLE user_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- e.g., "user-recipes/{userId}/recipe.md"
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., "Main Dishes", "Desserts"
  difficulty TEXT, -- "Easy", "Medium", "Hard"
  prep_time TEXT, -- ISO 8601 format: "PT15M"
  cook_time TEXT, -- ISO 8601 format: "PT30M"
  total_time TEXT, -- ISO 8601 format: "PT45M"
  yield TEXT, -- e.g., "4 servings"
  tags TEXT[], -- Array of strings
  metadata JSONB, -- Full parsed frontmatter
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT unique_user_recipe UNIQUE(user_id, filename),
  CONSTRAINT filename_not_empty CHECK (filename != ''),
  CONSTRAINT storage_path_not_empty CHECK (storage_path != '')
);

-- Canvas state table (one per user)
CREATE TABLE canvas_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tldraw_document JSONB NOT NULL, -- Full TLDraw state
  viewport_x FLOAT DEFAULT 0, -- Camera pan X
  viewport_y FLOAT DEFAULT 0, -- Camera pan Y
  viewport_zoom FLOAT DEFAULT 1, -- Zoom level
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT one_canvas_per_user UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX idx_user_recipes_user_id ON user_recipes(user_id);
CREATE INDEX idx_canvas_state_user_id ON canvas_state(user_id);

-- Enable Row Level Security
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_state ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies for user_recipes
CREATE POLICY "Users can view own recipes"
  ON user_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes"
  ON user_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON user_recipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON user_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Row Level Security Policies for canvas_state
CREATE POLICY "Users can view own canvas"
  ON canvas_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own canvas"
  ON canvas_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own canvas"
  ON canvas_state FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Supabase Storage policies (in Supabase dashboard)
-- Bucket: user-recipes (private)
-- Policy: Users can upload files to their own folder
-- Policy: Users can read files from their own folder
-- Policy: Users can delete files from their own folder
```

### 2.2 Data Models (TypeScript)

```typescript
// src/types/cookbook.ts

import { Database } from '@/types/database.types'; // Generated from Supabase

/**
 * User recipe metadata stored in Supabase
 */
export interface UserRecipe {
  id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  prep_time?: string; // ISO 8601: "PT15M"
  cook_time?: string;
  total_time?: string;
  yield?: string;
  tags?: string[];
  metadata: Record<string, any>; // Full frontmatter
  created_at: string;
  updated_at: string;
}

/**
 * Canvas state persisted in Supabase
 */
export interface CanvasState {
  id: string;
  user_id: string;
  tldraw_document: TLDrawDocument;
  viewport_x: number;
  viewport_y: number;
  viewport_zoom: number;
  last_updated: string;
}

/**
 * TLDraw document structure
 */
export interface TLDrawDocument {
  version: number;
  pages: Record<string, TLDrawPage>;
  pageStates: Record<string, TLDrawPageState>;
  shapes: Record<string, TLDrawShape>;
  bindings: Record<string, TLDrawBinding>;
  assets: Record<string, TLDrawAsset>;
}

/**
 * Custom Recipe Card shape for TLDraw
 */
export interface TLDrawRecipeCardShape extends TLDrawShape {
  type: 'recipe-card';
  props: {
    recipeSlug: string; // slug or "{userId}/{filename}"
    recipeType: 'main' | 'user';
    isExpanded: boolean;
    showMetadata: boolean;
    width: number;
    height: number;
    cardContent?: RecipeData; // Cache recipe data
  };
}

/**
 * Recipe data (main library or user uploaded)
 */
export interface RecipeData {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  yield?: string;
  tags?: string[];
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  markdown?: string; // Full markdown content
}

export interface RecipeIngredient {
  amount: string;
  unit: string;
  ingredient: string;
  notes?: string;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
  time?: string;
  temperature?: string;
}

/**
 * File upload form data
 */
export interface RecipeUploadForm {
  file: File;
  preview?: RecipeData;
  error?: string;
}

/**
 * API response types
 */
export interface CanvasSaveResponse {
  success: boolean;
  lastUpdated: string;
  error?: string;
}

export interface RecipeUploadResponse {
  success: boolean;
  recipeId?: string;
  filename?: string;
  error?: string;
}

export interface CanvasLoadResponse {
  success: boolean;
  canvas?: CanvasState;
  error?: string;
}
```

### 2.3 Database Seeding & Initialization

```typescript
// scripts/initialize-cookbook-schema.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function initializeSchema() {
  try {
    // Execute SQL file with schema
    const { error } = await supabase.rpc('execute_sql', {
      sql: fs.readFileSync('./scripts/schema.sql', 'utf-8')
    });

    if (error) throw error;
    console.log('✅ Schema initialized successfully');

    // Set up Storage policies
    await setupStoragePolicies();
    console.log('✅ Storage policies configured');

  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
    process.exit(1);
  }
}

async function setupStoragePolicies() {
  // Configure Supabase Storage bucket policies via dashboard or API
  // Bucket: "user-recipes" (private)
  // Allow: Users can upload to /user-recipes/{auth.uid()}/
  // Allow: Users can read from /user-recipes/{auth.uid()}/
  // Allow: Users can delete from /user-recipes/{auth.uid()}/
}

initializeSchema();
```

---

## 3. Frontend Implementation

### 3.1 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── signup/
│   │   │   └── page.tsx           # Sign up form
│   │   ├── signin/
│   │   │   └── page.tsx           # Sign in form
│   │   └── signout/
│   │       └── route.ts           # Sign out endpoint
│   ├── cookbook/
│   │   ├── page.tsx               # Main canvas page
│   │   ├── layout.tsx             # Protected layout
│   │   └── error.tsx              # Error boundary
│   └── api/
│       ├── canvas/
│       │   ├── save/route.ts       # POST save canvas
│       │   ├── load/route.ts       # GET load canvas
│       │   └── export/route.ts     # POST export canvas
│       └── recipes/
│           ├── upload/route.ts     # POST upload recipe
│           ├── user/route.ts       # GET user recipes
│           └── user/[id]/route.ts  # DELETE recipe
├── components/
│   ├── cookbook/
│   │   ├── CookbookCanvas.tsx      # Main canvas component
│   │   ├── RecipeCard.tsx          # Card renderer
│   │   ├── RecipeSelector.tsx      # Sidebar with search/filter
│   │   ├── RecipeUpload.tsx        # Drag & drop upload
│   │   ├── CanvasToolbar.tsx       # Export, undo/redo
│   │   └── DrawingToolbar.tsx      # Drawing tool picker
│   ├── auth/
│   │   ├── SignUpForm.tsx
│   │   ├── SignInForm.tsx
│   │   └── AuthGuard.tsx           # Route protection
│   └── ui/
│       ├── Modal.tsx
│       ├── Toast.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── canvas-persistence.ts       # Save/load logic
│   ├── recipe-parser.ts            # Markdown parsing
│   ├── recipe-upload.ts            # Upload validation
│   └── tldraw-shapes.ts            # Custom TLDraw shapes
├── types/
│   ├── cookbook.ts                 # Cookbook types
│   ├── database.types.ts           # Generated from Supabase
│   └── tldraw.ts                   # TLDraw extensions
├── middleware.ts                   # Auth middleware
└── env.example                     # Environment variables
```

### 3.2 Authentication Implementation

#### 3.2.1 Auth Middleware

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session
  await supabase.auth.getSession();

  // Protect /cookbook route
  if (request.nextUrl.pathname.startsWith('/cookbook')) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Redirect to sign in
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/cookbook/:path*', '/api/canvas/:path*', '/api/recipes/:path*'],
};
```

#### 3.2.2 Auth Pages

```typescript
// src/app/auth/signup/page.tsx
'use client';

import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Email and password required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Show success message or redirect to email verification
      router.push('/auth/verify-email');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### 3.3 Canvas Component

#### 3.3.1 Main Canvas Component

```typescript
// src/components/cookbook/CookbookCanvas.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Tldraw, TldrawUiMenuGroup } from 'tldraw';
import 'tldraw/tldraw.css';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@supabase/auth-helpers-react';
import { RecipeSelector } from './RecipeSelector';
import { RecipeUpload } from './RecipeUpload';
import { CanvasToolbar } from './CanvasToolbar';
import { RecipeCard } from './RecipeCard';
import { useCanvasPersistence } from '@/lib/canvas-persistence';
import Toast from '@/components/ui/Toast';

export function CookbookCanvas() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [canvas, setCanvas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const tldrawRef = useRef(null);
  const { saveCanvas, loadCanvas } = useCanvasPersistence(supabase, user?.id);

  // Load canvas on mount
  useEffect(() => {
    async function initialize() {
      try {
        if (!user?.id) return;

        const canvasState = await loadCanvas();
        setCanvas(canvasState);
      } catch (err) {
        console.error('Failed to load canvas:', err);
        setError('Failed to load canvas');
        setToast({ message: 'Failed to load your canvas', type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [user?.id, loadCanvas]);

  // Handle canvas changes with debounce
  const handleCanvasChange = useCallback(
    async (editor: any) => {
      try {
        const document = editor.getDocument();
        await saveCanvas(document);
      } catch (err) {
        console.error('Failed to save canvas:', err);
        setToast({ message: 'Failed to save canvas', type: 'error' });
      }
    },
    [saveCanvas]
  );

  // Handle recipe added to canvas
  const handleAddRecipe = useCallback((recipeSlug: string, recipeType: 'main' | 'user') => {
    if (!tldrawRef.current) return;

    const editor = tldrawRef.current;
    const viewport = editor.getViewportPageBounds();

    // Create recipe card shape at center of viewport
    const cardId = editor.createShape({
      type: 'recipe-card',
      x: viewport.x + viewport.w / 2 - 150,
      y: viewport.y + viewport.h / 2 - 200,
      props: {
        recipeSlug,
        recipeType,
        isExpanded: false,
        showMetadata: true,
        width: 300,
        height: 400,
      },
    });

    editor.setSelectedShapes([cardId]);
    setToast({ message: 'Recipe added to canvas', type: 'success' });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your cookbook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4">Your Recipes</h2>
            <RecipeUpload onUploadSuccess={() => setToast({ message: 'Recipe uploaded!', type: 'success' })} />
          </div>
          <RecipeSelector onRecipeSelect={handleAddRecipe} />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        <CanvasToolbar />
        <div className="flex-1">
          <Tldraw
            ref={tldrawRef}
            onMount={(editor) => {
              // Load initial canvas state
              if (canvas) {
                editor.loadSnapshot(canvas);
              }
            }}
            onChange={handleCanvasChange}
            // Custom shapes
            shapeUtils={[RecipeCard]}
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
```

#### 3.3.2 Recipe Card Shape (TLDraw Custom Shape)

```typescript
// src/lib/tldraw-shapes.ts
import {
  BaseBoxShapeUtil,
  SVGContainer,
  TLBaseShape,
  Geometry2d,
  Box2d,
  HTMLContainer,
} from 'tldraw';
import { ReactNode } from 'react';

export type RecipeCardShape = TLBaseShape<
  'recipe-card',
  {
    recipeSlug: string;
    recipeType: 'main' | 'user';
    isExpanded: boolean;
    showMetadata: boolean;
    width: number;
    height: number;
  }
>;

export class RecipeCardUtil extends BaseBoxShapeUtil<RecipeCardShape> {
  static override type = 'recipe-card' as const;

  override getDefaultProps(): RecipeCardShape['props'] {
    return {
      recipeSlug: '',
      recipeType: 'main',
      isExpanded: false,
      showMetadata: true,
      width: 300,
      height: 400,
    };
  }

  override getGeometry(shape: RecipeCardShape): Geometry2d {
    return new Box2d({
      width: shape.props.width,
      height: shape.props.height,
    });
  }

  override component(shape: RecipeCardShape) {
    return (
      <HTMLContainer id={shape.id}>
        <RecipeCardComponent shape={shape} />
      </HTMLContainer>
    );
  }

  override indicator(shape: RecipeCardShape) {
    return (
      <rect
        width={shape.props.width}
        height={shape.props.height}
        className="fill-none stroke-blue-500 stroke-2"
      />
    );
  }

  // Allow resizing
  override canResize() {
    return true;
  }

  // Handle resize
  override onResizeEnd(shape: RecipeCardShape) {
    return shape;
  }
}

// Recipe card renderer component
function RecipeCardComponent({ shape }: { shape: RecipeCardShape }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recipe data
    loadRecipe(shape.props.recipeSlug, shape.props.recipeType).then(setRecipe);
    setLoading(false);
  }, [shape.props.recipeSlug, shape.props.recipeType]);

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col"
      style={{ width: shape.props.width, height: shape.props.height }}
    >
      {/* Card header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 border-b border-gray-200">
        <h3 className="font-bold text-sm truncate">{recipe?.title || 'Loading...'}</h3>
        {shape.props.recipeType === 'user' && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded mt-1 inline-block">
            My Recipe
          </span>
        )}
      </div>

      {/* Compact view */}
      {!shape.props.isExpanded && (
        <div className="p-4 space-y-2">
          {shape.props.showMetadata && recipe && (
            <>
              {recipe.prepTime && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>⏱️</span>
                  <span>{recipe.prepTime}</span>
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>🔥</span>
                  <span>{recipe.cookTime}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-medium ${
                      recipe.difficulty === 'Easy'
                        ? 'bg-green-500'
                        : recipe.difficulty === 'Medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {recipe.difficulty}
                  </span>
                </div>
              )}
              {recipe.yield && (
                <div className="text-xs text-gray-600">Yields: {recipe.yield}</div>
              )}
            </>
          )}
        </div>
      )}

      {/* Full view (expanded) */}
      {shape.props.isExpanded && recipe && (
        <div className="flex-1 overflow-y-auto p-4 text-xs space-y-3">
          {/* Metadata */}
          <div className="space-y-1 pb-3 border-b border-gray-100">
            {recipe.prepTime && <div>Prep: {recipe.prepTime}</div>}
            {recipe.cookTime && <div>Cook: {recipe.cookTime}</div>}
            {recipe.difficulty && <div>Level: {recipe.difficulty}</div>}
            {recipe.yield && <div>Yield: {recipe.yield}</div>}
          </div>

          {/* Ingredients */}
          {recipe.ingredients && (
            <div>
              <h4 className="font-bold mb-2">Ingredients</h4>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    {ing.amount} {ing.unit} {ing.ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions && (
            <div>
              <h4 className="font-bold mb-2">Instructions</h4>
              <ol className="space-y-1 list-decimal list-inside">
                {recipe.instructions.map((instr, i) => (
                  <li key={i} className="text-xs">{instr.instruction}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Footer with actions */}
      <div className="border-t border-gray-200 p-2 flex gap-2">
        <button className="flex-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
          {shape.props.isExpanded ? 'Collapse' : 'Expand'}
        </button>
        <button className="flex-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">
          Delete
        </button>
      </div>
    </div>
  );
}
```

---

## 4. API Endpoints Implementation

### 4.1 Canvas Save Endpoint

```typescript
// src/app/api/canvas/save/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { tldraw_document, viewport_x, viewport_y, viewport_zoom } = body;

    if (!tldraw_document) {
      return NextResponse.json(
        { error: 'Missing tldraw_document' },
        { status: 400 }
      );
    }

    // UPSERT canvas state (RLS will enforce user isolation)
    const { data, error } = await supabase
      .from('canvas_state')
      .upsert(
        {
          user_id: user.id,
          tldraw_document,
          viewport_x: viewport_x || 0,
          viewport_y: viewport_y || 0,
          viewport_zoom: viewport_zoom || 1,
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Canvas save error:', error);
      return NextResponse.json(
        { error: 'Failed to save canvas' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lastUpdated: data.last_updated,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4.2 Canvas Load Endpoint

```typescript
// src/app/api/canvas/load/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query user's canvas state (RLS will enforce user isolation)
    const { data, error } = await supabase
      .from('canvas_state')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (acceptable for new users)
      console.error('Canvas load error:', error);
      return NextResponse.json(
        { error: 'Failed to load canvas' },
        { status: 500 }
      );
    }

    // Return empty canvas for new users
    const canvas = data || {
      user_id: user.id,
      tldraw_document: {
        version: 1,
        pages: {},
        pageStates: {},
        shapes: {},
        bindings: {},
        assets: {},
      },
      viewport_x: 0,
      viewport_y: 0,
      viewport_zoom: 1,
    };

    return NextResponse.json({
      success: true,
      canvas,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4.3 Recipe Upload Endpoint

```typescript
// src/app/api/recipes/upload/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import matter from 'gray-matter';

// File upload limits
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ALLOWED_MIME_TYPES = ['text/markdown', 'text/plain'];

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting check (simple approach: count uploads in last hour)
    const { count } = await supabase
      .from('user_recipes')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());

    if (count && count >= 10) {
      return NextResponse.json(
        { error: 'Upload limit exceeded. Max 10 per hour.' },
        { status: 429 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Only .md files accepted' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds 500KB limit (${(file.size / 1024).toFixed(2)}KB)` },
        { status: 400 }
      );
    }

    // Read and parse file
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);
    const { data: frontmatter, content } = matter(text);

    // Validate required frontmatter fields
    const requiredFields = ['title', 'description', 'category'];
    const missingFields = requiredFields.filter((field) => !frontmatter[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Validate ingredients and instructions exist
    if (
      !content.toLowerCase().includes('## ingredients') ||
      !content.toLowerCase().includes('## instructions')
    ) {
      return NextResponse.json(
        {
          error: 'Recipe must include "## Ingredients" and "## Instructions" sections',
        },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage
    const storagePath = `user-recipes/${user.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('user-recipes')
      .upload(storagePath, buffer, {
        contentType: 'text/markdown',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Save metadata to database (RLS enforces user isolation)
    const { data: recipe, error: dbError } = await supabase
      .from('user_recipes')
      .insert({
        user_id: user.id,
        filename: file.name,
        storage_path: storagePath,
        title: frontmatter.title,
        description: frontmatter.description,
        category: frontmatter.category,
        difficulty: frontmatter.difficulty,
        prep_time: frontmatter.prepTime,
        cook_time: frontmatter.cookTime,
        total_time: frontmatter.totalTime,
        yield: frontmatter.yield,
        tags: frontmatter.tags || [],
        metadata: {
          ...frontmatter,
          userUploaded: true,
          userId: user.id,
          uploadedAt: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Clean up uploaded file
      await supabase.storage.from('user-recipes').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to save recipe metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recipeId: recipe.id,
      filename: recipe.filename,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 5. Client-Side Utilities

### 5.1 Canvas Persistence Hook

```typescript
// src/lib/canvas-persistence.ts
import { useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { CanvasState } from '@/types/cookbook';

export function useCanvasPersistence(
  supabase: SupabaseClient,
  userId?: string
) {
  const saveCanvas = useCallback(
    async (tldrawDocument: any, viewport?: any) => {
      if (!userId) throw new Error('User not authenticated');

      const response = await fetch('/api/canvas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tldraw_document: tldrawDocument,
          viewport_x: viewport?.x || 0,
          viewport_y: viewport?.y || 0,
          viewport_zoom: viewport?.zoom || 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save canvas');
      }

      return response.json();
    },
    [userId]
  );

  const loadCanvas = useCallback(async (): Promise<CanvasState | null> => {
    if (!userId) throw new Error('User not authenticated');

    const response = await fetch('/api/canvas/load', {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to load canvas');
    }

    const { canvas } = await response.json();
    return canvas;
  }, [userId]);

  return { saveCanvas, loadCanvas };
}
```

### 5.2 Recipe Parser

```typescript
// src/lib/recipe-parser.ts
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { RecipeData } from '@/types/cookbook';

export async function parseRecipeMarkdown(
  markdown: string
): Promise<RecipeData> {
  const { data: frontmatter, content } = matter(markdown);

  // Parse markdown content for ingredients and instructions
  const ingredients: any[] = [];
  const instructions: any[] = [];

  const lines = content.split('\n');
  let section = '';
  let stepNum = 1;

  for (const line of lines) {
    if (line.startsWith('## Ingredients')) {
      section = 'ingredients';
      continue;
    }
    if (line.startsWith('## Instructions')) {
      section = 'instructions';
      stepNum = 1;
      continue;
    }
    if (line.startsWith('##')) {
      section = '';
      continue;
    }

    if (section === 'ingredients' && line.startsWith('- ')) {
      ingredients.push({
        amount: '',
        unit: '',
        ingredient: line.slice(2),
        notes: '',
      });
    }

    if (section === 'instructions' && line.startsWith('- ')) {
      instructions.push({
        step: stepNum++,
        instruction: line.slice(2),
      });
    }
  }

  return {
    slug: frontmatter.slug || generateSlug(frontmatter.title),
    title: frontmatter.title,
    description: frontmatter.description,
    category: frontmatter.category,
    difficulty: frontmatter.difficulty,
    prepTime: frontmatter.prepTime,
    cookTime: frontmatter.cookTime,
    totalTime: frontmatter.totalTime,
    yield: frontmatter.yield,
    tags: frontmatter.tags || [],
    ingredients,
    instructions,
    markdown: content,
  };
}

export async function renderRecipeMarkdown(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

---

## 6. Performance Optimizations

### 6.1 Canvas Virtualization

```typescript
// src/lib/canvas-virtualization.ts
import { Viewport } from 'tldraw';

export function filterVisibleShapes(
  shapes: any[],
  viewport: Viewport,
  padding: number = 100
): any[] {
  const visibleBounds = {
    x: viewport.x - padding,
    y: viewport.y - padding,
    w: viewport.w + padding * 2,
    h: viewport.h + padding * 2,
  };

  return shapes.filter((shape) => {
    // Check if shape is within visible viewport
    return (
      shape.x < visibleBounds.x + visibleBounds.w &&
      shape.x + shape.props.width > visibleBounds.x &&
      shape.y < visibleBounds.y + visibleBounds.h &&
      shape.y + shape.props.height > visibleBounds.y
    );
  });
}
```

### 6.2 Debounced Save

```typescript
// src/lib/debounce-save.ts
export function createDebouncedSave(
  saveFunction: (doc: any) => Promise<void>,
  delayMs: number = 500
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (document: any) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      saveFunction(document).catch((error) => {
        console.error('Debounced save failed:', error);
      });
    }, delayMs);
  };
}
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

```typescript
// src/lib/__tests__/recipe-parser.test.ts
import { parseRecipeMarkdown } from '@/lib/recipe-parser';

describe('parseRecipeMarkdown', () => {
  it('should parse valid recipe markdown', async () => {
    const markdown = `---
title: "Chocolate Chip Cookies"
description: "Classic cookies"
category: "Desserts"
difficulty: "Easy"
prepTime: "PT15M"
cookTime: "PT12M"
totalTime: "PT27M"
yield: "24 cookies"
---

## Ingredients
- 2 cups flour
- 1 cup sugar

## Instructions
- Mix ingredients
- Bake at 350F
`;

    const recipe = await parseRecipeMarkdown(markdown);

    expect(recipe.title).toBe('Chocolate Chip Cookies');
    expect(recipe.ingredients).toHaveLength(2);
    expect(recipe.instructions).toHaveLength(2);
  });

  it('should handle missing optional fields', async () => {
    const markdown = `---
title: "Simple Recipe"
description: "A simple recipe"
category: "Main"
---

## Ingredients
- 1 egg

## Instructions
- Cook it
`;

    const recipe = await parseRecipeMarkdown(markdown);
    expect(recipe.difficulty).toBeUndefined();
  });
});
```

### 7.2 Integration Tests

```typescript
// src/app/api/canvas/__tests__/save.integration.test.ts
import { POST } from '@/app/api/canvas/save/route';
import { createServerClient } from '@supabase/ssr';

describe('Canvas Save API', () => {
  it('should save canvas for authenticated user', async () => {
    // Mock authenticated request
    const mockRequest = new Request('http://localhost:3000/api/canvas/save', {
      method: 'POST',
      body: JSON.stringify({
        tldraw_document: { version: 1, pages: {} },
      }),
    });

    const response = await POST(mockRequest);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should return 401 for unauthenticated request', async () => {
    const mockRequest = new Request('http://localhost:3000/api/canvas/save', {
      method: 'POST',
      body: JSON.stringify({
        tldraw_document: {},
      }),
    });

    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
  });
});
```

---

## 8. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# TLDraw (if using self-hosted)
NEXT_PUBLIC_TLDRAW_LICENSE_KEY=optional_license_key
```

---

## 9. Deployment Checklist

**Pre-Deployment:**
- [ ] All tests passing (unit + integration)
- [ ] Environment variables configured
- [ ] Supabase project created and schema deployed
- [ ] Storage bucket created with policies
- [ ] Auth configured (email/password)
- [ ] Database RLS policies verified
- [ ] Performance tested with 50+ recipes
- [ ] Mobile responsiveness verified
- [ ] Error handling comprehensive
- [ ] Logging configured

**Vercel Deployment:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel deploy --prod
```

---

## 10. Monitoring & Observability

### 10.1 Logging

```typescript
// src/lib/logger.ts
export const logger = {
  debug: (msg: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${msg}`, data);
    }
  },
  info: (msg: string, data?: any) => {
    console.log(`[INFO] ${msg}`, data);
  },
  error: (msg: string, error?: any) => {
    console.error(`[ERROR] ${msg}`, error);
    // Send to error tracking service
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry integration
    }
  },
};
```

### 10.2 Metrics

- Canvas load time
- Save operation latency
- File upload success rate
- API error rates
- Database query performance
- Storage usage per user

---

## 11. Security Considerations

### 11.1 Row Level Security (RLS)

- All policies enforce `auth.uid() = user_id`
- Users cannot access other users' recipes or canvas
- Database enforces at table level, not application level

### 11.2 File Upload Security

- File type validation (`.md` only)
- File size limits (500KB)
- Malware scanning via Supabase Storage
- Rate limiting (10 uploads/hour)
- Validation of markdown structure

### 11.3 Authentication Security

- Secure password requirements (8+ chars, enforced server-side)
- Session tokens stored in secure HTTP-only cookies
- CSRF protection via Supabase
- No credentials stored client-side

---

## 12. Future Considerations

### Scale-Up Scenarios
- If users exceed free tier limits, upgrade to Supabase Pro ($25/month)
- Implement caching layer (Redis) for frequently accessed recipes
- CDN for exported images
- Consider edge functions for real-time collaboration

### Feature Expansions
- WebSockets for real-time collaboration (Supabase Realtime)
- Offline mode with service workers
- AI recipe recommendations
- Mobile native app

---

**Document Status:** Ready for Development
**Last Updated:** 2025-10-21
**Next Steps:** Begin Phase 1 implementation, set up Supabase project
