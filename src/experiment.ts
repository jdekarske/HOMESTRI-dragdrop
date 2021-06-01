import { CubeContainer } from "./cubecontainer.js"

let message: string = 'Hello';
let startContainer = new CubeContainer("startcontainer", 2, 8);
let instructionContainer = new CubeContainer("instructioncontainer", 2, 4);
let commandContainer = new CubeContainer("commandcontainer", 2, 4);

for (let index = 0; index < 14; index++) {
    let random_color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    startContainer.addNextCube(random_color);
}

[1,4,6,5].forEach(element => {
    let random_color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    instructionContainer.addCube(random_color,element);
});

for (let index = 0; index < 8; index++) {
    commandContainer.addNextCube('#f1f3f5');
}