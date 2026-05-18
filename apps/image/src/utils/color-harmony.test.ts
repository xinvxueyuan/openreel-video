import { describe, expect, it } from 'vitest';
import {
  getAllHarmonies,
  getAnalogous,
  getComplementary,
  getMonochromatic,
  getSplitComplementary,
  getTetradic,
  getTriadic,
  hexToHSL,
  hslToHex,
} from './color-harmony';

describe('color harmony utilities', () => {
  it('converts between hex and HSL for primary and grayscale colors', () => {
    expect(hexToHSL('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
    expect(hexToHSL('#808080')).toEqual({ h: 0, s: 0, l: expect.closeTo(50.196, 3) });
    expect(hexToHSL('not-a-color')).toEqual({ h: 0, s: 0, l: 0 });

    expect(hslToHex({ h: 120, s: 100, l: 50 })).toBe('#00ff00');
    expect(hslToHex({ h: 0, s: 0, l: 50 })).toBe('#808080');
  });

  it('generates expected harmonies for a red base color', () => {
    expect(getComplementary('#ff0000')).toEqual(['#00ffff']);
    expect(getAnalogous('#ff0000')).toEqual(['#ff0080', '#ff8000']);
    expect(getTriadic('#ff0000')).toEqual(['#00ff00', '#0000ff']);
    expect(getSplitComplementary('#ff0000')).toEqual(['#00ff80', '#007fff']);
    expect(getTetradic('#ff0000')).toEqual(['#80ff00', '#00ffff', '#7f00ff']);
    expect(getMonochromatic('#ff0000')).toEqual(['#990000', '#cc0000', '#ff3333', '#ff6666']);
  });

  it('returns every named harmony with the original base color first', () => {
    const harmonies = getAllHarmonies('#336699');

    expect(harmonies.map((harmony) => harmony.type)).toEqual([
      'complementary',
      'analogous',
      'triadic',
      'split-complementary',
      'tetradic',
      'monochromatic',
    ]);
    expect(harmonies.every((harmony) => harmony.colors[0] === '#336699')).toBe(true);
  });
});
