import * as THREE from 'three';
import { celestialBodies, CelestialBody } from "./solar-system";
import { cameraMouseControl } from "./camera-mouse-control";
import { Vector3 } from "three";

const scene = new THREE.Scene();
const gridMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
const gridSize = 500;
const gridSpacing = 1;

enum Color {
    LightGray = '0xdcdcdc'
}

function horizontalPlane() {
    const y = -5;

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

    createHorizontalGrid(y);
    createSquare(y)
}


function addShadowCastingLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.top = gridSize;
    directionalLight.shadow.camera.bottom = -gridSize;
    directionalLight.shadow.camera.left = -gridSize;
    directionalLight.shadow.camera.right = gridSize;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = gridSize;

    scene.add(directionalLight);
}

function createSky() {
    const skyGeometry = new THREE.SphereGeometry(300, 32, 32); // Large sphere geometry
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x222222,
        side: THREE.BackSide, // Render the material on the back side of the geometry
    });

    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
}



function createSolarSystem(bodies: CelestialBody[]) {
    function placeCelestialBodies() {
        bodies.forEach(body => {
            if (body.orbitRadius && body.centerBody) {
                const orbit = createOrbit(body.orbitRadius);
                const planet = createPlanet(body.size, body.color);

                body.mesh = orbit;
                body.centerBody.mesh?.add(orbit);

                const angle = Math.random() * Math.PI * 2; // Randomize initial position for variety
                const x = Math.cos(angle) * body.orbitRadius;
                const z = Math.sin(angle) * body.orbitRadius;

                planet.position.set(x, 0, z); // Set the planet's position along the orbit
                orbit.add(planet);
                body.mesh = planet;
            } else {
                const planet = createPlanet(body.size, body.color, body.emitsLight);
                body.mesh = planet;
                scene.add(planet);
            }
        });
    }
    function createPlanet(size: number, color: number, emitsLight = false): THREE.Mesh {
        const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({ color: color });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.castShadow = true;
        planet.receiveShadow = true;
        return planet
    }
    function createOrbit(radius: number): THREE.Line {
        const orbitPoints = 128;
        const orbitGeometry = new THREE.BufferGeometry();
        const vertices = [];

        for (let i = 0; i < orbitPoints; i++) {
            const angle = (i / orbitPoints) * Math.PI * 2;
            vertices.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
        }

        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        return new THREE.Line(orbitGeometry, orbitMaterial);
    }

    placeCelestialBodies();
}

function animate(camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer:THREE.WebGLRenderer) {
    function loop()
    {
        requestAnimationFrame(loop);
        renderer.render(scene, camera);
    }
    loop()
}

function buildScene() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type
    document.body.appendChild(renderer.domElement);

    addShadowCastingLight(); // Add the shadow-casting light
    horizontalPlane()
    createSky();
    // Call the function to create the solar system
    createSolarSystem(celestialBodies);
    // rotateCamera(camera, renderer, 30);
    cameraMouseControl(camera, new Vector3(0,0,0));

    animate(camera, scene, renderer);
}

buildScene();
