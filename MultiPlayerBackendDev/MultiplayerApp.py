from flask import Flask, request
from flask_socketio import SocketIO, send, emit, disconnect, join_room, leave_room
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'verysecretkey'
socketio = SocketIO(app, cors_allowed_origins="*")

sessions = {}

def find_session_waiting_for_players():
    for session_id, session in sessions.items():
        if len(session['players']) < 2:
            return session_id
    return None

@socketio.on('join_game')
def on_join_game(data):
    user_id = request.sid
    username = data.get('username', 'Anonymous')

    session_id = find_session_waiting_for_players()
    if not session_id:
        session_id = uuid.uuid4().hex
        sessions[session_id] = {'players': [(user_id, username)], 'game_state': 'waiting_for_players'}
    else:
        sessions[session_id]['players'].append((user_id, username))
        sessions[session_id]['game_state'] = 'generating_word'
    
    join_room(session_id)
    emit('game_state', {'state': sessions[session_id]['game_state']}, room=session_id)

    # Log the number of players in the game room after a player has joined
    print(f"Player {username} joined game room {session_id}. Total players in room: {len(sessions[session_id]['players'])}")

@socketio.on('disconnect')
def on_disconnect():
    user_id = request.sid
    for session_id, session in sessions.items():
        if user_id in [player[0] for player in session['players']]:
            player_left = [player for player in session['players'] if player[0] == user_id][0]
            session['players'] = [player for player in session['players'] if player[0] != user_id]
            if not session['players']:
                # Delete the session if there are no more players
                print(f"Player {player_left[1]} left game room {session_id}. Room is now empty and will be deleted.")
                del sessions[session_id]
            else:
                emit('game_state', {'state': 'waiting_for_players'}, room=session_id)
                print(f"Player {player_left[1]} left game room {session_id}. Total players in room: {len(session['players'])}")
            leave_room(session_id)
            break

@app.route("/")
def index():
    return "Flask SocketIO Wordle Server Running"



if __name__ == "__main__":
    socketio.run(app, host='192.168.1.38', port=2000, debug=True)
