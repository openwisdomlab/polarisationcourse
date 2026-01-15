#!/usr/bin/env node
/**
 * Update image references from .png/.jpg/.jpeg to .webp
 * in all TypeScript/JavaScript source files
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const SRC_DIR = 'src';
const PUBLIC_DIR = 'public';
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Pattern to match image references in code
const IMAGE_REF_PATTERN = /(['"`])([^'"`]*\.(png|jpg|jpeg))(['"`])/gi;

let totalReplacements = 0;
let filesModified = 0;

async function getAllSourceFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
        files.push(...await getAllSourceFiles(fullPath));
      }
    } else if (SOURCE_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function checkWebpExists(imagePath) {
  // Remove leading / for public paths
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const webpPath = cleanPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const fullPath = join(PUBLIC_DIR, webpPath.replace(/^images\//, 'images/'));

  // Handle paths that start with /images/
  if (imagePath.startsWith('/images/')) {
    const publicPath = join('public', imagePath.slice(1).replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    return existsSync(publicPath);
  }

  return existsSync(fullPath);
}

async function updateFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  let newContent = content;
  let replacements = 0;

  newContent = content.replace(IMAGE_REF_PATTERN, (match, quote1, imagePath, ext, quote2) => {
    // Only replace if it's a path to our images (starts with /images/)
    if (imagePath.startsWith('/images/')) {
      const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

      // Check if the webp file exists
      const publicPath = join('public', webpPath.slice(1));
      if (existsSync(publicPath)) {
        replacements++;
        return `${quote1}${webpPath}${quote2}`;
      } else {
        console.log(`⚠️  WebP not found for: ${imagePath}`);
        return match;
      }
    }
    return match;
  });

  if (replacements > 0) {
    await writeFile(filePath, newContent, 'utf-8');
    console.log(`✅ ${filePath}: ${replacements} replacement(s)`);
    totalReplacements += replacements;
    filesModified++;
  }

  return replacements;
}

async function main() {
  console.log('🔄 Updating Image References');
  console.log('=============================\n');

  const files = await getAllSourceFiles(SRC_DIR);
  console.log(`Found ${files.length} source files to check\n`);

  for (const file of files) {
    await updateFile(file);
  }

  console.log('\n=============================');
  console.log('📊 Summary');
  console.log('=============================');
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total replacements: ${totalReplacements}`);
}

main().catch(console.error);
