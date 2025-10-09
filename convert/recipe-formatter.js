/**
 * Recipe Formatter
 * Generates standardized YAML frontmatter + Markdown content
 */

/**
 * Generate complete standardized recipe
 */
function generateStandardizedRecipe(metadata, parsed) {
  const sections = [];

  // YAML Frontmatter
  sections.push(generateYAMLFrontmatter(metadata));

  // Description section
  sections.push(generateDescriptionSection(metadata.description));

  // Ingredients section
  sections.push(generateIngredientsSection(parsed.ingredients));

  // Instructions section
  sections.push(generateInstructionsSection(parsed.instructions));

  // Notes section (if any)
  if (parsed.notes.length > 0) {
    sections.push(generateNotesSection(parsed.notes));
  }

  return sections.join('\n\n');
}

/**
 * Generate YAML frontmatter
 */
function generateYAMLFrontmatter(metadata) {
  const yaml = ['---'];

  // Required fields
  yaml.push(`title: "${escapeYAML(metadata.title)}"`);
  yaml.push(`slug: "${metadata.slug}"`);
  yaml.push(`category: "${metadata.category}"`);
  yaml.push(`difficulty: "${metadata.difficulty}"`);
  yaml.push('');

  // Highly recommended fields
  yaml.push(`description: "${escapeYAML(metadata.description)}"`);
  yaml.push(`prepTime: "${metadata.prepTime}"`);
  yaml.push(`cookTime: "${metadata.cookTime}"`);
  yaml.push(`totalTime: "${metadata.totalTime}"`);
  yaml.push(`yield: "${metadata.yield}"`);
  yaml.push('');

  // Tags
  if (metadata.tags && metadata.tags.length > 0) {
    yaml.push('tags:');
    metadata.tags.forEach(tag => {
      yaml.push(`  - ${tag}`);
    });
    yaml.push('');
  }

  // Optional fields
  yaml.push(`author: "${escapeYAML(metadata.author)}"`);
  yaml.push(`source: "${escapeYAML(metadata.source)}"`);
  yaml.push(`cuisine: "${metadata.cuisine}"`);
  yaml.push(`generation: "${metadata.generation}"`);
  yaml.push(`dateAdded: "${metadata.dateAdded}"`);

  yaml.push('---');

  return yaml.join('\n');
}

/**
 * Escape special characters in YAML strings
 */
function escapeYAML(str) {
  if (!str) return '';
  return str.replace(/"/g, '\\"');
}

/**
 * Generate description section
 */
function generateDescriptionSection(description) {
  return `## Description\n\n${description}`;
}

/**
 * Generate ingredients section
 */
function generateIngredientsSection(ingredients) {
  if (ingredients.length === 0) {
    return '## Ingredients\n\n- (Ingredients to be added)';
  }

  const lines = ['## Ingredients', ''];
  
  // Check if this is a multi-component recipe
  const hasComponents = detectMultiComponent(ingredients);
  
  if (hasComponents) {
    // Organize by components
    const components = organizeByComponents(ingredients);
    for (const [component, items] of Object.entries(components)) {
      if (component !== 'main') {
        lines.push(`### ${component}`);
        lines.push('');
      }
      items.forEach(item => {
        lines.push(`- ${item}`);
      });
      lines.push('');
    }
  } else {
    // Simple ingredient list
    ingredients.forEach(item => {
      lines.push(`- ${item}`);
    });
  }

  return lines.join('\n').trim();
}

/**
 * Detect if recipe has multiple components
 */
function detectMultiComponent(ingredients) {
  const text = ingredients.join(' ').toLowerCase();
  return text.match(/for the (cake|icing|frosting|filling|crust|topping|sauce|glaze)/);
}

/**
 * Organize ingredients by component
 */
function organizeByComponents(ingredients) {
  const components = { main: [] };
  let currentComponent = 'main';

  ingredients.forEach(item => {
    const componentMatch = item.match(/^for the (cake|icing|frosting|filling|crust|topping|sauce|glaze)/i);
    if (componentMatch) {
      currentComponent = `For the ${componentMatch[1].charAt(0).toUpperCase() + componentMatch[1].slice(1)}`;
      components[currentComponent] = [];
    } else {
      if (!components[currentComponent]) {
        components[currentComponent] = [];
      }
      components[currentComponent].push(item);
    }
  });

  return components;
}

/**
 * Generate instructions section
 */
function generateInstructionsSection(instructions) {
  if (instructions.length === 0) {
    return '## Instructions\n\n1. (Instructions to be added)';
  }

  const lines = ['## Instructions', ''];

  // Convert paragraph instructions to numbered steps
  const steps = processInstructions(instructions);

  steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step}`);
    lines.push('');
  });

  return lines.join('\n').trim();
}

/**
 * Process instructions - split paragraphs, clean up, standardize
 */
function processInstructions(instructions) {
  const steps = [];

  instructions.forEach(instruction => {
    // Remove existing numbering
    let cleaned = instruction.replace(/^\d+\.\s*/, '').trim();

    // Standardize temperatures
    cleaned = standardizeTemperatures(cleaned);

    // Standardize times
    cleaned = standardizeTimes(cleaned);

    // Split long paragraphs into sentences if needed
    if (cleaned.length > 200 && cleaned.includes('. ')) {
      const sentences = cleaned.split('. ');
      sentences.forEach((sentence, i) => {
        if (sentence.trim()) {
          const step = i < sentences.length - 1 ? sentence + '.' : sentence;
          if (step.length > 20) { // Avoid very short fragments
            steps.push(step.trim());
          }
        }
      });
    } else {
      steps.push(cleaned);
    }
  });

  return steps;
}

/**
 * Standardize temperature formats
 */
function standardizeTemperatures(text) {
  // 350 degrees -> 350°F
  text = text.replace(/(\d+)\s*degrees?(?!\s*[CF])/gi, '$1°F');
  
  // 350° -> 350°F (if not already followed by F or C)
  text = text.replace(/(\d+)°(?!\s*[CF])/g, '$1°F');
  
  return text;
}

/**
 * Standardize time formats
 */
function standardizeTimes(text) {
  // 30 min -> 30 minutes
  text = text.replace(/(\d+)\s*min(?!ute)/gi, '$1 minutes');
  
  // 1 hr -> 1 hour
  text = text.replace(/(\d+)\s*hrs?(?!s)/gi, '$1 hour');
  
  return text;
}

/**
 * Generate notes section
 */
function generateNotesSection(notes) {
  const lines = ['## Notes', ''];

  // Combine notes into paragraphs
  const noteText = notes.join('\n\n');

  // Try to organize notes into subsections
  const organized = organizeNotes(noteText);

  if (organized.storage) {
    lines.push('### Storage');
    lines.push('');
    lines.push(organized.storage);
    lines.push('');
  }

  if (organized.tips) {
    lines.push('### Tips');
    lines.push('');
    lines.push(organized.tips);
    lines.push('');
  }

  if (organized.variations) {
    lines.push('### Variations');
    lines.push('');
    lines.push(organized.variations);
    lines.push('');
  }

  if (organized.other) {
    if (!organized.storage && !organized.tips && !organized.variations) {
      lines.push(organized.other);
    } else {
      lines.push('### Additional Notes');
      lines.push('');
      lines.push(organized.other);
    }
  }

  return lines.join('\n').trim();
}

/**
 * Organize notes into categories
 */
function organizeNotes(noteText) {
  const organized = {
    storage: '',
    tips: '',
    variations: '',
    other: '',
  };

  const paragraphs = noteText.split('\n\n');

  paragraphs.forEach(para => {
    const lower = para.toLowerCase();
    
    if (lower.match(/store|refrigerate|freeze|keep/)) {
      organized.storage += para + '\n\n';
    } else if (lower.match(/tip|hint|suggestion|note:|important/)) {
      organized.tips += para + '\n\n';
    } else if (lower.match(/variation|alternative|substitute|instead|can use/)) {
      organized.variations += para + '\n\n';
    } else {
      organized.other += para + '\n\n';
    }
  });

  // Trim all sections
  Object.keys(organized).forEach(key => {
    organized[key] = organized[key].trim();
  });

  return organized;
}

module.exports = {
  generateStandardizedRecipe,
  generateYAMLFrontmatter,
  generateIngredientsSection,
  generateInstructionsSection,
  generateNotesSection,
  standardizeTemperatures,
  standardizeTimes,
};

