import React, { useState } from "react";
import Form from "./Components/Form";

const App = () => {
  const [output, setOutput] = useState('');

  const handleChange = (value) => {
    setOutput(value);
  }

  return (
    <div>
      <h2>Turing Machine Input</h2>
      <Form onChange={handleChange}/>
      {output !== '' && (
        <div>
          <h1>OUTPUT:</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
