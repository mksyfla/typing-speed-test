import { mainFooter } from "./main.footer";
import { mainHeader } from "./main.header";

export function mainElement(): HTMLElement {
    const main: HTMLElement = document.createElement("div");

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
            mainFooter(),
        );
    }

    render();

    return main;
}
