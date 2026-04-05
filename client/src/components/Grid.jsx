import React, { useMemo } from 'react';
import Cell from './Cell';
import GridLegend from './GridLegend';
import { createGrid } from '../utils/gridUtils';

const MAX_GRID_PX = 800;
const MAX_CELL_PX = 90;

function Grid({ width, height, cells: cellsProp }) {
  const cells = useMemo(
    () => cellsProp ?? createGrid(width, height),
    [cellsProp, width, height]
  );

  const cellSize = Math.min(
    Math.floor(MAX_GRID_PX / width),
    Math.floor(MAX_GRID_PX / height),
    MAX_CELL_PX
  );

  return (
    <div style={{ width: `${cellSize * width}px`, margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        }}
      >
        {cells.map((cell) => (
          <Cell
            key={cell.id}
            id={cell.id}
            itemPresent={cell.itemPresent}
            weather={cell.weather}
            size={cellSize}
          />
        ))}
      </div>
      <GridLegend />
    </div>
  );
}

export default Grid;
