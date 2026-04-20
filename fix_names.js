const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /Portal SENAI/g, to: 'Sistema Interativo de Aprendizagem' },
  { from: /PORTAL SENAI/g, to: 'Sistema Interativo de Aprendizagem' },
  { from: /Portal Senai/g, to: 'Sistema Interativo de Aprendizagem' },
  { from: /SENAI/g, to: 'Inteligência Educacional Interativa' },
  { from: /Senai/g, to: 'Inteligência Educacional Interativa' }
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git' && file !== '.next') {
        walk(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.md') || file.endsWith('.json')) {
      if (file === 'package-lock.json') return;
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      replacements.forEach(r => {
        if (r.from.test(content)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

walk('.');
