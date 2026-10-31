/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'bun:test';
import {
  isArchivedEligible,
  getEffectiveDateString,
  getRegistrationStatus
} from '../src/lib/event-utils';

describe('isArchivedEligible', () => {
  it('archives an event whose registration deadline has passed even if event_date is in the future', () => {
    const event = {
      event_date: '2026-11-20',
      registration_deadline: '2026-10-25'
    };
    expect(isArchivedEligible(event, '2026-10-31')).toBe(true);
  });

  it('keeps an event active when registration deadline is in the future', () => {
    const event = {
      event_date: '2026-11-20',
      registration_deadline: '2026-11-10'
    };
    expect(isArchivedEligible(event, '2026-10-31')).toBe(false);
  });

  it('keeps an event active on the exact deadline day', () => {
    const event = {
      event_date: '2026-11-20',
      registration_deadline: '2026-10-31'
    };
    expect(isArchivedEligible(event, '2026-10-31')).toBe(false);
  });

  it('archives an event with missing registration_deadline when end_date has passed', () => {
    const event = {
      event_date: '2026-10-20',
      end_date: '2026-10-25'
    };
    expect(isArchivedEligible(event, '2026-10-31')).toBe(true);
  });

  it('keeps an event active with missing registration_deadline when end_date is in the future', () => {
    const event = {
      event_date: '2026-10-28',
      end_date: '2026-11-02'
    };
    expect(isArchivedEligible(event, '2026-10-31')).toBe(false);
  });

  it('archives an event with missing registration_deadline and end_date when event_date has passed', () => {
    const event = {
      event_date: '2026-10-20'
    };
    expect(isArchivedEligible(event, '2026-10-31')).toBe(true);
  });

  it('keeps an event active when all dates are in the future', () => {
    const event = {
      event_date: '2026-11-15'
    };
    expect(isArchivedEligible(event, '2026-10-31')).toBe(false);
  });
});

describe('getEffectiveDateString', () => {
  it('returns valid YYYY-MM-DD format', () => {
    const today = getEffectiveDateString();
    expect(/^\d{4}-\d{2}-\d{2}$/.test(today)).toBe(true);
  });

  it('respects date override', () => {
    expect(getEffectiveDateString('2026-12-25')).toBe('2026-12-25');
  });
});

describe('getRegistrationStatus', () => {
  it('correctly marks registration Closed after deadline', () => {
    expect(getRegistrationStatus('2026-10-20', '2026-11-15', '2026-10-31')).toBe('Closed');
  });

  it('marks registration Closing Soon within 3 days', () => {
    expect(getRegistrationStatus('2026-11-02', '2026-11-15', '2026-10-31')).toBe('Closing Soon');
  });

  it('marks registration Open when deadline is well ahead', () => {
    expect(getRegistrationStatus('2026-11-10', '2026-11-15', '2026-10-31')).toBe('Open');
  });
});
