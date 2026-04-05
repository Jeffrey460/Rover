const WEATHER_VALUES = ['calm', 'windy', 'stormy'];

export function randomWeather() {
  return WEATHER_VALUES[Math.floor(Math.random() * WEATHER_VALUES.length)];
}

export function createGrid(width, height) {
  const cells = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      cells.push({
        id: `${col}-${row}`,
        itemPresent: false,
        weather: randomWeather(),
      });
    }
  }
  return cells;
}
