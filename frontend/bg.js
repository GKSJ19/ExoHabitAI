const canvas = document.getElementById('bg');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 4;

//
// 🌍 CREATE PLANET
//
const geometry = new THREE.SphereGeometry(1, 64, 64);

// texture (Earth-like)
const texture = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/earth_atmos_2048.jpg"
);

const material = new THREE.MeshStandardMaterial({
    map: texture
});

const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

//
// 💡 LIGHTS
//
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5, 3, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambient);

//
// ✨ STARS BACKGROUND
//
const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const positions = new Float32Array(starCount * 3);

for(let i=0;i<starCount*3;i++){
    positions[i] = (Math.random()-0.5) * 2000;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

//
// 🔁 ANIMATION LOOP
//
function animate(){
    requestAnimationFrame(animate);

    planet.rotation.y += 0.002;
    stars.rotation.y += 0.0003;

    renderer.render(scene, camera);
}
animate();

//
// 📱 RESIZE FIX
//
window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
