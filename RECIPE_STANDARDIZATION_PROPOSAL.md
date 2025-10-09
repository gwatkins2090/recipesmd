# Recipe Standardization Proposal

## Analysis of Current Format Issues

### Formatting Inconsistencies Found in Examples:

1. **Title Formats:**
   - `## Recipe #83: Black Bottom Pie` (with recipe number)
   - `## Recipe #102: Blueberry Pound Cake` (with recipe number)
   - `## 42. Tuna Casserole` (simple number)
   - `## Recipe #111: Lola's Southern Buttermilk Pie` (with author on next line)

2. **Section Headers:**
   - `**Ingredients:**` (bold) - black_bottom_pie.md, tuna_casserole.md
   - `### Ingredients:` (heading) - blueberry_pound_cake.md, red_velvet_cake.md
   - `#### Ingredients:` (sub-heading) - lolas_southern_buttermilk_pie.md

3. **Instruction Formats:**
   - Numbered lists (black_bottom_pie.md, lolas_southern_buttermilk_pie.md)
   - Paragraph blocks (blueberry_pound_cake.md, red_velvet_cake.md)
   - Minimal instructions (tuna_casserole.md)

4. **Missing Metadata:**
   - No prep/cook times (except lolas_southern_buttermilk_pie.md has it in text)
   - No servings/yield (except lolas_southern_buttermilk_pie.md and blueberry_pound_cake.md)
   - No difficulty levels
   - No categories/tags
   - No author attribution (except lolas_southern_buttermilk_pie.md)
   - Inconsistent temperature formats (350 degrees vs 350°)

5. **Special Cases:**
   - Multi-component recipes (red_velvet_cake.md has cake + icing)
   - Recipe variations in notes (black_bottom_pie.md)
   - Incomplete ingredient quantities (tuna_casserole.md: "1 cheddar cheese soup")
   - Personal notes (blueberry_pound_cake.md: "Note by Strooney")

---

## Proposed Standardized Format

### YAML Frontmatter Structure

```yaml
---
# REQUIRED FIELDS
title: "Recipe Name"
slug: "recipe-name"  # Auto-generated from filename
category: "Desserts"  # Main category
difficulty: "Medium"  # Easy, Medium, Hard

# HIGHLY RECOMMENDED FIELDS
description: "Brief 1-2 sentence description"
prepTime: "PT15M"  # ISO 8601 duration format
cookTime: "PT45M"
totalTime: "PT1H"
yield: "8 servings"  # or "1 9-inch pie" or "12 cookies"

# OPTIONAL BUT VALUABLE FIELDS
author: "Grandma Betty"
source: "Family Recipe Collection"
cuisine: "Southern"
generation: "grandma"  # great-grandma, grandma, mom, modern
dateAdded: "2024-01-15"

# TAGS (for filtering/search)
tags:
  - pie
  - dessert
  - chocolate
  - southern
  - family-recipe

# RECIPE METADATA
recipeYield: "8 servings"
recipeCategory: "Dessert"
recipeCuisine: "Southern"

# OPTIONAL ADVANCED FIELDS
image: "/images/recipes/black-bottom-pie.jpg"
video: ""
keywords: "chocolate pie, custard pie, southern dessert"
nutrition:
  servingSize: "1 slice"
  calories: "350"
  fatContent: "18g"
  carbohydrateContent: "42g"
  proteinContent: "6g"

# EQUIPMENT (if special tools needed)
equipment:
  - "9-inch pie pan"
  - "Double boiler"

# NOTES/VARIATIONS
notes: |
  Can be made ahead and refrigerated overnight.
  For a lighter version, use fat-free cool whip instead of whipped cream.
---
```

---

## Markdown Content Structure

```markdown
## Description

[Optional: 1-2 paragraph description of the dish, its history, or why it's special]

## Ingredients

### For the Main Recipe
- 3 cups whole milk
- 1 cup granulated sugar
- 1/4 cup all-purpose flour
- 4 large eggs, separated
- 1 envelope (2¼ tsp) unflavored gelatin
- 1/4 cup cold water
- 1 oz semi-sweet chocolate, chopped
- 2 tsp vanilla extract, divided
- 1 (9-inch) baked pie shell or graham cracker crust
- 1/2 cup heavy whipping cream, whipped

### For the [Component Name] (if multi-component recipe)
- Ingredient list for second component

## Instructions

1. First step with clear, specific instructions.
2. Second step with temperatures and times specified.
3. Continue with numbered steps.
4. Each step should be a single action or closely related actions.
5. Include visual cues (e.g., "until golden brown" or "until mixture thickens").

## Notes

- Storage instructions
- Make-ahead tips
- Substitution suggestions
- Recipe variations
- Personal family notes

## Variations

### [Variation Name]
- Changes to make for this variation

## Nutrition Information (Optional)

Per serving (1 slice):
- Calories: 350
- Total Fat: 18g
- Carbohydrates: 42g
- Protein: 6g
```

---

## Field Requirements

### REQUIRED (Must have for all recipes):
- `title` - Recipe name
- `slug` - URL-friendly identifier (auto-generated from filename)
- `category` - Main category (Breakfast, Lunch, Dinner, Dessert, Appetizer, Side Dish, etc.)
- `difficulty` - Easy, Medium, or Hard

### HIGHLY RECOMMENDED (Should have for most recipes):
- `description` - Brief summary
- `prepTime` - Preparation time in ISO 8601 format
- `cookTime` - Cooking time in ISO 8601 format
- `totalTime` - Total time (can be auto-calculated)
- `yield` - Number of servings or quantity produced
- `tags` - Array of searchable tags

### OPTIONAL (Add when available):
- `author` - Who created/contributed the recipe
- `source` - Where it came from
- `cuisine` - Type of cuisine
- `generation` - Family generation (great-grandma, grandma, mom, modern)
- `dateAdded` - When added to collection
- `image` - Path to recipe photo
- `equipment` - Special tools needed
- `nutrition` - Nutritional information
- `notes` - Additional notes/variations
- `keywords` - SEO keywords

---

## ISO 8601 Duration Format Guide

- `PT15M` = 15 minutes
- `PT1H` = 1 hour
- `PT1H30M` = 1 hour 30 minutes
- `PT45M` = 45 minutes
- `PT2H` = 2 hours

Format: `PT` (Period Time) + hours (`H`) + minutes (`M`)

---

## Category Taxonomy

**Main Categories:**
- Breakfast & Brunch
- Appetizers & Snacks
- Soups & Salads
- Main Dishes
- Side Dishes
- Breads & Biscuits
- Desserts
- Beverages
- Sauces & Condiments

**Subcategories (via tags):**
- Beef, Chicken, Pork, Seafood, Vegetarian
- Casseroles, Pies, Cakes, Cookies
- Southern, Italian, Mexican, Asian
- Holiday, Quick & Easy, Make-Ahead

---

## Benefits of This Format

1. **Schema.org Compatible** - Can easily export to JSON-LD for SEO
2. **Human Readable** - Easy to read and edit in any text editor
3. **Machine Parseable** - YAML frontmatter is easy to parse programmatically
4. **Flexible** - Optional fields don't clutter simple recipes
5. **Searchable** - Tags and metadata enable powerful filtering
6. **Future-Proof** - Can add new fields without breaking existing recipes
7. **Export-Friendly** - Can convert to JSON, HTML, PDF, recipe apps
8. **Git-Friendly** - Text-based format works well with version control

