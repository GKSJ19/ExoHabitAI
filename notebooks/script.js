// ---------------------------------------------------------
// ExoHabitAI - Cinematic Space Interface & Logic
// ---------------------------------------------------------

// --- THREE.JS SCENE SETUP ---
const canvas = document.getElementById('bg3d');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

// --- ASSETS & TEXTURES ---
const loader = new THREE.TextureLoader();

// Fallback texture generation (if external assets fail or for procedural look)
function createNoiseTexture() {
    const size = 512;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
    }
    const texture = new THREE.DataTexture(data, size, size);
    texture.needsUpdate = true;
    return texture;
}

// --- PLANET CREATION ---
const planetGroup = new THREE.Group();
scene.add(planetGroup);

// 1. Core Planet
const geometry = new THREE.SphereGeometry(10, 64, 64);
// Earth-like textures
const earthDiffuseUrl = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const earthBumpUrl = 'https://threejs.org/examples/textures/planets/earth_bump_2048.jpg';
const earthSpecUrl = 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg';

const material = new THREE.MeshPhongMaterial({
    map: loader.load(earthDiffuseUrl),
    bumpMap: loader.load(earthBumpUrl),
    bumpScale: 0.5,
    specularMap: loader.load(earthSpecUrl),
    specular: new THREE.Color(0x333333),
    shininess: 15
});

const planet = new THREE.Mesh(geometry, material);
planetGroup.add(planet);

// 2. Atmosphere Glow (Shader)
const atmosphereVertexShader = `
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const atmosphereFragmentShader = `
    varying vec3 vNormal;
    void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 1.5;
    }
`;

const atmosphereGeometry = new THREE.SphereGeometry(12, 64, 64);
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
});

const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
planetGroup.add(atmosphere);

// 3. Clouds (Simple Sphere just above surface)
const cloudGeometry = new THREE.SphereGeometry(10.12, 64, 64);
const cloudTexture = loader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png');
const cloudMaterial = new THREE.MeshLambertMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.35
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
planetGroup.add(clouds);

// Position Planet (Bottom Center)
planetGroup.position.y = -12;
planetGroup.rotation.z = 0.41;

// --- STARFIELD & PARTICLES ---

// 1. Distant Stars
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3000;
const posArray = new Float32Array(starsCount * 3);
const scaleArray = new Float32Array(starsCount);

for(let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200; // Spread
}
for(let i = 0; i < starsCount; i++) {
    scaleArray[i] = Math.random();
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
starsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

const starsMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// 2. Cosmic Dust / Particles
const dustGeometry = new THREE.BufferGeometry();
const dustCount = 500;
const dustPos = new Float32Array(dustCount * 3);

for(let i = 0; i < dustCount * 3; i++) {
    dustPos[i] = (Math.random() - 0.5) * 100;
}

dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dustMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});

const dustField = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dustField);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white light
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(20, 20, 20);
scene.add(sunLight);

const rimLight = new THREE.SpotLight(0x00f3ff, 2);
rimLight.position.set(-20, 10, 10);
rimLight.lookAt(planetGroup.position);
scene.add(rimLight);

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate Planet
    planet.rotation.y = elapsedTime * 0.08;
    clouds.rotation.y = elapsedTime * 0.1;
    clouds.rotation.x = elapsedTime * 0.01;

    // Rotate Starfield (Parallax)
    starField.rotation.y = elapsedTime * 0.01;
    dustField.rotation.y = elapsedTime * 0.02;
    dustField.position.y = Math.sin(elapsedTime * 0.2) * 2;

    // Atmosphere handled by shader; no uniform updates needed

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Adjust planet position for mobile
    if (window.innerWidth < 992) {
        planetGroup.position.y = -8;
        planetGroup.scale.set(0.8, 0.8, 0.8);
    } else {
        planetGroup.position.y = -12;
        planetGroup.scale.set(1, 1, 1);
    }
});

// Trigger resize once to set initial state
window.dispatchEvent(new Event('resize'));


// --- UI LOGIC & GSAP ANIMATIONS ---

// Initial Load Animation
window.addEventListener('load', () => {
    const loaderEl = document.getElementById('loader');
    
    // Simulate initialization time
    setTimeout(() => {
        gsap.to(loaderEl, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                loaderEl.style.display = 'none';
                startIntroAnimations();
            }
        });
    }, 1500);
});

function startIntroAnimations() {
    gsap.from('.app-header', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('#predictForm .glass-panel', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
}

// --- FORM HANDLING ---

const form = document.getElementById('predictForm');
const predictBtn = document.getElementById('predictBtn');
const btnText = predictBtn.querySelector('.btn-text');
const btnLoader = predictBtn.querySelector('.btn-loader');
const resultCard = document.getElementById('resultCard');
const predictionPanel = document.getElementById('predictForm'); // Updated target
const errorAlert = document.getElementById('errorAlert');
const errorMsg = document.getElementById('errorMsg');
const resetBtn = document.getElementById('resetBtn');
const backBtn = document.getElementById('backBtn');

// Helper: Parse Number
function parseNum(id) {
    const el = document.getElementById(id);
    if (!el) return NaN;
    const v = parseFloat(el.value);
    return Number.isFinite(v) ? v : NaN;
}

// Helper: Convert Radius
function convertRadiusToEarthRadii(value, unit) {
    const EARTH_RADIUS_KM = 6371;
    if (unit === 'km') return value / EARTH_RADIUS_KM;
    return value; // already in Earth radii
}

// Reset Form
resetBtn.addEventListener('click', () => {
    form.reset();
    hideError();
    gsap.to(resultCard, { opacity: 0, display: 'none', duration: 0.3 });
    gsap.to(predictionPanel, { x: 0, opacity: 1, display: 'block', duration: 0.3 });
});

// Back from Result
backBtn.addEventListener('click', () => {
    gsap.to(resultCard, { 
        opacity: 0, 
        x: 50, 
        duration: 0.3, 
        onComplete: () => {
            resultCard.classList.add('d-none');
            predictionPanel.classList.remove('d-none');
            gsap.fromTo(predictionPanel, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 });
        }
    });
});

function showError(msg) {
    errorMsg.textContent = msg;
    errorAlert.classList.remove('d-none');
    gsap.fromTo(errorAlert, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.3 });
}

function hideError() {
    errorAlert.classList.add('d-none');
}

// Submit Handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    
    // UI Loading State
    predictBtn.disabled = true;
    btnText.textContent = 'ANALYZING...';
    btnLoader.classList.remove('d-none');

    // Gather Data
    const pl_rade_raw = parseNum('pl_rade');
    const pl_rade_unit = document.getElementById('pl_rade_unit').value;
    const pl_rade = convertRadiusToEarthRadii(pl_rade_raw, pl_rade_unit);

    const pl_bmasse = parseNum('pl_bmasse');
    const pl_dens = parseNum('pl_dens');
    const pl_orbper = parseNum('pl_orbper');
    const pl_orbsmax = parseNum('pl_orbsmax');
    const pl_eqt = parseNum('pl_eqt');
    const st_teff = parseNum('st_teff');
    const st_lum = parseNum('st_lum');
    const st_met = parseNum('st_met');
    const star_type = document.getElementById('star_type').value;

    // Validate
    const nums = { pl_rade, pl_bmasse, pl_dens, pl_orbper, pl_orbsmax, pl_eqt, st_teff, st_lum };
    for (const [k, v] of Object.entries(nums)) {
        if (!Number.isFinite(v) || v < 0) {
            showError(`Invalid value for ${k}. Must be a positive number.`);
            resetLoadingState();
            return;
        }
    }
    if (!Number.isFinite(st_met)) {
        showError('Invalid value for Metallicity.');
        resetLoadingState();
        return;
    }
    if (!star_type) {
        showError('Please select a Star Type.');
        resetLoadingState();
        return;
    }

    // Prepare Payload
    const star_F = star_type === 'F' ? 1 : 0;
    const star_G = star_type === 'G' ? 1 : 0;
    const star_K = star_type === 'K' ? 1 : 0;
    const star_M = star_type === 'M' ? 1 : 0;

    const payload = {
        pl_rade, pl_bmasse, pl_dens, pl_orbper, pl_orbsmax, pl_eqt,
        st_teff, st_lum, st_met,
        star_F, star_G, star_K, star_M
    };

    try {
        const resp = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!resp.ok) throw new Error(`Server Error: ${resp.status}`);
        const data = await resp.json();
        console.log("API RESULT:", data);

        // Simulate delay for dramatic effect
        setTimeout(() => {
            showResult(data);
            resetLoadingState();
        }, 800);

    } catch (err) {
        console.error(err);
        showError('Analysis Failed: ' + err.message);
        resetLoadingState();
    }
});

function resetLoadingState() {
    predictBtn.disabled = false;
    btnText.textContent = 'INITIATE ANALYSIS';
    btnLoader.classList.add('d-none');
}

function showResult(data) {

    gsap.to(predictionPanel, {
        opacity: 0,
        x: -50,
        duration: 0.3,
        onComplete: () => {

            predictionPanel.classList.add('d-none');
            resultCard.classList.remove('d-none');

            // ✅ Extract correctly
            const label = data.prediction.habitability;
            const prob = data.prediction.score || 0;

            const isHabitable = label === 'Habitable';
            const score = (prob * 100).toFixed(2);

            const statusBadge = document.getElementById('statusBadge');
            const statusText = document.getElementById('statusText');
            const scoreValue = document.getElementById('scoreValue');
            const scoreBar = document.getElementById('scoreBar');

            if (isHabitable) {
                statusBadge.className = 'status-badge habitable';
                statusText.textContent = 'HABITABLE';

                gsap.to(planet.material.color, {
                    r: 0.1, g: 0.6, b: 0.3, duration: 1
                });

            } else {
                statusBadge.className = 'status-badge not-habitable';
                statusText.textContent = 'NOT HABITABLE';

                gsap.to(planet.material.color, {
                    r: 0.6, g: 0.2, b: 0.1, duration: 1
                });
            }

            // ✅ Show percentage
            scoreValue.textContent = `${score}%`;

            // Animate bar
            scoreBar.style.width = '0%';
            gsap.fromTo(resultCard,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5 }
            );

            setTimeout(() => {
                scoreBar.style.width = `${score}%`;
            }, 300);
        }
    });
}
