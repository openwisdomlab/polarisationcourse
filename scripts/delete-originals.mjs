#!/usr/bin/env node
/**
 * Delete original PNG/JPG images that have been converted to WebP
 * Only deletes files where the corresponding WebP exists
 */

import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

const IMAGES_DIR = 'public/images';
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

let deletedCount = 0;
let deletedSize = 0;
let skippedCount = 0;

async function getAllImages(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllImages(fullPath));
    } else if (IMAGE_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function deleteOriginal(filePath) {
  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  if (!existsSync(webpPath)) {
    console.log(`⏭️  Skipped (no WebP): ${basename(filePath)}`);
    skippedCount++;
    return false;
  }

  const stats = await stat(filePath);
  const sizeKB = (stats.size / 1024).toFixed(1);

  if (dryRun) {
    console.log(`🔍 Would delete: ${filePath} (${sizeKB}KB)`);
    deletedSize += stats.size;
    deletedCount++;
    return true;
  }

  await unlink(filePath);
  console.log(`🗑️  Deleted: ${basename(filePath)} (${sizeKB}KB)`);
  deletedSize += stats.size;
  deletedCount++;
  return true;
}

async function main() {
  console.log('🗑️  Delete Original Images');
  console.log('=============================');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  const images = await getAllImages(IMAGES_DIR);
  console.log(`Found ${images.length} original images\n`);

  for (const image of images) {
    await deleteOriginal(image);
  }

  console.log('\n=============================');
  console.log('📊 Summary');
  console.log('=============================');
  console.log(`${dryRun ? 'Would delete' : 'Deleted'}: ${deletedCount} files`);
  console.log(`Skipped: ${skippedCount} files`);
  console.log(`Space ${dryRun ? 'would be' : ''} freed: ${(deletedSize / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
