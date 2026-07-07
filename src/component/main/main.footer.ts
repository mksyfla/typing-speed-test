import { classnameTypes } from "../../utils/classname.types";
import { ICON_RESTART } from "../../utils/svg";
import { button } from "../button";
import { gameSettingsStateProps, gameSettingsStateStore, gameStatsStateStore } from "./main";

export function mainFooter(): HTMLElement {
    const classname: classnameTypes = {
        base: "flex w-full shrink-0 items-center justify-center border-t border-neutral-500 bg-neutral-900",
        desktop: "lg:pt-4 lg:pb-8",
        mobile: "pt-4 pb-8",
    };

    const mainFooterElement: HTMLElement = document.createElement("div");
    mainFooterElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const buttonRefresh: HTMLButtonElement = button({
        classname: "text-neutral-0 bg-neutral-800 p-4",
        text: "Restart Test",
        trailingIcon: ICON_RESTART(false),
        event: () => {
            gameSettingsStateStore.setState({
                start: false,
                finish: false,
            });
            gameStatsStateStore.setState({
                characterRight: 0,
                characterWrong: 0,
                wpm: 0,
            });
        },
    });

    mainFooterElement.append(buttonRefresh);

    function render(state: gameSettingsStateProps) {
        if (state.start === true) {
            mainFooterElement.classList.remove("hidden");
        } else {
            mainFooterElement.classList.add("hidden");
        }
    }

    gameSettingsStateStore.subscribe(render);

    render(gameSettingsStateStore.getState());

    return mainFooterElement;
}
