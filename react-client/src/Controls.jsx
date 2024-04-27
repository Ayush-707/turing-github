import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Tape.css'; // Import CSS for styling

function Controls({ runCode, pauseCode, stepCode, resetCode, loadExample, handleExampleChange }) {

    const [initialInput, setInitialInput] = useState([]); // State for initial input

    const handleInputChange = (e) => {
        let input = e.target.value;
        // Filter out characters that are not 0 or 1
        input = input.replace(/[^01]/g, '');
        // Convert input to an array of characters
        const inputArray = input.split('');
        setInitialInput(inputArray);
    };

    return (
        <div className="controls">
            {/* Buttons Container */}
            <div className="buttons-container">
                {/* Run Button */}
                <button onClick={runCode}>Run</button>

                {/* Pause Button */}
                <button onClick={pauseCode}>Pause</button>

                {/* Step Button */}
                <button onClick={stepCode}>Step</button>

                {/* Reset Button */}
                <button onClick={resetCode}>Reset</button>
            </div>

          

        
        </div>
    );
}

Controls.propTypes = {
    runCode: PropTypes.func.isRequired,
    pauseCode: PropTypes.func.isRequired,
    stepCode: PropTypes.func.isRequired,
    resetCode: PropTypes.func.isRequired,
    loadExample: PropTypes.func.isRequired,
    handleExampleChange: PropTypes.func.isRequired,
};

export default Controls;
