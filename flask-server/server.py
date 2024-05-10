from flask import Flask, jsonify, request
from automata.tm.dtm import DTM
from automata.base import exceptions
import io
from contextlib import redirect_stdout

app = Flask(__name__)


# DTM which matches all strings beginning with '0's, and followed by
# the same number of '1's
dtm1 = DTM(
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


# DTM which matches all strings beginning with '1's, and followed by
# the same number of '0's
dtm2 = DTM(
    states={'q0', 'q1', 'q2', 'q3', 'q4'},
    input_symbols={'0', '1'},
    tape_symbols={'0', '1', 'x', 'y', '.'},
    transitions={
        'q0': {
            '1': ('q1', 'x', 'R'),
            'y': ('q3', 'y', 'R')
        },
        'q1': {
            '1': ('q1', '1', 'R'),
            '0': ('q2', 'y', 'L'),
            'y': ('q1', 'y', 'R')
        },
        'q2': {
            '1': ('q2', '1', 'L'),
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
        
        if binary_string.startswith('0'):
            # Run dtm1
            generator = dtm1.read_input_stepwise(binary_string)
        elif binary_string.startswith('1'):
            # Run dtm2
            generator = dtm2.read_input_stepwise(binary_string)
        else:
            return jsonify({'error': 'Input must start with 0 or 1'}), 400


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