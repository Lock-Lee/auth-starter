import { FlatCompat } from '@eslint/eslintrc';
import { eslintCommonConfig } from '@repo/eslint-config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * A custom ESLint configuration for the back-office app.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { ignores: ['.next/*'] },
  ...eslintCommonConfig,
];

export default eslintConfig;
