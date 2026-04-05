import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GridSetup from './GridSetup';

// ── Helpers ───────────────────────────────────────────────────────────────────
const setup = (props = {}) => render(<GridSetup {...props} />);

const getInput = () => screen.getByLabelText(/grid size input/i);
const getButton = () => screen.getByRole('button', { name: /generate grid/i });

const submit = (value) => {
  if (value !== undefined) {
    fireEvent.change(getInput(), { target: { value } });
  }
  fireEvent.click(getButton());
};

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('GridSetup', () => {
  describe('Rendering', () => {
    test('renders the prompt heading', () => {
      setup();
      expect(screen.getByText(/how big would you like your grid to be\?/i)).toBeInTheDocument();
    });

    test('renders the format hint', () => {
      setup();
      expect(screen.getByText(/width by height/i)).toBeInTheDocument();
    });

    test('renders the text input', () => {
      setup();
      expect(getInput()).toBeInTheDocument();
    });

    test('renders the Generate Grid button', () => {
      setup();
      expect(getButton()).toBeInTheDocument();
    });

    test('does not show an error on initial render', () => {
      setup();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('does not show a confirmation message', () => {
      setup();
      expect(screen.queryByTestId('confirmation')).not.toBeInTheDocument();
    });
  });

  describe('Valid input', () => {
    test('calls onGridCreate with correct width and height for "2 by 3"', () => {
      const onGridCreate = jest.fn();
      setup({ onGridCreate });
      submit('2 by 3');
      expect(onGridCreate).toHaveBeenCalledWith(2, 3);
    });

    test('calls onGridCreate with correct width and height for "5 by 5"', () => {
      const onGridCreate = jest.fn();
      setup({ onGridCreate });
      submit('5 by 5');
      expect(onGridCreate).toHaveBeenCalledWith(5, 5);
    });

    test('calls onGridCreate with numbers not strings', () => {
      const onGridCreate = jest.fn();
      setup({ onGridCreate });
      submit('3 by 7');
      const [w, h] = onGridCreate.mock.calls[0];
      expect(typeof w).toBe('number');
      expect(typeof h).toBe('number');
    });

    test('does not show an error on valid input', () => {
      setup();
      submit('4 by 6');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Invalid input', () => {
    test('shows an error for empty input', () => {
      setup();
      submit('');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('shows an error for "abc by 3"', () => {
      setup();
      submit('abc by 3');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('shows an error for "2 by abc"', () => {
      setup();
      submit('2 by abc');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('shows an error for just a number ("5")', () => {
      setup();
      submit('5');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('shows an error for random text ("hello world")', () => {
      setup();
      submit('hello world');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('does not call onGridCreate on invalid input', () => {
      const onGridCreate = jest.fn();
      setup({ onGridCreate });
      submit('bad input');
      expect(onGridCreate).not.toHaveBeenCalled();
    });
  });

  describe('Error clears on valid input after an error', () => {
    test('error disappears when valid input follows invalid input', () => {
      setup();
      submit('bad');
      expect(screen.getByRole('alert')).toBeInTheDocument();
      submit('3 by 3');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
