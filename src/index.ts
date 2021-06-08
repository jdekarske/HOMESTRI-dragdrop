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

document.getElementById("send_btn").onclick = (() => {
    ros.deleteAllCubes();
    let command_cubes = commandContainer.listCubes();
    if (command_cubes.num_cubes == 4) {
        let i = 1;
        command_cubes.cubelist.forEach((element) => {
            if (element.color) {
                ros.spawnCube(i++, element.color)
            }
        });
    } else {
        return false;
    }
})

document.getElementById("sort_btn").onclick = (() => {
    let command_cubes = commandContainer.listCubes();
    if (command_cubes.num_cubes == 4) {
        let i = 1;
        command_cubes.cubelist.forEach((element) => {
            if (element.color) {
                ros.goPickPlace(i++, element.id + 1);
            }
        });
    } else {
        return false;
    }
})