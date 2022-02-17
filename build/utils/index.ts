import { spawn, SpawnOptions } from 'child_process';
import { projectRoot } from './paths';
import { TaskFunction } from 'gulp';

export const withTaskName = (displayName: string, fn: TaskFunction) => Object.assign(fn, { displayName });

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
