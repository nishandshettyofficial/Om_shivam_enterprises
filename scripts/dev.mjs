import { spawn } from 'child_process';

console.log('\x1b[36m%s\x1b[0m', '🚀 Launching OM SHIVAM ENTERPRISES (Backend + Frontend)...');

const backend = spawn('npm', ['--prefix', 'backend', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

const frontend = spawn('npm', ['--prefix', 'frontend', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
backend.on('exit', (code) => { if (code !== 0 && code !== null) cleanup(); });
frontend.on('exit', (code) => { if (code !== 0 && code !== null) cleanup(); });
