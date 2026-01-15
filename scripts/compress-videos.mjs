#!/usr/bin/env node
/**
 * Video Compression Script using fluent-ffmpeg
 * Compresses MP4 videos with H.264 encoding
 *
 * Usage: node scripts/compress-videos.mjs [--dry-run] [--crf=28]
 */

import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import Ffmpeg from 'fluent-ffmpeg';
import { readdir, stat, unlink, rename } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { existsSync } from 'fs';

// Set ffmpeg path
Ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const VIDEOS_DIR = 'public/videos';
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];
const DEFAULT_CRF = 28; // Higher = smaller file, lower quality (23-28 is good)

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const crfArg = args.find(a => a.startsWith('--crf='));
const crf = crfArg ? parseInt(crfArg.split('=')[1]) : DEFAULT_CRF;

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let processedCount = 0;
let skippedCount = 0;
const results = [];

async function getAllVideos(dir) {
  const files = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllVideos(fullPath));
    } else if (VIDEO_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function compressVideo(inputPath, crf) {
  return new Promise(async (resolve, reject) => {
    const outputPath = inputPath.replace(/(\.[^.]+)$/, '_compressed$1');

    try {
      const originalStats = await stat(inputPath);
      const originalSize = originalStats.size;

      console.log(`🎬 Compressing: ${basename(inputPath)} (${(originalSize / 1024 / 1024).toFixed(2)} MB)...`);

      let lastProgress = 0;

      Ffmpeg(inputPath)
        .videoCodec('libx264')
        .addOptions([
          `-crf ${crf}`,
          '-preset medium',
          '-movflags +faststart'
        ])
        .audioCodec('aac')
        .audioBitrate('128k')
        .on('progress', (progress) => {
          if (progress.percent && progress.percent - lastProgress > 10) {
            process.stdout.write(`\r   Progress: ${progress.percent.toFixed(0)}%`);
            lastProgress = progress.percent;
          }
        })
        .on('end', async () => {
          process.stdout.write('\r');

          try {
            const compressedStats = await stat(outputPath);
            const compressedSize = compressedStats.size;

            // Only keep if compression actually reduced size
            if (compressedSize < originalSize) {
              // Replace original with compressed
              await unlink(inputPath);
              await rename(outputPath, inputPath);

              const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

              totalOriginalSize += originalSize;
              totalCompressedSize += compressedSize;
              processedCount++;

              const result = {
                inputPath,
                originalSize,
                compressedSize,
                savings: parseFloat(savings)
              };
              results.push(result);

              console.log(`✅ ${basename(inputPath)}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${savings}% saved)`);

              resolve(result);
            } else {
              // Remove compressed file, keep original
              await unlink(outputPath);
              console.log(`⏭️  ${basename(inputPath)}: Already optimized (compression would increase size)`);
              skippedCount++;
              resolve(null);
            }
          } catch (error) {
            reject(error);
          }
        })
        .on('error', async (error) => {
          // Clean up partial output
          try {
            if (existsSync(outputPath)) {
              await unlink(outputPath);
            }
          } catch (e) {}

          console.error(`❌ Error: ${error.message}`);
          skippedCount++;
          resolve(null); // Continue with other files
        })
        .save(outputPath);

    } catch (error) {
      reject(error);
    }
  });
}

async function main() {
  console.log('🎬 Video Compression Script (fluent-ffmpeg)');
  console.log('==========================================');
  console.log(`FFmpeg: ${ffmpegInstaller.version}`);
  console.log(`CRF: ${crf} (lower = better quality, larger file)`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  // Get all videos
  const videos = await getAllVideos(VIDEOS_DIR);
  console.log(`Found ${videos.length} videos to process\n`);

  if (videos.length === 0) {
    console.log('No videos found.');
    return;
  }

  // Sort by size (largest first)
  const videoStats = await Promise.all(
    videos.map(async (path) => {
      const stats = await stat(path);
      return { path, size: stats.size };
    })
  );
  videoStats.sort((a, b) => b.size - a.size);

  if (dryRun) {
    for (const { path, size } of videoStats) {
      console.log(`🔍 Would compress: ${basename(path)} (${(size / 1024 / 1024).toFixed(2)} MB)`);
    }
  } else {
    for (const { path } of videoStats) {
      await compressVideo(path, crf);
    }
  }

  console.log('\n==========================================');
  console.log('📊 Summary');
  console.log('==========================================');
  console.log(`Processed: ${processedCount} videos`);
  console.log(`Skipped: ${skippedCount} videos`);

  if (!dryRun && processedCount > 0) {
    const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
    const totalCompressedMB = (totalCompressedSize / 1024 / 1024).toFixed(2);
    const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);

    console.log(`Original total: ${totalOriginalMB} MB`);
    console.log(`Compressed total: ${totalCompressedMB} MB`);
    console.log(`Total savings: ${totalSavings}%`);

    // Show top 5 by savings
    if (results.length > 0) {
      console.log('\n📈 Top 5 by Size Reduction:');
      const topBySize = [...results].sort((a, b) => (b.originalSize - b.compressedSize) - (a.originalSize - a.compressedSize)).slice(0, 5);
      for (const r of topBySize) {
        const savedKB = ((r.originalSize - r.compressedSize) / 1024).toFixed(0);
        console.log(`  ${basename(r.inputPath)}: saved ${savedKB}KB (${r.savings}%)`);
      }
    }
  }
}

main().catch(console.error);
