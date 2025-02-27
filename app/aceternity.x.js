import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

/**
 * Tailwind Plugin: Adds colors as CSS variables (e.g., --gray-200)
 */
export default function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({ ':root': newVars });
}
