import eslintjs from '@eslint/js';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  {
    files: ['src/**/*.ts'],
    plugins: {
      eslint: eslintjs,
      typescript: tseslint
    },
    extends: [
      tseslint.configs.strict,
      eslintjs.configs.recommended
    ],
    rules: {
      'max-len': ['error', {
        ignoreTemplateLiterals: true,
        ignoreStrings: true
      }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-control-regex': 'off'
    }
  },
]);
