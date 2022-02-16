import { spawn, SpawnOptions } from 'child_process';
import { projectRoot } from './paths';

export const withTaskName = (displayName: string, fn: (...args: any[]) => Promise<any>) => Object.assign(fn, { displayName });

export const run = (command: string, options?: SpawnOptions) => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const app = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
      ...options
    });
    app.on('close', resolve);
    app.on('error', reject);
  });
};
