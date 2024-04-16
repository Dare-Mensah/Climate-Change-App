from flask import Flask, request
from flask_socketio import SocketIO, send, emit, disconnect, join_room, leave_room
import uuid
import threading
import time


app = Flask(__name__)
app.config['SECRET_KEY'] = 'verysecretkey'
socketio = SocketIO(app, cors_allowed_origins="*")

sessions = {}

def game_timer(session_id, duration):
    time.sleep(duration)
    session = sessions.get(session_id)
    if session and session['game_state'] == 'playing':
        emit('time_up', room=session_id)
        session['game_state'] = 'ended'

@socketio.on('timer_finished')
def handle_timer_finished():
    session_id = find_player_session(request.sid)
    if session_id:
        sessions[session_id]['game_state'] = 'ended'
        emit('time_up', room=session_id)

def find_session_waiting_for_players():
    for session_id, session in sessions.items():
        if len(session['players']) < 2:
            return session_id
    return None

@socketio.on('submit_guess')
def handle_guess(data):
    user_id = request.sid
    guess = data['guess']
    session_id = find_player_session(user_id)
    if session_id:
        session = sessions.get(session_id)
        if session:
            # Check if the guess is correct
            if guess.lower() == session['word'].lower():
                # Mark the game as won and notify all players in the room
                session['game_state'] = 'ended'
                emit('game_state', {'state': 'ended', 'message': 'Correct guess!', 'winner': user_id}, room=session_id)
            else:
                # Notify the user of a wrong guess
                emit('guess_response', {'correct': False, 'message': 'Incorrect guess, try again!'}, room=user_id)

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
    
    
@socketio.on('typing')
def handle_typing(data):
    is_typing = data['isTyping']
    user_id = request.sid
    session_id = find_player_session(user_id)
    if session_id:
        emit('player_typing', {'isTyping': is_typing}, room=session_id, include_self=False)


@socketio.on('word_generated')
def on_word_generated(data):
    word = data['word']
    session_id = find_player_session(request.sid)
    if session_id:
        sessions[session_id]['game_state'] = 'ready'
        sessions[session_id]['word'] = word  # Save the word in the session
        emit('game_state', {'state': 'ready', 'word': word}, room=session_id)  # Broadcasting 'ready' state to both players

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
