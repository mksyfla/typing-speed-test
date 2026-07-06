type listener<T> = (state: T) => void;

export function store<T>(state: T) {
    const listeners = new Set<listener<T>>();

    return {
        getState(): T {
            return state;
        },
        setState(newState: Partial<T>): void {
            state = {
                ...state,
                ...newState,
            };

            listeners.forEach((listener: listener<T>) => listener(state));
        },
        subscribe(listener: listener<T>): () => void {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
    };
}
