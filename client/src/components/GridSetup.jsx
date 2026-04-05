import React, { useState } from 'react';
import './GridSetup.css';

function GridSetup({ onGridCreate }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const parse = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return { error: 'Please enter a grid size.' };
    const match = trimmed.match(/^(\d+)\s+by\s+(\d+)$/i);
    if (!match) return { error: 'Invalid format. Please use "width by height", e.g. "5 by 5".' };
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    if (width <= 0 || height <= 0) return { error: 'Width and height must both be positive integers greater than zero.' };
    return { width, height };
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const result = parse(input);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError('');
    if (typeof onGridCreate === 'function') {
      onGridCreate(result.width, result.height);
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

      <form className="grid-setup__form" onSubmit={handleGenerate} noValidate>
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
          Generate Grid
        </button>
      </form>

      {error && (
        <p id="grid-error" className="grid-setup__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default GridSetup;
