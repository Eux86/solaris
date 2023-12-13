import * as THREE from 'three';
import { Vector3 } from "three";
export interface CelestialBody {
    name: string;
    size: number;
    color: number;
    orbitRadius?: number;
    centerBody?: CelestialBody;
    mesh?: THREE.Mesh | THREE.Line;
    emitsLight?: boolean;
    updatePosition: (time: number) => void;
    position: Vector3;
}

const sun: CelestialBody = {
    name: 'Sun',
    size: 5,
    color: 0xffff00,
    emitsLight: true,
    position: new Vector3(0,0,0),
    updatePosition: function () {}
};

const mercury: CelestialBody = {
    name: 'Mercury',
    size: 2,
    color: 0xAAAAAA,
    orbitRadius: 15,
    centerBody: sun,
    position: new Vector3(0,0,0),
    updatePosition: function (time: number) {
        // Calculate Mercury's position in its orbit around the sun
        // Use astronomical formulas to determine the position
        // This is a simplified example and might not be accurate for actual celestial mechanics

        // For demonstration purposes, assume a circular orbit and update the position based on time
        const orbitSpeed = 0.001; // Adjust as needed
        const randomInitialPosition = 1198;
        const angle = (time + randomInitialPosition) * orbitSpeed; // Calculate the angle based on time

        // Calculate Mercury's position around the sun in 2D circular orbit
        const x = Math.cos(angle) * this.orbitRadius!;
        const y = 0;
        const z = Math.sin(angle) * this.orbitRadius!;
        const position = new THREE.Vector3(x, y, z);

        this.position = position;
    }
};

const venus: CelestialBody = {
    name: 'Venus',
    size: 3,
    color: 0xAAAAAA,
    orbitRadius: 25,
    centerBody: sun,
    position: new Vector3(0,0,0),
    updatePosition: function (time: number) {
        // Calculate Venus's position in its orbit around the sun
        // Use astronomical formulas to determine the position
        // This is a simplified example and might not be accurate for actual celestial mechanics

        // For demonstration purposes, assume a circular orbit and update the position based on time
        const orbitSpeed = 0.0008; // Adjust as needed
        const randomInitialPosition = 223;
        const angle = (time + randomInitialPosition) * orbitSpeed; // Calculate the angle based on time

        // Calculate Venus's position around the sun in 2D circular orbit
        const x = Math.cos(angle) * this.orbitRadius!;
        const y = 0;
        const z = Math.sin(angle) * this.orbitRadius!;
        const position = new THREE.Vector3(x, y, z);

        this.position = position;
    }
};

const earth: CelestialBody = {
    name: 'Earth',
    size: 4,
    color: 0xAAAAAA,
    orbitRadius: 35,
    centerBody: sun,
    position: new Vector3(0,0,0),
    updatePosition: function (time: number) {
        // Calculate Earth's position in its orbit around the sun
        // Use astronomical formulas to determine the position
        // This is a simplified example and might not be accurate for actual celestial mechanics

        // For demonstration purposes, assume a circular orbit and update the position based on time
        const orbitSpeed = 0.0007; // Adjust as needed
        const randomInitialPosition = 21500;
        const angle = (time + randomInitialPosition) * orbitSpeed; // Calculate the angle based on time

        // Calculate Earth's position around the sun in 2D circular orbit
        const x = Math.cos(angle) * this.orbitRadius!;
        const y = 0;
        const z = Math.sin(angle) * this.orbitRadius!;
        const position = new THREE.Vector3(x, y, z);

        this.position = position;
    }
};

const mars: CelestialBody = {
    name: 'Mars',
    size: 5,
    color: 0xAAAAAA,
    orbitRadius: 45,
    centerBody: sun,
    position: new Vector3(0,0,0),
    updatePosition: function (time: number) {
        // Calculate Mars's position in its orbit around the sun
        // Use astronomical formulas to determine the position
        // This is a simplified example and might not be accurate for actual celestial mechanics

        // For demonstration purposes, assume a circular orbit and update the position based on time
        const orbitSpeed = 0.0006; // Adjust as needed
        const randomInitialPosition = 47;
        const angle = (time + randomInitialPosition) * orbitSpeed; // Calculate the angle based on time

        // Calculate Mars's position around the sun in 2D circular orbit
        const x = Math.cos(angle) * this.orbitRadius!;
        const y = 0;
        const z = Math.sin(angle) * this.orbitRadius!;
        const position = new THREE.Vector3(x, y, z);

        this.position = position;
    }
};
// List of celestial bodies
export const celestialBodies: CelestialBody[] = [sun, mercury, venus, earth, mars];

