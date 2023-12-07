import * as THREE from "three";

export function cameraMouseControl(camera: THREE.PerspectiveCamera, orbitPosition: THREE.Vector3) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let distance = orbitPosition.distanceTo(camera.position);
    let autoRotate = false;
    let idleTimeout: NodeJS.Timeout;

    // Calculate initial camera position along the orbit
    const initialTheta = Math.PI * 0.25; // Initial angle (adjust as needed)
    const initialRadius = 30; // Initial radius (adjust as needed)
    const initialX = orbitPosition.x + Math.cos(initialTheta) * initialRadius;
    const initialZ = orbitPosition.z + Math.sin(initialTheta) * initialRadius;
    const initialY = orbitPosition.y + initialRadius;
    camera.position.set(initialX, initialY, initialZ);
    camera.lookAt(orbitPosition);

    function startAutoRotate() {
        idleTimeout = setTimeout(() => {
            autoRotate = true;
        }, 2000); // 2 seconds idle time before auto-rotation starts
    }

    function cancelAutoRotate() {
        clearTimeout(idleTimeout);
        autoRotate = false;
    }

    // Auto-rotation function
    function autoRotateCamera() {
        if (!isDragging && autoRotate) {
            const time = Date.now() * 0.001;
            const angle = time * 0.1; // Adjust the speed of rotation
            const x = orbitPosition.x + Math.cos(angle) * initialRadius;
            const z = orbitPosition.z + Math.sin(angle) * initialRadius;
            const y = orbitPosition.y + initialRadius;

            camera.position.set(x, y, z);
            camera.lookAt(orbitPosition);
        }

        requestAnimationFrame(autoRotateCamera);
    }


    window.addEventListener('mousedown', (event) => {
        cancelAutoRotate(); // Cancel auto-rotation on mouse movement
        startAutoRotate(); // Restart idle timer on mouse movement

        if (event.button === 0) {
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        } else if (event.button === 2) { // Check for right mouse button
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaMove = { x: event.clientX - previousMousePosition.x, y: event.clientY - previousMousePosition.y };

            if (event.buttons === 1) { // Left mouse button (orbit)
                const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(orbitPosition));
                spherical.theta -= deltaMove.x * 0.01;
                spherical.phi -= deltaMove.y * 0.01;

                spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, spherical.phi));

                const offset = new THREE.Vector3().setFromSpherical(spherical);
                camera.position.copy(orbitPosition).add(offset);

                camera.lookAt(orbitPosition);
            } else if (event.buttons === 2) { // Right mouse button (pan)
                const panSpeed = 0.1;
                const panOffset = new THREE.Vector3(deltaMove.x * panSpeed, -deltaMove.y * panSpeed, 0);
                const panMatrix = new THREE.Matrix4().extractRotation(camera.matrixWorld);

                panOffset.applyMatrix4(panMatrix);
                camera.position.add(panOffset);
                orbitPosition.add(panOffset);
            }

            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    window.addEventListener('mouseup', (event) => {
        if (event.button === 0 || event.button === 2) {
            isDragging = false;
        }
    });

    window.addEventListener('wheel', (event) => {
        distance -= event.deltaY * 0.1;
        distance = Math.max(1, distance);

        const direction = camera.position.clone().sub(orbitPosition).normalize();
        const newCameraPosition = orbitPosition.clone().add(direction.multiplyScalar(distance));
        camera.position.copy(newCameraPosition);
    });

    // Prevent default right-click context menu
    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });


    startAutoRotate();
    autoRotateCamera();
}


