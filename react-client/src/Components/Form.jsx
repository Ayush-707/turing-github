import { useState } from 'react';
import TextInput from './TextInput'; // Assuming TextInput is in a separate file
//import MachineList from './MachineList'; // Assuming MachineList is in a separate file
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { sendInput } from '../APIs/Request';

function Form() {

   const [inputValue, setInputValue] = useState('');
   
   const handleChange = (value) => {
    setInputValue(value);
   }

   

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('Input: ', inputValue);
        //console.log('Machine number: ', machine);
        const data = {inputValue}
        const res = await sendInput(data)

        console.log(res)
    };

    return (
        <div>
            
                <TextInput value={inputValue} onChange={handleChange} />
                {/* <MachineList machine={machine} /> */}

                <Button 
                    variant="contained" 
                    endIcon={<SendIcon />}
                    color = 'secondary'
                    onClick={handleSubmit}>
                    Submit
                </Button>
            
        </div>
    );
}

export default Form;
