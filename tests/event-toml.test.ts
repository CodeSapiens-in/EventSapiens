/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'bun:test';
import { createEventSlug, serializeEventToToml } from '../src/lib/event-toml';
import type { RawEventToml } from '../src/types/event';

describe('createEventSlug', () => {
  it('converts title to clean lowercase kebab-case slug', () => {
    expect(createEventSlug('Kurukshetra 2026 – Tech Fest!')).toBe('kurukshetra-2026-tech-fest');
  });

  it('handles consecutive hyphens and trims edges', () => {
    expect(createEventSlug('---Hackathon   Challenge---')).toBe('hackathon-challenge');
  });
});

describe('serializeEventToToml', () => {
  it('serializes event data including stages into valid TOML format', () => {
    const event: RawEventToml = {
      title: 'AI Summit',
      description: 'Annual college summit',
      organizer: 'Tech Club',
      category: 'Conference',
      mode: 'Hybrid',
      event_date: '2026-11-20',
      stages: [
        {
          name: 'Prelims',
          date: '2026-11-10',
          mode: 'Online'
        },
        {
          name: 'Finals',
          date: '2026-11-20',
          mode: 'Offline',
          venue: 'Campus Hall'
        }
      ]
    };

    const toml = serializeEventToToml(event);
    expect(toml).toContain('title = "AI Summit"');
    expect(toml).toContain('[[stages]]');
    expect(toml).toContain('name = "Prelims"');
    expect(toml).toContain('name = "Finals"');
    expect(toml).toContain('venue = "Campus Hall"');
  });
});
