# Quick Reference Guide - Standardized Recipe Format

## 📝 Template

Copy this template for creating new recipes or manual conversions:

```markdown
---
# REQUIRED FIELDS
title: "Recipe Name"
slug: "recipe-name"
category: "Desserts"
difficulty: "Medium"

# HIGHLY RECOMMENDED FIELDS
description: "Brief 1-2 sentence description of the dish"
prepTime: "PT15M"
cookTime: "PT45M"
totalTime: "PT1H"
yield: "8 servings"

# OPTIONAL FIELDS
author: "Grandma Betty"
source: "Family Recipe Collection"
cuisine: "Southern"
generation: "grandma"
dateAdded: "2024-01-15"

# TAGS
tags:
  - main-category
  - ingredient
  - technique
  - characteristic

# EQUIPMENT (if needed)
equipment:
  - "9-inch pie pan"
  - "Electric mixer"

# NOTES (if needed)
notes: |
  Any special notes, modifications, or family stories.
---

## Description

1-2 paragraphs describing the dish, its history, or why it's special.

## Ingredients

### For the Main Recipe
- Quantity unit ingredient, preparation
- 1 cup all-purpose flour, sifted
- 2 large eggs, beaten
- 1/2 cup butter, softened

### For the [Component] (if multi-part)
- Component ingredients

## Instructions

1. First step with clear, specific instructions including temperatures and times.
2. Second step with visual cues (e.g., "until golden brown").
3. Continue with numbered steps, one action per step.
4. Include timing and temperature details.
5. Add visual or sensory cues for doneness.

## Notes

### Storage
- How to store and for how long

### Make-Ahead Tips
- What can be prepared in advance

### Substitutions
- Alternative ingredients

### Tips
- Helpful hints for success

## Variations

### [Variation Name]
- Changes to make for this variation
```

---

## 🎯 Categories

Choose ONE primary category:

- **Breakfast & Brunch** - Pancakes, eggs, breakfast casseroles
- **Appetizers & Snacks** - Dips, finger foods, party snacks
- **Soups & Salads** - All soups, stews, and salads
- **Main Dishes** - Entrees, casseroles, main proteins
- **Side Dishes** - Vegetables, starches, accompaniments
- **Breads & Biscuits** - All baked breads, rolls, biscuits
- **Desserts** - Cakes, pies, cookies, sweet treats
- **Beverages** - Drinks, cocktails, smoothies
- **Sauces & Condiments** - Sauces, dressings, spreads

---

## 📊 Difficulty Levels

Choose ONE difficulty level:

### Easy
- ≤5 steps
- ≤30 minutes total time
- Common ingredients
- No special techniques
- Examples: Simple casseroles, basic cookies, quick breads

### Medium
- 6-12 steps
- 30-90 minutes total time
- Some technique required
- May need special equipment
- Examples: Layer cakes, yeast breads, custard pies

### Hard
- >12 steps
- >90 minutes total time
- Advanced techniques
- Special equipment needed
- Precise timing critical
- Examples: Soufflés, croissants, multi-component desserts

---

## ⏱️ Time Format (ISO 8601)

Format: `PT[hours]H[minutes]M`

### Common Examples:
- `PT5M` = 5 minutes
- `PT15M` = 15 minutes
- `PT30M` = 30 minutes
- `PT45M` = 45 minutes
- `PT1H` = 1 hour
- `PT1H15M` = 1 hour 15 minutes
- `PT1H30M` = 1 hour 30 minutes
- `PT2H` = 2 hours
- `PT2H30M` = 2 hours 30 minutes
- `PT3H` = 3 hours

### Time Types:
- **prepTime** - Active preparation (chopping, mixing, etc.)
- **cookTime** - Active cooking/baking time
- **totalTime** - Everything including passive time (rising, chilling, cooling)

---

## 🏷️ Tag Guidelines

Include 5-15 tags per recipe. Choose from these categories:

### Category Tags
- breakfast, lunch, dinner, dessert, snack, appetizer, side-dish

### Ingredient Tags
- chicken, beef, pork, seafood, vegetarian, chocolate, fruit, cheese

### Technique Tags
- baked, fried, grilled, no-bake, slow-cooker, instant-pot

### Characteristic Tags
- quick, easy, make-ahead, freezer-friendly, kid-friendly, holiday

### Cuisine Tags
- southern, italian, mexican, asian, american, french

### Special Tags
- family-recipe, traditional, vintage, modern, special-occasion

### Dietary Tags (if applicable)
- gluten-free, dairy-free, low-carb, vegetarian, vegan

---

## 📏 Measurement Standards

### Volume
- cup (not c)
- tablespoon or Tbsp (not Tblsp, TBS)
- teaspoon or tsp (not teasp)
- fluid ounce or fl oz

### Weight
- pound or lb
- ounce or oz (not oz.)
- gram or g

### Temperature
- 350°F (not 350 degrees, 350°)
- Include °F or °C

### Fractions
Use Unicode fractions when possible:
- ½ (not 1/2)
- ¼ (not 1/4)
- ¾ (not 3/4)
- ⅓ (not 1/3)
- ⅔ (not 2/3)

### Package Sizes
- 1 (10.5 oz) can (not 1-10 oz. can)
- 1 (8 oz) package (not 1-8 oz pkg)

---

## 👨‍👩‍👧‍👦 Generation Tags

Choose ONE generation tag:

- **great-grandma** - Very traditional, old-fashioned recipes
  - Examples: Angel biscuits, scripture cake, vintage desserts
  
- **grandma** - Classic comfort foods, traditional Southern
  - Examples: Casseroles, pies, classic cakes
  
- **mom** - Modern convenience, updated classics
  - Examples: Quick recipes, convenience ingredients
  
- **modern** - Contemporary additions, new discoveries
  - Examples: Recent favorites, trendy recipes

---

## 🍽️ Yield Formats

Be specific about what the recipe makes:

### Servings
- "8 servings"
- "6-8 servings"
- "12 servings"

### Quantity
- "1 (9-inch) pie"
- "24 cookies"
- "2 loaves"
- "1 (13x9-inch) pan"

### Volume
- "6 cups"
- "1 quart"

---

## 📸 Optional Fields Quick Reference

### Equipment
List only special or specific equipment:
```yaml
equipment:
  - "9-inch pie pan"
  - "Electric mixer"
  - "Candy thermometer"
```

### Notes
Use YAML multiline format:
```yaml
notes: |
  First line of notes.
  Second line of notes.
  Can include multiple paragraphs.
```

### Nutrition (Optional)
```yaml
nutrition:
  servingSize: "1 slice"
  calories: "350"
  fatContent: "18g"
  carbohydrateContent: "42g"
  proteinContent: "6g"
```

---

## ✅ Validation Checklist

Before saving a recipe, verify:

- [ ] Title is clean (no recipe numbers)
- [ ] Slug matches filename pattern
- [ ] Category is from approved list
- [ ] Difficulty is Easy/Medium/Hard
- [ ] Times are in ISO 8601 format (PT1H30M)
- [ ] Yield is specific and clear
- [ ] Tags are lowercase and relevant
- [ ] Ingredients have quantities and units
- [ ] Instructions are numbered steps
- [ ] Temperatures include °F
- [ ] Times include "minutes" or "hours"
- [ ] Section headers are H2 (##)
- [ ] Multi-component recipes use H3 (###) for subsections

---

## 🔄 Common Conversions

### From Old Format → New Format

| Old | New |
|-----|-----|
| `## Recipe #83: Title` | `title: "Title"` in frontmatter |
| `**Ingredients:**` | `## Ingredients` |
| `**Instructions:**` | `## Instructions` |
| `350 degrees` | `350°F` |
| `30 min` | `30 minutes` |
| `1/2 c` | `½ cup` |
| `1 tsp.` | `1 tsp` |
| Paragraph instructions | Numbered list |
| Notes at end | `## Notes` section |

---

## 💾 File Naming

- Use lowercase
- Use underscores for spaces
- Match slug but with underscores
- Example: `black_bottom_pie.md` → slug: `"black-bottom-pie"`

---

## 🎨 Markdown Formatting

### Headers
- H1 (`#`) - Not used (reserved for page title)
- H2 (`##`) - Main sections (Description, Ingredients, Instructions, Notes)
- H3 (`###`) - Subsections (For the Cake, For the Icing)
- H4 (`####`) - Rarely used

### Lists
- Use `-` for unordered lists (ingredients)
- Use `1.` for ordered lists (instructions)
- Indent with 2 spaces for nested lists

### Emphasis
- **Bold** for emphasis: `**bold**`
- *Italic* for terms: `*italic*`
- Don't overuse formatting

---

## 📞 Need Help?

Refer to these documents:
- **Full specification:** `RECIPE_STANDARDIZATION_PROPOSAL.md`
- **Field details:** `FIELD_REQUIREMENTS.md`
- **Examples:** `examples/black_bottom_pie_STANDARDIZED.md`
- **Issues & solutions:** `FORMATTING_ISSUES_AND_SOLUTIONS.md`

