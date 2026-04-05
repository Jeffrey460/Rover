import { randomWeather, createGrid } from './gridUtils';

const VALID_WEATHER = ['calm', 'windy', 'stormy'];

describe('randomWeather', () => {
  test('returns only valid weather values', () => {
    for (let i = 0; i < 100; i++) {
      expect(VALID_WEATHER).toContain(randomWeather());
    }
  });
});

describe('createGrid', () => {
  test('createGrid(3, 2) returns exactly 6 cells', () => {
    expect(createGrid(3, 2)).toHaveLength(6);
  });

  test('createGrid(3, 2) gives every cell itemPresent: false', () => {
    createGrid(3, 2).forEach((cell) => {
      expect(cell.itemPresent).toBe(false);
    });
  });

  test('createGrid(3, 2) gives every cell a valid weather value', () => {
    createGrid(3, 2).forEach((cell) => {
      expect(VALID_WEATHER).toContain(cell.weather);
    });
  });

  test('createGrid(1, 1) works for edge case single cell', () => {
    const cells = createGrid(1, 1);
    expect(cells).toHaveLength(1);
    expect(cells[0].id).toBe('0-0');
    expect(cells[0].itemPresent).toBe(false);
    expect(VALID_WEATHER).toContain(cells[0].weather);
  });
});
