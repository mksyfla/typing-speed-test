import { classnameTypes } from "../../utils/classname.types";
import { ICON_RESTART } from "../../utils/svg";
import { button } from "../button";

export function mainFooter(): HTMLElement {
    const classname: classnameTypes = {
        base: "flex w-full justify-center items-center border-t border-neutral-500",
        desktop: "lg:pt-8 lg:pb-16",
        mobile: "pt-4 pb-8",
    };

    const mainFooter: HTMLElement = document.createElement("div");
    mainFooter.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    function render() {
        function toggleList() {
            console.log(mainFooter);
        }

        const buttonRefresh = button({
            classname:
                "p-4 bg-neutral-800 text-lg tracking-wider text-neutral-0 gap-2",
            text: "Restart Test",
            trailingIcon: ICON_RESTART(false),
            event: toggleList,
        });
        mainFooter.append(buttonRefresh);
    }

    render();

    return mainFooter;
}
