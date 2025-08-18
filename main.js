import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const canvas = document.querySelector('#c');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

const cubeLoader = new THREE.CubeTextureLoader();
const skybox = cubeLoader.load(
    [
        'resources/images/skybox_right.jpeg',  // posX
        'resources/images/skybox_left.jpeg',   // negX
        'resources/images/skybox_top.jpeg',    // posY
        'resources/images/skybox_bottom.jpeg', // negY
        'resources/images/skybox_front.jpeg',  // posZ
        'resources/images/skybox_back.jpeg',   // negZ
    ],
    () => { scene.background = skybox; },
    undefined,
    (err) => console.error('Skybox load error:', err)
);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
);
cube.position.set(0, 1.6, 0);
scene.add(cube);

scene.add(new THREE.GridHelper(50, 50));

const mtlLoader = new MTLLoader();
mtlLoader.load('resources/objects/audioobj.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('resources/objects/audioobj.obj', (obj) => {

        scene.add(obj);

    });

});

const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

const keys = {};
document.addEventListener('keydown', (e) => (keys[e.code] = true));
document.addEventListener('keyup', (e) => (keys[e.code] = false));

const speed = 0.1;
function handleMovement() {
    if (!controls.isLocked) return;
    if (keys['KeyW']) controls.moveForward(speed);
    if (keys['KeyS']) controls.moveForward(-speed);
    if (keys['KeyA']) controls.moveRight(-speed);
    if (keys['KeyD']) controls.moveRight(speed);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    handleMovement();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
