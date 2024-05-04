import { useState } from "react";
import Form from "./Components/Form";

const App = () => {
  const [output, setOutput] = useState('');

  const handleChange = (value) => {
    setOutput(value);
  }

  return (
    <div>
      <h1>Turing Machine</h1>
      <h2>Matches any string starting with 0s followed by equal number of 1s</h2>
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
