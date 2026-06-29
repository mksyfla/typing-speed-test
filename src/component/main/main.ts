import { stateStore } from "../../utils/state";
import { mainFooter } from "./main.footer";
import { mainHeader } from "./main.header";
import { mainMain } from "./main.main";

export function mainElement(): HTMLElement {
    const main: HTMLElement = document.createElement("main");
    main.className = "flex flex-col flex-1 min-h-0";

    const header = mainHeader({
        stats: [
            { key: "WPM:", value: "0" },
            { key: "Accuracy:", value: "100%" },
            { key: "Time:", value: "0:60" },
        ],
        difficulty: stateStore.getState().difficulty,
        mode: stateStore.getState().mode,
    });

    main.append(header, mainMain(), mainFooter());

    return main;
}
