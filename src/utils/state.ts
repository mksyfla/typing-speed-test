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

type listener = (state: stateProps) => void;

function store() {
    let state: stateProps = initialState;
    const listeners = new Set<listener>();

    return {
        getState(): stateProps {
            return state;
        },
        setState(newState: Partial<stateProps>): void {
            state = {
                ...state,
                ...newState,
            };

            const localPersonalBest: number = parseInt(
                localStorage.getItem("personal-best") ?? "0",
            );
            if (state.personalBest > localPersonalBest) {
                localStorage.setItem(
                    "personal-best",
                    state.personalBest.toString(),
                );
            }

            listeners.forEach((listener: listener) => listener(state));
        },
        subscribe(listener: listener): () => void {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
    };
}

export const stateStore = store();
