import React, { useState } from 'react';
import Compression from './components/Compression';
import Decompression from './components/Decompression';
import './App.css';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="App">
      <header className="App-header">
        <h1>File - Converter</h1>
        {view === 'home' && (
          <div>
            <button onClick={() => setView('compression')} className="button">Compress File</button>
            <button onClick={() => setView('decompression')} className="button">Decompress File</button>
          </div>
        )}
        {view === 'compression' && <Compression goBack={() => setView('home')} />}
        {view === 'decompression' && <Decompression goBack={() => setView('home')} />}
      </header>
    </div>
  );
}

export default App;
