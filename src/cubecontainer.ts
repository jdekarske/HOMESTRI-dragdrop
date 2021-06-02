
import { Cube } from "./movable.js"

export class CubeContainer {

    protected svg_node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    protected parent_node: HTMLElement;
    protected parent_div_name: string;

    // cubes in the interface
    private contains: Cube[] = [];
    private next_id = 0;
    private static selected_cube: string;
    public numberofshapes = 0;

    // sizing
    private numrows: number;
    private numcolumns: number;
    // dimensions for the cube positions
    private gridwidth: number;
    private gridheight: number;
    private rowseperation: number;
    private columnseperation: number;

    constructor(div_name: string, numrows: number, numcolumns: number) {
        this.parent_div_name = div_name;
        this.parent_node = document.getElementById(div_name);
        this.svg_node.onclick = this.checkClickedCube;
        this.parent_node.appendChild(this.svg_node);

        this.numrows = numrows;
        this.numcolumns = numcolumns;
        this.numberofshapes = numrows * numcolumns;
        this.gridwidth = this.parent_node.clientWidth; // Dimensions of grid
        this.gridheight = this.parent_node.clientHeight; // Dimensions of grid
        this.rowseperation = this.gridheight / (this.numrows + 1);
        this.columnseperation = this.gridwidth / (this.numcolumns + 1);
    }

    public fillContainer(empty = false) {
        for (let index = 0; index < this.numberofshapes; index++) {
            if (empty) {
                this.addNextCube('#f1f3f5'); // empty cubes
            } else {
                let random_color = '#' + Math.floor(Math.random() * 16777215).toString(16)
                this.addNextCube(random_color);
            }
        }
    }

    private static setObjectVisuals(id: string) {
        let obj_node = document.getElementById(id);
        if (!obj_node) { return; }
        obj_node.setAttributeNS(null, 'stroke-width', "2");
    }

    private static unsetObjectVisuals(id: string) {
        let obj_node = document.getElementById(id);
        if (!obj_node) { return; }
        obj_node.setAttributeNS(null, 'stroke-width', "0");
    }

    private checkClickedCube(evt) {
        // if no cube selected, select it
        if (!CubeContainer.selected_cube) {
            CubeContainer.selected_cube = evt.target.id;
            CubeContainer.setObjectVisuals(evt.target.id);

        } else { // otherwise, swap the cubes
            CubeContainer.unsetObjectVisuals(CubeContainer.selected_cube);
            let new_cube_DOM = document.getElementById(evt.target.id);
            let old_cube_DOM = document.getElementById(CubeContainer.selected_cube);
            let new_color = new_cube_DOM.getAttribute('fill');
            let old_color = old_cube_DOM.getAttribute('fill');
            old_cube_DOM.setAttribute('fill', new_color);
            new_cube_DOM.setAttribute('fill', old_color);
            CubeContainer.selected_cube = null;
        }
    }

    /**
     * addCube
     */
    public addCube(color: string, id: number): void {
        const row = Math.floor(id / this.numcolumns);
        const column = id % this.numcolumns;
        const default_size = 40;
        const cube = new Cube(this.parent_div_name + id.toString(),
            this.columnseperation * (column + 1),
            this.rowseperation * (row + 1),
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

