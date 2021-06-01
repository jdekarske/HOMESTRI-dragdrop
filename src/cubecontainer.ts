
import { Cube } from "./movable.js"

export class CubeContainer {

    protected svg_node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    protected parent_node;

    // cubes in the interface
    private contains = [];
    private next_id = 0;

    constructor(div_name: string) {
        this.parent_node = document.getElementById(div_name);
        this.parent_node.appendChild(this.svg_node);
    }

    /**
     * addCube
     */
    public addCube(color: string): void {
        // dimensions for the cube positions
        const numrows = 2;
        const numcolumns = 7;
        const gridwidth = this.parent_node.clientWidth; // Dimensions of grid
        const gridheight = this.parent_node.clientHeight; // Dimensions of grid
        const rowseperation = gridheight / (numrows + 1);
        const columnseperation = gridwidth / (numcolumns + 1);
        const row = Math.floor(this.next_id / numcolumns);
        const column = this.next_id % numcolumns;

        const default_size = 50;
        const cube = new Cube(this.next_id,
            columnseperation * (column + 1),
            rowseperation * (row + 1),
            default_size,
            color);
        this.contains.push(cube);
        cube.addToContainer(this.parent_node);
        this.next_id++;
    }

    /**
     * listCubes
     */
    public listCubes(): void {
        this.contains.forEach(element => {
            console.log(element);
        });
    }
}

