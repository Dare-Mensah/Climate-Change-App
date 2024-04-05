from flask import Flask, request
from flask_socketio import SocketIO, send, emit, disconnect, join_room, leave_room
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'verysecretkey'
socketio = SocketIO(app, cors_allowed_origins="*")

# Sessions store: maps a session ID to a dictionary with player details and game state
sessions = {}

def find_session_waiting_for_players():
    """Find an existing game session that's waiting for more players."""
    for session_id, session in sessions.items():
        if len(session['players']) < 2:
            return session_id
    return None

@socketio.on('join_game')
def on_join_game(data):
    """Handle a player's request to join a game."""
    user_id = request.sid
    username = data.get('username', 'Anonymous')

    session_id = find_session_waiting_for_players()
    if not session_id:
        # Create a new session if there's no available session waiting for players
        session_id = uuid.uuid4().hex
        sessions[session_id] = {'players': [(user_id, username)], 'game_state': 'waiting_for_players'}
        join_room(session_id)
        emit('game_state', {'state': 'waiting_for_players'}, room=session_id)
    else:
        # Add player to the existing session and update the game state
        sessions[session_id]['players'].append((user_id, username))
        sessions[session_id]['game_state'] = 'generating_word'
        join_room(session_id)
        emit('game_state', {'state': 'generating_word'}, room=session_id)
        # Optionally, trigger word generation and start the game

@socketio.on('disconnect')
def on_disconnect():
    """Handle player disconnection."""
    user_id = request.sid
    for session_id, session in sessions.items():
        if user_id in [player[0] for player in session['players']]:
            session['players'] = [player for player in session['players'] if player[0] != user_id]
            if not session['players']:
                # Delete the session if there are no more players
                del sessions[session_id]
            else:
                emit('game_state', {'state': 'waiting_for_players'}, room=session_id)
            leave_room(session_id)
            break

@app.route("/")
def index():
    return "Flask SocketIO Wordle Server Running"



if __name__ == "__main__":
    socketio.run(app, host='192.168.1.38', port=2000, debug=True)
