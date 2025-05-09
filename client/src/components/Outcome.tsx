function Outcome({
    outcome,
    setHumanPlayerLetter,
    setAiPlayerLetter,
    setBoard,
    gameOver,
    setGameOver,
}: {
    outcome: string;
    setAiPlayerLetter: React.Dispatch<React.SetStateAction<string>>
    setHumanPlayerLetter: React.Dispatch<React.SetStateAction<string>>
    setBoard: React.Dispatch<React.SetStateAction<(string | null)[][]>>
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const handleClick = () => {
        setAiPlayerLetter("");
        setHumanPlayerLetter("");
        setBoard([
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]);
        setGameOver(!gameOver);
    };
    return (
        <>
            <p>{outcome}</p>
            <button className="play-again" onClick={handleClick}>Play Again</button>
        </>
    );
}
export default Outcome;
