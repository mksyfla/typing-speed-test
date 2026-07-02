export interface responseData {
    easy: string[];
    medium: string[];
    hard: string[];
}

export async function getData() {
    try {
        const response: Response = await fetch("./data-2.json");

        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const result: responseData = await response.json();
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
    }
}
