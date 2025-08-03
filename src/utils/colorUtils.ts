// A set of visually distinct colors for different expense categories
const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6B6B',
  Groceries: '#4ECDC4',
  Rent: '#FFD166',
  Transportation: '#6A0572',
  Utilities: '#1A535C',
  Entertainment: '#F9C80E',
  Shopping: '#FF8C42',
  Health: '#54478C',
  Travel: '#2EC4B6',
  Education: '#5E2BFF',
  Insurance: '#FF595E',
  Subscriptions: '#8AC926',
};

// Fallback colors for categories not in the predefined list
const FALLBACK_COLORS = [
  '#3A86FF', '#FB5607', '#FFBE0B', '#FF006E',
  '#8338EC', '#06D6A0', '#118AB2', '#073B4C'
];

let fallbackColorIndex = 0;

/**
 * Get a color for a specific expense category
 */
export const getCategoryColor = (category: string): string => {
  if (CATEGORY_COLORS[category]) {
    return CATEGORY_COLORS[category];
  }
  
  // For categories not in our predefined list, assign a fallback color
  const color = FALLBACK_COLORS[fallbackColorIndex % FALLBACK_COLORS.length];
  fallbackColorIndex++;
  return color;
};

/**
 * Reset the fallback color index to ensure consistent colors across renders
 */
export const resetColorIndex = (): void => {
  fallbackColorIndex = 0;
};

/**
 * Get all known category colors
 */
export const getAllCategoryColors = (): Record<string, string> => {
  return CATEGORY_COLORS;
};