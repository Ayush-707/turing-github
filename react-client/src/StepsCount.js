// StepsCount.js
import React, { useState } from 'react';
import './Tape.css'; // Import CSS for styling

function StepsCount() {
  // Define initial steps count
  const initialStepsCount = 0;
  const [stepsCount] = useState(initialStepsCount); // Destructure setStepsCount directly

  return (
    <div className="steps-count">
      <h3>Steps Count</h3>
      <div>{stepsCount}</div>
    </div>
  );
}

export default StepsCount;
