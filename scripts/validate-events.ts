/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Event Validation Script for CI and Pull Requests
 * Usage:
 *   npx tsx scripts/validate-events.ts
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';
import { validateEventData } from '../src/lib/event-utils';

const EVENTS_DIR = path.resolve(process.cwd(), 'events');
const ARCHIVE_FILE = path.resolve(process.cwd(), 'src/data/archived.json');

export interface ValidationSummary {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  errorsByFile: Record<string, string[]>;
}

export function validateAllEvents(): ValidationSummary {
  console.log(`[Eventsapiens Validator] Inspecting event TOML files in ${EVENTS_DIR}...`);

  if (!fs.existsSync(EVENTS_DIR)) {
    console.error(`Events directory not found!`);
    return { totalFiles: 0, validFiles: 0, invalidFiles: 0, errorsByFile: {} };
  }

  // Load archived IDs to prevent collision
  let archivedIds = new Set<string>();
  if (fs.existsSync(ARCHIVE_FILE)) {
    try {
      const archived = JSON.parse(fs.readFileSync(ARCHIVE_FILE, 'utf-8'));
      archivedIds = new Set(archived.map((e: { id: string }) => e.id));
    } catch (e) {
      console.warn('Could not read archived.json:', e);
    }
  }

  const files = fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith('.toml') && !f.startsWith('_'));
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();

  const errorsByFile: Record<string, string[]> = {};
  let validFiles = 0;
  let invalidFiles = 0;

  for (const filename of files) {
    const filePath = path.join(EVENTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const slug = filename.replace(/\.toml$/, '');
    const fileErrors: string[] = [];

    // Check filename format (kebab-case)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      fileErrors.push(
        `Filename "${filename}" should only contain lowercase alphanumeric characters and hyphens (e.g. college-hackathon.toml)`
      );
    }

    // Check slug collision
    if (seenIds.has(slug)) {
      fileErrors.push(`Duplicate slug detected: "${slug}" is used by multiple event files`);
    }
    seenIds.add(slug);

    if (archivedIds.has(slug)) {
      fileErrors.push(`Slug "${slug}" already exists in src/data/archived.json`);
    }

    // Parse TOML
    try {
      const parsed = parse(content);
      const valResult = validateEventData(parsed, filename);

      if (!valResult.valid) {
        fileErrors.push(...valResult.errors);
      } else {
        const titleKey = ((parsed as any).title || '').trim().toLowerCase();
        if (titleKey && seenTitles.has(titleKey)) {
          fileErrors.push(`Duplicate title detected: Another active event shares the exact title "${(parsed as any).title}"`);
        }
        seenTitles.add(titleKey);
      }
    } catch (err: any) {
      fileErrors.push(`TOML syntax error: ${err.message || err}`);
    }

    if (fileErrors.length > 0) {
      invalidFiles++;
      errorsByFile[filename] = fileErrors;
    } else {
      validFiles++;
    }
  }

  console.log(`\nValidation complete:`);
  console.log(`- Total active events: ${files.length}`);
  console.log(`- Valid events: ${validFiles}`);
  console.log(`- Invalid events: ${invalidFiles}\n`);

  if (invalidFiles > 0) {
    console.error('Errors found in event files:');
    for (const [file, errs] of Object.entries(errorsByFile)) {
      console.error(`\n📄 events/${file}:`);
      errs.forEach((err) => console.error(`   ❌ ${err}`));
    }
  } else {
    console.log('✅ All event TOML files passed schema and integrity validation!');
  }

  return {
    totalFiles: files.length,
    validFiles,
    invalidFiles,
    errorsByFile
  };
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validateAllEvents();
  if (result.invalidFiles > 0) {
    process.exit(1);
  }
}
