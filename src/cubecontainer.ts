export class CubeContainer {

    private contains: string[] = [];

    constructor() {
        console.group("hey");
    }

    /**
     * addCube
     */
    public addCube(id:string): void {
        this.contains.push(id); 
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

