const { execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname);
console.log('Installing dependencies in:', projectDir);

try {
  const result = execSync('npm install', {
    cwd: projectDir,
    stdio: 'inherit',
    timeout: 300000,
  });
  console.log('Install completed successfully');
} catch (error) {
  console.error('Install failed:', error.message);
  process.exit(1);
}
