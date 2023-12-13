import * as THREE from "three";
import { Vector3 } from "three";
import { CelestialBody } from "./solar-system-data";
import TWEEN from '@tweenjs/tween.js'

const centerPosition = new Vector3(0,0,0);
let previousSelectedPlanet: CelestialBody | undefined = undefined;
let initialized = false;

export function cameraControl(camera: THREE.PerspectiveCamera, selectedPlanet: CelestialBody) {
    if (!initialized) {
        const lookAt = selectedPlanet.mesh?.position || new Vector3(0,0,0);
        // Calculate initial camera position along the orbit
        const initialTheta = Math.PI * 0.25; // Initial angle (adjust as needed)
        const initialRadius = 30; // Initial radius (adjust as needed)
        const initialX = lookAt.x + Math.cos(initialTheta) * initialRadius;
        const initialZ = lookAt.z + Math.sin(initialTheta) * initialRadius;
        const initialY = lookAt.y + initialRadius;
        camera.position.set(initialX, initialY, initialZ);
        camera.lookAt(lookAt);
        initialized = true;
    }

    function moveCameraToPlanet(selectedPlanet: CelestialBody) {
        if (selectedPlanet.mesh) {
            // Calculate a new position for the camera that shows both the selected planet and the sun
            const distanceFromPlanet = 20; // Adjust the distance as needed

            // Calculate the camera's position relative to the selected planet
            const relativePosition = new THREE.Vector3(0, distanceFromPlanet, distanceFromPlanet);
            relativePosition.applyQuaternion(selectedPlanet.mesh.quaternion);
            const newPosition = selectedPlanet.mesh.position.clone().add(relativePosition);

            // Calculate the new lookAt point to focus on the center while following the selected planet
            const lookAtPoint = new THREE.Vector3().addVectors(selectedPlanet.mesh.position, centerPosition).multiplyScalar(0.5);

            // Animate the camera movement to the new position
            const tweenDuration = 1000; // Adjust the duration of the animation
            new TWEEN.Tween(camera.position)
                .to(newPosition, tweenDuration)
                .start();
            new TWEEN.Tween(camera.lookAt)
                .to(lookAtPoint, tweenDuration)
                .onUpdate((obj) => {
                    camera.lookAt(lookAtPoint);
                })
                .start();
        }
    }

    function moveCameraWithPlanet(selectedPlanet: CelestialBody) {
        if (selectedPlanet.mesh) {
            // Calculate a new position for the camera that shows both the selected planet and the sun
            const distanceFromPlanet = selectedPlanet.size*1.2; // Adjust the distance as needed

            // Calculate the camera's position relative to the selected planet
            const relativePosition = new THREE.Vector3(0, 0, distanceFromPlanet);
            relativePosition.applyQuaternion(selectedPlanet.mesh.quaternion);
            const newPosition = selectedPlanet.mesh.position.clone().add(relativePosition);
            newPosition.y = 2;

            // Calculate the new lookAt point to focus on the center while following the selected planet
            const lookAtPoint = new THREE.Vector3().addVectors(selectedPlanet.mesh.position, centerPosition).multiplyScalar(0.5);

            // Animate the camera movement to the new position
            const tweenDuration = 1000; // Adjust the duration of the animation
            camera.position.set(newPosition.x, newPosition.y, newPosition.z);
            camera.lookAt(lookAtPoint);
        }
    }

    if (previousSelectedPlanet !== selectedPlanet) {
        previousSelectedPlanet = selectedPlanet;
        // moveCameraToPlanet(selectedPlanet);
    }

    moveCameraWithPlanet(selectedPlanet);


}


