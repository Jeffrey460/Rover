import { WEATHER_STYLES } from './weatherStyles';

describe('WEATHER_STYLES', () => {
  test('has exactly three keys: calm, windy, stormy', () => {
    expect(Object.keys(WEATHER_STYLES)).toEqual(['calm', 'windy', 'stormy']);
  });

  test.each([['calm'], ['windy'], ['stormy']])(
    '%s entry has a background and a label property',
    (key) => {
      expect(WEATHER_STYLES[key]).toHaveProperty('background');
      expect(WEATHER_STYLES[key]).toHaveProperty('label');
    }
  );

  test('calm background is #FFD8A8', () => {
    expect(WEATHER_STYLES.calm.background).toBe('#FFD8A8');
  });

  test('windy background is #fff3cd', () => {
    expect(WEATHER_STYLES.windy.background).toBe('#fff3cd');
  });

  test('stormy background is #6c6c6c', () => {
    expect(WEATHER_STYLES.stormy.background).toBe('#6c6c6c');
  });
});

