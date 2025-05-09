
export function getAiMove(url:string ,board: (string| null)[][]) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: board }),
    };
    return fetch(url, requestOptions)
}

export const API_URL = "/ai-move";