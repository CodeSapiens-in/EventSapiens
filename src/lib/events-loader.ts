/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { parse } from 'smol-toml';
import type { EventItem, RawEventToml } from '../types/event';
import archivedEventsRaw from '../data/archived.json';

// Discover all active TOML files in /events/ at build time
const tomlFiles = import.meta.glob('/events/*.toml', {
  query: '?raw',
  eager: true
}) as Record<string, { default: string }>;

let cachedActiveEvents: EventItem[] | null = null;
let cachedArchivedEvents: EventItem[] | null = null;

export function loadActiveEvents(): EventItem[] {
  if (cachedActiveEvents) return cachedActiveEvents;

  const events: EventItem[] = [];

  for (const [path, module] of Object.entries(tomlFiles)) {
    // Skip template files or files starting with _
    const filename = path.split('/').pop() || '';
    if (filename.startsWith('_')) continue;

    const rawContent = module.default;
    try {
      const parsed = parse(rawContent) as unknown as RawEventToml;
      const slug = filename.replace(/\.toml$/, '');

      events.push({
        ...parsed,
        id: slug,
        filename,
        isArchived: false,
        // Ensure tags is an array
        tags: Array.isArray(parsed.tags) ? parsed.tags : []
      });
    } catch (err) {
      console.error(`Failed to parse TOML event at ${path}:`, err);
    }
  }

  // Sort upcoming events chronologically
  events.sort((a, b) => a.event_date.localeCompare(b.event_date));
  cachedActiveEvents = events;
  return events;
}

export function loadArchivedEvents(): EventItem[] {
  if (cachedArchivedEvents) return cachedArchivedEvents;

  const list = (archivedEventsRaw as unknown as EventItem[]).map((item) => ({
    ...item,
    isArchived: true,
    tags: Array.isArray(item.tags) ? item.tags : []
  }));

  // Sort archived events descending (newest first)
  list.sort((a, b) => b.event_date.localeCompare(a.event_date));
  cachedArchivedEvents = list;
  return list;
}

export function getAllEvents(): EventItem[] {
  return [...loadActiveEvents(), ...loadArchivedEvents()];
}

export function getEventById(id: string): EventItem | undefined {
  return getAllEvents().find((ev) => ev.id === id);
}
