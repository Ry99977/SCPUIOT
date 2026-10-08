const { execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname);
console.log('Installing dependencies in:', projectDir);

try {
  console.log('Setting npm registry to taobao mirror...');
  execSync('npm config set registry https://registry.npmmirror.com', {
    cwd: projectDir,
    stdio: 'inherit',
  });
  
  console.log('Installing dependencies...');
  execSync('npm install', {
    cwd: projectDir,
    stdio: 'inherit',
    timeout: 600000,
  });
  console.log('Install completed successfully');
} catch (error) {
  console.error('Install failed:', error.message);
  process.exit(1);
}
