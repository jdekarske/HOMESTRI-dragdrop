import "./static/style.css"
import { CubeContainer } from "./cubecontainer"
import { ROSInterface } from "./ros";
import { range, shuffle, getFormattedTime, downloadObjectAsJson } from "./util";

// Init
//---------------------

let startContainer = new CubeContainer("startcontainer", 2, 8);
let instructionContainer = new CubeContainer("instructioncontainer", 2, 4);
let commandContainer = new CubeContainer("commandcontainer", 2, 4);

let ros = new ROSInterface();

let logs = [];

function logthis(object) {
    logs.push({
        "time": performance.now(),
        value: object
    });
}

// Setup the experiment
//---------------------

function setupExperiment() {

    logthis("trial start!")

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

    ros.deleteAllCubes();
}

setupExperiment();

// Setup the buttons
//---------------------

document.getElementById("send_btn").onclick = (() => {
    logthis("sendcubes")
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
    logthis("sortcubes")
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

document.getElementById("export_btn").onclick = (() => {
    downloadObjectAsJson(logs, getFormattedTime());
})

document.getElementById("trust_slider").oninput = function () {
    logthis("trust: " + (this as HTMLInputElement).value.toString())
    // console.log((this as HTMLInputElement).value);
}