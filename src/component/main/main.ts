import { mainFooter } from "./main.footer";
import { mainHeader } from "./main.header";
import { mainMain } from "./main.main";

export function mainElement(): HTMLElement {
    const main: HTMLElement = document.createElement("main");
    main.className = "flex min-h-0 flex-1 flex-col";

    const header = mainHeader({
        stats: [
            { key: "WPM:", value: "0" },
            { key: "Accuracy:", value: "100%" },
            { key: "Time:", value: "0:60" },
        ],
    });

    main.append(header, mainMain(), mainFooter());

    return main;
}
