function StartScreen({
    setHumanPlayerLetter,
    setAiPlayerLetter,
    aiTurn,
    setAiTurn,
}: {
    setHumanPlayerLetter: React.Dispatch<React.SetStateAction<string>>
    setAiPlayerLetter: React.Dispatch<React.SetStateAction<string>>
    aiTurn: boolean
    setAiTurn: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const handleClick = (e: React.MouseEvent) => {
        const humanLetter = (e.target as HTMLButtonElement).getAttribute(
            "data-player"
        );
        setHumanPlayerLetter(humanLetter as string);
        const buttonWrapper = ((e.target as HTMLButtonElement).closest("div") as HTMLElement)
        const otherButton = (buttonWrapper.querySelector(`button:not([data-player="${humanLetter}"]`) as HTMLButtonElement)
        const aiLetter = otherButton 
            .getAttribute("data-player");
        setAiPlayerLetter(aiLetter as string);
        const aiGoesFirst = humanLetter === "O";
        if (aiGoesFirst) {
            setAiTurn(!aiTurn);
        }
    };
    return (
        <div className="start-screen">
            <div className="choose-letter">
                <button onClick={handleClick} data-player="X">
                    Play as X
                </button>
                <button onClick={handleClick} data-player="O">
                    Play as O
                </button>
            </div>
            <p style={{marginTop: '1rem'}}>X goes first</p>
        </div>
    );
}
export default StartScreen;
