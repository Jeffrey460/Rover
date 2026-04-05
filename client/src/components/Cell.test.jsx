import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cell from './Cell';

describe('Cell', () => {
  describe('weather labels — removed', () => {
    test('does not render "Calm" text inside the cell', () => {
      render(<Cell id="0-0" itemPresent={false} weather="calm" />);
      expect(screen.queryByText(/calm/i)).not.toBeInTheDocument();
    });

    test('does not render "Windy" text inside the cell', () => {
      render(<Cell id="0-0" itemPresent={false} weather="windy" />);
      expect(screen.queryByText(/windy/i)).not.toBeInTheDocument();
    });

    test('does not render "Stormy" text inside the cell', () => {
      render(<Cell id="0-0" itemPresent={false} weather="stormy" />);
      expect(screen.queryByText(/stormy/i)).not.toBeInTheDocument();
    });
  });

  describe('background colour', () => {
    test('applies light orange background for calm', () => {
      render(<Cell id="0-0" itemPresent={false} weather="calm" />);
      expect(screen.getByTestId('cell-0-0')).toHaveStyle({ backgroundColor: '#FFD8A8' });
    });

    test('applies light yellow background for windy', () => {
      render(<Cell id="0-0" itemPresent={false} weather="windy" />);
      expect(screen.getByTestId('cell-0-0')).toHaveStyle({ backgroundColor: '#fff3cd' });
    });

    test('applies dark grey background for stormy', () => {
      render(<Cell id="0-0" itemPresent={false} weather="stormy" />);
      expect(screen.getByTestId('cell-0-0')).toHaveStyle({ backgroundColor: '#6c6c6c' });
    });
  });

  describe('rover icon', () => {
    test('does not render rover icon when itemPresent is false', () => {
      render(<Cell id="0-0" itemPresent={false} weather="calm" />);
      expect(screen.queryByText('🚗')).not.toBeInTheDocument();
    });

    test('renders rover icon when itemPresent is true', () => {
      render(<Cell id="0-0" itemPresent={true} weather="calm" />);
      expect(screen.getByText('🚗')).toBeInTheDocument();
    });
  });
});
