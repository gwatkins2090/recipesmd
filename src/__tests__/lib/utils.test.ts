import {
  capitalize,
  kebabToTitle,
  truncate,
  formatNumber,
  isEmpty,
  deepClone,
  formatDate,
  isValidEmail,
  createSlug,
  getContrastColor
} from '@/lib/utils';

describe('utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('HELLO');
      expect(capitalize('')).toBe('');
      expect(capitalize('h')).toBe('H');
    });
  });

  describe('kebabToTitle', () => {
    it('should convert kebab-case to Title Case', () => {
      expect(kebabToTitle('hello-world')).toBe('Hello World');
      expect(kebabToTitle('single')).toBe('Single');
      expect(kebabToTitle('multi-word-string')).toBe('Multi Word String');
      expect(kebabToTitle('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate text to specified length', () => {
      const text = 'This is a long text that should be truncated';
      expect(truncate(text, 10)).toBe('This is a...');
      expect(truncate(text, 50)).toBe(text); // No truncation needed
      expect(truncate('short', 10)).toBe('short');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(123)).toBe('123');
    });
  });

  describe('isEmpty', () => {
    it('should correctly identify empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should create deep copies of objects', () => {
      const original = {
        name: 'test',
        nested: {
          value: 42,
          array: [1, 2, 3]
        }
      };

      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.nested.array).not.toBe(original.nested.array);
    });

    it('should handle primitive values', () => {
      expect(deepClone('string')).toBe('string');
      expect(deepClone(42)).toBe(42);
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should handle dates', () => {
      const date = new Date('2024-01-01');
      const cloned = deepClone(date);
      
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });

    it('should handle arrays', () => {
      const array = [1, { nested: 'value' }, [2, 3]];
      const cloned = deepClone(array);
      
      expect(cloned).toEqual(array);
      expect(cloned).not.toBe(array);
      expect(cloned[1]).not.toBe(array[1]);
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      
      expect(formatted).toBe('January 15, 2024');
    });

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toBe('January 15, 2024');
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
      
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@invalid.com')).toBe(false);
      expect(isValidEmail('invalid.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('createSlug', () => {
    it('should create SEO-friendly slugs', () => {
      expect(createSlug('Hello World')).toBe('hello-world');
      expect(createSlug('Special Characters!')).toBe('special-characters');
      expect(createSlug('Multiple   Spaces')).toBe('multiple-spaces');
      expect(createSlug('Under_scores')).toBe('under-scores');
      expect(createSlug('  Leading and trailing  ')).toBe('leading-and-trailing');
    });
  });

  describe('getContrastColor', () => {
    it('should return appropriate contrast colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('#000000'); // White background -> black text
      expect(getContrastColor('#000000')).toBe('#FFFFFF'); // Black background -> white text
      expect(getContrastColor('#FF0000')).toBe('#FFFFFF'); // Red background -> white text
      expect(getContrastColor('#FFFF00')).toBe('#000000'); // Yellow background -> black text
    });

    it('should handle colors without hash', () => {
      expect(getContrastColor('FFFFFF')).toBe('#000000');
      expect(getContrastColor('000000')).toBe('#FFFFFF');
    });
  });
});
