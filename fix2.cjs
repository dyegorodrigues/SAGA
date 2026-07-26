const fs = require('fs');
let content = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf8');

content = content.replace('        )}}', '        )}');

fs.writeFileSync('src/components/KidHomeScreen.tsx', content);
