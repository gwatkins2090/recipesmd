# Recipe Field Requirements & Guidelines

## Field Classification

### 🔴 REQUIRED FIELDS (Must have for ALL recipes)

#### `title` (string)
- **Purpose:** Recipe name displayed to users
- **Format:** Title case, no recipe numbers
- **Example:** `"Black Bottom Pie"` not `"Recipe #83: Black Bottom Pie"`
- **Validation:** Must be unique, 3-100 characters
- **Auto-generation:** Extract from filename or first heading

#### `slug` (string)
- **Purpose:** URL-friendly identifier
- **Format:** Lowercase, hyphens, no special characters
- **Example:** `"black-bottom-pie"`
- **Validation:** Must be unique, match pattern `^[a-z0-9-]+$`
- **Auto-generation:** From filename: `black_bottom_pie.md` → `black-bottom-pie`

#### `category` (string)
- **Purpose:** Primary classification for browsing/filtering
- **Format:** One of predefined categories
- **Allowed Values:**
  - `"Breakfast & Brunch"`
  - `"Appetizers & Snacks"`
  - `"Soups & Salads"`
  - `"Main Dishes"`
  - `"Side Dishes"`
  - `"Breads & Biscuits"`
  - `"Desserts"`
  - `"Beverages"`
  - `"Sauces & Condiments"`
- **Auto-generation:** Infer from title/ingredients
- **Fallback:** `"Main Dishes"` if uncertain

#### `difficulty` (string)
- **Purpose:** Skill level required
- **Format:** One of three values
- **Allowed Values:**
  - `"Easy"` - Simple recipes, few steps, common ingredients
  - `"Medium"` - Multiple steps, some technique required
  - `"Hard"` - Complex techniques, special equipment, precise timing
- **Auto-generation:** Based on instruction count and complexity
- **Guidelines:**
  - Easy: ≤5 steps, ≤30 min total time, no special techniques
  - Medium: 6-12 steps, 30-90 min, basic techniques
  - Hard: >12 steps, >90 min, advanced techniques

---

### 🟡 HIGHLY RECOMMENDED FIELDS (Should have for most recipes)

#### `description` (string)
- **Purpose:** Brief summary for search results and recipe cards
- **Format:** 1-3 sentences, 50-200 characters
- **Example:** `"A classic Southern dessert featuring a rich chocolate custard layer topped with a light vanilla custard."`
- **Auto-generation:** Can use AI to generate from ingredients/instructions
- **Fallback:** First sentence of instructions or generic description

#### `prepTime` (string, ISO 8601 duration)
- **Purpose:** Time to prepare ingredients before cooking
- **Format:** `PT[hours]H[minutes]M`
- **Examples:**
  - `"PT15M"` = 15 minutes
  - `"PT1H"` = 1 hour
  - `"PT1H30M"` = 1 hour 30 minutes
- **Auto-generation:** Extract from text or estimate from complexity
- **Validation:** Must match pattern `^PT(\d+H)?(\d+M)?$`

#### `cookTime` (string, ISO 8601 duration)
- **Purpose:** Active cooking/baking time
- **Format:** Same as prepTime
- **Example:** `"PT45M"`
- **Auto-generation:** Extract from instructions (look for "bake", "cook")
- **Note:** Does not include passive time (rising, chilling)

#### `totalTime` (string, ISO 8601 duration)
- **Purpose:** Total time from start to finish
- **Format:** Same as prepTime
- **Example:** `"PT3H"` (includes chilling time)
- **Auto-generation:** Can calculate from prepTime + cookTime + passive time
- **Note:** Include all passive time (chilling, rising, marinating)

#### `yield` (string)
- **Purpose:** How much the recipe makes
- **Format:** Natural language with number
- **Examples:**
  - `"8 servings"`
  - `"1 (9-inch) pie"`
  - `"24 cookies"`
  - `"6-8 servings"`
- **Auto-generation:** Extract from text ("Makes X servings", "Serves X")
- **Fallback:** Estimate from recipe type (pie = 8 servings, cake = 12 servings)

#### `tags` (array of strings)
- **Purpose:** Searchable keywords for filtering
- **Format:** Lowercase, hyphenated, 3-20 tags per recipe
- **Examples:** `["pie", "dessert", "chocolate", "southern", "make-ahead"]`
- **Auto-generation:** Extract from:
  - Category (dessert, main-dish)
  - Ingredients (chocolate, chicken, beef)
  - Techniques (baked, fried, no-bake)
  - Characteristics (quick, easy, family-recipe)
  - Occasions (holiday, special-occasion)
- **Validation:** Each tag 2-30 characters, lowercase

---

### 🟢 OPTIONAL FIELDS (Add when available/relevant)

#### `author` (string)
- **Purpose:** Who created or contributed the recipe
- **Format:** Full name or attribution
- **Examples:** `"Grandma Betty"`, `"Barbara Miller"`, `"Family Recipe Collection"`
- **Auto-generation:** Extract from recipe text or metadata
- **Default:** `"Family Recipe Collection"` if unknown

#### `source` (string)
- **Purpose:** Where the recipe came from
- **Format:** Free text
- **Examples:** `"Recipe #83"`, `"Purple Parrot Restaurant"`, `"Southern Living Magazine"`
- **Auto-generation:** Extract from recipe notes or original filename

#### `cuisine` (string)
- **Purpose:** Type of cuisine
- **Format:** One of common cuisines
- **Examples:** `"Southern"`, `"Italian"`, `"Mexican"`, `"Asian"`, `"American"`
- **Auto-generation:** Infer from ingredients and recipe name
- **Default:** `"American"` for most family recipes

#### `generation` (string)
- **Purpose:** Which family generation the recipe is from
- **Format:** One of four values
- **Allowed Values:**
  - `"great-grandma"` - Very traditional, old-fashioned
  - `"grandma"` - Classic comfort foods
  - `"mom"` - Modern convenience
  - `"modern"` - Contemporary additions
- **Auto-generation:** Infer from recipe characteristics
- **Use:** Powers the Generation filter in the app

#### `dateAdded` (string, ISO 8601 date)
- **Purpose:** When recipe was added to collection
- **Format:** `YYYY-MM-DD`
- **Example:** `"2024-01-15"`
- **Auto-generation:** Use file creation date or current date
- **Default:** Current date during conversion

#### `image` (string)
- **Purpose:** Path to recipe photo
- **Format:** Relative path from public directory
- **Example:** `"/images/recipes/black-bottom-pie.jpg"`
- **Default:** Empty string or placeholder image
- **Note:** Can be added later as photos are taken

#### `equipment` (array of strings)
- **Purpose:** Special tools or equipment needed
- **Format:** Array of equipment names
- **Examples:** `["9-inch pie pan", "Electric mixer", "Double boiler"]`
- **Auto-generation:** Extract from instructions (look for equipment mentions)
- **When to include:** Only if special equipment is required

#### `notes` (string, multiline)
- **Purpose:** Additional information, tips, variations
- **Format:** Markdown text, can be multiple paragraphs
- **Examples:** Storage instructions, make-ahead tips, substitutions
- **Auto-generation:** Extract from recipe notes sections
- **Use:** Display in Notes section of recipe

#### `keywords` (string)
- **Purpose:** SEO keywords for search engines
- **Format:** Comma-separated list
- **Example:** `"chocolate pie, custard pie, southern dessert"`
- **Auto-generation:** Combine title, tags, and key ingredients
- **Use:** Schema.org metadata for SEO

---

### 🔵 ADVANCED OPTIONAL FIELDS (For future enhancement)

#### `nutrition` (object)
- **Purpose:** Nutritional information per serving
- **Format:** Object with standard nutrition fields
- **Example:**
  ```yaml
  nutrition:
    servingSize: "1 slice"
    calories: "350"
    fatContent: "18g"
    carbohydrateContent: "42g"
    proteinContent: "6g"
  ```
- **Auto-generation:** Can use nutrition API or calculator
- **Note:** Optional, can be added later

#### `recipeYield` (string)
- **Purpose:** Schema.org compatible yield
- **Format:** Same as `yield` field
- **Use:** Duplicate of `yield` for Schema.org compatibility

#### `recipeCategory` (string)
- **Purpose:** Schema.org compatible category
- **Format:** Same as `category` field
- **Use:** Duplicate of `category` for Schema.org compatibility

#### `recipeCuisine` (string)
- **Purpose:** Schema.org compatible cuisine
- **Format:** Same as `cuisine` field
- **Use:** Duplicate of `cuisine` for Schema.org compatibility

#### `video` (string)
- **Purpose:** URL to recipe video
- **Format:** Full URL
- **Example:** `"https://youtube.com/watch?v=..."`
- **Default:** Empty string
- **Note:** For future video content

---

## Field Priority for Conversion Script

### Phase 1: Automated Conversion (Required + Highly Recommended)
1. ✅ `title` - Extract from heading
2. ✅ `slug` - Generate from filename
3. ✅ `category` - Infer from content
4. ✅ `difficulty` - Infer from complexity
5. ✅ `description` - Generate or extract
6. ✅ `prepTime` - Extract or estimate
7. ✅ `cookTime` - Extract or estimate
8. ✅ `totalTime` - Calculate or estimate
9. ✅ `yield` - Extract or estimate
10. ✅ `tags` - Auto-generate from content

### Phase 2: Manual Enhancement (Optional fields)
1. ⚠️ `author` - Add if known
2. ⚠️ `source` - Preserve from original
3. ⚠️ `cuisine` - Verify auto-inference
4. ⚠️ `generation` - Verify auto-inference
5. ⚠️ `image` - Add photos over time
6. ⚠️ `equipment` - Review and add
7. ⚠️ `notes` - Enhance with tips

### Phase 3: Future Enhancement (Advanced fields)
1. 🔮 `nutrition` - Calculate or use API
2. 🔮 `video` - Create video content
3. 🔮 Schema.org duplicates - For SEO

---

## Validation Rules

### Required Field Validation
```javascript
const requiredFields = ['title', 'slug', 'category', 'difficulty'];

function validateRequired(recipe) {
  const missing = requiredFields.filter(field => !recipe[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}
```

### Category Validation
```javascript
const validCategories = [
  'Breakfast & Brunch',
  'Appetizers & Snacks',
  'Soups & Salads',
  'Main Dishes',
  'Side Dishes',
  'Breads & Biscuits',
  'Desserts',
  'Beverages',
  'Sauces & Condiments'
];

function validateCategory(category) {
  if (!validCategories.includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }
}
```

### Difficulty Validation
```javascript
const validDifficulties = ['Easy', 'Medium', 'Hard'];

function validateDifficulty(difficulty) {
  if (!validDifficulties.includes(difficulty)) {
    throw new Error(`Invalid difficulty: ${difficulty}`);
  }
}
```

### Time Format Validation
```javascript
const timePattern = /^PT(\d+H)?(\d+M)?$/;

function validateTime(time) {
  if (time && !timePattern.test(time)) {
    throw new Error(`Invalid time format: ${time}. Use ISO 8601 (e.g., PT1H30M)`);
  }
}
```

