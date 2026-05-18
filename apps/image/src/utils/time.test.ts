import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDistanceToNow, formatDuration } from './time';

describe('formatDistanceToNow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats recent timestamps across each display bucket', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T12:00:00.000Z'));

    expect(formatDistanceToNow(Date.now() - 4_000)).toBe('just now');
    expect(formatDistanceToNow(Date.now() - 12_000)).toBe('12s ago');
    expect(formatDistanceToNow(Date.now() - 5 * 60_000)).toBe('5m ago');
    expect(formatDistanceToNow(Date.now() - 3 * 60 * 60_000)).toBe('3h ago');
    expect(formatDistanceToNow(Date.now() - 24 * 60 * 60_000)).toBe('yesterday');
    expect(formatDistanceToNow(Date.now() - 3 * 24 * 60 * 60_000)).toBe('3d ago');
  });
});

describe('formatDuration', () => {
  it('formats sub-hour durations as minutes and seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65_900)).toBe('1:05');
  });

  it('formats hour-long durations with padded minutes and seconds', () => {
    expect(formatDuration(3_661_000)).toBe('1:01:01');
    expect(formatDuration(10 * 60 * 60_000 + 5_000)).toBe('10:00:05');
  });
});
