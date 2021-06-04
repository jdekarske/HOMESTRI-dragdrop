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
        name: '/camera/remote_camera/compressed',
        messageType: 'sensor_msgs/CompressedImage'
    });

    public subscribeToCamera() {
        this.camera_topic.subscribe(function (message) {
            //TODO
            document.getElementById('camera_stream').setAttribute('src', "data:image/jpg;base64," + message);
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

    private spawnCubes() {
        let request = new ROSLIB.ServiceRequest({
            //TODO
            surface_name: '',
            overwrite: true,
        });

        this.spawnCubesClient.callService(request, function (result) {
            console.log('Result for service call on spawncubes: '
                + result.status);
        });
    }

    private goPickPlaceClient = new ROSLIB.Service({
        ros: this.ros,
        name: '/pick_place',
        serviceType: 'targetpose/pickplace'
    });

    private goPickPlace() {
        let request = new ROSLIB.ServiceRequest({
            // TODO
            pick_object: 'todo',
            place_object: 'todo'
        });

        this.goPickPlaceClient.callService(request, function (result) {
            console.log('Result for service call on pickplace: '
                + result.status);
        });
    }
}
