// Tape.jsx
import React, { useState, useEffect } from 'react';
import './Form.css'; // Import CSS for styling

const Tape = ({ input, headPosition, currentState, steps, onStop }) => {
  const [headVisible, setHeadVisible] = useState(true); // Whether the head is visible or not
  const [halted, setHalted] = useState(false); // Whether the machine has halted
  const [headLeft, setHeadLeft] = useState(0); // Track head position from left

  useEffect(() => {
    // Function to toggle the visibility of the head
    const toggleHeadVisibility = () => {
      setHeadVisible((prev) => !prev);
    };

    // Start toggling the head visibility at regular intervals
    const intervalId = setInterval(toggleHeadVisibility, 500); // Adjust the interval as needed

    // Clean up function to stop toggling when the component unmounts or onStop is called
    return () => {
      clearInterval(intervalId);
    };
  }, [onStop]);

  // Function to stop head movement and mark the machine as halted
  const handleStop = () => {
    onStop();
    setHalted(true);
  };

  // Update head position based on headPosition prop
  useEffect(() => {
    setHeadLeft(headPosition * 30); // Adjust this based on the width of the tape cells
  }, [headPosition]);

  return (
    <div className={`tape-container ${halted ? 'halted' : ''}`}>
      <div className="tape-content">
        {input.split('').map((symbol, index) => (
          <div key={index} className={`tape-cell ${index === headPosition ? 'active' : ''}`}>
            {symbol}
          </div>
        ))}
      </div>
      <div className="tape-details">
        <span>Current State: {currentState}</span>
        <span>Steps: {steps}</span>
        {halted && <span className="halted-message">Machine Halted</span>}
        <button onClick={handleStop}>Stop</button>
      </div>
      <div className="tape-head" style={{ left: `${headLeft}px`, display: headVisible ? 'block' : 'none' }}>
        <div className="head-arrow"></div>
      </div>
    </div>
  );
};

export default Tape;
