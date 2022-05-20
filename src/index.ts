import "./static/style.css"
import { CubeContainer } from "./cubecontainer"
import { ROSInterface } from "./ros";
import { range, shuffle, getFormattedTime, downloadObjectAsJson } from "./util";

//TODO get jatos types
declare var jatos: any;
let trialsRemaining: number = 10;

// Init
//---------------------

let startContainer = new CubeContainer("startcontainer", 2, 8);
let instructionContainer = new CubeContainer("instructioncontainer", 2, 4);
let commandContainer = new CubeContainer("commandcontainer", 2, 4);

let gamma = 0.9; // good capability
let echo = 0.3 // bad capability

let current_algorithm = "algorithm_gamma";
let current_capability = gamma;

function randomMistake(capability: number) {
    return (Math.random() > capability); //if the random number is higher than the capability, we will make a mistake
}

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

    document.getElementById("trials_remaining").innerText = `${trialsRemaining} trials remaining.`

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
                logthis("spawncube: " + i.toString() + ":" + element.color)
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
        // find the empty command spaces
        let empty: number[] = [];
        let iempty = 0;
        command_cubes.cubelist.forEach((element) => {
            if (!element.color) {
                empty.push(element.id);
            }
        });
        let random_empty = shuffle(empty);

        let i = 1;
        command_cubes.cubelist.forEach((element) => {
            if (element.color) {
                if (randomMistake(current_capability)) {
                    logthis("mistake: " + (element.id + 1) + ":" + (random_empty[iempty] + 1).toString())
                    ros.goPickPlace(i++, random_empty[iempty++] + 1); // put it in an empty space
                } else {
                    ros.goPickPlace(i++, element.id + 1); // put it in the designated space
                    logthis("correct: " + (element.id + 1) + ":" + (element.id + 1).toString())
                }
            }
        });
    } else {
        return false;
    }
})

// TODO not using right now
// document.getElementById("replace_btn").onclick = (() => {
//     setupExperiment();
// })

document.getElementById("end_trial_btn").onclick = (() => {
    logthis("end trial")
    jatos.submitResultdata(logs); // TODO log everything better

    trialsRemaining -= 1;
    if (trialsRemaining <= 0) {
        jatos.startNextComponent()
    }
    setupExperiment();
})

document.getElementById("misplaced_object_btn").onclick = (() => {
    logthis("misplaced object");
})

document.getElementById("strange_behavior_btn").onclick = (() => {
    logthis("strange behavior");
})

document.getElementById("broken_robot_btn").onclick = (() => {
    logthis("broken robot");
    // TODO reset the simulation
})

document.getElementById("trust_slider").oninput = function () {
    logthis("trust: " + (this as HTMLInputElement).value.toString())
    // console.log((this as HTMLInputElement).value);
}

jatos.onLoad(() => {
    //    jatos.studyJsonInput["numTrials"] 
    setupExperiment();
});
