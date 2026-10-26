/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Automated Event Archiver Script
 * Usage:
 *   npx tsx scripts/archive-events.ts [--dry-run] [--date=YYYY-MM-DD]
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import type { EventItem, RawEventToml } from '../src/types/event';
import { isArchivedEligible } from '../src/lib/event-utils';

const EVENTS_DIR = path.resolve(process.cwd(), 'events');
const ARCHIVE_FILE = path.resolve(process.cwd(), 'src/data/archived.json');

// Parse CLI flags
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const dateArg = args.find((a) => a.startsWith('--date='));
const referenceDateStr = dateArg ? dateArg.split('=')[1] : undefined;

export interface ArchiveRunResult {
  eligibleCount: number;
  archivedCount: number;
  skippedCount: number;
  duplicateCount: number;
  archivedSlugs: string[];
}

export function runArchiver(dryRun = isDryRun, customDate = referenceDateStr): ArchiveRunResult {
  console.log(`[Eventsapiens Archiver] Running archiver (dryRun: ${dryRun}, date: ${customDate || 'today'})...`);

  if (!fs.existsSync(EVENTS_DIR)) {
    console.error(`Events directory not found at: ${EVENTS_DIR}`);
    return { eligibleCount: 0, archivedCount: 0, skippedCount: 0, duplicateCount: 0, archivedSlugs: [] };
  }

  // Read existing archived.json
  let existingArchived: EventItem[] = [];
  if (fs.existsSync(ARCHIVE_FILE)) {
    try {
      const raw = fs.readFileSync(ARCHIVE_FILE, 'utf-8');
      existingArchived = JSON.parse(raw);
    } catch (e) {
      console.error(`Error reading ${ARCHIVE_FILE}, initializing empty list:`, e);
      existingArchived = [];
    }
  }

  const existingIds = new Set(existingArchived.map((e) => e.id));
  const existingSignatures = new Set(
    existingArchived.map((e) => `${e.title.toLowerCase()}::${e.organizer.toLowerCase()}::${e.event_date}`)
  );

  const eventFiles = fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith('.toml') && !f.startsWith('_'));

  const newlyArchived: EventItem[] = [];
  const filesToDelete: string[] = [];
  let duplicateCount = 0;
  let skippedCount = 0;

  for (const filename of eventFiles) {
    const filePath = path.join(EVENTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const slug = filename.replace(/\.toml$/, '');

    try {
      const parsed = parse(content) as unknown as RawEventToml;

      // Check if event is eligible for archiving (end_date or event_date < reference date)
      if (isArchivedEligible(parsed, customDate)) {
        const signature = `${parsed.title.toLowerCase()}::${parsed.organizer.toLowerCase()}::${parsed.event_date}`;

        if (existingIds.has(slug) || existingSignatures.has(signature)) {
          console.warn(`[Duplicate Record] Event ${slug} is already in archived.json. Skipping duplicate append.`);
          duplicateCount++;
          // Even if duplicate in archive, delete active TOML to clear completed event
          filesToDelete.push(filePath);
        } else {
          console.log(`[Archive Target] ${slug} (concluded on ${parsed.end_date || parsed.event_date})`);
          newlyArchived.push({
            ...parsed,
            id: slug,
            isArchived: true,
            tags: Array.isArray(parsed.tags) ? parsed.tags : []
          });
          filesToDelete.push(filePath);
        }
      } else {
        skippedCount++;
      }
    } catch (err) {
      console.error(`Failed to parse ${filename}:`, err);
    }
  }

  const result: ArchiveRunResult = {
    eligibleCount: filesToDelete.length,
    archivedCount: newlyArchived.length,
    duplicateCount,
    skippedCount,
    archivedSlugs: newlyArchived.map((e) => e.id)
  };

  if (dryRun) {
    console.log(`[Dry Run Summary] ${newlyArchived.length} events would be archived, ${filesToDelete.length} files removed.`);
    return result;
  }

  if (newlyArchived.length > 0) {
    const updatedArchived = [...newlyArchived, ...existingArchived];
    // Sort descending by event_date
    updatedArchived.sort((a, b) => b.event_date.localeCompare(a.event_date));

    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(updatedArchived, null, 2) + '\n', 'utf-8');
    console.log(`Updated ${ARCHIVE_FILE} with ${newlyArchived.length} new entries.`);
  }

  for (const file of filesToDelete) {
    fs.unlinkSync(file);
    console.log(`Removed active file: ${path.basename(file)}`);
  }

  console.log(`Archiving complete. Successfully archived ${newlyArchived.length} events.`);
  return result;
}

// Execute when invoked directly from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runArchiver();
}
