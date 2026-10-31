/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'bun:test';
import {
  formatDateRange,
  getRegistrationStatus,
  filterEvents,
  validateEventData,
  generateGoogleCalendarUrl,
  groupEventsIntoThisMonthAndUpcoming
} from '../src/lib/event-utils';
import type { EventItem } from '../src/types/event';

describe('formatDateRange', () => {
  it('formats single day date', () => {
    expect(formatDateRange('2026-11-10')).toBe('Nov 10, 2026');
  });

  it('formats same month multi-day range', () => {
    expect(formatDateRange('2026-11-10', '2026-11-12')).toBe('Nov 10 – 12, 2026');
  });

  it('formats cross-month multi-day range', () => {
    expect(formatDateRange('2026-11-28', '2026-12-02')).toBe('Nov 28 – Dec 2, 2026');
  });

  it('formats cross-year multi-day range', () => {
    expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('Dec 30, 2026 – Jan 2, 2027');
  });
});

describe('getRegistrationStatus', () => {
  it('returns Closed when deadline has passed', () => {
    const status = getRegistrationStatus('2026-10-25', '2026-11-10', '2026-10-31');
    expect(status).toBe('Closed');
  });

  it('returns Closing Soon when deadline is within 3 days', () => {
    const status = getRegistrationStatus('2026-11-02', '2026-11-10', '2026-10-31');
    expect(status).toBe('Closing Soon');
  });

  it('returns Open when deadline is more than 3 days ahead', () => {
    const status = getRegistrationStatus('2026-11-15', '2026-11-20', '2026-10-31');
    expect(status).toBe('Open');
  });

  it('falls back to event_date when deadline is absent', () => {
    expect(getRegistrationStatus(undefined, '2026-10-20', '2026-10-31')).toBe('Closed');
    expect(getRegistrationStatus(undefined, '2026-11-20', '2026-10-31')).toBe('Open');
  });
});

describe('validateEventData', () => {
  it('validates a correct event payload', () => {
    const validEvent = {
      title: 'Tamil Nadu Hackathon 2026',
      description: 'A collegiate hackathon for developer students.',
      organizer: 'Anna University',
      category: 'Hackathon',
      mode: 'Offline',
      event_date: '2026-11-20',
      city: 'Chennai',
      venue: 'College Auditorium'
    };
    const res = validateEventData(validEvent, 'tamil-nadu-hackathon-2026.toml');
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('rejects invalid mode or date', () => {
    const invalid = {
      title: 'Invalid Event',
      description: 'Test',
      organizer: 'Club',
      category: 'Hackathon',
      mode: 'Metaverse',
      event_date: 'invalid-date'
    };
    const res = validateEventData(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });
});

describe('generateGoogleCalendarUrl', () => {
  it('generates canonical EventSapiens calendar link', () => {
    const event: EventItem = {
      id: 'test-event',
      title: 'Hackfest 2026',
      description: 'Coding competition',
      organizer: 'CEG',
      category: 'Hackathon',
      mode: 'Offline',
      event_date: '2026-11-15',
      city: 'Chennai'
    };
    const url = generateGoogleCalendarUrl(event);
    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('EventSapiens');
    expect(url).toContain('https%3A%2F%2Feventsapiens.tech');
  });
});

describe('groupEventsIntoThisMonthAndUpcoming', () => {
  it('correctly separates this month events from future upcoming events', () => {
    const events: EventItem[] = [
      {
        id: 'ev-1',
        title: 'Event 1',
        description: 'Desc',
        organizer: 'Org',
        category: 'Hackathon',
        mode: 'Online',
        event_date: '2026-10-31',
        registration_deadline: '2026-10-31'
      },
      {
        id: 'ev-2',
        title: 'Event 2',
        description: 'Desc',
        organizer: 'Org',
        category: 'Workshop',
        mode: 'Offline',
        event_date: '2026-11-15',
        registration_deadline: '2026-11-10'
      }
    ];

    const groups = groupEventsIntoThisMonthAndUpcoming(events, '2026-10-31');
    expect(groups).toHaveLength(2);
    expect(groups[0].key).toBe('this-month');
    expect(groups[0].events[0].id).toBe('ev-1');
    expect(groups[1].key).toBe('upcoming');
    expect(groups[1].events[0].id).toBe('ev-2');
  });

  it('does not label future month as this month when current month has 0 events', () => {
    const events: EventItem[] = [
      {
        id: 'ev-nov',
        title: 'November Event',
        description: 'Desc',
        organizer: 'Org',
        category: 'Hackathon',
        mode: 'Online',
        event_date: '2026-11-20',
        registration_deadline: '2026-11-15'
      }
    ];

    const groups = groupEventsIntoThisMonthAndUpcoming(events, '2026-10-31');
    expect(groups).toHaveLength(1);
    expect(groups[0].key).toBe('upcoming');
    expect(groups[0].label).toBe('Upcoming');
  });
});
