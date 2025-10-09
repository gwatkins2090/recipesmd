# Testing Checklist - Recipe Pages Consolidation

## 🧪 Pre-Deployment Testing

### 1. Recipe Loading & Display

#### A. Recipe Count Verification
- [ ] Navigate to `/recipes`
- [ ] Verify total recipe count includes both markdown AND family recipes
- [ ] Expected: 100+ recipes (family) + markdown recipes
- [ ] Check that recipe count is displayed correctly in hero section

#### B. Recipe Cards Display
- [ ] Verify all recipe cards render properly
- [ ] Check that images display (or placeholder images)
- [ ] Verify recipe titles are readable
- [ ] Check that difficulty badges show correctly
- [ ] Verify cooking time displays properly

---

### 2. Filter Functionality

#### A. Tags Filter
- [ ] Open Tags filter card
- [ ] Verify ALL tags are displayed (not just 10)
- [ ] Click on various tags
- [ ] Verify recipes filter correctly
- [ ] Check that tag names display properly (spaces instead of hyphens)
- [ ] Verify scrolling works in tags list

#### B. Generation Filter
- [ ] Open Generation filter card
- [ ] Verify all 4 options are present:
  - [ ] Great Grandma's Recipes
  - [ ] Grandma's Recipes
  - [ ] Mom's Recipes
  - [ ] Modern Family Additions
- [ ] Select each generation option
- [ ] Verify recipes filter correctly based on tags
- [ ] Test multiple generation selections

#### C. Cooking Time Filter
- [ ] Verify slider is positioned ABOVE Difficulty filter
- [ ] Move slider to different time values
- [ ] Verify recipes filter correctly
- [ ] Check that time display updates (e.g., "1h 30m")

#### D. Difficulty Filter
- [ ] Verify Difficulty filter is at the BOTTOM
- [ ] Select Easy, Medium, Hard options
- [ ] Verify recipes filter correctly
- [ ] Test multiple difficulty selections

#### E. Combined Filters
- [ ] Select multiple filters simultaneously
- [ ] Verify all filters work together correctly
- [ ] Check active filters display
- [ ] Test "Clear All" button
- [ ] Verify individual filter removal (X button)

---

### 3. Dark Mode Testing

#### A. Recipes Page (`/recipes`)
- [ ] Toggle to dark mode
- [ ] Check hero title contrast (should be cream colored)
- [ ] Check hero description contrast
- [ ] Verify "113 Recipes" text is readable
- [ ] Verify "Sort by:" label is readable
- [ ] Check recipe cards are readable

#### B. Categories Page (`/categories`)
- [ ] Toggle to dark mode
- [ ] Check hero title contrast
- [ ] Check hero description contrast
- [ ] Verify "Featured Recipes:" heading is readable
- [ ] Check category cards display properly

#### C. Search Page (`/search`)
- [ ] Toggle to dark mode
- [ ] Check hero title contrast
- [ ] Check hero description contrast
- [ ] Verify all text is readable

#### D. Home Page (`/`)
- [ ] Toggle to dark mode
- [ ] Check hero title contrast
- [ ] Check hero description contrast
- [ ] Verify stats numbers are readable
- [ ] Verify stats labels are readable

---

### 4. Recipe Links & Slugs

#### A. Family Recipe Links
- [ ] Click on "Best Rolls" recipe
- [ ] Verify it navigates to `/recipes/best_rolls` (with underscore)
- [ ] Verify recipe content loads correctly
- [ ] Test 5-10 other family recipes with underscores in names
- [ ] Verify all links work correctly

#### B. Markdown Recipe Links
- [ ] Click on various markdown recipes
- [ ] Verify they navigate correctly
- [ ] Verify recipe content loads

#### C. Recipe Detail Pages
- [ ] Verify ingredients display correctly
- [ ] Verify instructions display correctly
- [ ] Check that images load
- [ ] Test favorite button functionality

---

### 5. Responsive Design

#### A. Mobile View (< 640px)
- [ ] Test filter toggle button appears
- [ ] Verify filters collapse/expand correctly
- [ ] Check recipe grid displays in single column
- [ ] Verify all text is readable
- [ ] Test dark mode on mobile

#### B. Tablet View (640px - 1024px)
- [ ] Verify recipe grid displays in 2 columns
- [ ] Check filter sidebar behavior
- [ ] Test all filters work correctly

#### C. Desktop View (> 1024px)
- [ ] Verify recipe grid displays in 3 columns
- [ ] Check filter sidebar is always visible
- [ ] Verify layout is balanced

---

### 6. Performance Testing

#### A. Initial Load
- [ ] Measure time to first contentful paint
- [ ] Check for any console errors
- [ ] Verify no infinite loops or re-renders
- [ ] Check network tab for API calls

#### B. Filtering Performance
- [ ] Select various filters
- [ ] Verify filtering is instant (< 100ms)
- [ ] Check for any lag or stuttering
- [ ] Verify no memory leaks

#### C. Sorting Performance
- [ ] Test all sort options
- [ ] Verify sorting is instant
- [ ] Check that UI doesn't freeze

---

### 7. API Routes

#### A. `/api/recipes`
- [ ] Navigate to `/api/recipes` in browser
- [ ] Verify JSON response
- [ ] Check that all markdown recipes are returned
- [ ] Verify no errors in response

#### B. `/api/family-recipes`
- [ ] Navigate to `/api/family-recipes` in browser
- [ ] Verify JSON response
- [ ] Check that all family recipes are returned
- [ ] Verify generation tags are present

---

### 8. Redirect Testing

#### A. Family Recipes Redirect
- [ ] Navigate to `/family-recipes`
- [ ] Verify automatic redirect to `/recipes`
- [ ] Check that redirect is smooth (no flash)
- [ ] Verify no console errors

---

### 9. Browser Compatibility

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

### 10. Accessibility Testing

#### A. Keyboard Navigation
- [ ] Tab through all filters
- [ ] Verify focus indicators are visible
- [ ] Test Enter/Space to toggle checkboxes
- [ ] Verify all interactive elements are reachable

#### B. Screen Reader Testing
- [ ] Test with NVDA or JAWS
- [ ] Verify filter labels are announced
- [ ] Check that recipe cards are properly labeled
- [ ] Verify active filters are announced

#### C. Color Contrast
- [ ] Run WAVE or axe DevTools
- [ ] Verify all text meets WCAG AA standards
- [ ] Check both light and dark modes
- [ ] Fix any contrast issues

---

## 🐛 Known Issues to Watch For

1. **Slug Mismatch**: Family recipes with underscores might not link correctly
2. **Generation Filter**: May not categorize all recipes correctly (heuristic-based)
3. **API Loading**: Initial load might be slow with 100+ recipes
4. **Filter State**: Filters don't persist on page refresh
5. **Search Integration**: Search bar doesn't integrate with filters yet

---

## ✅ Success Criteria

- [ ] All 100+ family recipes display on `/recipes` page
- [ ] All filters work correctly and in the correct order
- [ ] Dark mode text is readable throughout the site
- [ ] All recipe links work (especially family recipes with underscores)
- [ ] Generation filter categorizes recipes appropriately
- [ ] No console errors or warnings
- [ ] Page loads in < 3 seconds
- [ ] Filtering is instant (< 100ms)
- [ ] Mobile experience is smooth
- [ ] Accessibility score > 90 (Lighthouse)

---

## 📝 Post-Testing Actions

After testing is complete:

1. Document any bugs found
2. Create GitHub issues for bugs
3. Update documentation if needed
4. Plan for any necessary fixes
5. Schedule deployment

