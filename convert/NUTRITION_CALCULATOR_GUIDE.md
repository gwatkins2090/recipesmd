# USDA Nutrition Calculator Guide

## Quick Start

### 1. Get Your Free API Key

1. Visit: https://fdc.nal.usda.gov/api-guide.html
2. Click "Get an API Key"
3. Sign up (free)
4. Copy your API key

### 2. Set Up Environment Variable

**Windows (PowerShell):**
```powershell
$env:USDA_API_KEY="your_api_key_here"
```

**Windows (Command Prompt):**
```cmd
set USDA_API_KEY=your_api_key_here
```

**Mac/Linux:**
```bash
export USDA_API_KEY=your_api_key_here
```

**Or create a `.env` file:**
```
USDA_API_KEY=your_api_key_here
```

### 3. Run the Script

**Single Recipe:**
```bash
node add-nutrition.js chocolate_chess_pie.md
```

**All Recipes (takes time due to rate limiting):**
```bash
node add-nutrition.js --all
```

---

## How It Works

### Step 1: Parse Ingredients
```
"1 cup all-purpose flour"
↓
{
  quantity: 1,
  unit: "cup",
  ingredient: "all-purpose flour"
}
```

### Step 2: Map to USDA Database
```
"all-purpose flour" → "wheat flour, white, all-purpose"
"oleo" → "margarine"
"velveta" → "processed cheese"
```

### Step 3: Look Up Nutrition
```
API call to USDA FoodData Central
↓
Returns nutrition per 100g
```

### Step 4: Calculate for Recipe
```
Scale to actual quantity
↓
Sum all ingredients
↓
Divide by servings
```

---

## Ingredient Mappings

The script automatically maps common recipe ingredients to USDA database entries:

### Fats
- `oleo` → `margarine`
- `butter` → `butter, salted`
- `shortening` → `vegetable shortening`

### Dairy
- `velveta` / `velveeta` → `processed cheese`
- `cream cheese` → `cream cheese`
- `milk` → `whole milk`

### Proteins
- `chicken` → `chicken breast, raw`
- `beef` → `ground beef`
- `tuna` → `tuna, canned in water`
- `eggs` → `egg, whole, raw`

### Grains
- `flour` → `wheat flour, white, all-purpose`
- `sugar` → `sugar, granulated`
- `brown sugar` → `sugar, brown`
- `rice` → `rice, white, long-grain`

### Canned Goods
- `cream of mushroom soup` → `soup, cream of mushroom, canned`
- `rotel` → `tomatoes, canned, diced`

---

## Smart Features

### 1. Range Handling
```
"2-3 cups flour" → Uses median: 2.5 cups
```

### 2. Fraction Parsing
```
"1/2 cup" → 0.5 cup
"3/4 tsp" → 0.75 tsp
```

### 3. Unit Conversion
```
1 cup flour = 120g
1 tbsp butter = 14g
1 oz = 28.35g
```

### 4. Brand Name Matching
```
"Velveeta cheese" → "processed cheese"
"Karo syrup" → "corn syrup"
```

---

## Output Format

The script adds a `nutrition` section to the YAML frontmatter:

```yaml
---
title: "Chocolate Chess Pie"
# ... other fields ...

nutrition:
  servingSize: "1 serving (1/8 of recipe)"
  calories: "420"
  totalFat: "18g"
  protein: "5g"
  totalCarbohydrate: "62g"
  dietaryFiber: "1g"
  sugars: "48g"
  sodium: "180mg"
  cholesterol: "95mg"
  note: "Estimated values based on 12/15 ingredients"
---
```

---

## Accuracy Levels

### High Accuracy (±5-10%)
✅ Simple ingredients with standard measurements
- "1 cup all-purpose flour"
- "2 tbsp butter"
- "1 cup sugar"

### Medium Accuracy (±15-25%)
⚠️ Prepared ingredients or variable items
- "1 can cream of mushroom soup"
- "1 medium onion"
- "1 lb chicken breast"

### Low Accuracy (±30%+)
❌ Vague quantities or complex preparations
- "Salt to taste"
- "A little pepper"
- "Cooked and shredded chicken"

---

## Troubleshooting

### Issue: "API Key Required"
**Solution:** Set the `USDA_API_KEY` environment variable

### Issue: "Rate Limit Exceeded"
**Solution:** The script includes 100ms delays between requests. If using free tier, process recipes in smaller batches.

### Issue: "Ingredient Not Found"
**Solution:** The script will skip ingredients it can't match and note this in the output. Review and manually add if needed.

### Issue: "Inaccurate Nutrition Values"
**Solution:** 
1. Check ingredient quantities in the recipe
2. Verify unit conversions are correct
3. Manually adjust values if needed
4. Add note about manual adjustments

---

## Best Practices

### 1. Start Small
- Test on 5-10 recipes first
- Review results for accuracy
- Adjust mappings if needed

### 2. Review Results
- Check calculated values against known nutrition facts
- Verify serving sizes are correct
- Adjust manually if needed

### 3. Document Changes
- Note any manual adjustments
- Keep track of which recipes have been processed
- Update the note field with accuracy information

### 4. Batch Processing
- Process similar recipes together (all pies, all casseroles)
- This helps identify patterns and improve mappings

---

## Example Usage

### Example 1: Single Recipe

```bash
$ node add-nutrition.js chocolate_chess_pie.md

Calculating nutrition for 8 ingredients...
  ✅ sugar → sugar, granulated
  ✅ cocoa → cocoa, dry powder, unsweetened
  ✅ eggs → egg, whole, raw
  ✅ evaporated milk → milk, evaporated, canned
  ✅ butter → butter, salted
  ✅ vanilla → vanilla extract
  ⏭️  unbaked pie shell - Could not calculate
  ⏭️  salt to taste - Could not calculate

✅ Nutrition added successfully!
   Calories per serving: 387
```

### Example 2: Review Output

Check the recipe file to see the added nutrition:

```yaml
nutrition:
  servingSize: "1 serving (1/8 of recipe)"
  calories: "387"
  totalFat: "16g"
  protein: "6g"
  totalCarbohydrate: "58g"
  dietaryFiber: "2g"
  sugars: "45g"
  sodium: "165mg"
  cholesterol: "98mg"
  note: "Estimated values based on 6/8 ingredients"
```

---

## API Rate Limits

### Free Tier (DEMO_KEY)
- **Limit:** 30 requests per hour, 50 per day
- **Recommendation:** Use for testing only

### Free API Key
- **Limit:** 1,000 requests per hour
- **Recommendation:** Sufficient for all 104 recipes

### Rate Limiting in Script
- **Delay:** 100ms between requests
- **Time for 104 recipes:** ~10-15 minutes (with 15 ingredients each)

---

## Advanced Usage

### Custom Ingredient Mappings

Edit `add-nutrition.js` to add custom mappings:

```javascript
const INGREDIENT_MAPPINGS = {
  // Add your custom mappings
  'your ingredient': 'usda database term',
  'special cheese': 'cheddar cheese',
};
```

### Adjust Unit Conversions

Modify the `UNIT_CONVERSIONS` object:

```javascript
const UNIT_CONVERSIONS = {
  'cup': { 
    flour: 120,  // grams
    sugar: 200,
    // Add more
  },
};
```

---

## Recommended Workflow

### Phase 1: Test (5-10 recipes)
1. Get API key
2. Test on 5-10 diverse recipes
3. Review accuracy
4. Adjust mappings if needed

### Phase 2: Popular Recipes (20-30 recipes)
1. Identify most popular recipes
2. Process in batches of 10
3. Review and manually adjust
4. Deploy to production

### Phase 3: Remaining Recipes (70+ recipes)
1. Process in batches
2. Review periodically
3. Update as needed
4. Gradually improve accuracy

---

## Support

### Documentation
- **USDA API Guide:** https://fdc.nal.usda.gov/api-guide.html
- **FoodData Central:** https://fdc.nal.usda.gov/

### Script Files
- **`add-nutrition.js`** - Main nutrition calculator
- **`ENHANCEMENT_GUIDE.md`** - Complete enhancement guide
- **`ENHANCEMENTS_COMPLETED.md`** - Summary of all enhancements

---

## Summary

The USDA Nutrition Calculator provides:
- ✅ Automated nutrition calculation
- ✅ Intelligent ingredient matching
- ✅ Best-effort accuracy
- ✅ Easy to use and extend
- ✅ Free API access

**Start with a few recipes, review the results, and gradually expand!**

