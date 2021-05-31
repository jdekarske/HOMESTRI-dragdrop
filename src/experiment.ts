import { CubeContainer } from "./cubecontainer.js"

let message: string = 'Hello';
let startContainer = new CubeContainer();

startContainer.addCube("1");

window.onload = function () {
    document.getElementById("instructions").textContent = "test";
    startContainer.listCubes();
} 