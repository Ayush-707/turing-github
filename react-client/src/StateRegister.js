// StateRegister.js
import React, { useState } from 'react';
import './Tape.css'; // Import CSS for styling

function StateRegister() {
  // Define initial state
  const initialState = 0;
  const [currentState] = useState(initialState); // Destructure setCurrentState directly

  return (
    <div className="state-register">
      <h3>Current State</h3>
      <div>{currentState}</div>
    </div>
  );
}

export default StateRegister;
