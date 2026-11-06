import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Optimize lucide-react barrel exports to prevent Rollup EMFILE open file limit hang
function lucideOptimizationPlugin() {
  let iconMap = null;
  return {
    name: 'lucide-optimization',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.jsx') && !id.endsWith('.js')) return;
      if (!code.includes('lucide-react')) return;

      if (!iconMap) {
        try {
          const mjsPath = path.resolve('node_modules/lucide-react/dist/esm/lucide-react.mjs');
          const content = fs.readFileSync(mjsPath, 'utf8');
          iconMap = {};
          const regex = /export \{([^}]+)\} from '\.\/icons\/([^']+)\.mjs';/g;
          let m;
          while ((m = regex.exec(content)) !== null) {
            const file = m[2];
            const names = m[1].split(',').map(s => {
              const parts = s.trim().split(/\s+as\s+/);
              return parts[parts.length - 1];
            });
            for (const name of names) {
              iconMap[name] = file;
            }
          }
        } catch (e) {
          iconMap = {};
        }
      }

      return code.replace(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?/g, (match, imports) => {
        const items = imports.split(',').map(s => s.trim()).filter(Boolean);
        return items.map(item => {
          const [orig, alias] = item.split(/\s+as\s+/);
          const iconName = orig.trim();
          const asName = alias ? alias.trim() : iconName;
          const file = iconMap[iconName];
          if (file) {
            return `import ${asName} from 'lucide-react/dist/esm/icons/${file}.mjs';`;
          }
          return `import { ${item} } from 'lucide-react';`;
        }).join('\n');
      });
    }
  };
}

export default defineConfig({
  plugins: [lucideOptimizationPlugin(), react()],
  server: {
    port: 3000,
    host: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
});
