import { classnameTypes } from "../../utils/classname.types";
import { ICON_RESTART } from "../../utils/svg";
import { button } from "../button";

export function mainFooter(): HTMLElement {
    const classname: classnameTypes = {
        base: "shrink-0 flex w-full justify-center items-center border-t bg-neutral-900 border-neutral-500",
        desktop: "lg:pt-8 lg:pb-16",
        mobile: "pt-4 pb-8",
    };

    const mainFooterElement: HTMLElement = document.createElement("div");
    mainFooterElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const buttonRefresh: HTMLButtonElement = button({
        classname:
            "p-4 bg-neutral-800 text-lg tracking-wider text-neutral-0 gap-2",
        text: "Restart Test",
        trailingIcon: ICON_RESTART(false),
        event: () => console.log(mainFooterElement),
    });

    mainFooterElement.append(buttonRefresh);

    return mainFooterElement;
}
