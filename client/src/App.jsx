import React, { useState, useEffect } from 'react';
import GridSetup from './components/GridSetup';
import Grid from './components/Grid';
import { connectWebSocket, sendMessage } from './services/websocketService';
import { createGrid, randomWeather } from './utils/gridUtils';
import './App.css';

function formatAge(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  return `${mins}m ${secs % 60}s ago`;
}

function App() {
  const [grid, setGrid] = useState(null);
  const [quadrants, setQuadrants] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [wsStatus, setWsStatus] = useState('connecting');
  const [weatherMeta, setWeatherMeta] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const staleness = setInterval(() => {
      const now = Date.now()
      setGrid((prev) => {
        if (!prev) return prev
        let changed = false
        const cells = prev.cells.map((cell) => {
          if (now - cell.lastUpdatedAt > 30000) {
            changed = true
            return { ...cell, weather: randomWeather(), lastUpdatedAt: now }
          }
          return cell
        })
        if (!changed) return prev
        setWeatherMeta({ source: 'local', updatedAt: now })
        return { ...prev, cells }
      })
    }, 1000)
    return () => clearInterval(staleness)
  }, []);

  useEffect(() => {
    connectWebSocket(
      (message) => {
        if (message.type === 'WEATHER_UPDATE') {
          handleWeatherUpdate(message.cells, message.quadrants);
        }
        if (message.type === 'ERROR') {
          handleServerError(message.message);
        }
        if (message.type === 'CELL_UPDATE') {
          handleCellUpdate(message.cell);
        }
      },
      (status) => setWsStatus(status)
    );
  }, []);

  const handleGridCreate = (width, height) => {
    const cells = createGrid(width, height).map(cell => ({ ...cell, lastUpdatedAt: Date.now() }));
    setGrid({ width, height, cells });
    setQuadrants(null);
    setWeatherMeta({ source: 'local', updatedAt: Date.now() });
    sendMessage({
      type: 'GRID_CREATED',
      grid: { width, height, cells }
    });
  };

  const handleWeatherUpdate = (updatedCells, updatedQuadrants) => {
    setGrid((prev) => {
      if (!prev) return prev;
      const weatherMap = Object.fromEntries(updatedCells.map((c) => [c.id, c.weather]));
      return {
        ...prev,
        cells: prev.cells.map((cell) => ({
          ...cell,
          weather: weatherMap[cell.id] ?? cell.weather,
          lastUpdatedAt: weatherMap[cell.id] ? Date.now() : cell.lastUpdatedAt
        }))
      };
    });
    setWeatherMeta({ source: 'mars orbital climate', updatedAt: Date.now() });
    if (updatedQuadrants) setQuadrants(updatedQuadrants);
  };

  const handleCellUpdate = (updatedCell) => {
    setGrid((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cells: prev.cells.map((cell) =>
          cell.id === updatedCell.id
            ? { ...cell, weather: updatedCell.weather, lastUpdatedAt: Date.now() }
            : cell
        )
      };
    });
    setWeatherMeta({ source: 'mars orbital climate', updatedAt: Date.now() });
  };

  const handleServerError = (message) => {
    setServerError(message);
    setTimeout(() => setServerError(null), 5000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Mars Rover Grid Simulator</h1>
        <div className={`ws-status ws-status--${wsStatus}`}>
          <span className="ws-status__dot" />
          <span className="ws-status__label">
            {wsStatus === 'connected'
              ? 'Connected'
              : wsStatus === 'connecting'
              ? 'Connecting…'
              : 'Disconnected'}
          </span>
        </div>
      </header>
      <main className="App-main">
        <GridSetup onGridCreate={handleGridCreate} />
        {grid && <Grid width={grid.width} height={grid.height} cells={grid.cells} quadrants={quadrants} />}
        {weatherMeta && (
          <p className="weather-meta">
            Weather last updated {formatAge(weatherMeta.updatedAt)} — source: <strong>{weatherMeta.source}</strong>
          </p>
        )}
        {serverError && (
          <p className="server-error">
            Warning: {serverError}
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
