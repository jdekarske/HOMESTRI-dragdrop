import { Cube } from './movable';

function randomColor(): string {
  const colors = ['#337ab7', '#5bc0de', '#5cb85c', '#f0ad4e', '#d9534f'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default class CubeContainer {
  protected svg_node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  protected parent_node: HTMLElement;

  protected parent_div_name: string;

  // cubes in the interface
  private next_id = 0;

  private static selected_cube: string;

  public numberofshapes = 0;

  private empty_color = '#f1f3f5';

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
    this.svg_node.onclick = CubeContainer.checkClickedCube;
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
    this.next_id = 0; // start placing cubes from the beginning
    for (let index = 0; index < this.numberofshapes; index += 1) {
      if (empty) {
        this.addNextCube(this.empty_color); // empty cubes
      } else {
        this.addNextCube(randomColor());
      }
    }
  }

  public clearContainer() {
    while (this.svg_node.lastChild) {
      this.svg_node.removeChild(this.svg_node.lastChild);
    }
  }

  public setcubeColor(position: number, color: string) {
    const cubeDOM = document.getElementById(this.parent_div_name + position.toString());
    cubeDOM.setAttribute('fill', color);
  }

  private static setObjectVisuals(id: string) {
    const objNode = document.getElementById(id);
    if (!objNode) { return; }
    objNode.setAttributeNS(null, 'stroke-width', '3');
  }

  private static unsetObjectVisuals(id: string) {
    const objNode = document.getElementById(id);
    if (!objNode) { return; }
    objNode.setAttributeNS(null, 'stroke-width', '0');
  }

  private static checkClickedCube(evt) {
    // make sure we have a cube
    if (!evt.target.id) { return; } // could unselect here

    // instruction cubes are not selectable
    const dontSelect = 'instructioncontainer';
    if (evt.target.id.includes(dontSelect)) { return; }

    // if no cube selected, select it
    if (!CubeContainer.selected_cube) {
      CubeContainer.selected_cube = evt.target.id;
      CubeContainer.setObjectVisuals(evt.target.id);
    } else { // otherwise, swap the cubes
      CubeContainer.unsetObjectVisuals(CubeContainer.selected_cube);
      const newCubeDOM = document.getElementById(evt.target.id);
      const oldCubeDOM = document.getElementById(CubeContainer.selected_cube);
      const newColor = newCubeDOM.getAttribute('fill');
      const oldColor = oldCubeDOM.getAttribute('fill');
      oldCubeDOM.setAttribute('fill', newColor);
      newCubeDOM.setAttribute('fill', oldColor);
      CubeContainer.selected_cube = null;
    }
  }

  /**
     * addCube
     */
  public addCube(color: string, id: number): void {
    const row = Math.floor(id / this.numcolumns);
    const column = id % this.numcolumns;
    const defaultSize = 40;
    const cube = new Cube(
      this.parent_div_name + id.toString(),
      this.columnseperation * (column + 1),
      this.rowseperation * (row + 1),
      defaultSize,
      color,
    );
    cube.addToContainer(this.parent_node);
  }

  /**
 * addCube
 */
  public addNextCube(color: string): void {
    this.addCube(color, this.next_id);
    this.next_id += 1;
  }

  /**
     * listCubes
     */
  public listCubes(): object[] {
    const cubelist = [];
    this.svg_node.childNodes.forEach((element) => {
      let color = (element as SVGElement).getAttribute('fill');
      if (color === this.empty_color) { color = null; }
      const cube = {
        color,
        id: parseInt((element as SVGElement).getAttribute('id').substring(this.parent_div_name.length), 10),
      };
      cubelist.push(cube);
    });
    return cubelist;
  }
}
