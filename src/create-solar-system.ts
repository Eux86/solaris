import { CelestialBody } from "./solar-system-data";
import * as THREE from "three";
import { Logger } from "./logger";
import { CurrentTime } from "./current-time";

export function createSolarSystem(scene: THREE.Scene, bodies: CelestialBody[]) {
    function placeCelestialBodies() {
        bodies.forEach(body => {
            if (!body.mesh){
                const planet = createPlanet(body.size, body.color, body.emitsLight);
                body.mesh = planet;
                scene.add(planet);

                const orbit = body.orbitRadius ? createOrbit(body.orbitRadius) : undefined;
                if (orbit && body?.centerBody) {
                    // scene.add(orbit);
                    body.centerBody.mesh?.add(orbit);
                }
            }
            const time = CurrentTime.getInstance().get();
            body.updatePosition(time);
            const { x, y, z}= body.position;
            // Logger.log(`${body.name}: ${JSON.stringify(body.position)} - Time: ${time}`);
            body.mesh.position.set(x,y,z);
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

        for (let i = 0; i < orbitPoints+1; i++) {
            const angle = (i / orbitPoints) * Math.PI * 2;
            vertices.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
        }

        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        return new THREE.Line(orbitGeometry, orbitMaterial);
    }

    function addLensFlareToSun(sun: CelestialBody) {
        const textureLoader = new THREE.TextureLoader();
        const lensFlareTexture = textureLoader.load('lensflare.jpg'); // Replace with your lens flare texture

        const lensFlare = new THREE.SpriteMaterial({
            map: lensFlareTexture,
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const lensFlareSize = 200; // Adjust the size of the lens flare
        const lensFlareDistance = 0; // Distance from the center

        const flare = new THREE.Sprite(lensFlare);
        flare.scale.set(lensFlareSize, lensFlareSize, 1);
        flare.position.set(0, 0, -lensFlareDistance);

        sun.mesh?.add(flare);
    }

    placeCelestialBodies();
    // addLensFlareToSun(bodies[0]);
}