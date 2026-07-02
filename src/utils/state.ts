import { MEDIA_QUERY } from "./breakpoint";

export interface stateProps {
    difficulty: number;
    mode: number;
    personalBest: number;
    isDesktop: boolean;
}

const initialState: stateProps = {
    difficulty: 0,
    mode: 0,
    personalBest: parseInt(localStorage.getItem("personal-best") ?? "0"),
    isDesktop: MEDIA_QUERY.matches,
};

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
        getListener() {
            console.log(listeners);
        },
    };
}

export const stateStore = store<stateProps>(initialState);

export interface pbStateProps {
    personalBest: number;
}

const pbState: pbStateProps = {
    personalBest: parseInt(localStorage.getItem("personal-best") ?? "0"),
};

export const pbStateStore = store<pbStateProps>(pbState);

export interface displayStateProps {
    isDesktop: boolean;
}

const displayState: displayStateProps = {
    isDesktop: MEDIA_QUERY.matches,
};

export const displayStateStore = store<displayStateProps>(displayState);

export interface gameSettingsStateProps {
    difficulty: number;
    mode: number;
}

const gameSettingsState: gameSettingsStateProps = {
    difficulty: 0,
    mode: 0,
};

export const gameSettingsStateStore = store<gameSettingsStateProps>(gameSettingsState);
