// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio set to 1 for square viewport
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('car-container');
const aspectRatio = container.clientWidth / container.clientHeight; // Calculate aspect ratio
renderer.setSize(container.clientWidth, container.clientHeight); // Set renderer size to container size
container.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Load GLB model
const loader = new THREE.GLTFLoader();
loader.load(
    '/Users/dawidmaciejewski/Downloads/AuctionHouse/ProjectBigOne-AuctionHouse/frontend/img/1983_porsche_911_carrera.glb', // Adjusted path to GLB model
    function (gltf) {
        const carModel = gltf.scene;
        scene.add(carModel);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

// Camera setup
camera.position.z = 5;

// Update camera aspect ratio when container size changes
window.addEventListener('resize', function () {
    const newAspectRatio = container.clientWidth / container.clientHeight;
    camera.aspect = newAspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
