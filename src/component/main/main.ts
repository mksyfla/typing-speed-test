import { mainFooter } from "./main.footer";
import { mainHeader } from "./main.header";

export function mainElement(): HTMLElement {
    const main: HTMLElement = document.createElement("div");

    const mainElement: HTMLElement = document.createElement("div");
    mainElement.className =
        "w-full h-900 bg-linear-to-t from-cyan-100 to-blue-900";

    function render() {
        main.append(
            mainHeader({
                stats: [
                    { key: "WMP:", value: "0" },
                    { key: "Accuracy:", value: "100%" },
                    { key: "Time:", value: "0:60" },
                ],
                difficulty: 0,
                difficultyList: ["Easy", "Medium", "Hard"],
                mode: 0,
                modeList: ["Timed (60s)", "Passage"],
            }),
            mainElement,
            mainFooter(),
        );
    }

    render();

    return main;
}
