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
});
