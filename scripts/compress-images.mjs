#!/usr/bin/env node
/**
 * Image Compression Script
 * Converts PNG/JPG images to WebP format using sharp
 *
 * Usage: node scripts/compress-images.mjs [--dry-run] [--quality=80]
 */

import sharp from 'sharp';
import { readdir, stat, mkdir, unlink } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { existsSync } from 'fs';

const IMAGES_DIR = 'public/images';
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const DEFAULT_QUALITY = 80;

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const qualityArg = args.find(a => a.startsWith('--quality='));
const quality = qualityArg ? parseInt(qualityArg.split('=')[1]) : DEFAULT_QUALITY;

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let processedCount = 0;
let skippedCount = 0;
const results = [];

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

async function compressImage(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  const webpPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  try {
    const originalStats = await stat(inputPath);
    const originalSize = originalStats.size;

    // Check if WebP already exists
    if (existsSync(webpPath)) {
      const webpStats = await stat(webpPath);
      console.log(`⏭️  Skipped (WebP exists): ${inputPath}`);
      skippedCount++;
      return null;
    }

    if (dryRun) {
      console.log(`🔍 Would convert: ${inputPath} → ${webpPath}`);
      return { inputPath, webpPath, originalSize, compressedSize: 0, savings: 0 };
    }

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(webpPath);

    const compressedStats = await stat(webpPath);
    const compressedSize = compressedStats.size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    totalOriginalSize += originalSize;
    totalCompressedSize += compressedSize;
    processedCount++;

    const result = {
      inputPath,
      webpPath,
      originalSize,
      compressedSize,
      savings: parseFloat(savings)
    };

    results.push(result);

    const originalSizeKB = (originalSize / 1024).toFixed(1);
    const compressedSizeKB = (compressedSize / 1024).toFixed(1);

    console.log(`✅ ${basename(inputPath)} → ${basename(webpPath)}: ${originalSizeKB}KB → ${compressedSizeKB}KB (${savings}% saved)`);

    return result;
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Image Compression Script');
  console.log('=============================');
  console.log(`Quality: ${quality}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  if (!existsSync(IMAGES_DIR)) {
    console.error(`❌ Directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const images = await getAllImages(IMAGES_DIR);
  console.log(`Found ${images.length} images to process\n`);

  // Sort by size (largest first)
  const imageStats = await Promise.all(
    images.map(async (path) => {
      const stats = await stat(path);
      return { path, size: stats.size };
    })
  );
  imageStats.sort((a, b) => b.size - a.size);

  for (const { path } of imageStats) {
    await compressImage(path);
  }

  console.log('\n=============================');
  console.log('📊 Summary');
  console.log('=============================');
  console.log(`Processed: ${processedCount} images`);
  console.log(`Skipped: ${skippedCount} images`);

  if (!dryRun && processedCount > 0) {
    const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
    const totalCompressedMB = (totalCompressedSize / 1024 / 1024).toFixed(2);
    const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);

    console.log(`Original total: ${totalOriginalMB} MB`);
    console.log(`Compressed total: ${totalCompressedMB} MB`);
    console.log(`Total savings: ${totalSavings}%`);

    // Show top 10 by savings
    console.log('\n📈 Top 10 by Size Reduction:');
    const topBySize = [...results].sort((a, b) => (b.originalSize - b.compressedSize) - (a.originalSize - a.compressedSize)).slice(0, 10);
    for (const r of topBySize) {
      const savedKB = ((r.originalSize - r.compressedSize) / 1024).toFixed(0);
      console.log(`  ${basename(r.inputPath)}: saved ${savedKB}KB (${r.savings}%)`);
    }
  }
}

main().catch(console.error);
