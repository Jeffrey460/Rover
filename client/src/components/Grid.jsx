import React, { useMemo } from 'react';
import Cell from './Cell';
import GridLegend from './GridLegend';
import { createGrid } from '../utils/gridUtils';

const MAX_GRID_PX = 800;
const MAX_CELL_PX = 90;

function Grid({ width, height, cells: cellsProp, quadrants }) {
  const cells = useMemo(
    () => cellsProp ?? createGrid(width, height),
    [cellsProp, width, height]
  );

  const cellSize = Math.min(
    Math.floor(MAX_GRID_PX / width),
    Math.floor(MAX_GRID_PX / height),
    MAX_CELL_PX
  );

  const quadrantRightEdges = useMemo(() => {
    if (!quadrants?.length) return new Set();
    const edgeSet = new Set();
    quadrants.forEach(q => {
      if (q.endX < width - 1) {
        for (let y = q.startY; y <= q.endY; y++) {
          edgeSet.add(`${q.endX}-${y}`);
        }
      }
    });
    return edgeSet;
  }, [quadrants, width]);

  const quadrantBottomEdges = useMemo(() => {
    if (!quadrants?.length) return new Set();
    const edgeSet = new Set();
    quadrants.forEach(q => {
      if (q.endY < height - 1) {
        for (let x = q.startX; x <= q.endX; x++) {
          edgeSet.add(`${x}-${q.endY}`);
        }
      }
    });
    return edgeSet;
  }, [quadrants, height]);

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
            borderRight={quadrantRightEdges.has(cell.id)}
            borderBottom={quadrantBottomEdges.has(cell.id)}
          />
        ))}
      </div>
      <GridLegend />
    </div>
  );
}

export default Grid;
