import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Tape.css'; // Import CSS for styling

function Tape({ initialInput }) {
  const [tapeContent, setTapeContent] = useState([initialInput]); // Start with the initial input
  const [headPosition, setHeadPosition] = useState(0);

  const moveLeft = () => {
    setHeadPosition(prevPosition => Math.max(prevPosition - 1, 0)); // Ensure head doesn't go out of bounds
  };

  const moveRight = () => {
    setHeadPosition(prevPosition => Math.min(prevPosition + 1, tapeContent.length - 1)); // Ensure head doesn't go out of bounds
  };

  const updateTapeContent = (newContent) => {
    setTapeContent(newContent);
  };

  return (
    <div className="tape-container">
      <div className="tape">
        {tapeContent.map((symbol, index) => (
          <div key={index} className={`tape-cell${index === headPosition ? ' head-cell' : ''}`}>
            {symbol || '0'} {/* Display '0' if symbol is empty */}
          </div>
        ))}
      </div>
      <div className="head" style={{ left: `${headPosition * 40}px` }}></div>
      <div className="contro">
        <button onClick={moveLeft}>Move Left</button>
        <button onClick={moveRight}>Move Right</button>
      </div>
      <input
        type="text"
        value={initialInput}
        onChange={(e) => updateTapeContent(e.target.value.split(''))}
        placeholder="Initial Input"
      />
    </div>
  );
}

Tape.propTypes = {
  initialInput: PropTypes.string.isRequired,
};

export default Tape;
