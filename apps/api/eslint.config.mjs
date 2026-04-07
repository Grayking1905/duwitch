import { baseConfig } from '@duwitch/config/eslint'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      // Fastify req/reply types are complex — allow any in API
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'prisma/**'],
  },
]
