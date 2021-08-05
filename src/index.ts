import "./static/style.css"
import { CubeContainer } from "./cubecontainer"
import { ROSInterface } from "./ros";
import { range, shuffle } from "./util";

let startContainer = new CubeContainer("startcontainer", 2, 8);
let instructionContainer = new CubeContainer("instructioncontainer", 2, 4);
let commandContainer = new CubeContainer("commandcontainer", 2, 4);

// Setup the experiment
//---------------------

function setupExperiment() {

    // make sure the containers are empty
    commandContainer.clearContainer()
    instructionContainer.clearContainer()
    startContainer.clearContainer()

    commandContainer.fillContainer(true); // empty
    instructionContainer.fillContainer(true); //empty

    // generate random cubes
    startContainer.fillContainer();

    // grab four random ones
    var start_cubes = startContainer.listCubes();
    var random_start_cubes_i = shuffle(range(0, start_cubes.cubelist.length)); // randomly selected cubes

    // put those in four random instruction places
    var random_instruction_cubes_i = shuffle(range(0, instructionContainer.numberofshapes));
    for (let i = 0; i < 4; i++) {
        instructionContainer.setcubeColor(
            random_instruction_cubes_i[i], // the position in the instruction box
            start_cubes.cubelist[random_start_cubes_i[i]].color) // random color from start box
    }
}

setupExperiment();
let ros = new ROSInterface();

// Setup the buttons
//---------------------

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

document.getElementById("replace_btn").onclick = (() => {
    setupExperiment();
})