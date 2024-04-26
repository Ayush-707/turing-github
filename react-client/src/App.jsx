

import React, { useState } from 'react';
import './App.css';

import TuringProgram from './TuringProgram';
import Turing from './Turing';

function App() {
  const [exampleProgram, setExampleProgram, initialInput, setInitialInput] = useState('');

  const handleLoadExample = (exampleText) => {
    setExampleProgram(exampleText);
  };

  return (
    <div className="App">

<Turing initialInput={initialInput} />

    </div>
  );
}

export default App;
