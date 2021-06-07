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
    let command_cubes = commandContainer.listCubes()
    if (command_cubes.num_cubes == 4) {
        command_cubes.cubelist.forEach((element, i) => {
            if (element.color) {
                ros.spawnCube(i + 1, element.color)
            }
        });
    } else {
        return false;
    }
})

document.getElementById("sort_btn").onclick = (() => {
    ros.goPickPlace(1, 1);
    ros.goPickPlace(2, 5);
    ros.goPickPlace(3, 3);
    ros.goPickPlace(4, 8);
})