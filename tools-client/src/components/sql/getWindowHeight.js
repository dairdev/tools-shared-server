import WindowStates from "./windowStates";

function getWindowHeight(windowState) {
    switch (windowState) {
        case WindowStates.NORMAL:
            return "40vh";
            break;
        case WindowStates.MAXIMIZED:
            return "calc(95vh - 52px)";
            break;
        case WindowStates.MINIMIZED:
            return "26px";
            break;
    }
}

export default getWindowHeight;
