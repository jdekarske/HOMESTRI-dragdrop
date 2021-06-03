import { CubeContainer } from "./cubecontainer.js"
import { ROSInterface } from "./ros.js";

let startContainer = new CubeContainer("startcontainer", 2, 8);
let instructionContainer = new CubeContainer("instructioncontainer", 2, 4);
let commandContainer = new CubeContainer("commandcontainer", 2, 4);

startContainer.fillContainer();
instructionContainer.fillContainer();
commandContainer.fillContainer(true);

let ros = new ROSInterface();