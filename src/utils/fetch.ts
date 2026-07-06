export interface responseData {
    easy: string[];
    medium: string[];
    hard: string[];
}

export async function getData() {
    try {
        const response: Response = await fetch("./data-2.json");

        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
    }
}

export const DATA_TEXT = await getData();
