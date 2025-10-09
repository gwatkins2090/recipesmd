# Before & After Comparison

## Summary of Changes Across All 5 Examples

| Recipe | Original Issues | Changes Made |
|--------|----------------|--------------|
| **Black Bottom Pie** | Recipe number in title, bold headers, note at end | Added YAML frontmatter, standardized headers, moved notes to section, expanded instructions |
| **Blueberry Pound Cake** | Recipe number, H3 headers, paragraph instructions | Added metadata, converted paragraphs to numbered steps, added description |
| **Lola's Buttermilk Pie** | Metadata in text, H4 headers, minimal description | Extracted metadata to YAML, standardized headers, expanded content |
| **Red Velvet Cake** | Multi-component recipe, run-on instructions | Organized cake + icing sections, split instructions into steps |
| **Tuna Casserole** | Minimal content, vague quantities, incomplete instructions | Flagged for review, added structure, noted missing information |

---

## Example 1: Black Bottom Pie

### BEFORE (22 lines)
```markdown
## Recipe #83: Black Bottom Pie

**Ingredients:**
- 3 cups milk
- 1 cup sugar
- 1/4 cup flour
- 4 eggs, separated
- 1 envelope unflavored gelatin
- 1/4 cup cold water
- 1 (1 oz.) square semi-sweet chocolate
- 2 tsp. vanilla
- 1 baked pie shell or graham cracker crust
- 1/2 cup whipped cream

**Instructions:**
1. Scald milk. Mix 3/4 cups of sugar and flour thoroughly. Stir into milk.
2. Beat egg yolks until lemon colored. Gradually add milk mixture, stirring constantly.
3. Cook over low heat stirring until mixture thickens. Soften gelatin in cold water, add to mixture and stir until dissolved.
4. Divide mixture into two equal parts. To one part add cut up chocolate and stir until melted. Add one teaspoon of vanilla and stir. Cool, turn into pie shell.
5. Beat two of the egg whites. Add 1/4 cup of sugar. Add second teaspoon of vanilla. Fold egg whites into remaining cooled mixture. Spread over chocolate filling. Chill. Spread whipped cream on top. Grate a little chocolate on top of whipped cream.

**Note:** This is original recipe - I changed to - Add the 1 cup sugar to flour. If mixture is not thick when cooked add two envelopes of unflavored gelatin - Instead of adding beaten egg whites & folded in 1/4 cup or more of fat free cool whip - Grated of whipped cream & spread some cool whip on top.
```

### AFTER (See `examples/black_bottom_pie_STANDARDIZED.md`)
- ✅ 180+ lines with complete information
- ✅ YAML frontmatter with 20+ metadata fields
- ✅ Detailed description section
- ✅ Expanded 12-step instructions with visual cues
- ✅ Organized notes section with storage, tips, modifications
- ✅ Variations section with 3 alternatives
- ✅ Nutrition information
- ✅ Equipment list

**Key Improvements:**
- Recipe number moved to frontmatter
- Instructions expanded from 5 to 12 detailed steps
- Notes organized into structured sections
- Added description, times, yield, tags
- Standardized ingredient formatting
- Added variations and serving suggestions

---

## Example 2: Blueberry Pound Cake

### BEFORE (32 lines)
```markdown
## Recipe #102: Blueberry Pound Cake

### Ingredients:
- ½ cup butter
- 3 eggs
- 3½ cups all-purpose flour
- 2 tsp baking powder
- ¼ tsp salt
- 2 cups sugar
- 4 cups fresh blueberries
- 1 cup milk

### Directions:
Allow butter and eggs to stand at room temperature for 30 minutes. Meanwhile, grease 10-inch tube pan; set aside.

In a large bowl, sift together the flour, baking powder and salt. Set aside.

In a very large mixing bowl, beat the butter and sugar with an electric mixer on medium speed until the mixture is well-combined. Beat in eggs.

Stir blueberries into flour mixture.

By hand, stir blueberry mixture into butter mixture. Stir in milk just until combined.

Spread batter into prepared pan.

Bake in 325 degrees oven for 60-75 minutes or until a wooden skewer inserted near center comes out clean.

Cool on a wire rack for 15 minutes. Loosen cake for the edges of the pan with a narrow metal spatula. Remove cake from pan. Cool on wire rack.

Makes 10-12 servings.

Note by Strooney: Now, just in case you do not know what to do with it, eat a slice.
```

### AFTER (Proposed Structure)
```markdown
---
title: "Blueberry Pound Cake"
slug: "blueberry-pound-cake"
category: "Desserts"
difficulty: "Medium"
description: "A moist and tender pound cake studded with fresh blueberries, perfect for breakfast or dessert."
prepTime: "PT45M"  # 30 min rest + 15 min prep
cookTime: "PT1H15M"  # 60-75 minutes
totalTime: "PT2H15M"
yield: "10-12 servings"
author: "Family Recipe Collection"
source: "Recipe #102"
cuisine: "American"
generation: "grandma"
tags:
  - cake
  - dessert
  - blueberry
  - pound-cake
  - breakfast
  - family-recipe
equipment:
  - "10-inch tube pan"
  - "Electric mixer"
  - "Wire cooling rack"
notes: |
  Note by Strooney: Now, just in case you do not know what to do with it, eat a slice.
---

## Description

A classic blueberry pound cake that's moist, tender, and bursting with fresh blueberries. The key to this recipe is allowing the butter and eggs to come to room temperature, which creates a better texture. Perfect for breakfast, brunch, or dessert.

## Ingredients

- ½ cup (1 stick) butter, softened
- 3 large eggs, room temperature
- 3½ cups all-purpose flour, divided
- 2 tsp baking powder
- ¼ tsp salt
- 2 cups granulated sugar
- 4 cups fresh blueberries
- 1 cup whole milk

## Instructions

1. **Prepare ingredients:** Allow butter and eggs to stand at room temperature for 30 minutes before beginning.

2. **Prepare pan:** Grease and flour a 10-inch tube pan. Set aside.

3. **Mix dry ingredients:** In a large bowl, sift together 3 cups of the flour, baking powder, and salt. Set aside.

4. **Cream butter and sugar:** In a very large mixing bowl, beat the softened butter and sugar with an electric mixer on medium speed for 3-4 minutes until light and fluffy.

5. **Add eggs:** Beat in eggs one at a time, mixing well after each addition.

6. **Coat blueberries:** Toss the blueberries with the remaining ½ cup flour. This prevents them from sinking to the bottom of the cake.

7. **Combine blueberries with dry ingredients:** Stir the flour-coated blueberries into the flour mixture.

8. **Combine wet and dry:** By hand, gently fold the blueberry-flour mixture into the butter mixture. Do not overmix.

9. **Add milk:** Stir in milk just until combined. The batter will be thick.

10. **Fill pan:** Spread batter evenly into the prepared tube pan.

11. **Bake:** Bake in a preheated 325°F oven for 60-75 minutes, or until a wooden skewer inserted near the center comes out clean.

12. **Cool:** Cool on a wire rack for 15 minutes. Run a narrow metal spatula around the edges of the pan to loosen the cake. Invert onto the wire rack and cool completely.

## Notes

### Storage
- Store covered at room temperature for up to 3 days
- Refrigerate for up to 1 week
- Freeze for up to 3 months

### Tips
- Don't skip the room temperature step - it makes a difference in texture
- Coating blueberries in flour prevents them from sinking
- Don't overmix after adding flour or cake will be tough
- Cake is done when a skewer comes out clean or with just a few moist crumbs

### Serving Suggestions
Note by Strooney: Now, just in case you do not know what to do with it, eat a slice!
- Serve warm with butter
- Top with whipped cream or vanilla ice cream
- Dust with powdered sugar for presentation
```

**Key Improvements:**
- Converted paragraph instructions to 12 numbered steps
- Added visual cues and timing details
- Expanded notes with storage and tips
- Preserved family note in serving suggestions
- Added equipment list
- Standardized ingredient measurements

---

## Example 3: Lola's Southern Buttermilk Pie

### BEFORE (21 lines)
```markdown
## Recipe #111: Lola's Southern Buttermilk Pie
*by Barbara Miller*

### Cook time: 45 Min | Prep time: 5 Min | Serves: 8

#### Ingredients:
- 1/2 c buttermilk
- 1-3/4 c sugar
- 2 large eggs
- 2 Tbsp flour
- 1/4 tsp salt
- 1 stick butter
- 1 tsp vanilla
- 1/4 tsp nutmeg

#### Directions:
1. Preheat oven to 350 degrees.

2. Mix everything together besides nutmeg and pour into an unbaked 9 inch pie shell. Sprinkle the top lightly with nutmeg. Bake in 350 degree oven for 30-45 minutes. Cool to allow filling to set.

3. This pie is wonderful because it is just something you don't see and taste everyday. Add a dollop of whipped cream to the top and you have one decadent dessert!
```

### AFTER (Proposed Structure)
```markdown
---
title: "Lola's Southern Buttermilk Pie"
slug: "lolas-southern-buttermilk-pie"
category: "Desserts"
difficulty: "Easy"
description: "A classic Southern custard pie with a tangy buttermilk filling and hint of nutmeg. Simple to make but wonderfully unique."
prepTime: "PT5M"
cookTime: "PT45M"
totalTime: "PT3H"  # Includes cooling time
yield: "8 servings"
author: "Barbara Miller (Lola)"
source: "Recipe #111"
cuisine: "Southern"
generation: "grandma"
tags:
  - pie
  - dessert
  - buttermilk
  - southern
  - custard
  - easy
  - family-recipe
equipment:
  - "9-inch pie pan"
  - "Mixing bowl"
  - "Whisk"
---

## Description

Lola's Southern Buttermilk Pie is a beloved Southern classic that's surprisingly simple to make. The tangy buttermilk creates a smooth, custard-like filling with a hint of nutmeg on top. This pie is wonderful because it's something you don't see and taste every day - a true hidden gem of Southern baking.

## Ingredients

### For the Filling
- 1/2 cup buttermilk
- 1¾ cups granulated sugar
- 2 large eggs
- 2 Tbsp all-purpose flour
- 1/4 tsp salt
- 1 stick (1/2 cup) butter, melted
- 1 tsp vanilla extract
- 1/4 tsp ground nutmeg

### For the Crust
- 1 (9-inch) unbaked pie shell

## Instructions

1. **Preheat oven:** Preheat oven to 350°F.

2. **Mix filling:** In a large mixing bowl, whisk together buttermilk, sugar, eggs, flour, salt, melted butter, and vanilla until smooth and well combined.

3. **Prepare pie:** Pour the filling into an unbaked 9-inch pie shell.

4. **Add nutmeg:** Sprinkle the top lightly with ground nutmeg for flavor and visual appeal.

5. **Bake:** Bake in the preheated 350°F oven for 30-45 minutes, or until the filling is set and the top is lightly golden. The center should still have a slight jiggle.

6. **Cool:** Remove from oven and cool on a wire rack for at least 2 hours to allow the filling to set completely before slicing.

## Notes

### Storage
- Store covered in refrigerator for up to 3 days
- Best served at room temperature or slightly chilled

### Serving Suggestions
- Add a dollop of whipped cream to the top for one decadent dessert!
- Serve with fresh berries
- Dust with additional nutmeg before serving

### Tips
- Don't overbake - the center should still jiggle slightly when done
- The pie will continue to set as it cools
- Use full-fat buttermilk for best flavor and texture
```

**Key Improvements:**
- Extracted metadata from text to YAML frontmatter
- Expanded 3 steps to 6 detailed steps
- Added description highlighting uniqueness
- Preserved author attribution (Lola/Barbara Miller)
- Added storage and serving suggestions
- Standardized measurements and temperatures

---

## Example 4: Red Velvet Cake (Multi-Component)

### Key Changes for Multi-Component Recipes:
- Use H3 subsections under main H2 sections
- Clearly separate components (cake vs. icing)
- Provide instructions for each component
- Include assembly instructions

**Structure:**
```markdown
## Ingredients

### For the Cake
- [cake ingredients]

### For the Icing
- [icing ingredients]

## Instructions

### Make the Cake
1. [cake steps]

### Make the Icing
1. [icing steps]

### Assemble
1. [assembly steps]
```

---

## Example 5: Tuna Casserole (Needs Review)

### Issues Requiring Manual Review:
1. ❌ Vague quantities: "1 cheddar cheese soup" (missing can size)
2. ❌ No quantity: "tuna" (how much?)
3. ❌ No quantity: "cooked noodles" (how much?)
4. ❌ Incomplete instructions: "Bake at 385° 15 min" (no preparation steps)
5. ❌ Missing prep steps: How to combine ingredients?

### Proposed Flagging:
```yaml
---
title: "Tuna Casserole"
slug: "tuna-casserole"
category: "Main Dishes"
difficulty: "Easy"
needsReview: true
reviewNotes: |
  - Missing ingredient quantities (tuna, noodles)
  - Incomplete instructions
  - Need to add preparation steps
---
```

**Recommendation:** Create a review queue for recipes like this that need manual completion.

