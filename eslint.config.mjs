// @ts-check  // 在文件顶部添加这个 JSDoc 注释，可以在 VSCode 中获得类型提示
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier/flat';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.js'],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // 2. TypeScript 特有配置
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 在这里覆盖或添加 TS 规则
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettierConfig,
]);
