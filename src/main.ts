import { header } from "./component/header/header";
import { mainElement } from "./component/main/main";
import "./styles.css";

const app = document.getElementById("app") as HTMLDivElement;

app.append(header(), mainElement());
