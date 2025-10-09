/**
 * Metadata Generator
 * Generates YAML frontmatter metadata for recipes
 */

/**
 * Generate complete metadata for a recipe
 */
function generateMetadata(parsed, filename) {
  const metadata = {
    // REQUIRED FIELDS
    title: parsed.title,
    slug: generateSlug(filename),
    category: inferCategory(parsed),
    difficulty: inferDifficulty(parsed),

    // HIGHLY RECOMMENDED FIELDS
    description: generateDescription(parsed),
    prepTime: extractOrEstimatePrepTime(parsed),
    cookTime: extractOrEstimateCookTime(parsed),
    totalTime: '', // Will be calculated
    yield: extractOrEstimateYield(parsed),
    tags: generateTags(parsed),

    // OPTIONAL FIELDS
    author: parsed.author || 'Maw Maw',
    source: extractSource(parsed, filename),
    cuisine: inferCuisine(parsed),
    generation: inferGeneration(parsed),
    dateAdded: new Date().toISOString().split('T')[0],

    // IMAGE FIELDS
    image: '/images/recipes/placeholder.svg',
    imageAlt: `${parsed.title} recipe`,
  };

  // Calculate total time
  metadata.totalTime = calculateTotalTime(metadata.prepTime, metadata.cookTime, parsed);

  return metadata;
}

/**
 * Generate URL-friendly slug from filename
 */
function generateSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/_/g, '-')
    .toLowerCase();
}

/**
 * Infer recipe category from title and ingredients
 */
function inferCategory(parsed) {
  const title = parsed.title.toLowerCase();
  const ingredients = parsed.ingredients.join(' ').toLowerCase();

  // Desserts
  if (title.match(/pie|cake|cookie|brownie|dessert|sweet|pudding|cobbler/)) {
    return 'Desserts';
  }

  // Breads & Biscuits
  if (title.match(/bread|biscuit|roll|muffin|scone|biscotti/)) {
    return 'Breads & Biscuits';
  }

  // Breakfast & Brunch
  if (title.match(/breakfast|brunch|pancake|waffle|french toast|egg/)) {
    return 'Breakfast & Brunch';
  }

  // Soups & Salads
  if (title.match(/soup|salad|chowder|stew/)) {
    return 'Soups & Salads';
  }

  // Appetizers & Snacks
  if (title.match(/dip|appetizer|snack|sauce(?! for)|spread/)) {
    return 'Appetizers & Snacks';
  }

  // Side Dishes
  if (title.match(/side|dressing(?! casserole)|rice(?! casserole)|potato(?! casserole)|vegetable/)) {
    return 'Side Dishes';
  }

  // Sauces & Condiments
  if (title.match(/sauce|gravy|condiment|marinade|glaze/)) {
    return 'Sauces & Condiments';
  }

  // Main Dishes (casseroles, meat dishes)
  if (title.match(/casserole|chicken|beef|pork|fish|seafood|tuna|salmon|catfish|shrimp|ham|sausage|meat|loaf|quiche/)) {
    return 'Main Dishes';
  }

  // Default to Main Dishes if uncertain
  return 'Main Dishes';
}

/**
 * Infer difficulty based on instruction count and complexity
 */
function inferDifficulty(parsed) {
  const stepCount = parsed.instructions.length;
  const title = parsed.title.toLowerCase();
  const instructions = parsed.instructions.join(' ').toLowerCase();

  // Hard indicators
  if (stepCount > 12 || 
      title.match(/soufflé|croissant|puff pastry/) ||
      instructions.match(/fold|temper|proof|knead.*minutes|candy thermometer/)) {
    return 'Hard';
  }

  // Easy indicators
  if (stepCount <= 5 || 
      title.match(/quick|easy|simple/) ||
      instructions.match(/mix.*together|stir|combine all/)) {
    return 'Easy';
  }

  // Default to Medium
  return 'Medium';
}

/**
 * Generate simple description from title and category
 */
function generateDescription(parsed) {
  const title = parsed.title;
  const category = inferCategory(parsed);
  
  // Check if there's descriptive text in the content
  const lines = parsed.rawContent.split('\n');
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('*') && 
        !line.startsWith('-') && !line.match(/^\d+\./) &&
        line.length > 50 && line.length < 300 &&
        !line.match(/ingredients|instructions|directions/i)) {
      return line;
    }
  }

  // Generate simple description
  const templates = {
    'Desserts': `A delicious ${title.toLowerCase()} that's perfect for any occasion.`,
    'Breads & Biscuits': `Homemade ${title.toLowerCase()} that's perfect for breakfast or as a side dish.`,
    'Breakfast & Brunch': `A hearty ${title.toLowerCase()} recipe perfect for starting your day.`,
    'Soups & Salads': `A comforting ${title.toLowerCase()} that's perfect for any meal.`,
    'Main Dishes': `A family favorite ${title.toLowerCase()} recipe that's sure to please.`,
    'Side Dishes': `A delicious ${title.toLowerCase()} that pairs well with any main course.`,
    'Appetizers & Snacks': `A tasty ${title.toLowerCase()} perfect for parties and gatherings.`,
    'Sauces & Condiments': `A flavorful ${title.toLowerCase()} that enhances any dish.`,
  };

  return templates[category] || `A classic ${title.toLowerCase()} recipe from Maw Maw's collection.`;
}

/**
 * Extract or estimate prep time
 */
function extractOrEstimatePrepTime(parsed) {
  // Try to extract from metadata text
  if (parsed.metadata.timesText) {
    const match = parsed.metadata.timesText.match(/prep time:\s*(\d+)\s*min/i);
    if (match) {
      return `PT${match[1]}M`;
    }
  }

  // Estimate based on complexity
  const stepCount = parsed.instructions.length;
  if (stepCount <= 3) return 'PT10M';
  if (stepCount <= 6) return 'PT15M';
  if (stepCount <= 10) return 'PT30M';
  return 'PT45M';
}

/**
 * Extract or estimate cook time
 */
function extractOrEstimateCookTime(parsed) {
  const instructions = parsed.instructions.join(' ');

  // Try to extract from metadata text
  if (parsed.metadata.timesText) {
    const match = parsed.metadata.timesText.match(/cook time:\s*(\d+)\s*min/i);
    if (match) {
      return `PT${match[1]}M`;
    }
  }

  // Try to extract from instructions
  const bakeMatch = instructions.match(/bake.*?(\d+)[-–]?(\d+)?\s*min/i);
  if (bakeMatch) {
    const time = bakeMatch[2] ? Math.round((parseInt(bakeMatch[1]) + parseInt(bakeMatch[2])) / 2) : parseInt(bakeMatch[1]);
    return `PT${time}M`;
  }

  const cookMatch = instructions.match(/cook.*?(\d+)[-–]?(\d+)?\s*min/i);
  if (cookMatch) {
    const time = cookMatch[2] ? Math.round((parseInt(cookMatch[1]) + parseInt(cookMatch[2])) / 2) : parseInt(cookMatch[1]);
    return `PT${time}M`;
  }

  // Estimate based on category
  const category = inferCategory(parsed);
  if (category === 'Desserts') return 'PT45M';
  if (category === 'Breads & Biscuits') return 'PT30M';
  if (category === 'Main Dishes') return 'PT45M';
  return 'PT30M';
}

/**
 * Calculate total time
 */
function calculateTotalTime(prepTime, cookTime, parsed) {
  const prepMinutes = parseISODuration(prepTime);
  const cookMinutes = parseISODuration(cookTime);
  const total = prepMinutes + cookMinutes;

  // Add extra time for recipes with rising, chilling, etc.
  const instructions = parsed.instructions.join(' ').toLowerCase();
  let extraTime = 0;
  
  if (instructions.match(/chill|refrigerate.*hour/)) extraTime += 120;
  else if (instructions.match(/chill|refrigerate/)) extraTime += 30;
  
  if (instructions.match(/rise.*hour/)) extraTime += 60;
  else if (instructions.match(/rise/)) extraTime += 30;

  const totalMinutes = total + extraTime;
  
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `PT${hours}H${minutes}M` : `PT${hours}H`;
  }
  
  return `PT${totalMinutes}M`;
}

/**
 * Parse ISO 8601 duration to minutes
 */
function parseISODuration(duration) {
  if (!duration) return 0;
  const hourMatch = duration.match(/(\d+)H/);
  const minuteMatch = duration.match(/(\d+)M/);
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  return hours * 60 + minutes;
}

/**
 * Extract or estimate yield
 */
function extractOrEstimateYield(parsed) {
  const content = parsed.rawContent.toLowerCase();

  // Try to extract from metadata
  if (parsed.metadata.timesText) {
    const match = parsed.metadata.timesText.match(/serves:\s*(\d+[-–]?\d*)/i);
    if (match) {
      return `${match[1]} servings`;
    }
  }

  // Try to extract from content
  const servesMatch = content.match(/serves?\s*:?\s*(\d+[-–]?\d*)/i);
  if (servesMatch) {
    return `${servesMatch[1]} servings`;
  }

  const makesMatch = content.match(/makes?\s*(\d+[-–]?\d*)\s*(servings?|cookies?|muffins?|biscuits?|rolls?)/i);
  if (makesMatch) {
    return `${makesMatch[1]} ${makesMatch[2]}`;
  }

  // Estimate based on category
  const category = inferCategory(parsed);
  if (category === 'Desserts' && parsed.title.toLowerCase().includes('pie')) return '8 servings';
  if (category === 'Desserts' && parsed.title.toLowerCase().includes('cake')) return '12 servings';
  if (category === 'Breads & Biscuits') return '12 servings';
  if (category === 'Main Dishes') return '6-8 servings';
  
  return '8 servings';
}

/**
 * Generate tags from recipe content
 */
function generateTags(parsed) {
  const tags = new Set();
  const title = parsed.title.toLowerCase();
  const ingredients = parsed.ingredients.join(' ').toLowerCase();
  const category = inferCategory(parsed);

  // Add category tag
  tags.add(category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));

  // Add ingredient-based tags
  if (ingredients.match(/chicken/)) tags.add('chicken');
  if (ingredients.match(/beef/)) tags.add('beef');
  if (ingredients.match(/pork/)) tags.add('pork');
  if (ingredients.match(/fish|salmon|catfish|tuna/)) tags.add('seafood');
  if (ingredients.match(/chocolate/)) tags.add('chocolate');
  if (ingredients.match(/cheese/)) tags.add('cheese');
  if (ingredients.match(/blueberr/)) tags.add('blueberry');

  // Add technique tags
  if (title.match(/baked|bake/) || parsed.instructions.join(' ').match(/bake/i)) tags.add('baked');
  if (title.match(/casserole/)) tags.add('casserole');
  if (title.match(/pie/)) tags.add('pie');
  if (title.match(/cake/)) tags.add('cake');
  if (title.match(/soup/)) tags.add('soup');
  if (title.match(/salad/)) tags.add('salad');

  // Add characteristic tags
  tags.add('family-recipe');
  if (title.match(/southern/)) tags.add('southern');
  if (title.match(/quick|easy/)) tags.add('easy');
  if (title.match(/christmas|holiday/)) tags.add('holiday');

  return Array.from(tags).slice(0, 15); // Limit to 15 tags
}

/**
 * Extract source information
 */
function extractSource(parsed, filename) {
  // Check for recipe number in original content
  const match = parsed.rawContent.match(/Recipe #(\d+)/i);
  if (match) {
    return `Recipe #${match[1]}`;
  }
  
  // Check for numbered recipe
  const numMatch = parsed.rawContent.match(/^##\s*(\d+)\./m);
  if (numMatch) {
    return `Recipe #${numMatch[1]}`;
  }

  return 'Family Recipe Collection';
}

/**
 * Infer cuisine type
 */
function inferCuisine(parsed) {
  const title = parsed.title.toLowerCase();
  const ingredients = parsed.ingredients.join(' ').toLowerCase();

  if (title.match(/italian|spaghetti|lasagne|pizza/) || ingredients.match(/italian/)) return 'Italian';
  if (title.match(/mexican|taco|enchilada/) || ingredients.match(/mexican/)) return 'Mexican';
  if (title.match(/asian|chinese|thai/) || ingredients.match(/soy sauce|ginger/)) return 'Asian';
  if (title.match(/french/) || ingredients.match(/french/)) return 'French';
  if (title.match(/southern|buttermilk/) || ingredients.match(/buttermilk/)) return 'Southern';

  return 'American';
}

/**
 * Infer generation based on recipe characteristics
 */
function inferGeneration(parsed) {
  const title = parsed.title.toLowerCase();
  const content = parsed.rawContent.toLowerCase();

  // Great Grandma - very traditional, old-fashioned
  if (title.match(/angel|scripture|old fashioned|classic|traditional|vintage/)) {
    return 'great-grandma';
  }

  // Mom - modern, quick, convenience
  if (title.match(/quick|easy|simple|30 minute/)) {
    return 'mom';
  }

  // Default to Grandma for most family recipes
  return 'grandma';
}

module.exports = {
  generateMetadata,
  generateSlug,
  inferCategory,
  inferDifficulty,
  generateDescription,
  generateTags,
};

