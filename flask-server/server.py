from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/data/')
def hello():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)