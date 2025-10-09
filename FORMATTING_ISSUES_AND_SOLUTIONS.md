# Formatting Issues Found & Solutions

## Specific Issues Identified in Example Recipes

### 1. **Inconsistent Title Formatting**

**Issues Found:**
- `## Recipe #83: Black Bottom Pie` - Has recipe number prefix
- `## 42. Tuna Casserole` - Has simple number prefix
- `## Recipe #100: Red Velvet Cake` - Has recipe number prefix
- `## Recipe #111: Lola's Southern Buttermilk Pie` - Has recipe number + author on separate line

**Solution:**
- Remove all recipe numbers from titles
- Store recipe number in YAML frontmatter if needed: `recipeNumber: 83`
- Move author attribution to YAML frontmatter: `author: "Barbara Miller"`
- Clean title becomes: `title: "Black Bottom Pie"`

**Regex Pattern for Extraction:**
```javascript
// Remove "Recipe #XX:" or "XX." prefix
title = title.replace(/^Recipe #\d+:\s*/, '').replace(/^\d+\.\s*/, '').trim();
```

---

### 2. **Inconsistent Section Headers**

**Issues Found:**
- `**Ingredients:**` (bold) - 2 files
- `### Ingredients:` (H3 heading) - 2 files  
- `#### Ingredients:` (H4 heading) - 1 file
- `### Directions:` vs `### Instructions:` vs `**Instructions:**`

**Solution:**
- Standardize ALL section headers to H2 (`##`)
- Use consistent naming:
  - `## Ingredients` (no colon)
  - `## Instructions` (not "Directions")
  - `## Notes`
  - `## Variations`
- For multi-component recipes, use H3 for subsections:
  - `### For the Cake`
  - `### For the Icing`

**Conversion Logic:**
```javascript
content = content.replace(/\*\*Ingredients:\*\*/g, '## Ingredients');
content = content.replace(/###\s*Ingredients:/g, '## Ingredients');
content = content.replace(/####\s*Ingredients:/g, '### Ingredients');
content = content.replace(/\*\*Instructions:\*\*/g, '## Instructions');
content = content.replace(/###\s*(Instructions|Directions):/g, '## Instructions');
```

---

### 3. **Inconsistent Instruction Formatting**

**Issues Found:**

**black_bottom_pie.md** - Good numbered list:
```markdown
1. Scald milk. Mix 3/4 cups of sugar and flour thoroughly.
2. Beat egg yolks until lemon colored.
```

**blueberry_pound_cake.md** - Paragraph blocks (hard to follow):
```markdown
Allow butter and eggs to stand at room temperature for 30 minutes.

In a large bowl, sift together the flour, baking powder and salt.
```

**red_velvet_cake.md** - Run-on paragraph:
```markdown
Cream shortening & sugar. One at a time add food color, then vanilla, eggs. Mix well.
```

**tuna_casserole.md** - Minimal/incomplete:
```markdown
Bake at 385° 15 min
```

**Solution:**
- Convert ALL instructions to numbered lists
- Split run-on paragraphs into discrete steps
- Each step should be ONE action or closely related actions
- Include temperatures, times, and visual cues
- Expand minimal instructions with standard cooking details

**Conversion Logic:**
```javascript
// Split paragraph instructions into sentences
const sentences = instructionText.split(/\.\s+/);
const steps = sentences.map((sentence, index) => {
  return `${index + 1}. ${sentence.trim()}.`;
});
```

---

### 4. **Incomplete or Vague Ingredient Quantities**

**Issues Found:**

**tuna_casserole.md:**
- `1 cheddar cheese soup` - Missing "can" or size
- `tuna` - No quantity specified
- `cooked noodles` - No quantity specified
- `1 little can pimento` - Vague size

**Solution:**
- Flag incomplete quantities for manual review
- Add standard sizes where obvious:
  - `1 can (10.5 oz) cheddar cheese soup`
  - `1 can (5 oz) tuna, drained`
  - `8 oz egg noodles, cooked`
  - `1 small can (2 oz) pimento`
- Create a review list for recipes needing quantity clarification

---

### 5. **Inconsistent Temperature and Time Formats**

**Issues Found:**
- `350 degrees` vs `350°` vs `350 degrees oven` vs `325 degrees oven`
- `30-45 minutes` vs `60-75 minutes` vs `15 min`
- `Bake 350 - 30 minutes` (unclear format)

**Solution:**
- Standardize to: `350°F` (or `175°C` for metric)
- Standardize time to: `30-45 minutes` or `30 minutes`
- Always include unit: `minutes` not `min`
- Format: `Bake at 350°F for 30 minutes`

**Conversion Logic:**
```javascript
// Standardize temperature
text = text.replace(/(\d+)\s*degrees?/gi, '$1°F');
text = text.replace(/(\d+)°(?!\s*[FC])/g, '$1°F');

// Standardize time
text = text.replace(/\b(\d+)\s*min\b/gi, '$1 minutes');
```

---

### 6. **Missing Metadata That Can Be Inferred**

**Issues Found:**

**lolas_southern_buttermilk_pie.md** - Has metadata in text:
```markdown
### Cook time: 45 Min | Prep time: 5 Min | Serves: 8
```

**blueberry_pound_cake.md** - Has yield at end:
```markdown
Makes 10-12 servings.
```

**Others** - No metadata at all

**Solution:**
- Extract metadata from text when present
- Move to YAML frontmatter
- For recipes without metadata, use reasonable defaults or flag for review:
  - Simple recipes: `difficulty: "Easy"`
  - Casseroles: `difficulty: "Easy"`
  - Multi-step recipes: `difficulty: "Medium"`
  - Complex techniques: `difficulty: "Hard"`

**Extraction Patterns:**
```javascript
// Extract cook/prep time
const timeMatch = content.match(/Cook time:\s*(\d+)\s*Min.*Prep time:\s*(\d+)\s*Min/i);
if (timeMatch) {
  cookTime = `PT${timeMatch[1]}M`;
  prepTime = `PT${timeMatch[2]}M`;
}

// Extract servings
const servingsMatch = content.match(/Serves:\s*(\d+)/i) || 
                      content.match(/Makes\s+(\d+(?:-\d+)?)\s+servings/i);
```

---

### 7. **Notes and Variations Embedded in Instructions**

**Issues Found:**

**black_bottom_pie.md** - Note at end:
```markdown
**Note:** This is original recipe - I changed to - Add the 1 cup sugar...
```

**blueberry_pound_cake.md** - Personal note:
```markdown
Note by Strooney: Now, just in case you do not know what to do with it, eat a slice.
```

**lolas_southern_buttermilk_pie.md** - Serving suggestion in instructions:
```markdown
3. This pie is wonderful because it is just something you don't see...
```

**Solution:**
- Extract all notes to separate `## Notes` section
- Preserve personal notes and family comments (they add character!)
- Separate recipe variations into `## Variations` section
- Keep serving suggestions in notes

---

### 8. **Multi-Component Recipes**

**Issues Found:**

**red_velvet_cake.md** - Has cake + icing:
```markdown
### Icing for Red Velvet Cake

#### Ingredients:
...
#### Instructions:
...
```

**Solution:**
- Use H3 subsections under main sections:
```markdown
## Ingredients

### For the Cake
- cake ingredients

### For the Icing
- icing ingredients

## Instructions

### Make the Cake
1. Cake steps

### Make the Icing
1. Icing steps
```

---

### 9. **Inconsistent Ingredient List Formatting**

**Issues Found:**
- `1/2 c` vs `½ cup` vs `1/2 cup`
- `1 Tblsp` vs `1 tablespoon` vs `2 tablespoons`
- `1 tsp` vs `1 teaspoon` vs `1 tsp.`
- `1-1 oz.` vs `1 (1 oz.)` vs `1 oz`

**Solution:**
- Standardize fractions: Use Unicode fractions (½, ¼, ⅓) or decimals
- Standardize abbreviations:
  - `cup` (not `c`)
  - `tablespoon` or `Tbsp` (not `Tblsp`, `TBS`)
  - `teaspoon` or `tsp` (not `teasp`)
  - `ounce` or `oz` (not `oz.`)
- Standardize package sizes: `1 (10.5 oz) can` not `1-10 oz. can`

**Conversion Map:**
```javascript
const unitMap = {
  'c': 'cup',
  'teasp': 'tsp',
  'Tblsp': 'Tbsp',
  'TBS': 'Tbsp',
  'tablesp': 'Tbsp'
};
```

---

### 10. **Missing Recipe Categories**

**Issues Found:**
- No categories specified in any example
- Need to infer from recipe name and ingredients

**Solution:**
- Create category inference logic:
  - Contains "pie", "cake", "cookie" → `Desserts`
  - Contains "casserole", "tuna", "chicken" → `Main Dishes`
  - Contains "biscuit", "bread", "muffin" → `Breads & Biscuits`
- Flag uncertain categorizations for manual review

**Category Inference:**
```javascript
function inferCategory(title, ingredients) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('pie') || titleLower.includes('cake') || 
      titleLower.includes('cookie')) {
    return 'Desserts';
  }
  if (titleLower.includes('casserole') || titleLower.includes('bake')) {
    return 'Main Dishes';
  }
  if (titleLower.includes('biscuit') || titleLower.includes('bread')) {
    return 'Breads & Biscuits';
  }
  
  return 'NEEDS_REVIEW';
}
```

---

## Summary of Automated Fixes

### Can Be Automated (90%):
1. ✅ Remove recipe numbers from titles
2. ✅ Standardize section headers
3. ✅ Convert instructions to numbered lists
4. ✅ Standardize temperature/time formats
5. ✅ Extract metadata from text
6. ✅ Standardize ingredient abbreviations
7. ✅ Infer categories from content
8. ✅ Generate slugs from filenames
9. ✅ Add default tags based on content

### Needs Manual Review (10%):
1. ⚠️ Incomplete ingredient quantities
2. ⚠️ Vague instructions (e.g., "Bake at 385° 15 min")
3. ⚠️ Missing prep/cook times
4. ⚠️ Uncertain category assignments
5. ⚠️ Recipe descriptions (can use AI to generate drafts)
6. ⚠️ Difficulty level verification
7. ⚠️ Nutrition information (optional)

---

## Recommended Workflow

1. **Run automated conversion script** on all 115 recipes
2. **Generate review report** listing recipes needing manual attention
3. **Batch review** flagged recipes (estimated 10-15 recipes)
4. **Add descriptions** (can use AI assistance)
5. **Add photos** (optional, over time)
6. **Test in app** to verify parsing works correctly
7. **Commit to git** with detailed commit message

