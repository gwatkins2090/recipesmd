# Recipe Standardization Conversion Script

Automated conversion script to standardize 115 family recipe markdown files into a consistent YAML frontmatter + Markdown format.

## 📁 Files

- **`recipe-converter.js`** - Main conversion script
- **`metadata-generator.js`** - Generates YAML frontmatter metadata
- **`recipe-formatter.js`** - Formats standardized recipe content
- **`review-checker.js`** - Identifies recipes needing manual review
- **`report-generator.js`** - Generates statistics and review reports

## 🚀 Usage

### Test Mode (First 10 Recipes)
```bash
node recipe-converter.js --test
```

### Convert All Recipes
```bash
node recipe-converter.js
```

Or using npm scripts:
```bash
npm run test      # Test mode
npm run convert   # Convert all
```

## 📂 Directory Structure

```
convert/
├── recipe-converter.js       # Main script
├── metadata-generator.js     # Metadata generation
├── recipe-formatter.js       # Content formatting
├── review-checker.js         # Review checking
├── report-generator.js       # Report generation
├── package.json              # Package configuration
├── README.md                 # This file
├── *.md                      # 115 original recipe files
├── backup/                   # Backup of original files
└── output/                   # Standardized recipe files
    ├── *.md                  # Converted recipes
    └── REVIEW_REPORT.md      # Review report
```

## ✨ Features

### Automated Conversions
- ✅ Extract and clean titles (remove recipe numbers)
- ✅ Generate URL-friendly slugs
- ✅ Standardize section headers to H2 (`##`)
- ✅ Convert paragraph instructions to numbered lists
- ✅ Standardize temperatures (350 degrees → 350°F)
- ✅ Standardize times (30 min → 30 minutes)
- ✅ Standardize units (c → cup, tsp. → tsp)
- ✅ Standardize fractions (1/2 → ½)
- ✅ Extract metadata from text
- ✅ Infer categories from content
- ✅ Infer difficulty levels
- ✅ Generate tags from ingredients
- ✅ Infer generation tags
- ✅ Auto-generate descriptions
- ✅ Organize notes into sections

### Review Flagging
The script automatically flags recipes that need manual attention:
- 🔴 Incomplete ingredient quantities
- 🟡 Vague or minimal instructions
- 🟠 Missing or estimated metadata
- 🟢 Uncertain category inference
- 🔵 Multi-component recipes

## 📊 Output

### Standardized Recipe Format
```yaml
---
# REQUIRED FIELDS
title: "Recipe Name"
slug: "recipe-name"
category: "Desserts"
difficulty: "Medium"

# HIGHLY RECOMMENDED FIELDS
description: "Brief description"
prepTime: "PT15M"
cookTime: "PT45M"
totalTime: "PT1H"
yield: "8 servings"

# TAGS
tags:
  - desserts
  - pie
  - chocolate

# OPTIONAL FIELDS
author: "Grandma Betty"
source: "Recipe #83"
cuisine: "Southern"
generation: "grandma"
dateAdded: "2024-01-15"
---

## Description

[1-2 paragraphs about the dish]

## Ingredients

- Standardized ingredient list
- Clear quantities and units

## Instructions

1. Numbered steps
2. One action per step
3. Detailed with temps/times

## Notes

### Storage
[Storage instructions]

### Tips
[Helpful tips]
```

### Reports Generated
1. **Console Statistics** - Real-time progress and summary
2. **REVIEW_REPORT.md** - Detailed review report with all flagged recipes
3. **Category Distribution** - Breakdown by category, difficulty, generation

## 🎯 Categories

The script automatically categorizes recipes into:
- Breakfast & Brunch
- Appetizers & Snacks
- Soups & Salads
- Main Dishes
- Side Dishes
- Breads & Biscuits
- Desserts
- Beverages
- Sauces & Condiments

## 📈 Difficulty Levels

- **Easy** - ≤5 steps, ≤30 min, common ingredients
- **Medium** - 6-12 steps, 30-90 min, some technique
- **Hard** - >12 steps, >90 min, advanced techniques

## 👨‍👩‍👧‍👦 Generation Tags

- **great-grandma** - Traditional, old-fashioned recipes
- **grandma** - Classic comfort foods
- **mom** - Modern, quick recipes
- **modern** - Contemporary additions

## 🔧 How It Works

1. **Backup** - Creates backup of all original files
2. **Parse** - Extracts title, ingredients, instructions, notes
3. **Generate Metadata** - Creates YAML frontmatter with all fields
4. **Format Content** - Standardizes markdown sections
5. **Check for Issues** - Flags recipes needing review
6. **Write Output** - Saves standardized recipes
7. **Generate Reports** - Creates review report and statistics

## 📝 Manual Review Needed

After conversion, review the `REVIEW_REPORT.md` file for recipes that need manual attention. Typical issues:
- Incomplete ingredient quantities (e.g., "tuna" → "1 can (5 oz) tuna")
- Vague instructions that need expansion
- Estimated times/yields that need verification
- Uncertain categories that need confirmation

## ✅ Success Criteria

- **90%+ automated** - Most conversions require no manual intervention
- **100% preserved** - All original content is preserved
- **Consistent format** - All recipes follow the same structure
- **Enhanced metadata** - Rich metadata for filtering and search
- **Review flagging** - Clear identification of recipes needing attention

## 🚨 Safety Features

- ✅ Backups created before conversion
- ✅ Original files never modified
- ✅ Output to separate directory
- ✅ Detailed error reporting
- ✅ Test mode for validation

## 📞 Support

For issues or questions, refer to:
- `RECIPE_STANDARDIZATION_PROPOSAL.md` - Format specification
- `FIELD_REQUIREMENTS.md` - Field reference
- `FORMATTING_ISSUES_AND_SOLUTIONS.md` - Issue details

