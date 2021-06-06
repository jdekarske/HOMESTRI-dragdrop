import "./static/style.css"
import { CubeContainer } from "./cubecontainer"
import { ROSInterface } from "./ros";

let startContainer = new CubeContainer("startcontainer", 2, 8);
let instructionContainer = new CubeContainer("instructioncontainer", 2, 4);
let commandContainer = new CubeContainer("commandcontainer", 2, 4);

startContainer.fillContainer();
instructionContainer.fillContainer();
commandContainer.fillContainer(true);

let ros = new ROSInterface();
ros.subscribeToCamera();

document.getElementById("send_btn").onclick = (() => {
    ros.deleteAllCubes();
    ros.spawnCube(1, "#5cb85c")
    ros.spawnCube(2, "#5cb85c")
    ros.spawnCube(3, "#5cb85c")
    ros.spawnCube(4, "#5cb85c")
})

document.getElementById("sort_btn").onclick = (() => {
    ros.goPickPlace(1, 1);
    ros.goPickPlace(2, 5);
    ros.goPickPlace(3, 3);
    ros.goPickPlace(4, 8);
})