import { spawn } from 'child_process';
import { platform } from 'os';

const args = process.argv.slice(2);
const command = args.length > 0 ? args[0] : 'dev';
const additionalArgs = args.slice(1);

// Validate command
const validCommands = ['dev', 'build', 'lint'];
if (!validCommands.includes(command)) {
  console.error(`Error: Unknown command '${command}'. Use dev, build, or lint.`);
  process.exit(1);
}

console.log(`Running ${command} for all applications with args: ${additionalArgs.join(' ')}`);

// Define colors for the output
const colors = {
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
};

const apps = [
  { name: 'API', color: 'yellow', path: 'apps/api' },
  { name: 'Website', color: 'green', path: 'apps/website' },
];

function runCommand(app) {
  const isWindows = platform() === 'win32';

  // Combine the command with additional arguments
  const fullCommand = ['run', '--cwd', app.path, command, ...additionalArgs];

  const proc = spawn('bun', fullCommand, {
    stdio: 'pipe',
    shell: isWindows, // Use shell on Windows
  });

  proc.stdout.on('data', (data) => {
    console.log(`${colors[app.color]}[${app.name}]${colors.reset} ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`${colors[app.color]}[${app.name}]${colors.reset} ${data.toString().trim()}`);
  });

  proc.on('error', (error) => {
    console.error(`${colors[app.color]}[${app.name}]${colors.reset} Error: ${error.message}`);
  });

  return proc;
}

const processes = apps.map(runCommand);

process.on('SIGINT', () => {
  console.log('Stopping all processes...');
  processes.forEach((p) => p.kill());
  process.exit(0);
});