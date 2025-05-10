import sys
import os
from flask import Flask
from flask import send_from_directory
from flask import request
from flask_cors import CORS
from . import ai_model

# The 'static_folder' path should point to where the React build output
app = Flask(__name__, static_folder='../client_build', static_url_path='')
CORS(app)

# Serve React App
# This catch-all route directs all other requests to the React app's index.html.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    # If the requested path is a file in the static folder (e.g., main.js, main.css), serve it.
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Otherwise, serve the index.html, letting React Router handle the route.
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.post("/ai-move")
def ai_move():
    board = request.json.get("board")
    # check for a draw and then return the same board back if so
    tieMessage = f"Game ended in a Tie!"
    if(ai_model.full(board)): 
        return {"game_over": True, "outcome": tieMessage, "board": board}
    move = ai_model.minimax(board)
    board = ai_model.result(board, move)
    game_over = ai_model.terminal(board)
    if game_over:
        winner = ai_model.winner(board)
        if winner is None:
            return {"game_over": True, "outcome": tieMessage, "board": board}
        else:
            message = f"Game Over: {winner} wins."
            return {"game_over": True, "winner": winner, "outcome": message, "board": board}
    return {"board": board}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
