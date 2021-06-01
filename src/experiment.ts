import { CubeContainer } from "./cubecontainer.js"

let message: string = 'Hello';
let startContainer = new CubeContainer("startcontainer", 2, 8);
let instructionContainer = new CubeContainer("instructioncontainer", 1, 4);
let commandContainer = new CubeContainer("commandcontainer", 2, 4);

for (let index = 0; index < 14; index++) {
    let random_color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    startContainer.addCube(random_color);
}

for (let index = 0; index < 4; index++) {
    let random_color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    instructionContainer.addCube(random_color);
}

for (let index = 0; index < 5; index++) {
    let random_color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    commandContainer.addCube(random_color);
}