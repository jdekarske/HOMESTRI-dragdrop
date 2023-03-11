/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as ROSLIB from 'roslib';

function hexToRgb(hex: string): { r: number; g: number; b: number; } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

// find cubes in simulation and convert to number
function filterItems(arr: string[], query: string): number[] {
  return arr.filter((el) => el.toLowerCase()
    .indexOf(query.toLowerCase()) !== -1)
    .map((num) => num.slice(-1)) // assume we have "cube_n"
    .map(Number)
    .map((num) => ((num - 1) % 4) + 1); // TODO hacky
}

interface TimeMessage {
  time: {
    secs: number,
    nsecs: number
  }
}

interface Latency {
  time: number,
  rostime: number,
  latency: number,
}

interface CameraMessage {
  data: string,
  header: {
    seq: number,
    stamp: {
      secs: number,
      nsecs: number
    }
  }
}

interface CubeMessage {
  name: string[],
}

interface PickPlaceRequest {
  pick_object: string,
  place_object: string,
}

export default class ROSInterface {
  private remote_host: string;

  // TODO add websocket options here
  public ros = new ROSLIB.Ros({});

  public cubes_in_simulation: number[];

  public camera_element: HTMLElement;

  public status_element: HTMLElement;

  // TODO Promises... but roslibjs makes that messy
  public userMoveCubesCallback: ()=>void;

  public userSpawnCubesCallback: ()=>void;

  private last_latency: Latency = { time: 0, rostime: 0, latency: 0 };

  private time_sent = 0;

  // Connecting to server
  // ----------------------

  private setStatus(status: boolean) {
    if (status === true) {
      this.status_element.innerHTML = '🟢 Remote simulation connected.';
    } else {
      this.status_element.innerHTML = '🔴 Remote Simulation disconnected. Contact experiment team.';
      this.camera_element?.setAttribute('src', 'static/background.svg');
    }
  }

  private rosOnConnect() {
    // console.log('Connection to websocket!');
    this.setStatus(true);
    this.subscribeToCamera();
    this.subscribeToCubeCheck();
    this.last_latency = this.latency;
  }

  private rosOnReconnect(error: Event) {
    console.log('Error connecting to websocket server: ', error); // eslint-disable-line no-console
    this.setStatus(false);
    setTimeout(() => {
      this.ros.connect(this.remote_host);
    }, 1000);
  }

  private rosOnClose() {
    this.setStatus(false);
    setTimeout(() => {
      this.ros.connect(this.remote_host);
    }, 1000);
  }

  constructor() {
    this.ros.on('connection', this.rosOnConnect.bind(this));
    this.ros.on('error', this.rosOnReconnect.bind(this));
    this.ros.on('close', this.rosOnClose.bind(this));
  }

  public set remoteHost(value: string) {
    this.remote_host = value;
    this.ros.connect(this.remote_host);
  }

  // track time
  // -----------------

  // always spawn sequentially in position 1. the ROS stuff will take care of further naming

  private getTimeClient = new ROSLIB.Service({
    ros: this.ros,
    name: '/rosapi/get_time',
    serviceType: 'rosapi/GetTime',
  });

  public getTime() {
    const request = new ROSLIB.ServiceRequest({});
    this.time_sent = performance.now();
    this.getTimeClient.callService(request, (message: TimeMessage) => {
      const msecs = message.time.secs * 1_000 + message.time.nsecs / 1_000_000;
      this.last_latency = {
        time: this.time_sent,
        rostime: msecs,
        latency: performance.now() - this.time_sent,
      };
    });
  }

  public get latency() : Latency {
    this.getTime();
    return this.last_latency; // not going to get cheeky with async stuff
  }

  // Subscribing to the camera stream
  // ----------------------

  private camera_topic = new ROSLIB.Topic({
    ros: this.ros,
    name: '/camera/remote_camera_rack/compressed',
    messageType: 'sensor_msgs/CompressedImage',
  });

  private subscribeToCamera() {
    this.camera_topic.subscribe((message: CameraMessage) => {
      this.camera_element?.setAttribute('src', `data:image/png;base64,${message.data}`);
    });
  }

  // Check for cubes
  // -----------------

  private subscribeToCubeCheck() {
    const cubesTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/gazebo/model_states',
      messageType: 'gazebo_msgs/ModelStates',
    });

    cubesTopic.subscribe((message: CubeMessage) => {
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

  private spawnCubesCallback() {
    // console.log(`Result for service call on spawncubes: ${result.status}`);
    ROSInterface.spawning_flag = false;

    // if there are more things in the queue, send the next one
    if (ROSInterface.spawn_cubes_queue.length >= 1) {
      this.spawnCubesServiceCall();
    } else {
      this.userSpawnCubesCallback?.();
    }
  }

  // method to send spawn cube request to the simulation backend, there is no guarantee messages are
  // received sequentially
  private spawnCubesServiceCall() {
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

  private moveCubesCallback() {
    // console.log(`Result for service call on movecubes: ${result.status}`);
    ROSInterface.moving_flag = false;

    // if there are more things in the queue, send the next one
    if (ROSInterface.move_cubes_queue.length >= 1) {
      this.moveCubesServiceCall();
    } else {
      this.userMoveCubesCallback?.();
    }
  }

  // method to send move cube request to the simulation backend, there is no guarantee messages are
  // received sequentially
  private moveCubesServiceCall() {
    if (!ROSInterface.moving_flag) {
      const nextCube = ROSInterface.move_cubes_queue.shift() as PickPlaceRequest;

      ROSInterface.moving_flag = true;
      this.goPickPlaceClient.callService(
        nextCube,
        this.moveCubesCallback.bind(this),
        // run the thing again even if it fails (idk if this works)
        // everything falls apart otherwise
        this.moveCubesCallback.bind(this),
      );
    }
  }

  public goPickPlace(position1: number, position2: number) {
    const pickObject = `cube_${position1.toString()}`;
    const placeObject = `cube_${position2.toString()}`;

    const request = new ROSLIB.ServiceRequest({
      pick_object: pickObject,
      place_object: placeObject,
    });

    // add to queue and call the service if its the only thing in there
    ROSInterface.move_cubes_queue.push(request);
    this.moveCubesServiceCall();
  }

  // Reset pick and place
  // -----------------

  private resetClient = new ROSLIB.Service({
    ros: this.ros,
    name: '/pick_place/reset',
    serviceType: 'targetpose/reset',
  });

  public resetArm() {
    const request = new ROSLIB.ServiceRequest({ });
    this.resetClient.callService(request, () => {});
  }
}
