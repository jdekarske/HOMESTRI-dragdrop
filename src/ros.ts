import * as ROSLIB from "roslib";

export class ROSInterface {
    private remote_url = 'ws://172.17.0.2:9090'
    private local_url = 'ws://localhost:9090'
    private ros = new ROSLIB.Ros({});
    private url = this.remote_url;

    // Connecting to server
    // ----------------------

    constructor() {

        this.ros.on('connection', function () {
            console.log('Connection to websocket!');
        });

        this.ros.on('error', function (error) {
            console.log('Error connecting to websocket server: ', error);
            if (this.url === this.remote_url) {
                this.url = this.local_url;
                this.ros.connect(this.url);
            }
        });

        this.ros.on('close', function () {
            console.log('Connection to websocket server closed.');
        });

        this.ros.connect(this.url);
    }

    // Subscribing to the camera stream
    // ----------------------

    private camera_topic = new ROSLIB.Topic({
        ros: this.ros,
        name: '/camera/remote_camera_rack/compressed',
        messageType: 'sensor_msgs/CompressedImage'
    });

    public subscribeToCamera() {
        this.camera_topic.subscribe(function (message: ROSLIB.Message & any) {
            document.getElementById('camera_stream').setAttribute('src', "data:image/jpg;base64," + message.data);
        });
    }

    private filterItems(arr, query) {
        return arr.filter(function (el) {
            return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
    }

    // https://stackoverflow.com/questions/22395357/how-to-compare-two-arrays-are-equal-using-javascript
    private arraysAreIdentical(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    // check which cubes are in gazebo
    // var cubes_topic = new ROSLIB.Topic({
    //     ros: ros,
    //     name: '/gazebo/model_states',
    //     messageType: 'gazebo_msgs/ModelStates'
    // });

    // cubes_topic.subscribe(function (message) {
    //     var newcubes = filterItems(message.name, 'cube_');
    //     if (!arraysAreIdentical(newcubes, cubes)) {
    //         cubes = newcubes;
    //         updatePick(cubes);
    //     }

    // });

    // Spawning cubes
    // -----------------

    private spawnCubesClient = new ROSLIB.Service({
        ros: this.ros,
        name: '/spawn_objects_service',
        serviceType: 'spawn_objects/spawn_objects'
    });


    // rosservice call /spawn_objects_service "{param_name: '/cube_positions/inputs', overwrite: true, position: 1, color: [0,0,1], length: 0, width: 0}"
    public spawnCube(position: number, color: string) {
        let rgbcolors = hexToRgb(color);
        let request = new ROSLIB.ServiceRequest({
            param_name: '/cube_positions/inputs',
            overwrite: false,
            position: position,
            color: [rgbcolors.r, rgbcolors.g, rgbcolors.b],
            length: 0,
            width: 0
        }
        );

        this.spawnCubesClient.callService(request, function (result) {
            console.log('Result for service call on spawncubes: '
                + result.status);
        });
    }

    public deleteAllCubes() {
        let request = new ROSLIB.ServiceRequest({
            param_name: '',
            overwrite: true,
            position: 0,
            color: [0],
            length: 0,
            width: 0
        }
        );

        this.spawnCubesClient.callService(request, function (result) {
            console.log('Result for service call on spawncubes: '
                + result.status);
        });
    }

    // rosservice call /pick_place "{pick_object: 'cube_1', place_object: 'cube_1'}"
    private goPickPlaceClient = new ROSLIB.Service({
        ros: this.ros,
        name: '/pick_place',
        serviceType: 'targetpose/pickplace'
    });

    public goPickPlace(position1: number, position2: number) {
        let request = new ROSLIB.ServiceRequest({
            pick_object: 'cube_' + position1.toString(),
            place_object: 'cube_' + position2.toString(),
        });

        this.goPickPlaceClient.callService(request, function (result) {
            console.log('Result for service call on pickplace: '
                + result.status);
        });
    }
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number; } {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}