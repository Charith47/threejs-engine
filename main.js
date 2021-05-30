import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";

import PickHelper from "./js/PickHelper";
import LoadHelper from "./js/LoadHelper";

// declare variables
let camera, scene, renderer, controls;
let gridHelper, axesHelper, pointLightHelper;
let pointlight, ambientlight;
let geometry, material, cube;

let fileSelector = document.getElementById("loadObj");

let loadBtn = {
  loadFile: function () {
    fileSelector.click();
    console.log("Clicked");
  },
};

const stats = Stats();
const gui = new GUI();
const gui2 = new GUI();

const pickHelper = new PickHelper();
const pickPosition = { x: 0, y: 0 };
clearPickPosition();

// declare scene constants
const FOV = 75;
const WIDTH = window.innerWidth || 1;
const HEIGHT = window.innerHeight || 1;
const ASPECT_RATIO = WIDTH / HEIGHT;
const PIXEL_RATIO = window.devicePixelRatio;
const NEAR_CLIP = 0.1;
const FAR_CLIP = 1000;
const DEFAULT_POS = [20, 40, 60];
const CANVAS = document.querySelector("#bg");
const ENABLE_HELPERS = false;
const GRID_SIZE = 100;
const GRID_DIVISIONS = 25;
const BASE_COLOR = 0xffffff;
const BACKGROUND_COLOR = new THREE.Color(0x3c3c3c);
const BOX_COLOR = 0x0000aa;
const BOX_SIZE = [5, 5, 5];
init();

function init() {
  camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR_CLIP, FAR_CLIP);
  scene = new THREE.Scene();
  scene.background = BACKGROUND_COLOR;

  camera.position.set(...DEFAULT_POS.map((pos) => pos + 15));
  renderer = new THREE.WebGLRenderer({
    canvas: CANVAS,
  });

  renderer.setPixelRatio(PIXEL_RATIO);
  renderer.setSize(WIDTH, HEIGHT);

  pointlight = new THREE.PointLight(BASE_COLOR);
  pointlight.position.set(...DEFAULT_POS.map((pos) => pos - 15));
  ambientlight = new THREE.AmbientLight(BASE_COLOR);

  geometry = new THREE.BoxGeometry(...BOX_SIZE);
  material = new THREE.MeshPhongMaterial({ color: BOX_COLOR });
  cube = new THREE.Mesh(geometry, material);

  controls = new OrbitControls(camera, renderer.domElement);
  gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS);
  axesHelper = new THREE.AxesHelper(5);
  pointLightHelper = new THREE.PointLightHelper(pointlight, 5);

  scene.add(pointlight);
  scene.add(ambientlight);
  scene.add(cube);
  if (ENABLE_HELPERS) {
    scene.add(pointlight);
    scene.add(ambientlight);
    scene.add(gridHelper);
    scene.add(axesHelper);
    scene.add(pointLightHelper);
  }
  document.body.appendChild(stats.dom);
  gui.add(loadBtn, "loadFile").name("Load 3D model");
  animate();
}

function animate() {
  controls.update();
  stats.update();
  pickHelper.pick(pickPosition, scene, camera);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", onWindowResize);

window.addEventListener("mousemove", setPickPosition);
window.addEventListener("mouseout", clearPickPosition);
window.addEventListener("mouseleave", clearPickPosition);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

fileSelector.addEventListener("change", (event) => {
  new LoadHelper(event, scene).load();
});

function getCanvasRelativePosition(event) {
  const rect = CANVAS.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * CANVAS.width) / rect.width,
    y: ((event.clientY - rect.top) * CANVAS.height) / rect.height,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / CANVAS.width) * 2 - 1;
  pickPosition.y = (pos.y / CANVAS.height) * -2 + 1;
}

function clearPickPosition() {
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}
