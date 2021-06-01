// A generic object for things that can be dragged around. You have to implement the svg shape properties.
class Movable {
    public shape_node;
    private parent_node: HTMLElement;

    public id: string;
    public position_x: number;
    public position_y: number;
    public size: number;
    public color: string;
    public select = false;

    constructor(id: string, position_x: number, position_y: number, size: number, color: string) {
        this.id = id;
        this.position_x = position_x;
        this.position_y = position_y;
        this.size = size;
        this.color = color;
    }

    addToContainer(parent_node: HTMLElement) {
        parent_node.childNodes[0].appendChild(this.shape_node);
    }

    public getObjectDOM(): HTMLElement {
        return document.getElementById(this.id.toString());
    }

    onSelect = () => {
        let elem = this.getObjectDOM();
        elem.setAttributeNS(null, 'stroke-width', "4")
    }
}

export class Cube extends Movable {
    constructor(id: string, position_x: number, position_y: number, size: number, color: string) {
        super(id, position_x, position_y, size, color);
        this.shape_node = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.shape_node.setAttributeNS(null, 'id', this.id.toString());
        this.shape_node.setAttributeNS(null, 'x', this.position_x.toString());
        this.shape_node.setAttributeNS(null, 'y', this.position_y.toString());
        this.shape_node.setAttributeNS(null, 'width', this.size.toString());
        this.shape_node.setAttributeNS(null, 'height', this.size.toString());
        this.shape_node.setAttributeNS(null, 'fill', this.color);
        this.shape_node.setAttributeNS(null, 'transform', 'translate(' + (-this.size / 2).toString() + ' ' + (-this.size / 2).toString() + ')')
        this.shape_node.setAttributeNS(null, 'rx', '15');
        this.shape_node.setAttributeNS(null, 'class', 'movable');
        this.shape_node.setAttributeNS(null, 'stroke', "#AAA");
        this.shape_node.setAttributeNS(null, 'stroke-width', "0");
        this.shape_node.onclick = this.onSelect;
    }

    // call this after changing object attributes
    update() {
        let elem = this.getObjectDOM();
        elem.setAttributeNS(null, 'x', this.position_x.toString());
        elem.setAttributeNS(null, 'y', this.position_y.toString());
        elem.setAttributeNS(null, 'width', this.size.toString());
        elem.setAttributeNS(null, 'height', this.size.toString());
        elem.setAttributeNS(null, 'rx', '15');
        elem.setAttributeNS(null, 'fill', this.color);
    }
}
