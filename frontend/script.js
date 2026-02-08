const API_BASE = "http://127.0.0.1:5000";

/* -------- INPUT REFERENCES -------- */
const radius = document.getElementById("radius");
const mass = document.getElementById("mass");
const period = document.getElementById("period");
const axis = document.getElementById("axis");
const density = document.getElementById("density");
const eqTemp = document.getElementById("eqTemp");

const starTemp = document.getElementById("starTemp");
const luminosity = document.getElementById("luminosity");
const metallicity = document.getElementById("metallicity");
const starType = document.getElementById("starType");

const habitScoreEl = document.getElementById("habitScore");
const orbitalStabilityEl = document.getElementById("orbitalStability");

/* -------- AUTO CALCULATION -------- */
function calculateMetrics() {
    const r = parseFloat(radius.value);
    const a = parseFloat(axis.value);
    const p = parseFloat(period.value);
    const t = parseFloat(eqTemp.value);

    if (!r || !a || !p || !t) return;

    const EPSILON = 0.0001;

    const habitability =
        (1 / Math.max(Math.abs(t - 288), EPSILON)) +
        (1 / Math.max(Math.abs(r - 1), EPSILON)) +
        (1 / Math.max(a, EPSILON));


    const stability = p / a;

    habitScoreEl.textContent = habitability.toFixed(4);
    orbitalStabilityEl.textContent = stability.toFixed(4);
}

[radius, axis, period, eqTemp].forEach(el =>
    el.addEventListener("input", calculateMetrics)
);

/* -------- SINGLE PREDICTION -------- */
document.getElementById("planetForm").addEventListener("submit", async e => {
    e.preventDefault();

    const payload = {
        "Planet radius": Number(radius.value),
        "Planet mass": Number(mass.value),
        "Orbital period": Number(period.value),
        "Semi-major axis": Number(axis.value),
        "Equilibrium temperature": Number(eqTemp.value),
        "Planet density": Number(density.value),
        "Host star temperature": Number(starTemp.value),
        "Star luminosity": Number(luminosity.value),
        "Star metallicity": Number(metallicity.value),
        "habitability_score": Number(habitScoreEl.textContent),
        "orbital_stability": Number(orbitalStabilityEl.textContent),
        "Star type": starType.value
    };

    const resultBox = document.getElementById("predictionResult");
    resultBox.innerHTML = "Predicting…";

    try {
        const res = await fetch(`${API_BASE}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            resultBox.innerHTML = `<p class="error">${data.message}</p>`;
            return;
        }

        resultBox.innerHTML = `
      <p class="success">
        <strong>${data.prediction}</strong><br>
        Confidence Score: ${data.confidence_score}
      </p>`;
    } catch (err) {
        resultBox.innerHTML = `<p class="error">Backend not reachable</p>`;
    }
});

/* -------- JSON PREDICTION -------- */
document.getElementById("jsonPredict").addEventListener("click", async () => {
    const resultBox = document.getElementById("jsonResult");

    try {
        const json = JSON.parse(document.getElementById("jsonInput").value);

        const res = await fetch(`${API_BASE}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        });

        const data = await res.json();

        resultBox.innerHTML = res.ok
            ? `<p class="success"><strong>${data.prediction}</strong><br>Confidence Score: ${data.confidence_score}</p>`
            : `<p class="error">${data.message}</p>`;
    } catch {
        resultBox.innerHTML = `<p class="error">Invalid JSON format</p>`;
    }
});

/* -------- RANKING -------- */
const planetList = document.getElementById("planetList");

document.getElementById("addPlanet").onclick = () => {
    const wrapper = document.createElement("div");
    wrapper.className = "json-card";

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "✖";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => wrapper.remove();

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Enter exoplanet JSON";

    wrapper.appendChild(removeBtn);
    wrapper.appendChild(textarea);
    planetList.appendChild(wrapper);
};

document.getElementById("rankPlanets").onclick = async () => {
    const resultBox = document.getElementById("rankingResult");

    try {
        const planets = [...planetList.querySelectorAll("textarea")]
            .map(t => JSON.parse(t.value));

        const res = await fetch(`${API_BASE}/rank`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planets })
        });

        const data = await res.json();

        resultBox.innerHTML = data.ranked_exoplanets
            .map((p, i) =>
                `<p>${i + 1}. Habitability Probability: ${p.habitability_score}</p>`
            ).join("");
    } catch {
        resultBox.innerHTML = `<p class="error">Invalid JSON in ranking input</p>`;
    }
};
