const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit');
  console.log('SUCCESS');
} catch (e) {
  console.log('ERROR:\n' + e.stdout.toString());
}
