import { getAiMove, API_URL } from "../services/getAiMove";
import { useEffect } from "react";

import { Fragment } from "react/jsx-runtime";
import Outcome from "./Outcome";

function Board({
    board,
    setBoard,
    humanPlayerLetter,
    aiPlayerLetter,
    aiTurn,
    setAiTurn,
    gameOver,
    setGameOver,
    outcome,
    setOutcome,
    setAiPlayerLetter,
    setHumanPlayerLetter,
    loading,
    setLoading
}: {
    board: (string | null)[][];
    setBoard: React.Dispatch<React.SetStateAction<(string | null)[][]>>;
    humanPlayerLetter: string;
    aiPlayerLetter: string;
    aiTurn: boolean;
    setAiTurn: React.Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    outcome: string;
    setOutcome: React.Dispatch<React.SetStateAction<string>>;
    setAiPlayerLetter: React.Dispatch<React.SetStateAction<string>>;
    setHumanPlayerLetter: React.Dispatch<React.SetStateAction<string>>;
    loading:boolean;
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
}) {
    useEffect(() => {
        if (!aiTurn) return;
        setLoading(false);
        setTimeout(() => {
                setLoading(true)
        }, 2000)
        getAiMove(API_URL,board)
            .then((response) => response.json())
            .then((data) => {
                setBoard(data.board);
                setLoading(false);
                setAiTurn(!aiTurn);
                if (data?.game_over) {
                    setGameOver(!gameOver);
                    setOutcome(data?.outcome);
                }
            })
            .catch((error) => console.log("there was an error:", error));
    }, [aiTurn]);
    const handleClick = (e: React.MouseEvent) => {
        // if space is already occupied, or it's AI's turn, do nothing
        if (
            (e.target as HTMLDivElement).classList.contains("unplayable") ||
            aiTurn ||
            gameOver
        )
            return;
        setBoard((prevBoard: (null | string)[][]) => {
            const newBoard = [...prevBoard];
            const row = Number(
                (e.target as HTMLDivElement).getAttribute("data-row")
            );
            const col = Number(
                (e.target as HTMLDivElement).getAttribute("data-col")
            );
            // TODO dynamically set player letter - check python example
            newBoard[row][col] = humanPlayerLetter;
            return newBoard;
        });
        setAiTurn(!aiTurn);
    };
    return (
        <Fragment>
            <div className="players">
                <p><span className="highlight">You: </span>{humanPlayerLetter}</p>
                <p><span className="highlight">AI:</span> {aiPlayerLetter}</p>
                {aiTurn && loading ? <p className="ai-thinking"><span className="highlight">AI thinking...</span></p> : null}
            </div>
            <div className="board" aria-live="polite">
                {board.map((row: (string | null)[], rowIdx: number) => {
                    return (
                        <Fragment key={rowIdx}>
                            {row.map((cell: string | null, cellIdx: number) => {
                                return (
                                    <button
                                        onClick={handleClick}
                                        className={
                                            cell || aiTurn || gameOver
                                                ? "cell unplayable"
                                                : "cell playable"
                                        }
                                        data-row={rowIdx}
                                        data-col={cellIdx}
                                        key={`${rowIdx}_${cellIdx}`}
                                        disabled={(cell !== null || aiTurn || gameOver) as boolean}
                                        aria-label={cell ? `square in row ${rowIdx + 1}, column ${cellIdx + 1} contains ${cell}` : `empty square in row ${rowIdx + 1}, column ${cellIdx + 1}`}
                                    >
                                        {cell}
                                    </button>
                                );
                            })}
                        </Fragment>
                    );
                })}
            </div>
            {gameOver ? (
                <Outcome
                    outcome={outcome}
                    setAiPlayerLetter={setAiPlayerLetter}
                    setHumanPlayerLetter={setHumanPlayerLetter}
                    setBoard={setBoard}
                    gameOver={gameOver}
                    setGameOver={setGameOver}
                />
            ) : null}
        </Fragment>
    );
}
export default Board;
