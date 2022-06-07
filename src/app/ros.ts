/* eslint-disable object-shorthand */
import * as ROSLIB from 'roslib';

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number; } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function filterItems(arr, query) {
  return arr.filter((el) => el.toLowerCase().indexOf(query.toLowerCase()) !== -1);
}

export default class ROSInterface {
  private remote_url = 'wss://***REMOVED***/simulatorws/001';

  private local_url = 'ws://localhost:9090';

  public ros = new ROSLIB.Ros({});

  private url = this.remote_url;

  public cubes_in_simulation: string[];

  // Connecting to server
  // ----------------------

  private rosOnConnect() {
    console.log('Connection to websocket!');
    this.subscribeToCamera();
    this.subscribeToCubeCheck();
  }

  private rosOnReconnect(error) {
    console.log('Error connecting to websocket server: ', error);
    setTimeout(() => {
      this.ros.connect(this.remote_url);
    }, 1000);
  }

  constructor() {
    this.ros.on('connection', this.rosOnConnect.bind(this));
    this.ros.on('error', this.rosOnReconnect.bind(this));
    this.ros.on('close', () => {
      console.log('Connection to websocket server closed.');
    });

    this.ros.connect(this.url);
  }

  // Subscribing to the camera stream
  // ----------------------

  private camera_topic = new ROSLIB.Topic({
    ros: this.ros,
    name: '/camera/remote_camera_rack/compressed',
    messageType: 'sensor_msgs/CompressedImage',
  });

  public subscribeToCamera() {
    this.camera_topic.subscribe((message: ROSLIB.Message & any) => {
      document.getElementById('camera_stream').setAttribute('src', `data:image/jpg;base64,${message.data}`);
    });
  }

  // https://stackoverflow.com/questions/22395357/how-to-compare-two-arrays-are-equal-using-javascript
  private static arraysAreIdentical(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0, len = arr1.length; i < len; i += 1) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  // Check for cubes
  // -----------------

  public subscribeToCubeCheck() {
    const cubesTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/gazebo/model_states',
      messageType: 'gazebo_msgs/ModelStates',
    });

    cubesTopic.subscribe((message: ROSLIB.Message & any) => {
      this.cubes_in_simulation = filterItems(message.name, 'cube_');
    });
  }

  // Spawning cubes
  // -----------------

  // always spawn sequentially in position 1. the ROS stuff will take care of further naming

  private spawnCubesClient = new ROSLIB.Service({
    ros: this.ros,
    name: '/spawn_objects_service',
    serviceType: 'spawn_objects/spawn_objects',
  });

  static spawn_cubes_queue: ROSLIB.ServiceRequest[] = [];

  static spawning_flag = false; // determines if the simulation is spawning

  // rosservice call /spawn_objects_service "{param_name: '/cube_positions/inputs', overwrite: true,
  // position: 1, color: [0,0,1], length: 0, width: 0}"
  // TODO make this an interface probably
  public spawnCube(position: number, color: string) {
    const rgbcolors = hexToRgb(color);
    const request = new ROSLIB.ServiceRequest({
      param_name: '/cube_positions/inputs',
      overwrite: false,
      position,
      color: [rgbcolors.r, rgbcolors.g, rgbcolors.b],
      length: 0,
      width: 0,
    });

    // add to queue and call the service if its the only thing in there
    ROSInterface.spawn_cubes_queue.push(request);
    this.spawnCubesServiceCall();
  }

  public spawnCubesCallback(result) {
    console.log(`Result for service call on spawncubes: ${result.status}`);
    ROSInterface.spawning_flag = false;

    // if there are more things in the queue, send the next one
    if (ROSInterface.spawn_cubes_queue.length >= 1) {
      this.spawnCubesServiceCall();
    }
  }

  // method to send spawn cube request to the simulation backend, there is no guarantee messages are
  // received sequentially
  public spawnCubesServiceCall() {
    if (!ROSInterface.spawning_flag) {
      ROSInterface.spawning_flag = true;
      this.spawnCubesClient.callService(
        ROSInterface.spawn_cubes_queue.shift(),
        this.spawnCubesCallback.bind(this),
      );
    }
  }

  public deleteAllCubes() {
    const request = new ROSLIB.ServiceRequest({
      param_name: '',
      overwrite: true,
      position: 0,
      color: [0],
      length: 0,
      width: 0,
    });

    ROSInterface.spawn_cubes_queue.push(request);
    this.spawnCubesServiceCall();
  }

  // Moving cubes
  // -----------------

  // always  positions 1,2,3,4 (5,6,7,8). the ROS stuff will take care of further naming

  // rosservice call /pick_place "{pick_object: 'cube_1', place_object: 'cube_1'}"
  private goPickPlaceClient = new ROSLIB.Service({
    ros: this.ros,
    name: '/pick_place',
    serviceType: 'targetpose/pickplace',
  });

  static move_cubes_queue: ROSLIB.ServiceRequest[] = [];

  static moving_flag = false; // determines if the simulation is moving

  public moveCubesCallback(result) {
    console.log(`Result for service call on movecubes: ${result.status}`);
    ROSInterface.moving_flag = false;

    // if there are more things in the queue, send the next one
    if (ROSInterface.move_cubes_queue.length >= 1) {
      this.moveCubesServiceCall();
    }
  }

  // method to send move cube request to the simulation backend, there is no guarantee messages are
  // received sequentially
  public moveCubesServiceCall() {
    if (!ROSInterface.moving_flag) {
      ROSInterface.moving_flag = true;
      this.goPickPlaceClient.callService(
        ROSInterface.move_cubes_queue.shift(),
        this.moveCubesCallback.bind(this),
      );
    }
  }

  public goPickPlace(position1: number, position2: number) {
    const pickObject = `cube_${position1.toString()}`;
    const placeObject = `cube_${position2.toString()}`;

    // if (this.cubes_in_simulation.indexOf(pick_object) > -1) {
    //     console.warn(pick_object + ' not in simulation');
    //     return;
    // }

    const request = new ROSLIB.ServiceRequest({
      pick_object: pickObject,
      place_object: placeObject,
    });

    // add to queue and call the service if its the only thing in there
    ROSInterface.move_cubes_queue.push(request);
    this.moveCubesServiceCall();
  }
}
