import { header } from "./component/header";
import "./styles.css";

const app = document.getElementById("app") as HTMLDivElement;

app.addEventListener("resize", () => {
    console.log(window.innerWidth);
});

app.append(header());
