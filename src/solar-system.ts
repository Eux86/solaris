export interface CelestialBody {
    name: string;
    size: number;
    color: number;
    orbitRadius?: number;
    centerBody?: CelestialBody;
    mesh?: THREE.Mesh | THREE.Line;
    emitsLight?: boolean;
}

const sun: CelestialBody = {
    name: 'Sun',
    size: 5,
    color: 0xffff00,
    emitsLight: true,
};

const mercury: CelestialBody = {
    name: 'Mercury',
    size: 2,
    color: 0xAAAAAA,
    orbitRadius: 15,
    centerBody: sun,
};

const venus: CelestialBody = {
    name: 'Venus',
    size: 3,
    color: 0xAAAAAA,
    orbitRadius: 25,
    centerBody: sun,
};

const earth: CelestialBody = {
    name: 'Earth',
    size: 4,
    color: 0xAAAAAA,
    orbitRadius: 35,
    centerBody: sun,
};

const mars: CelestialBody = {
    name: 'Mars',
    size: 5,
    color: 0xAAAAAA,
    orbitRadius: 45,
    centerBody: sun,
};
// List of celestial bodies
export const celestialBodies: CelestialBody[] = [sun, mercury, venus, earth, mars];

