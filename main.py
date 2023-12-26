from flask import Flask
from flask_socketio import SocketIO
import time
import threading

app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app,cors_allowed_origins=['http://localhost:4200'])

def background_thread():
    count = 0
    while True:
        socketio.send(str(count))
        count += 1
        time.sleep(1)

@socketio.on('connect')
def handle_connect():
    if not thread.is_alive():
        thread.start()

thread = threading.Thread(target=background_thread)
thread.daemon = True

if __name__ == '__main__':
    socketio.run(app)
