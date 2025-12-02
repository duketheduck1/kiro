/**
 * Helper script to update API URLs after Vercel deployment
 * Usage: node update-api-urls.js https://your-project.vercel.app
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Please provide your Vercel URL');
  console.log('Usage: node update-api-urls.js https://your-project.vercel.app');
  process.exit(1);
}

const vercelUrl = args[0].replace(/\/$/, ''); // Remove trailing slash
console.log(`🔄 Updating API URLs to: ${vercelUrl}`);

// Files to update
const filesToUpdate = [
  {
    path: 'public/index.html',
    replacements: [
      {
        from: "apiBaseUrl: 'http://localhost:3000/api'",
        to: `apiBaseUrl: '${vercelUrl}/api'`
      }
    ]
  },
  {
    path: 'public/editor.html',
    replacements: [
      {
        from: "apiBaseUrl: 'http://localhost:3000/api'",
        to: `apiBaseUrl: '${vercelUrl}/api'`
      }
    ]
  },
  {
    path: 'src/frontend/clippy-bookmarklet.js',
    replacements: [
      {
        from: "const CLIPPY_SERVER = 'http://localhost:3000';",
        to: `const CLIPPY_SERVER = '${vercelUrl}';`
      }
    ]
  },
  {
    path: 'public/bookmarklet.html',
    replacements: [
      {
        from: /http:\/\/localhost:3000/g,
        to: vercelUrl
      }
    ]
  }
];

let updatedCount = 0;
let errorCount = 0;

filesToUpdate.forEach(({ path: filePath, replacements }) => {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    replacements.forEach(({ from, to }) => {
      if (typeof from === 'string') {
        if (content.includes(from)) {
          content = content.replace(from, to);
          modified = true;
        }
      } else {
        // RegExp
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      }
    });

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      updatedCount++;
    } else {
      console.log(`⚠️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n📊 Summary:');
console.log(`   ✅ Updated: ${updatedCount} files`);
console.log(`   ❌ Errors: ${errorCount} files`);

if (errorCount === 0) {
  console.log('\n🎉 All API URLs updated successfully!');
  console.log('💡 Commit and push these changes to deploy to Vercel.');
} else {
  console.log('\n⚠️  Some files had errors. Please check and update manually.');
  process.exit(1);
}
