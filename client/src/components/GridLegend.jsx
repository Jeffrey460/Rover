import React from 'react';
import { WEATHER_STYLES } from '../utils/weatherStyles';

function GridLegend() {
  return (
    <div
      style={{
        marginTop: '16px',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: '0 0 8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
        Weather Legend
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {Object.entries(WEATHER_STYLES).map(([key, { background, label }]) => (
          <div
            key={key}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            data-testid={`legend-item-${key}`}
          >
            <span
              data-testid={`legend-swatch-${key}`}
              style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                backgroundColor: background,
                border: '1px solid #999',
                flexShrink: 0,
              }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridLegend;

