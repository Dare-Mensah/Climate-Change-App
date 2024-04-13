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
        sessions[session_id]['game_state'] = 'waiting_for_word'
    
    join_room(session_id)
    emit('game_state', {'state': sessions[session_id]['game_state']}, room=session_id)

@socketio.on('word_generated')
def on_word_generated(data):
    word = data['word']
    session_id = find_player_session(request.sid)
    if session_id:
        sessions[session_id]['game_state'] = 'ready'
        sessions[session_id]['word'] = word  # Save the word in the session
        emit('game_state', {'state': 'ready', 'word': word}, room=session_id)  # Broadcasting 'ready' state to both players
        
        
        
@socketio.on('submit_guess')
def handle_guess(data):
    user_id = request.sid
    guess = data['guess']
    session_id = find_player_session(user_id)
    if session_id and 'word' in sessions[session_id]:
        correct = guess.lower() == sessions[session_id]['word'].lower()
        # Emit the guess result back to the specific user who made the guess
        emit('guess_response', {'correct': correct}, room=user_id)
        if correct:
            sessions[session_id]['game_state'] = 'completed'
            # Optionally, you can also notify the other player about the game completion
            emit('game_completed', {'winner': user_id}, room=session_id)
        
    

def find_player_session(user_id):
    for session_id, session in sessions.items():
        if user_id in [player[0] for player in session['players']]:
            return session_id
    return None

@socketio.on('disconnect')
def on_disconnect():
    user_id = request.sid
    for session_id, session in sessions.items():
        players = session['players']
        if user_id in [player[0] for player in players]:
            remaining_players = [player for player in players if player[0] != user_id]
            session['players'] = remaining_players
            if not remaining_players:
                print(f"Game room {session_id} is now empty and will be deleted.")
                del sessions[session_id]
            else:
                emit('player_dropped', {'message': 'Other player has left the game.'}, room=session_id)
            leave_room(session_id)
            break

@app.route("/")
def index():
    return "Flask SocketIO Wordle Server Running"



if __name__ == "__main__":
    socketio.run(app, host='192.168.1.38', port=2000, debug=True)
