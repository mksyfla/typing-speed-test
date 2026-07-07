export interface responseData {
    easy: string[];
    medium: string[];
    hard: string[];
}

export async function getData() {
    try {
        // @ts-ignore
        const response: Response = await fetch(`${import.meta.env.BASE_URL}/data-2.json`);

        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
    }
}

export const DATA_TEXT = await getData();
