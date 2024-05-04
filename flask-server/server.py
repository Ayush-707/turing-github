from flask import Flask, jsonify, request
from automata.tm.dtm import DTM
from automata.base import exceptions
import io
from contextlib import redirect_stdout

app = Flask(__name__)


# DTM which matches all strings beginning with '0's, and followed by
# the same number of '1's
dtm = DTM(
    states={'q0', 'q1', 'q2', 'q3', 'q4'},
    input_symbols={'0', '1'},
    tape_symbols={'0', '1', 'x', 'y', '.'},
    transitions={
        'q0': {
            '0': ('q1', 'x', 'R'),
            'y': ('q3', 'y', 'R')
        },
        'q1': {
            '0': ('q1', '0', 'R'),
            '1': ('q2', 'y', 'L'),
            'y': ('q1', 'y', 'R')
        },
        'q2': {
            '0': ('q2', '0', 'L'),
            'x': ('q0', 'x', 'R'),
            'y': ('q2', 'y', 'L')
        },
        'q3': {
            'y': ('q3', 'y', 'R'),
            '.': ('q4', '.', 'R')
        }
    },
    initial_state='q0',
    blank_symbol='.',
    final_states={'q4'}
)

input_str = "000111"

# Call the read_input_stepwise method on the instance



@app.route('/data/', methods=['POST'])
def receive_data():
    try:
        # Parse the JSON data from the request body
        data = request.json
        # Access the specific field (in this case 'myInput')
        binary_string = data.get('inputValue')
        
        # Do something with the received data
        print('Received input:', binary_string)
        generator = dtm.read_input_stepwise(binary_string)


        try:    
        # Code that uses the generator
            buf = io.StringIO()
            with redirect_stdout(buf):
                for config in generator:
                # Do something with the TMConfiguration instance
                    config.print()
            
            output = buf.getvalue()
            print('Accepted!')
            return(output)
        
        except exceptions.RejectionException as e:
            return jsonify (str(e))

    except Exception as e:
        # Handle any exceptions
        
        return jsonify({'error': str(e)}), 500

   

if __name__ == "__main__":
    app.run(debug=True)