import { SVG_ICON_DATA_TYPES } from "../utils/svg";

interface buttonProps {
    text: string;
    classname: string;
    event: () => void;
    trailingIcon?: SVG_ICON_DATA_TYPES;
}

export function button(props: buttonProps): HTMLButtonElement {
    const spanElement: HTMLSpanElement = document.createElement("span");
    spanElement.className = "inline";
    spanElement.textContent = props.text;

    const buttonElement: HTMLButtonElement = document.createElement("button");
    buttonElement.className = `${props.classname} flex cursor-pointer flex-row items-center justify-center rounded-lg`;
    buttonElement.append(spanElement);
    buttonElement.insertAdjacentHTML("beforeend", props.trailingIcon ?? "");
    buttonElement.addEventListener("click", props.event);

    return buttonElement;
}
