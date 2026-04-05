import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Grid from './Grid';

describe('Grid', () => {
  test('renders the correct number of cells for a 3×2 grid (expect 6 cells)', () => {
    render(<Grid width={3} height={2} />);
    const cells = screen.getAllByTestId(/^cell-/);
    expect(cells).toHaveLength(6);
  });

  test('renders the correct number of cells for a 1×1 grid (expect 1 cell)', () => {
    render(<Grid width={1} height={1} />);
    const cells = screen.getAllByTestId(/^cell-/);
    expect(cells).toHaveLength(1);
  });

  test('renders the GridLegend below the cells', () => {
    render(<Grid width={2} height={2} />);
    expect(screen.getByText('Weather Legend')).toBeInTheDocument();
  });

  describe('quadrant separators', () => {
    const quadrants = [
      { startX: 0, startY: 0, endX: 1, endY: 1 },
      { startX: 2, startY: 0, endX: 2, endY: 1 },
    ];

    test('cells on the right edge of an internal quadrant boundary have borderRight', () => {
      // 3x2 grid with quadrants split at x=1/x=2: cells x=1 get borderRight
      render(<Grid width={3} height={2} quadrants={quadrants} />);
      expect(screen.getByTestId('cell-1-0')).toHaveStyle({ borderRight: '3px solid #555' });
      expect(screen.getByTestId('cell-1-1')).toHaveStyle({ borderRight: '3px solid #555' });
    });

    test('cells NOT on a quadrant right edge have normal right border', () => {
      render(<Grid width={3} height={2} quadrants={quadrants} />);
      expect(screen.getByTestId('cell-0-0')).toHaveStyle({ borderRight: '1px solid #999' });
    });

    test('rightmost cells do not get a quadrant separator even if they end a quadrant', () => {
      render(<Grid width={3} height={2} quadrants={quadrants} />);
      expect(screen.getByTestId('cell-2-0')).toHaveStyle({ borderRight: '1px solid #999' });
    });

    test('no separators rendered when quadrants prop is not provided', () => {
      render(<Grid width={3} height={2} />);
      const cells = screen.getAllByTestId(/^cell-/);
      cells.forEach(cell => {
        expect(cell).toHaveStyle({ borderRight: '1px solid #999' });
      });
    });
  });
});
