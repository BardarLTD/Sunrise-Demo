// @ts-check
import baseConfig from './base.mjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration for Next.js applications
 */
export default tseslint.config(...baseConfig, {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      React: 'readonly',
    },
  },
});
