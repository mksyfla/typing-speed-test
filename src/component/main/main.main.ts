export function mainMain(): HTMLElement {
    const mainElement: HTMLElement = document.createElement("div");
    mainElement.className = "flex-1 overflow-y-auto w-full";

    mainElement.innerHTML = `<div class="h-900 bg-neutral-900"></div>`;

    return mainElement;
}
