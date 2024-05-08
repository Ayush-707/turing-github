import React, { useState } from 'react';
import Form from './Components/Form';
import Tape from './Components/Tape';
import './App.css'; // Import CSS for styling

const App = () => {
  const [output, setOutput] = useState('');
  const [headPosition, setHeadPosition] = useState(1); // Initial head position
  const [currentState, setCurrentState] = useState(''); // Current state
  const [steps, setSteps] = useState(0); // Steps counter
  const [stopMovement, setStopMovement] = useState(false); // State to stop head movement

  const handleChange = (value) => {
    setOutput(value);
    // Reset head position when input changes
    setHeadPosition(1);
    // Reset steps and current state
    setSteps(0);
    setCurrentState('');
  };

  // Function to handle head movement
  const moveHead = () => {
    if (!stopMovement) {
      // Increment steps counter
      setSteps((prevSteps) => prevSteps + 1);
      // Update head position based on the current state
      setHeadPosition((prevPosition) => prevPosition + 1);
    }
  };

  // Function to stop head movement
  const stopHead = () => {
    setStopMovement(true);
  };

  // Function to reset head movement
  const resetHead = () => {
    setStopMovement(false);
    setSteps(0);
    setCurrentState('');
  };

  return (
    <div className="app-container">
      <h1>Turing Machine</h1>
      <h2>Matches any string starting with 0s followed by an equal number of 1s</h2>
      <Form onChange={handleChange} setHeadPosition={setHeadPosition} moveHead={moveHead} stopHead={stopHead} resetHead={resetHead} />
      <Tape input={output} headPosition={headPosition} currentState={currentState} steps={steps} onStop={stopHead} />
      {output !== '' && (
        <div className="output-container">
          <h1>OUTPUT:</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
