import * as THREE from "three";

export function setupLightingAndBackground(scene: THREE.Scene, gridSize: number) {
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

    addShadowCastingLight();
    createSky();
}