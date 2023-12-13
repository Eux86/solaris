import * as THREE from 'three';
import { celestialBodies, CelestialBody } from "./solar-system-data";
import { cameraControl } from "./camera-control";
import { setupLightingAndBackground } from "./lighting-and-background";
import { createSolarSystem } from "./create-solar-system";
import { solarSystemMenu } from "./planet-selection-menu";
import { CurrentTime } from "./current-time";
import TWEEN from "@tweenjs/tween.js";
import { Logger } from "./logger";

const scene = new THREE.Scene();
const gridSize = 500;
const gridSpacing = 1;
let selectedCelestialBody: CelestialBody = celestialBodies[2];

function horizontalPlane(heigth: number = -5) {
    function createHorizontalGrid(y: number) {
        const verticalPosition = y;
        const maxOpacityDistance = gridSize * 0.05; // Adjust this value to control the distance where lines start fading

        for (let i = -gridSize; i <= gridSize; i += gridSpacing) {
            const distanceFromCenter = Math.abs(i); // Assuming the lines are centered at the origin

            // Calculate opacity based on distance
            const opacity = 1 - (distanceFromCenter / maxOpacityDistance);
            const alpha = opacity < 0 ? 0 : opacity; // Ensure opacity is not negative

            const gridMaterial = new THREE.LineBasicMaterial({color: 0xdcdcdc, transparent: true, opacity: alpha}); // Light gray color

            const horizontalGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-gridSize, verticalPosition, i),
                new THREE.Vector3(gridSize, verticalPosition, i),
            ]);
            const horizontalLine = new THREE.Line(horizontalGeometry, gridMaterial);
            scene.add(horizontalLine);

            const verticalGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, verticalPosition, -gridSize),
                new THREE.Vector3(i, verticalPosition, gridSize),
            ]);
            const verticalLine = new THREE.Line(verticalGeometry, gridMaterial);
            scene.add(verticalLine);
        }
    }
    function createSquare(y: number) {
        const squareSize = 999;
        const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
        const squareMaterial = new THREE.MeshStandardMaterial({color: 0xAAAAAA}); // Green color

        const square = new THREE.Mesh(squareGeometry, squareMaterial);
        square.receiveShadow = true; // Ensure the square receives shadows

        // Rotate the square to be horizontal (lying flat)
        square.rotation.x = -Math.PI / 2;
        square.position.y = y;

        scene.add(square);
    }

    createHorizontalGrid(heigth);
    createSquare(heigth)
}




function animate(camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer:THREE.WebGLRenderer) {
    function loop()
    {
        requestAnimationFrame(loop);
        TWEEN.update();
        CurrentTime.getInstance().increment();
        createSolarSystem(scene, celestialBodies);
        cameraControl(camera, selectedCelestialBody);
        renderer.render(scene, camera);
    }
    loop()
}

function onSelectPlanet(celestialBody: CelestialBody) {
    selectedCelestialBody = celestialBody;
    Logger.log(`Selected planet: ${selectedCelestialBody.name}`)
}

function buildScene() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type
    document.body.appendChild(renderer.domElement);

    setupLightingAndBackground(scene, gridSize);
    horizontalPlane()
    solarSystemMenu(scene, celestialBodies, onSelectPlanet);
    animate(camera, scene, renderer);
}

buildScene();
