import { connectWebSocket, sendMessage } from './websocketService';

let mockSocket;

beforeEach(() => {
  mockSocket = {
    readyState: WebSocket.OPEN,
    send: jest.fn(),
    onmessage: null,
    onerror: null,
    onclose: null,
  };
  global.WebSocket = jest.fn(() => mockSocket);
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test('connectWebSocket calls onMessage with parsed JSON when a message event fires', () => {
  const onMessage = jest.fn();
  connectWebSocket(onMessage);
  mockSocket.onmessage({ data: JSON.stringify({ type: 'WEATHER_UPDATE', cells: [] }) });
  expect(onMessage).toHaveBeenCalledWith({ type: 'WEATHER_UPDATE', cells: [] });
});

test('sendMessage sends JSON-stringified message when socket is OPEN', () => {
  connectWebSocket(jest.fn());
  sendMessage({ type: 'GRID_CREATED' });
  expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'GRID_CREATED' }));
});

test('sendMessage does not throw when socket is not OPEN', () => {
  connectWebSocket(jest.fn());
  mockSocket.readyState = WebSocket.CLOSED;
  expect(() => sendMessage({ type: 'TEST' })).not.toThrow();
});

test('onclose triggers reconnect after 3 seconds', () => {
  const onMessage = jest.fn();
  connectWebSocket(onMessage);
  mockSocket.onclose();
  expect(global.WebSocket).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(3000);
  expect(global.WebSocket).toHaveBeenCalledTimes(2);
});
