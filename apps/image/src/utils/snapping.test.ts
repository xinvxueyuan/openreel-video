import { describe, expect, it } from 'vitest';
import type { Layer } from '../types/project';
import { calculateSnap } from './snapping';

const canvas = { x: 0, y: 0, width: 200, height: 120 };

const baseConfig = {
  snapToObjects: false,
  snapToGuides: false,
  snapToGrid: false,
  gridSize: 10,
  threshold: 5,
};

function layerWithBounds(x: number, y: number, width: number, height: number): Layer {
  return {
    transform: {
      x,
      y,
      width,
      height,
    },
  } as Layer;
}

describe('calculateSnap', () => {
  it('keeps the moving bounds when snapping is disabled', () => {
    const result = calculateSnap(
      { x: 97, y: 44, width: 20, height: 10 },
      [layerWithBounds(100, 50, 40, 30)],
      canvas,
      [{ id: 'guide-1', type: 'vertical', position: 100 }],
      baseConfig
    );

    expect(result).toEqual({ x: 97, y: 44, guides: [] });
  });

  it('snaps to nearby layer edges and returns one guide per axis', () => {
    const result = calculateSnap(
      { x: 96, y: 78, width: 20, height: 10 },
      [layerWithBounds(100, 80, 40, 30)],
      canvas,
      [],
      { ...baseConfig, snapToObjects: true }
    );

    expect(result.x).toBe(100);
    expect(result.y).toBe(80);
    expect(result.guides).toEqual([
      { type: 'vertical', position: 100, start: 0, end: 120 },
      { type: 'horizontal', position: 80, start: 0, end: 200 },
    ]);
  });

  it('snaps the moving center to vertical and horizontal guides', () => {
    const result = calculateSnap(
      { x: 43, y: 23, width: 10, height: 10 },
      [],
      canvas,
      [
        { id: 'guide-x', type: 'vertical', position: 50 },
        { id: 'guide-y', type: 'horizontal', position: 30 },
      ],
      { ...baseConfig, snapToGuides: true, threshold: 2 }
    );

    expect(result.x).toBe(45);
    expect(result.y).toBe(25);
    expect(result.guides).toEqual([
      { type: 'vertical', position: 50, start: 0, end: 120 },
      { type: 'horizontal', position: 30, start: 0, end: 200 },
    ]);
  });

  it('uses grid snapping only when a positive grid size is configured', () => {
    const result = calculateSnap(
      { x: 12, y: 29, width: 10, height: 10 },
      [],
      canvas,
      [],
      { ...baseConfig, snapToGrid: true, gridSize: 10, threshold: 2 }
    );

    expect(result.x).toBe(10);
    expect(result.y).toBe(30);

    const disabledGrid = calculateSnap(
      { x: 12, y: 29, width: 10, height: 10 },
      [],
      canvas,
      [],
      { ...baseConfig, snapToGrid: true, gridSize: 0, threshold: 2 }
    );

    expect(disabledGrid).toEqual({ x: 12, y: 29, guides: [] });
  });
});
