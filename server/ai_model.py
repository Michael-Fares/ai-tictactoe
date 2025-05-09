"""
Tic Tac Toe Player
"""

import math
import copy

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.
    """
    if(terminal(board)):
        return None
    if(board == initial_state()):
        return X

    """
    if the number of X's and O's on the board is equal, it is X's turn
    otherwise it is O's turn
    """
    counter = {}
    # loop over the board and keep track of the number of X's and Y's
    for i in range(len(board)):
        row = board[i]
        for j in range(len(row)):
            letter = row[j]
            if(letter not in counter):
                counter[letter] = 1
            else:
                counter[letter] += 1

    if(O in counter and counter[X] == counter[O]):
        return X
    else:
        return O


def actions(board):
  """
  Returns set of all possible actions (i, j) available on the board.
  """
  actions = []
  if(terminal(board)):
      return None

  for i in range(len(board)):
    row = board[i]
    for j in range(len(row)):
        cell = row[j]
        if(cell is None):
          actions.append((i,j))
  return actions

def full(board):
  for row in board:
          if(any(space is None for space in row)):
              return False
  return True

def result(board, action):
  """
  Returns the board that results from making move (i, j) on the board.
  """
  (rowIndex, cellIndex) = action
  #check if the action is valid on the board
  if(board[rowIndex][cellIndex] is not None):
    raise Exception("You cannot play on a cell that already has a letter")
  else:
    newBoard = copy.deepcopy(board)
    newBoard[rowIndex][cellIndex] = player(board)
    return newBoard



def horizontalWin(board):
  if(board[0][0] == board[0][1] == board[0][2] and board[0][0] is not None):
    return board[0][0]
  elif(board[1][0] == board[1][1] == board[1][2] and board[1][0] is not None):
    return board[1][0]
  elif(board[2][0] == board[2][1] == board[2][2] and board[2][0] is not None):
    return board[2][0]
  else:
    return None
    
def verticalWin(board):
  if(board[0][0] == board[1][0] == board[2][0] and board[0][0] is not None):
    return board[0][0]
  elif(board[0][1] == board[1][1] == board[2][1] and board[0][1] is not None):
    return board[0][1]
  elif(board[0][2] == board[1][2] == board[2][2] and board[0][2] is not None):
    return board[0][2]
  else:
    return None

def diagonalWin(board):
  if(board[0][0] == board[1][1] == board[2][2]):
    return board[0][0]
  elif(board[2][0] == board[1][1] == board[0][2]):
    return board[2][0]
  else:
    return None


def winner(board):
  return horizontalWin(board) or verticalWin(board) or diagonalWin(board)


def terminal(board):
  """
  check for a full board
  or a winner on the board
  and return true only then
  """
  if winner(board):
      return True
  else:
      for row in board:
          if(any(space is None for space in row)):
              return False
  return True
    

def utility(board):
  """
  Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
  """
  if(winner(board) == X):
      return 1
  elif((winner(board) == O)):
      return -1
  else:
      return 0


def max_value(board):
  if(terminal(board)):
    return utility(board)
  v = -math.inf
  for action in actions(board):
    v = max(v, min_value(result(board,action)))
  return v

def min_value(board):
  if(terminal(board)):
    return utility(board)
  v = math.inf
  for action in actions(board):
    v = min(v, max_value(result(board,action)))
  return v

def minimax(board):
  """
  Returns the optimal action for the current player on the board.
  """
  if(terminal(board)):
    return None
  isMaximizingPlayer = player(board) == X
  bestMove = (-1,-1)
  
  if(isMaximizingPlayer):
    bestValue = -math.inf
    for action in actions(board):
      moveValue = min_value(result(board,action))
      if(moveValue > bestValue):
        bestMove = action
        bestValue = moveValue
    return bestMove
  else:
    bestValue = math.inf
    for action in actions(board):
      moveValue = max_value(result(board,action))
      if(moveValue < bestValue):
        bestMove = action
        bestValue = moveValue
    return bestMove