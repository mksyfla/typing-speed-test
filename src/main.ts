import { header } from "./component/header/header";
import { mainElement } from "./component/main/main";
import "./styles.css";
import { getData } from "./utils/fetch";

const app = document.getElementById("app") as HTMLDivElement;

(async function () {
    console.log(await getData());
})();

app.append(header(), mainElement());
