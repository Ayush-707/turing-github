//import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';



TextFields.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}


export default function TextFields({value, onChange}) {
 // const [inputValue, setInputValue] = useState('');

  // const handleInputChange = (event) => {
  //   const value = event.target.value;
  //   // Check if the value contains only 0s and 1s
  //   if (/^[01]*$/.test(value)) {
  //     setInputValue(value);
  //   }
  // };

  return (
    <>
    
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '45ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-basic"
          label="Enter Input String"
          variant="outlined"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Box>

    
    </>
    

  );
}
