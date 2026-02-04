/* =========================
   🌌 THREE.JS GALAXY
========================= */

const canvas = document.getElementById("galaxy");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

/* Galaxy particles */
const starsCount = 15000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount; i++) {
    const radius = Math.random() * 50;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 10;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

/* Animation */
function animate() {
    galaxy.rotation.y += 0.0006;
    galaxy.rotation.x += 0.0002;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

/* Resize */
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =========================
   🔗 BACKEND CONNECTION
========================= */

document.getElementById("predictionForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = {
        pl_rade: +pl_rade.value,
        pl_masse: +pl_masse.value,
        pl_orbper: +pl_orbper.value,
        pl_orbsmax: 1,
        pl_eqt: 288,
        pl_insol: 1,
        pl_dens: 5.5,
        st_teff: +st_teff.value,
        st_mass: 1,
        st_rad: 1,
        st_lum: 1,
        st_logg: 4.4,
        st_met: 0.02,
        st_age: 4.6,
        sy_dist: 10,
        sy_vmag: 9,
        sy_kmag: 7,
        pl_trandep: 0.01,
        pl_trandur: 2.5,
        pl_ratror: 0.1,
        pl_imppar: 0.3
    };

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(res => {
        document.getElementById("result").innerText =
            res.status === "success"
                ? `🌱 ${res.prediction ? "Habitable" : "Not Habitable"} (${res.habitability_score})`
                : res.message;
    })
    .catch(() => {
        document.getElementById("result").innerText = "⚠️ Backend not reachable";
    });
});




