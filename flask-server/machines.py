from automata.tm.dtm import DTM

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


#DTM for binary palindrome

dtm2 = DTM(
    states={'q0', 'q1', 'q2', 'q3'},
    input_symbols={'0', '1'},
    tape_symbols={'0', '1', 'x', 'y', '.'},
    transitions={
        # Start state - Read first symbol
        'q0': {
            '0' : ('q1', '0', 'R'),
            '1' :  ('q1', '1', 'R')
        },
        'q1' : {
            '0' : ('q1', 'x', 'R'),
            '1' : ('q1', 'x', 'R'),
            '.' : ('q2', '.', 'L')
        },
        
        'q2' : {
            '0': ('q2', '0', 'L'),
            '1': ('q2', '1', 'L')
        },
        # Check matching symbol on the left side
        ('q2', '0'): ('q2', '0', 'L'),
        ('q2', '1'): ('q2', '1', 'L'),
        ('q2', 'x'): ('qreject', 'x', 'R'),  # Mismatch, reject

        # Move left, erasing 'x' until reaching the beginning
        ('q2', '.'): ('q0', '.', 'R'),  # Reached beginning, accept if all 'x' matched
        ('q2', 'y'): ('q2', 'y', 'L'),  # Erase 'x'

        # Accept state - Only reached if entire string is matched
        ('q0', '.'): ('q3', '.', 'R'),  # Entire string read and matched
    },
    initial_state='q0',
    blank_symbol='.',
    final_states={'q3'}
)
