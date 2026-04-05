import React from 'react';
import { WEATHER_STYLES } from '../utils/weatherStyles';

function Cell({ id, itemPresent, weather, size = 90, borderRight = false, borderBottom = false }) {
  const { background } = WEATHER_STYLES[weather] || WEATHER_STYLES.calm;

  return (
    <div
      data-testid={`cell-${id}`}
      style={{
        backgroundColor: background,
        borderTop: '1px solid #999',
        borderLeft: '1px solid #999',
        borderRight: borderRight ? '3px solid #555' : '1px solid #999',
        borderBottom: borderBottom ? '3px solid #555' : '1px solid #999',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {itemPresent && <span>🚗</span>}
    </div>
  );
}

export default Cell;
