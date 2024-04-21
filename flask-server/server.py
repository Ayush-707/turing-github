from flask import Flask, jsonify
from automata.tm.dtm import DTM
from automata.base import exceptions
from io import StringIO
import sys

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
generator = dtm.read_input_stepwise(input_str)


@app.route('/data/')

def hello():
    #data = {'message': 'Hello from Flask!'}

   

    try:
    # Code that uses the generator
        for config in generator:
        # Do something with the TMConfiguration instance
            stdout_backup = sys.stdout
            sys.stdout = StringIO()

            config.print()

            output = sys.stdout.getvalue()

            sys.stdout = stdout_backup
            return output

        else:
            return jsonify("Accepted")
    except exceptions.RejectionException as e:
        return jsonify (e)

   

if __name__ == "__main__":
    app.run(debug=True)