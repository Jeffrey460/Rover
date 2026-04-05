import React from 'react';
import GridSetup from './components/GridSetup';
import './App.css';

function App() {
  const handleGridSet = (width, height) => {
    console.log(`Grid configured: ${width} × ${height}`);
    // Future: transition to the rover placement / navigation page
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Mars Rover Grid Simulator</h1>
      </header>
      <main className="App-main">
        <GridSetup onGridSet={handleGridSet} />
      </main>
    </div>
  );
}

export default App;

