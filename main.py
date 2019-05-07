from flask import Flask, render_template, session
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(1000)
socketio = SocketIO(app)

FPS = 30

players = []


@app.route('/', methods=["POST", "GET"])
def main():
    session["player"] = len(players)
    session["speed"] = 0.1
    players.append(
        {
            "x": 0,
            "y": 0
        }
    )

    return render_template("game.html", players=players)


@socketio.on('update')
def start_client(data):
    emit('updateclient', players)
    if not data == "No Keys":
        if data == "up":
            players[session["player"]]["y"] -= session["speed"]

        elif data == "down":
            players[session["player"]]["y"] += session["speed"]

        elif data == "right":
            players[session["player"]]["x"] += session["speed"]

        else:
            players[session["player"]]["x"] -= session["speed"]


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=99)
