import { spawn } from 'node:child_process';

const child = spawn('npx', ['react-router', 'build'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

let buildFinished = false;

child.stdout.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);
  if (str.includes('asset cleaned from React Router server build') ||
      str.includes('Build failed')) {
    buildFinished = true;
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Once build output is done, wait 8s then force kill if still alive
const finishTimer = setInterval(() => {
  if (buildFinished) {
    clearInterval(finishTimer);
    setTimeout(() => {
      if (!child.killed) {
        console.log('\n[build] Force exiting after build completion...');
        child.kill('SIGKILL');
      }
    }, 8000);
  }
}, 1000);

// Absolute safety net: 3 minutes
setTimeout(() => {
  if (!child.killed) {
    console.log('\n[build] Absolute timeout reached, force killing...');
    child.kill('SIGKILL');
  }
}, 3 * 60 * 1000);

child.on('exit', (code, signal) => {
  if (signal === 'SIGKILL' && buildFinished) {
    console.log('[build] Exited cleanly');
    process.exit(0);
  }
  process.exit(code ?? 0);
});

child.on('error', (err) => {
  console.error('[build] Failed to start:', err);
  process.exit(1);
});
