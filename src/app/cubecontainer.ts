import { Cube } from './movable';

function randomColor(): string {
  const colors = ['#337ab7', '#5bc0de', '#5cb85c', '#f0ad4e', '#d9534f'];
  return colors[Math.floor(Math.random() * colors.length)];
}

interface DisplayCube {
  id: number,
  DOMid: string,
  color: string,
}

export default class CubeContainer {
  protected svg_node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  protected parent_node: HTMLElement;

  protected parent_div_name: string;

  private disabled = false;

  // cubes in the interface
  private next_id = 0;

  private static selected_cube: DisplayCube;

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
    this.svg_node.onclick = (...args) => CubeContainer.checkClickedCube(...args);
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

  private static setOutline(id: string) {
    const objNode = document.getElementById(id);
    objNode.setAttributeNS(null, 'stroke-width', '3');
  }

  private static unsetOutline(id: string) {
    const objNode = document.getElementById(id);
    objNode.setAttributeNS(null, 'stroke-width', '0');
  }

  private static checkClickedCube(evt: Event) {
    // make sure we have a cube (and not the box)
    if (!(evt.target as SVGElement).classList.contains('movable')) { return; }
    const newCube: DisplayCube = {
      DOMid: (evt.target as Element).id,
      color: (evt.target as Element).getAttribute('fill'),
      id: parseInt((evt.target as Element).id.match(/\d+/g)[0], 10),
    };

    // instruction cubes are not selectable
    // TODO use the disabled property
    const dontSelect = 'instructioncontainer';
    if (newCube.DOMid.includes(dontSelect)) { return; }

    // if no cube selected, select it
    if (!CubeContainer.selected_cube) {
      CubeContainer.selected_cube = newCube;
      CubeContainer.setOutline(newCube.DOMid);
    } else { // otherwise, swap the cubes
      CubeContainer.unsetOutline(CubeContainer.selected_cube.DOMid);
      const newCubeDOM = document.getElementById(newCube.DOMid);
      const oldCubeDOM = document.getElementById(CubeContainer.selected_cube.DOMid);
      const newColor = newCubeDOM.getAttribute('fill');
      const oldColor = oldCubeDOM.getAttribute('fill');
      oldCubeDOM.setAttribute('fill', newColor);
      newCubeDOM.setAttribute('fill', oldColor);
      CubeContainer.selected_cube = null;
    }
  }

  public set disable(setting: boolean) {
    if (this.disabled === setting) return;
    this.disabled = setting;

    if (this.disabled) {
      const disabledNode = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      disabledNode.setAttributeNS(null, 'id', 'disabledNode');
      disabledNode.setAttributeNS(null, 'width', '100%');
      disabledNode.setAttributeNS(null, 'height', '100%');
      disabledNode.setAttributeNS(null, 'fill', 'red');
      disabledNode.setAttributeNS(null, 'opacity', '20%');
      const disabledText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      disabledText.innerHTML = 'Sorting...';
      disabledText.setAttributeNS(null, 'id', 'disabledText');
      disabledText.setAttributeNS(null, 'x', '50%');
      disabledText.setAttributeNS(null, 'y', '50%');
      disabledText.setAttributeNS(null, 'text-anchor', 'middle');
      this.svg_node.appendChild(disabledText);
      this.svg_node.appendChild(disabledNode);
    } else {
      const disabledNode = this.svg_node.getElementById('disabledNode');
      const disabledText = this.svg_node.getElementById('disabledText');
      this.svg_node.removeChild(disabledNode);
      this.svg_node.removeChild(disabledText);
    }
  }

  public get disable() {
    return this.disabled;
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
  public listCubes(): DisplayCube[] {
    const cubelist: DisplayCube[] = [];
    const movables = this.svg_node.getElementsByClassName('movable');
    Array.prototype.forEach.call(
      movables,
      (element: SVGElement) => {
        let color = element.getAttribute('fill');
        if (color === this.empty_color) { color = null; }
        const cube: DisplayCube = {
          color,
          id: parseInt(element.getAttribute('id').substring(this.parent_div_name.length), 10),
          DOMid: element.id,
        };
        cubelist.push(cube);
      },
    );
    return cubelist;
  }
}
