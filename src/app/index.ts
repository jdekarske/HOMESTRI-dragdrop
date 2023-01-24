import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/style.css';
import CubeContainer from './cubecontainer';
import ROSInterface from './ros';
import { range, shuffle } from './util';

const prod = process.env.NODE_ENV === 'production';
if (prod) console.log('production'); // eslint-disable-line no-console

// TODO make this a jatos var
let trialsRemaining = 10;
// Init
//---------------------

const gamma = 0.9; // good capability
const echo = 0.3; // bad capability
const numCubes = 4; // the number of cubes that will be sorted

const capabilities = [gamma, echo];
const algorithms = ['gamma', 'echo'];

let currentAlgorithm = 'algorithm_gamma';
let currentCapability = gamma;

const startContainer = new CubeContainer('startcontainer', 2, 8);
const instructionContainer = new CubeContainer('instructioncontainer', 2, numCubes);
const commandContainer = new CubeContainer('commandcontainer', 2, numCubes);

function randomMistake(capability: number) {
  // if the random number is higher than the capability, we will make a mistake
  return (Math.random() > capability);
}

const ros = new ROSInterface();
ros.remoteHost = `wss://${process.env.simulator_host}/simulatorws/1`; // TODO workerID
ros.camera_element = document.getElementById('camera_stream');
ros.status_element = document.getElementById('status_element');

const logs = [];

function logthis(object: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  logs.push({
    time: performance.now(),
    value: object, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  });
}

// TODO this chunk should help when running multiple sims
// if (!prod) {
//   const input = document.createElement('input');
//   input.setAttribute('type', 'text');
//   input.setAttribute('value', '1');
//   input.addEventListener('keypress', (event: KeyboardEvent) => {
//     if (event.key === 'Enter') {
//       ros.workerID = parseInt(input.value, 10);
//     }
//   });
//   document.getElementsByName('dev')[0].appendChild(input);
// }

// Setup the experiment
//---------------------

function setupExperiment() {
  logthis('trial start!');

  document.getElementById('trials_remaining').innerText = `${trialsRemaining} trials remaining.`;

  const choice = Math.ceil(Math.random() * 2) - 1;
  currentAlgorithm = algorithms[choice];
  currentCapability = capabilities[choice];
  logthis(currentAlgorithm);
  logthis(currentCapability);
  document.getElementById('current_algorithm').innerText = `Current Algorithm: ${currentAlgorithm}`;

  // make sure the containers are empty
  commandContainer.clearContainer();
  instructionContainer.clearContainer();
  startContainer.clearContainer();

  commandContainer.fillContainer(true); // empty
  instructionContainer.fillContainer(true); // empty

  // generate random cubes
  startContainer.fillContainer();

  // grab four random ones
  const startCubes = startContainer.listCubes();

  // randomly selected cubes
  const randomStartCubesi = shuffle(range(0, startCubes.length));

  // put those in four random instruction places
  const randomInstructionCubesi = shuffle(range(0, instructionContainer.numberofshapes));
  for (let i = 0; i < numCubes; i += 1) {
    instructionContainer.setcubeColor(
      randomInstructionCubesi[i], // the position in the instruction box
      startCubes[randomStartCubesi[i]].color,
    ); // random color from start box
  }

  ros.deleteAllCubes();
}

// Setup the buttons
//---------------------

document.getElementById('send_btn').onclick = (() => {
  logthis('sendcubes');
  ros.deleteAllCubes();
  const commandCubes = commandContainer.listCubes();
  if (commandCubes.filter((v) => v.color !== null).length === numCubes) {
    let i = 0;
    commandCubes.forEach((element) => {
      if (element.color) {
        logthis(`spawncube: ${i.toString()}:${element.color}`);
        ros.spawnCube(i += 1, element.color);
      }
    });
  } else {
    return false;
  }
  return true;
});

document.getElementById('sort_btn').onclick = (() => {
  logthis('sortcubes');
  const commandCubes = commandContainer.listCubes();
  if (commandCubes.filter((v) => v.color !== null).length === numCubes) {
    // find the empty command spaces
    const empty: number[] = [];
    let iempty = 0;
    commandCubes.forEach((element) => {
      if (!element.color) {
        empty.push(element.id);
      }
    });
    const randomEmpty = shuffle(empty);

    let i = 0;
    commandCubes.forEach((element) => {
      if (element.color) {
        if (randomMistake(currentCapability)) {
          logthis(`mistake: ${element.id + 1}:${(randomEmpty[iempty] + 1).toString()}`);
          ros.goPickPlace(i += 1, randomEmpty[iempty += 1] + 1); // put it in an empty space
        } else {
          ros.goPickPlace(i += 1, element.id + 1); // put it in the designated space
          logthis(`correct: ${element.id + 1}:${(element.id + 1).toString()}`);
        }
      }
    });
  } else {
    return false;
  }
  return true;
});

document.getElementById('end_trial_btn').onclick = (() => {
  logthis('end trial');
  if (prod) jatos.submitResultData(logs); // TODO log everything better

  trialsRemaining -= 1;
  if (trialsRemaining <= 0) {
    if (prod) jatos.startNextComponent();
  }
  setupExperiment();
});

document.getElementById('misplaced_object_btn').onclick = (() => {
  logthis('misplaced object');
});

document.getElementById('strange_behavior_btn').onclick = (() => {
  logthis('strange behavior');
});

document.getElementById('broken_robot_btn').onclick = (() => {
  logthis('broken robot');
  // TODO reset the simulation
});

document.getElementById('trust_slider').oninput = () => {
  logthis(`trust: ${(this as HTMLInputElement).value.toString()}`);
};

if (prod) {
  jatos.onLoad(() => {
    //    jatos.componentJsonInput["numTrials"]
    setupExperiment();
  });
} else {
  // TODO optionally load jatos stuff here from config file
  setupExperiment();
}
