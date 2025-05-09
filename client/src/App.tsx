import { useState } from "react";
import "./App.css";
import Board from "./components/Board";
import StartScreen from "./components/StartScreen";

/**
 *
 * Player who chooses to play as X always goes first
 *
 */

function App() {
    const [humanPlayerLetter, setHumanPlayerLetter] = useState<string>("");
    const [aiPlayerLetter, setAiPlayerLetter] = useState<string>("");
    const [aiTurn, setAiTurn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [outcome, setOutcome] = useState<string>("");

    const [board, setBoard] = useState<Array<Array<string | null>>>([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]);

    return (
        <main>
            <h1 className="heading">TicTacToe.ai</h1>
            <p>Can you beat an AI in tic tac toe?</p>
            {humanPlayerLetter && aiPlayerLetter ? (
                <Board
                    board={board}
                    setBoard={setBoard}
                    humanPlayerLetter={humanPlayerLetter}
                    aiPlayerLetter={aiPlayerLetter}
                    aiTurn={aiTurn}
                    setAiTurn={setAiTurn}
                    gameOver={gameOver}
                    setGameOver={setGameOver}
                    outcome={outcome}
                    setOutcome={setOutcome}
                    setAiPlayerLetter={setAiPlayerLetter}
                    setHumanPlayerLetter={setAiPlayerLetter}
                    loading={loading}
                    setLoading={setLoading}
                />
            ) : (
                <StartScreen
                    setHumanPlayerLetter={setHumanPlayerLetter}
                    setAiPlayerLetter={setAiPlayerLetter}
                    aiTurn={aiTurn}
                    setAiTurn={setAiTurn}
                />
            )}
        </main>
    );
}

export default App;
