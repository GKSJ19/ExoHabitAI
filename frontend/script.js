const API = "http://127.0.0.1:5000";

/* ---------- UTILITY ---------- */

function renderResult(containerId, html) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="output-box">
      <button class="btn-close position-absolute top-0 end-0 m-2"
        onclick="this.parentElement.remove()"></button>
      ${html}
    </div>
  `;
}

/* ---------- FORM PREDICTION ---------- */

function predictFromForm() {
  const fields = [
    "radius", "mass", "period", "axis",
    "density", "temp", "lum", "met", "type"
  ];

  for (let id of fields) {
    const el = document.getElementById(id);
    if (!el.value || el.value.trim() === "") {
      alert("Please fill in all fields before predicting.");
      return;
    }
  }

  const data = {
    "Planet radius": Number(radius.value),
    "Planet mass": Number(mass.value),
    "Orbital period": Number(period.value),
    "Semi-major axis": Number(axis.value),
    "Planet density": Number(density.value),
    "Host star temperature": Number(temp.value),
    "Star luminosity": Number(lum.value),
    "Star metallicity": Number(met.value),
    "Star type": type.value
  };

  sendPredict(data, "formResult");
}

/* ---------- JSON PREDICTION ---------- */

function predictFromJSON() {
  try {
    const data = JSON.parse(jsonInput.value);
    sendPredict(data, "jsonResult");
  } catch {
    alert("Invalid JSON format.");
  }
}

/* ---------- SHARED PREDICT ---------- */

function sendPredict(payload, outputId) {
  fetch(`${API}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      renderResult(
        outputId,
        `<strong>Prediction:</strong> ${data.prediction}<br>
         <strong>Confidence:</strong> ${(data.confidence_score * 100).toFixed(2)}%`
      );
    })
    .catch(err => {
      renderResult(outputId, `<span class="text-danger">Error occurred</span>`);
    });
}

/* ---------- MULTI PLANET ---------- */

function addPlanetJson() {
  const container = document.getElementById("planetJsonContainer");

  const card = document.createElement("div");
  card.className = "card glass mt-3 p-3 position-relative";

  card.innerHTML = `
    <button class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
      onclick="this.parentElement.remove()"></button>

    <textarea class="form-control planet-json" rows="6" placeholder='{
  "Planet radius": 1.2,
  "Planet mass": 2.0,
  "Orbital period": 365,
  "Semi-major axis": 1.0,
  "Planet density": 5.5,
  "Host star temperature": 288,
  "Star luminosity": 1.0,
  "Star metallicity": 0.02,
  "Star type": "G"
}'></textarea>
  `;

  container.appendChild(card);
}

function rankPlanets() {
  const planets = [];
  document.querySelectorAll(".planet-json").forEach(t => {
    if (t.value.trim()) planets.push(JSON.parse(t.value));
  });

  fetch(`${API}/rank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planets })
  })
    .then(res => res.json())
    .then(data => {
      let list = "<ol>";
      data.ranked_exoplanets.forEach(p => {
        list += `<li>Habitability Score: ${p.habitability_score}</li>`;
      });
      list += "</ol>";

      renderResult("rankResult", list);
    });
}
