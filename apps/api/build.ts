/* eslint-disable no-console */
import { spawn } from 'bun';
import { platform } from 'os';

import pkg from './package.json';

type BuildStep = {
  command: string[];
  name: string;
};

const OUT_DIR = './dist';

const BUILD_STEPS: BuildStep[] = [
  {
    command: platform() === 'win32' ? ['rmdir', '/s', '/q', OUT_DIR] : ['rm', '-rf', OUT_DIR],
    name: 'Cleaning',
  },
  { command: ['bun', 'run', 'lint'], name: 'Linting' },
  {
    command: [
      'bun',
      'build',
      './src/index.ts',
      '--compile',
      '--minify',
      '--target',
      'bun',
      '--outfile',
      `${OUT_DIR}/${pkg.name}`,
    ],
    name: 'Building',
  },
  {
    command:
      platform() === 'win32'
        ? ['del', '/f', '/q', '*.bun-build']
        : ['find', '.', '-name', '*.bun-build', '-type', 'f', '-delete'],
    name: 'Cleaning bun build cache',
  },
];

async function build() {
  try {
    const startTime = Date.now();
    console.log('Starting build process...');
    for (const step of BUILD_STEPS) await runStep(step);
    const endTime = Date.now();
    console.log(`Build process completed in ${endTime - startTime}ms.`);
  } catch (err) {
    console.error(`Build process failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

async function runStep({ command, name }: BuildStep): Promise<void> {
  console.log(`Running ${name}...`);

  const process = spawn(command);
  const exitCode = await process.exited;

  if (exitCode !== 0) {
    throw new Error(`${name} failed.`);
  }
}

build();
