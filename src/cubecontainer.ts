
import { Cube } from "./movable.js"

export class CubeContainer {

    protected svg_node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    protected parent_node: HTMLElement;
    protected parent_div_name: string;

    // cubes in the interface
    private contains = [];
    private next_id = 0;

    // sizing
    private numrows: number;
    private numcolumns: number;

    constructor(div_name: string, numrows: number, numcolumns: number) {
        this.numrows = numrows;
        this.numcolumns = numcolumns;

        this.parent_div = div_name;
        this.parent_node = document.getElementById(div_name);
        this.parent_node.appendChild(this.svg_node);
    }

    /**
     * addCube
     */
    public addCube(color: string, id: number): void {
        // dimensions for the cube positions
        const gridwidth = this.parent_node.clientWidth; // Dimensions of grid
        const gridheight = this.parent_node.clientHeight; // Dimensions of grid
        const rowseperation = gridheight / (this.numrows + 1);
        const columnseperation = gridwidth / (this.numcolumns + 1);
        const row = Math.floor(id / this.numcolumns);
        const column = id % this.numcolumns;

        const default_size = 40;
        const cube = new Cube(this.parent_div + id.toString(),
            columnseperation * (column + 1),
            rowseperation * (row + 1),
            default_size,
            color);
        this.contains.push(cube);
        cube.addToContainer(this.parent_node);
    }

    /**
 * addCube
 */
    public addNextCube(color: string): void {
        this.addCube(color, this.next_id)
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

