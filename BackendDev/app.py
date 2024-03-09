from flask import Flask, jsonify


app = Flask(__name__)


@app.route('/', methods=['GET'])
def get_articles():
    return jsonify({"Hello":"World"})


if __name__ == "__main__":
    app.run(host='192.168.1.38', port=3000, debug=True)