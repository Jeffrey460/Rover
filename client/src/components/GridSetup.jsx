import React, { useState } from 'react';
import './GridSetup.css';

/**
 * GridSetup
 * Prompts the user for a grid size in the format "width by height"
 * (e.g. "5 by 5" or "2 by 3"), validates the input, and calls
 * onGridSet(width, height) on success.
 */
function GridSetup({ onGridSet }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = input.trim();

    // Guard: empty input
    if (!trimmed) {
      setError('Please enter a grid size.');
      setConfirmation('');
      return;
    }

    // Parse "width by height"
    const match = trimmed.match(/^(\d+)\s+by\s+(\d+)$/i);
    if (!match) {
      setError(
        'Invalid format. Please use "width by height", e.g. "5 by 5".'
      );
      setConfirmation('');
      return;
    }

    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);

    // Guard: both values must be positive integers
    if (width <= 0 || height <= 0) {
      setError('Width and height must both be positive integers greater than zero.');
      setConfirmation('');
      return;
    }

    // Success
    setError('');
    setConfirmation(`Grid set to ${width} \u00d7 ${height}`);

    if (typeof onGridSet === 'function') {
      onGridSet(width, height);
    }
  };

  return (
    <div className="grid-setup">
      <h2 className="grid-setup__title">
        How big would you like your grid to be?
      </h2>
      <p className="grid-setup__hint">
        Enter the size in the format <strong>width by height</strong>, e.g.{' '}
        <em>"2 by 3"</em> or <em>"5 by 5"</em>.
      </p>

      <form className="grid-setup__form" onSubmit={handleSubmit} noValidate>
        <input
          className="grid-setup__input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g. "5 by 5"'
          aria-label="Grid size input"
          aria-describedby={error ? 'grid-error' : undefined}
        />
        <button className="grid-setup__button" type="submit">
          Set Grid
        </button>
      </form>

      {error && (
        <p id="grid-error" className="grid-setup__error" role="alert">
          {error}
        </p>
      )}

      {confirmation && (
        <p className="grid-setup__confirmation" data-testid="confirmation">
          {confirmation}
        </p>
      )}
    </div>
  );
}

export default GridSetup;

