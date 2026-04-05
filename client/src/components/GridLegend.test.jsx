import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GridLegend from './GridLegend';
import { WEATHER_STYLES } from '../utils/weatherStyles';

describe('GridLegend', () => {
  beforeEach(() => {
    render(<GridLegend />);
  });

  test('renders the "Weather Legend" heading', () => {
    expect(screen.getByText('Weather Legend')).toBeInTheDocument();
  });

  test('renders one legend item per weather type', () => {
    const items = screen.getAllByTestId(/^legend-item-/);
    expect(items).toHaveLength(Object.keys(WEATHER_STYLES).length);
  });

  test('renders "Calm" label', () => {
    expect(screen.getByText('Calm')).toBeInTheDocument();
  });

  test('renders "Windy" label', () => {
    expect(screen.getByText('Windy')).toBeInTheDocument();
  });

  test('renders "Dusty" label', () => {
    expect(screen.getByText('Dusty')).toBeInTheDocument();
  });

  test('renders "Stormy" label', () => {
    expect(screen.getByText('Stormy')).toBeInTheDocument();
  });

  test('calm swatch has the correct background colour', () => {
    const swatch = screen.getByTestId('legend-swatch-calm');
    expect(swatch).toHaveStyle({ backgroundColor: WEATHER_STYLES.calm.background });
  });

  test('windy swatch has the correct background colour', () => {
    const swatch = screen.getByTestId('legend-swatch-windy');
    expect(swatch).toHaveStyle({ backgroundColor: WEATHER_STYLES.windy.background });
  });

  test('dusty swatch has the correct background colour', () => {
    const swatch = screen.getByTestId('legend-swatch-dusty');
    expect(swatch).toHaveStyle({ backgroundColor: WEATHER_STYLES.dusty.background });
  });

  test('stormy swatch has the correct background colour', () => {
    const swatch = screen.getByTestId('legend-swatch-stormy');
    expect(swatch).toHaveStyle({ backgroundColor: WEATHER_STYLES.stormy.background });
  });
});

