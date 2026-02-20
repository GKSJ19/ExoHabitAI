// ===== CONFIGURATION =====
const API_BASE_URL = "http://localhost:5000";
// ===== FIELD DEFINITIONS =====
const planetaryFields = [
  "planetaryMass", "planetaryRadius", "orbitalPeriod",
  "semiMajorAxis", "eccentricity", "equilibriumTemperature"
];
const stellarFields = [
  "stellarMass", "stellarRadius", "stellarTemperature",
  "stellarLuminosity", "stellarMetallicity", "stellarAge"
];
// ===== VALIDATION =====
function validateField(id, value) {
  const errorEl = document.getElementById(id + "-error");
  const inputEl = document.getElementById(id);
  if (!value.trim()) {
    inputEl.classList.add("is-invalid");
    errorEl.textContent = "This field is required";
    errorEl.style.display = "block";
    return false;
  }
  if (isNaN(Number(value))) {
    inputEl.classList.add("is-invalid");
    errorEl.textContent = "Must be a valid number";
    errorEl.style.display = "block";
    return false;
  }
  if (id === "eccentricity") {
    const num = Number(value);
    if (num < 0 || num >= 1) {
      inputEl.classList.add("is-invalid");
      errorEl.textContent = "Must be between 0 and 1";
      errorEl.style.display = "block";
      return false;
    }
  } else if (id !== "stellarMetallicity" && Number(value) < 0) {
    inputEl.classList.add("is-invalid");
    errorEl.textContent = "Must be a positive number";
    errorEl.style.display = "block";
    return false;
  }
  inputEl.classList.remove("is-invalid");
  errorEl.textContent = "";
  errorEl.style.display = "none";
  return true;
}
function validateAll() {
  let valid = true;
  const allFields = [...planetaryFields, ...stellarFields];
  allFields.forEach(function (id) {
    const value = document.getElementById(id).value;
    if (!validateField(id, value)) {
      valid = false;
    }
  });
  return valid;
}
// ===== CLEAR VALIDATION ON INPUT =====
document.addEventListener("DOMContentLoaded", function () {
  const allFields = [...planetaryFields, ...stellarFields];
  allFields.forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      const errorEl = document.getElementById(id + "-error");
      this.classList.remove("is-invalid");
      errorEl.textContent = "";
      errorEl.style.display = "none";
    });
  });
});
// ===== ERROR HANDLING =====
function showError(message) {
  const alertEl = document.getElementById("errorAlert");
  document.getElementById("errorMessage").textContent = message;
  alertEl.classList.remove("d-none");
}
function dismissError() {
  document.getElementById("errorAlert").classList.add("d-none");
}
// ===== MAIN PREDICTION HANDLER =====
async function handlePredict() {
  // Prevent page reload (handled via onsubmit="return false" too)
  dismissError();
  if (!validateAll()) return;
  // Gather data
  const payload = {
    planetary_mass: Number(document.getElementById("planetaryMass").value),
    planetary_radius: Number(document.getElementById("planetaryRadius").value),
    orbital_period: Number(document.getElementById("orbitalPeriod").value),
    semi_major_axis: Number(document.getElementById("semiMajorAxis").value),
    eccentricity: Number(document.getElementById("eccentricity").value),
    equilibrium_temperature: Number(document.getElementById("equilibriumTemperature").value),
    stellar_mass: Number(document.getElementById("stellarMass").value),
    stellar_radius: Number(document.getElementById("stellarRadius").value),
    stellar_temperature: Number(document.getElementById("stellarTemperature").value),
    stellar_luminosity: Number(document.getElementById("stellarLuminosity").value),
    stellar_metallicity: Number(document.getElementById("stellarMetallicity").value),
    stellar_age: Number(document.getElementById("stellarAge").value),
  };
  // Show loading, hide results
  const btn = document.getElementById("predictBtn");
  const spinner = document.getElementById("loadingSpinner");
  const resultsSection = document.getElementById("resultsSection");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Analyzing...';
  spinner.classList.remove("d-none");
  resultsSection.classList.add("d-none");
  try {
    const response = await fetch(API_BASE_URL + "/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(function () { return {}; });
      throw new Error(errorData.message || "Server error: " + response.status);
    }
    const data = await response.json();
    displayResults(data);
  } catch (err) {
    showError(
      err.message || "Failed to connect to the prediction server. Make sure the backend is running."
    );
  } finally {
    btn.disabled = false;
    btn.innerHTML = "🚀 Predict Habitability";
    spinner.classList.add("d-none");
  }
}
// ===== DISPLAY RESULTS =====
function displayResults(data) {
  const resultsSection = document.getElementById("resultsSection");
  const statusCard = document.getElementById("statusCard");
  const statusIcon = document.getElementById("statusIcon");
  const statusValue = document.getElementById("statusValue");
  const scoreRing = document.getElementById("scoreRing");
  const scoreText = document.getElementById("scoreText");
  const scoreBar = document.getElementById("scoreBar");
  const status = data.habitability_status || "Unknown";
  const score = data.habitability_score || 0;
  const scorePercent = Math.round(score * 100);
  // Determine if habitable
  const isHabitable = status.toLowerCase().includes("habitable") && !status.toLowerCase().includes("not");
  // Status card styling
  statusCard.className = "result-card " + (isHabitable ? "result-card-habitable" : "result-card-not-habitable");
  statusIcon.textContent = isHabitable ? "✅" : "⚠️";
  statusValue.textContent = status;
  statusValue.className = "result-value " + (isHabitable ? "habitable" : "not-habitable");
  // Score ring animation
  setTimeout(function () {
    scoreRing.setAttribute("stroke-dasharray", scorePercent + ", 100");
  }, 100);
  scoreText.textContent = scorePercent + "%";
  // Progress bar
  scoreBar.style.width = scorePercent + "%";
  scoreBar.className = "progress-bar-fill " + (score >= 0.7 ? "high" : score >= 0.4 ? "medium" : "low");
  // Show results
  resultsSection.classList.remove("d-none");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}