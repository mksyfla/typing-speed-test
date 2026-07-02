import { classnameTypes } from "../../utils/classname.types";
import { stateStore } from "../../utils/state";
import { ICON_RESTART } from "../../utils/svg";
import { button } from "../button";

export function mainFooter(): HTMLElement {
    const classname: classnameTypes = {
        base: "flex w-full shrink-0 items-center justify-center border-t border-neutral-500 bg-neutral-900",
        desktop: "lg:pt-4 lg:pb-8",
        mobile: "p-4",
    };

    const mainFooterElement: HTMLElement = document.createElement("div");
    mainFooterElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const buttonRefresh: HTMLButtonElement = button({
        classname: "text-neutral-0 gap-2 bg-neutral-800 p-4 text-sm font-semibold tracking-wider",
        text: "Restart Test",
        trailingIcon: ICON_RESTART(false),
        // event: () => console.log(mainFooterElement),
        event: () => stateStore.getListener(),
    });

    mainFooterElement.append(buttonRefresh);

    return mainFooterElement;
}
