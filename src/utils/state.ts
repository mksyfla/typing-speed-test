type listener<T> = (state: T, description?: string) => void;

export function store<T>(state: T) {
    const listeners = new Set<listener<T>>();

    return {
        getState(): T {
            return state;
        },
        setState(newState: Partial<T>, description?: string): void {
            state = {
                ...state,
                ...newState,
            };

            listeners.forEach((listener: listener<T>) => listener(state, description));
        },
        subscribe(listener: listener<T>): () => void {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
    };
}
