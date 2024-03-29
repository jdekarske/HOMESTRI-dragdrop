import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/style.css';
import CubeContainer from './cubecontainer';
import ROSInterface from './ros';
import {
  range, shuffle, downloadObjectAsJson, getFormattedTime,
} from './util';

const useJatos = process.env.use_jatos;
console.debug(useJatos);

// TODO make this a jatos var
const totalTrials = 10;
let trialsRemaining = totalTrials;
// Init
//---------------------

const gamma = 1.0; // good capability
const echo = 0.5; // bad capability
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
ros.remoteHost = `${process.env.protocol}${process.env.host}/${process.env.endpoints_simulation}`; // TODO workerID
ros.camera_element = document.getElementById('camera_stream');
ros.status_element = document.getElementById('status_element');

// TODO this should be a class or library
const logs = [];

function logthis(object: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  logs.push({
    time: performance.now(),
    value: object, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  });
}

// Buttons
//--------

// const sendBtn = document.getElementById('send_btn'); // sort automatically
const sortBtn = document.getElementById('sort_btn') as HTMLInputElement;
const nextTrialBtn = document.getElementById('next_trial_btn') as HTMLInputElement;
// const misplacedBtn = document.getElementById('misplaced_object_btn');
// const strangeBtn = document.getElementById('strange_behavior_btn');
// const brokneBtn = document.getElementById('broken_robot_btn');

// Setup the experiment
//---------------------

function setupExperiment() {
  logthis('trial start!');
  logthis({ trial: totalTrials - trialsRemaining });

  document.getElementById('trials_remaining').innerText = `${trialsRemaining} trials remaining.`;
  nextTrialBtn.disabled = true;

  const choice = Math.ceil(Math.random() * 2) - 1;
  currentAlgorithm = algorithms[choice];
  currentCapability = capabilities[choice];
  logthis({ currentAlgorithm });
  logthis({ currentCapability });
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

  ros.resetArm();
  ros.deleteAllCubes();

  setInterval(() => {
    logthis(ros.latency);
  }, 10_000);
}

function sort() {
  logthis('sortcubes');
  logthis({ commandContainer: commandContainer.listCubes() });
  logthis({ instructionContainer: instructionContainer.listCubes() });
  logthis({ startContainer: startContainer.listCubes() });

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
      if (element.color) { // not an empty space
        if (randomMistake(currentCapability)) {
          const newSpace = randomEmpty[iempty] + 1;
          logthis(`mistake: ${element.id + 1}:${newSpace.toString()}`);
          ros.goPickPlace(i += 1, newSpace); // put it in an empty space
          iempty += 1;
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
}

function send() {
  logthis('sendcubes');
  ros.deleteAllCubes();
  const commandCubes = commandContainer.listCubes();
  if (commandCubes.filter((v) => v.color !== null).length === numCubes) {
    commandContainer.disable = true;
    sortBtn.disabled = true;
    nextTrialBtn.disabled = true;
    let i = 0;
    commandCubes.forEach((element) => {
      if (element.color) {
        logthis(`spawncube: ${i.toString()}:${element.color}`);
        ros.spawnCube(i += 1, element.color);
      }
    });
  } else {
    // TODO alert that you need 4 cubes
    return false;
  }
  return true;
}

function nextTrial() {
  logthis('end trial');
  if (useJatos) jatos.submitResultData(logs);

  trialsRemaining -= 1;
  if (trialsRemaining <= 0) {
    if (useJatos) {
      jatos.startNextComponent();
    } else {
      downloadObjectAsJson(logs, getFormattedTime());
    }
  }
  setupExperiment();
}

ros.userSpawnCubesCallback = () => {
  sort(); // TODO will only sort if there are cubes
};

ros.userMoveCubesCallback = () => {
  console.log('movecubes');
  commandContainer.disable = false;
  nextTrialBtn.disabled = false;
  sortBtn.disabled = false;
};

// sendBtn.onclick = send;
sortBtn.onclick = send; // sort automatically
nextTrialBtn.onclick = nextTrial;
// misplacedBtn.onclick = (() => {
//   logthis('misplaced object');
// });
// strangeBtn.onclick = (() => {
//   logthis('strange behavior');
// });
// brokenBtn.onclick = (() => {
//   logthis('broken robot');
//   ros.resetArm();
// });

document.getElementById('trust_slider').oninput = () => {
  logthis(`trust: ${(document.getElementById('trust_slider') as HTMLInputElement).value.toString()}`);
};

if (useJatos) {
  jatos.onLoad(() => {
    //    jatos.componentJsonInput["numTrials"]
    logthis(jatos.addJatosIds({ startTime: Date.now() }));
    setupExperiment();
  });
} else {
  // TODO optionally load jatos stuff here from config file
  setupExperiment();
}
