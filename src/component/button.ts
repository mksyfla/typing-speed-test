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

    const buttonElement = document.createElement("button");
    buttonElement.className = `${props.classname} font-semibold rounded-lg flex flex-row items-center justify-center cursor-pointer`;
    buttonElement.append(spanElement);
    buttonElement.insertAdjacentHTML("beforeend", props.trailingIcon ?? "");

    buttonElement.innerHTML = `
        <span class="inline">${props.text}</span>
        ${props.trailingIcon ?? ""}
    `;
    buttonElement.addEventListener("click", props.event);

    return buttonElement;
}
