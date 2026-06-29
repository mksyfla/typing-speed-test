import { header } from "./component/header/header";
import { mainHeader } from "./component/main/main.header";
import "./styles.css";

const app = document.getElementById("app") as HTMLDivElement;

app.addEventListener("resize", () => {
    console.log(window.innerWidth);
});

app.append(header());
app.append(
    mainHeader({
        stats: [
            { key: "WMP:", value: "0" },
            { key: "Accuracy:", value: "100%" },
            { key: "Time:", value: "0:60" },
        ],
        difficulty: 0,
        difficultyList: ["Easy", "Medium", "Hard"],
        mode: 0,
        modeList: ["Timed (60s)", "Passage"],
    }),
);
