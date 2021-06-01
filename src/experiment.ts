import { CubeContainer } from "./cubecontainer.js"

let message: string = 'Hello';
let startContainer = new CubeContainer("startcontainer");
let instructionContainer = new CubeContainer("instructioncontainer");
let commandContainer = new CubeContainer("commandcontainer");

for (let index = 0; index < 14; index++) {
    let random_color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    startContainer.addCube(random_color);
}