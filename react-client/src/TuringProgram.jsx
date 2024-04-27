import React, { useState } from 'react';
import './Tape.css'; // Import CSS for styling

function TuringProgram() {
  const [programText, setProgramText] = useState('');

  const handleProgramChange = (event) => {
    setProgramText(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProgramText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const lineNumbers = programText.split('\n').map((_, index) => <div key={index + 1}>{index + 1}</div>);

  return (
    <div className="turing-program">
      <div className="line-numbers">{lineNumbers}</div>
      <textarea
        id="program-textarea"
        className="program-textarea"
        value={programText}
        onChange={handleProgramChange}
        placeholder="Enter your Turing machine program here..."
      ></textarea>
      <div className="example-programs">
        <input type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default TuringProgram;
