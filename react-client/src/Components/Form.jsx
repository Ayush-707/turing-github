import React, { useState } from 'react';
import TextInput from './TextInput';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { sendInput } from '../APIs/Request';
import PropTypes from 'prop-types';
import './Form.css'; // Import CSS for styling

Form.propTypes = {
  onChange: PropTypes.func,
  setHeadPosition: PropTypes.func,
  moveHead: PropTypes.func,
 
  resetHead: PropTypes.func
};

function Form({ onChange, moveHead, stopHead, resetHead }) {
  const [inputValue, setInputValue] = useState('');
  const [headPosition, setHeadPosition] = useState(0); // Track head position

  const handleChange = (value) => {
    setInputValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Input: ', inputValue);
    const data = { inputValue };
    const res = await sendInput(data);
    onChange(res.data);
    setHeadPosition(0); // Reset head position
    moveHead(); // Move the head
    console.log(res);
  };

  const handleStop = () => {
    stopHead(); // Stop head movement
  };

  const handleReset = () => {
    resetHead(); // Reset head movement
    setInputValue(''); // Clear input value
    setHeadPosition(0); // Reset head position
  };

  return (
    <div className="form-container">
      <TextInput value={inputValue} onChange={handleChange} />
      <div className="button-container">
        <Button className="submit-button" variant="contained" endIcon={<SendIcon />} color="secondary" onClick={handleSubmit}>
          Submit
        </Button>
      
        <Button className="action-button" variant="contained" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className="head-container" style={{ left: `${headPosition * 20}px` }}></div> {/* Render head at current position */}
    </div>
  );
}

export default Form;