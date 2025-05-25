import { defineConfig } from 'eslint/config';
import { eslintCommonConfig } from '@repo/eslint-config';

export default defineConfig([{ ignores: ['dist', './prisma-generated'] }, ...eslintCommonConfig]);
