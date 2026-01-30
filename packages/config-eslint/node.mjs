// @ts-check
import baseConfig from './base.mjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration for Node.js (Express) applications
 */
export default tseslint.config(...baseConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
});
