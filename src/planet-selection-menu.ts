// Assuming celestialBodies is the list of available planets and moons

import * as THREE from "three";
import { CelestialBody } from "./solar-system-data";

export function solarSystemMenu(scene: THREE.Scene, celestialBodies: CelestialBody[], onSelectCelestialBody: (celestialBody: CelestialBody)=> void)
{
// Create an on-screen menu
    const menuDiv = document.createElement('div');
    menuDiv.style.position = 'absolute';
    menuDiv.style.top = '10px';
    menuDiv.style.left = '10px';
    document.body.appendChild(menuDiv);

// Populate the menu with available planets
    celestialBodies.forEach((planet) => {
        const planetButton = document.createElement('button');
        planetButton.textContent = planet.name;
        planetButton.addEventListener('click', () => {
            onSelectCelestialBody(planet);
        });
        menuDiv.appendChild(planetButton);
    });





// Render the scene using requestAnimationFrame or your animation loop
}