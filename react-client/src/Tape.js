import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Tape.css'; // Import CSS for styling

function Tape({ initialInput }) {
  // Define initial tape content and head position
  const [tapeContent, setTapeContent] = useState([]);
  const [headPosition, setHeadPosition] = useState(0);

  // Function to move the head left
  const moveLeft = () => {
    setHeadPosition(prevPosition => (prevPosition === 0 ? prevPosition : prevPosition - 1));
  };

  // Function to move the head right
  const moveRight = () => {
    setHeadPosition(prevPosition => prevPosition + 1);
  };

  // Function to update tape content at head position
  const updateTapeContent = (symbol) => {
    if (symbol === '0' || symbol === '1') {
      const newTapeContent = [...tapeContent];
      newTapeContent[headPosition] = symbol;
      setTapeContent(newTapeContent);
    }
  };

  return (
    <div className="tape-container">
      {/* Tape */}
      <div className="tape">
        {tapeContent.map((symbol, index) => (
          <div key={index} className={`tape-cell${index === headPosition ? ' head-cell' : ''}`}>
            {symbol || '0'} {/* Display '0' if symbol is empty */}
          </div>
        ))}
      </div>
      {/* Head pointer */}
      <div className="head" style={{ left: `${headPosition * 20}px` }}></div>
      {/* Controls */}
      <div className="contro">
        <button onClick={moveLeft}>Move Left</button>
        <button onClick={moveRight}>Move Right</button>
      </div>
      {/* Initial Input Box */}
      <input
        type="text"
        value={initialInput}
        onChange={(e) => updateTapeContent(e.target.value)}
        placeholder="Enter 0 or 1"
      />
    </div>
  );
}

Tape.propTypes = {
  initialInput: PropTypes.string.isRequired,
};

export default Tape;
