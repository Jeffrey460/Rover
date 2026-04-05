import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GridSetup from './GridSetup';

// ── Helper ────────────────────────────────────────────────────────────────────
const setup = (props = {}) => render(<GridSetup {...props} />);

const getInput = () => screen.getByLabelText(/grid size input/i);
const getButton = () => screen.getByRole('button', { name: /set grid/i });

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
      expect(
        screen.getByText(/how big would you like your grid to be\?/i)
      ).toBeInTheDocument();
    });

    test('renders the format hint', () => {
      setup();
      expect(screen.getByText(/width by height/i)).toBeInTheDocument();
    });

    test('renders the text input', () => {
      setup();
      expect(getInput()).toBeInTheDocument();
    });

    test('renders the submit button', () => {
      setup();
      expect(getButton()).toBeInTheDocument();
    });

    test('does not show an error or confirmation on initial render', () => {
      setup();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByTestId('confirmation')).not.toBeInTheDocument();
    });
  });

  describe('Valid input', () => {
    test('shows confirmation for "2 by 3"', () => {
      setup();
      submit('2 by 3');
      expect(screen.getByTestId('confirmation')).toHaveTextContent('Grid set to 2 × 3');
    });

    test('shows confirmation for "5 by 5"', () => {
      setup();
      submit('5 by 5');
      expect(screen.getByTestId('confirmation')).toHaveTextContent('Grid set to 5 × 5');
    });

    test('shows confirmation for "10 by 1"', () => {
      setup();
      submit('10 by 1');
      expect(screen.getByTestId('confirmation')).toHaveTextContent('Grid set to 10 × 1');
    });

    test('does not show an error on valid submission', () => {
      setup();
      submit('4 by 6');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('calls onGridSet with correct width and height', () => {
      const onGridSet = jest.fn();
      setup({ onGridSet });
      submit('3 by 7');
      expect(onGridSet).toHaveBeenCalledWith(3, 7);
    });
  });

  describe('Invalid input', () => {
    test('shows an error for empty input', () => {
      setup();
      submit('');
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByTestId('confirmation')).not.toBeInTheDocument();
    });

    test('shows an error for "abc by 3"', () => {
      setup();
      submit('abc by 3');
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByTestId('confirmation')).not.toBeInTheDocument();
    });

    test('shows an error for "2 by abc"', () => {
      setup();
      submit('2 by abc');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('shows an error for just a number with no format ("5")', () => {
      setup();
      submit('5');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('shows an error for random text ("hello world")', () => {
      setup();
      submit('hello world');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('does not call onGridSet on invalid input', () => {
      const onGridSet = jest.fn();
      setup({ onGridSet });
      submit('bad input');
      expect(onGridSet).not.toHaveBeenCalled();
    });
  });

  describe('Error clears on valid submission after an error', () => {
    test('error disappears when a valid value is submitted after an invalid one', () => {
      setup();
      submit('bad');
      expect(screen.getByRole('alert')).toBeInTheDocument();

      submit('3 by 3');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByTestId('confirmation')).toBeInTheDocument();
    });
  });
});

