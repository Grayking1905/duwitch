// ESLint flat config for @duwitch/config (ESLint 9+)
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.FlatConfig[]} */
export const baseConfig = [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Prefer TypeScript's own unused-vars over ESLint's (avoids false positives)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // Allow console for backend/scripts
      'no-console': 'off',
      // Turn off base rule in favour of TypeScript-aware rule
      'no-undef': 'off',
    },
  },
  {
    ignores: ['dist/**', '.next/**', 'node_modules/**', '*.d.ts'],
  },
]

export default baseConfig
