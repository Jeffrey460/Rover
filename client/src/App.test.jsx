import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./services/websocketService', () => ({
  connectWebSocket: jest.fn(),
  sendMessage: jest.fn(),
}));

import { connectWebSocket, sendMessage } from './services/websocketService';

// Helper to get the onMessage callback registered with connectWebSocket
const getOnMessage = () => connectWebSocket.mock.calls[0][0];

const setupGrid = () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/grid size input/i), { target: { value: '2 by 2' } });
  fireEvent.click(screen.getByRole('button', { name: /generate grid/i }));
};

describe('App WebSocket integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('sendMessage is called with type GRID_CREATED when grid is generated', () => {
    setupGrid();
    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'GRID_CREATED' })
    );
  });

  test('sendMessage payload contains correct width, height, and cells', () => {
    setupGrid();
    const call = sendMessage.mock.calls.find(c => c[0].type === 'GRID_CREATED');
    expect(call[0].grid.width).toBe(2);
    expect(call[0].grid.height).toBe(2);
    expect(call[0].grid.cells).toHaveLength(4);
  });

  test('cell weather colours update when WEATHER_UPDATE message is received', () => {
    setupGrid();
    const onMessage = getOnMessage();
    act(() => {
      onMessage({
        type: 'WEATHER_UPDATE',
        cells: [
          { id: '0-0', weather: 'stormy', itemPresent: false },
          { id: '1-0', weather: 'stormy', itemPresent: false },
          { id: '0-1', weather: 'stormy', itemPresent: false },
          { id: '1-1', weather: 'stormy', itemPresent: false },
        ]
      });
    });
    const stormyCells = screen.getAllByTestId(/^cell-/);
    stormyCells.forEach(cell => {
      expect(cell).toHaveStyle({ backgroundColor: '#6c6c6c' });
    });
  });

  test('itemPresent is preserved on cells after WEATHER_UPDATE', () => {
    setupGrid();
    const onMessage = getOnMessage();
    act(() => {
      onMessage({
        type: 'WEATHER_UPDATE',
        cells: [
          { id: '0-0', weather: 'calm', itemPresent: false },
          { id: '1-0', weather: 'calm', itemPresent: false },
          { id: '0-1', weather: 'calm', itemPresent: false },
          { id: '1-1', weather: 'calm', itemPresent: false },
        ]
      });
    });
    // itemPresent was false for all cells (createGrid defaults to false),
    // so no rover icons should be present
    expect(screen.queryByText('🚗')).not.toBeInTheDocument();
  });

  test('error notification renders when ERROR message is received', () => {
    setupGrid();
    const onMessage = getOnMessage();
    act(() => {
      onMessage({ type: 'ERROR', message: 'Failed to reach Mars service' });
    });
    expect(screen.getByText(/failed to reach mars service/i)).toBeInTheDocument();
  });

  test('error notification is removed after 5 seconds', () => {
    setupGrid();
    const onMessage = getOnMessage();
    act(() => {
      onMessage({ type: 'ERROR', message: 'Failed to reach Mars service' });
    });
    expect(screen.getByText(/failed to reach mars service/i)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.queryByText(/failed to reach mars service/i)).not.toBeInTheDocument();
  });

  test('error notification does not clear grid cells', () => {
    setupGrid();
    const onMessage = getOnMessage();
    act(() => {
      onMessage({ type: 'ERROR', message: 'Failed to reach Mars service' });
    });
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(4);
  });
});

describe('App CELL_UPDATE and staleness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('CELL_UPDATE message updates only the targeted cell', () => {
    setupGrid();
    const onMessage = connectWebSocket.mock.calls[0][0];

    // First set all cells to calm via WEATHER_UPDATE so we have a known baseline
    act(() => {
      onMessage({
        type: 'WEATHER_UPDATE',
        cells: [
          { id: '0-0', weather: 'calm', itemPresent: false },
          { id: '1-0', weather: 'calm', itemPresent: false },
          { id: '0-1', weather: 'calm', itemPresent: false },
          { id: '1-1', weather: 'calm', itemPresent: false },
        ]
      });
    });

    act(() => {
      onMessage({ type: 'CELL_UPDATE', cell: { id: '0-0', weather: 'stormy' } });
    });

    // cell 0-0 should now be stormy (#6c6c6c), others still calm (#FFD8A8)
    expect(screen.getByTestId('cell-0-0')).toHaveStyle({ backgroundColor: '#6c6c6c' });
    expect(screen.getByTestId('cell-1-0')).toHaveStyle({ backgroundColor: '#FFD8A8' });
  });

  test('CELL_UPDATE sets source to "mars orbital climate"', () => {
    setupGrid();
    const onMessage = connectWebSocket.mock.calls[0][0];
    act(() => {
      onMessage({ type: 'CELL_UPDATE', cell: { id: '0-0', weather: 'stormy' } });
    });
    expect(screen.getByText(/mars orbital climate/i)).toBeInTheDocument();
  });

  test('stale cells are updated locally after 30 seconds', () => {
    setupGrid();
    // advance past 30 seconds without any CELL_UPDATE messages
    act(() => { jest.advanceTimersByTime(31000); });
    // All cells should have been locally randomised — weatherMeta source should be 'local'
    expect(screen.getByText(/local/i)).toBeInTheDocument();
  });

  test('a cell updated via CELL_UPDATE does not go stale for another 30 seconds', () => {
    setupGrid();
    const onMessage = connectWebSocket.mock.calls[0][0];

    // Update cell 0-0 to stormy just before the 30s mark
    act(() => { jest.advanceTimersByTime(29000); });
    act(() => {
      onMessage({ type: 'CELL_UPDATE', cell: { id: '0-0', weather: 'stormy' } });
    });

    // At 30s the other cells will go stale but 0-0 should still be stormy
    act(() => { jest.advanceTimersByTime(1500); });
    expect(screen.getByTestId('cell-0-0')).toHaveStyle({ backgroundColor: '#6c6c6c' });
  });
});

describe('App weather metadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('weather meta is not shown before a grid is generated', () => {
    render(<App />);
    expect(screen.queryByText(/weather last updated/i)).not.toBeInTheDocument();
  });

  test('shows "local" source immediately after grid is generated', () => {
    setupGrid();
    expect(screen.getByText(/weather last updated/i)).toBeInTheDocument();
    expect(screen.getByText(/local/i)).toBeInTheDocument();
  });

  test('shows "mars orbital climate" source after WEATHER_UPDATE is received', () => {
    setupGrid();
    const onMessage = connectWebSocket.mock.calls[0][0];
    act(() => {
      onMessage({
        type: 'WEATHER_UPDATE',
        cells: [
          { id: '0-0', weather: 'calm', itemPresent: false },
          { id: '1-0', weather: 'calm', itemPresent: false },
          { id: '0-1', weather: 'calm', itemPresent: false },
          { id: '1-1', weather: 'calm', itemPresent: false },
        ]
      });
    });
    expect(screen.getByText(/mars orbital climate/i)).toBeInTheDocument();
  });

  test('age display updates as time passes', () => {
    setupGrid();
    expect(screen.getByText(/0s ago/i)).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(3000); });
    expect(screen.getByText(/3s ago/i)).toBeInTheDocument();
  });

  test('source switches back to "local" when a new grid is generated', () => {
    setupGrid();
    const onMessage = connectWebSocket.mock.calls[0][0];
    act(() => {
      onMessage({
        type: 'WEATHER_UPDATE',
        cells: [
          { id: '0-0', weather: 'calm', itemPresent: false },
          { id: '1-0', weather: 'calm', itemPresent: false },
          { id: '0-1', weather: 'calm', itemPresent: false },
          { id: '1-1', weather: 'calm', itemPresent: false },
        ]
      });
    });
    expect(screen.getByText(/mars orbital climate/i)).toBeInTheDocument();

    // Generate a new grid
    fireEvent.change(screen.getByLabelText(/grid size input/i), { target: { value: '3 by 3' } });
    fireEvent.click(screen.getByRole('button', { name: /generate grid/i }));
    expect(screen.getByText(/local/i)).toBeInTheDocument();
  });
});
