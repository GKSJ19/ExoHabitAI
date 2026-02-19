 document.getElementById("planetForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const button = document.querySelector("button");
  button.disabled = true;

  const data = {
    pl_rade: parseFloat(document.getElementById("pl_rade").value),
    pl_bmasse: parseFloat(document.getElementById("pl_bmasse").value),
    pl_orbper: parseFloat(document.getElementById("pl_orbper").value),
    pl_eqt: parseFloat(document.getElementById("pl_eqt").value),
    st_spectype: document.getElementById("st_spectype").value
  };

  const resultDiv = document.getElementById("result");
  resultDiv.className = "";
  resultDiv.innerHTML = "<div class='alert alert-info'>Predicting...</div>";

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }
    const isHabitable = result.prediction === 1;

    const status = result.prediction === 1 ? "Habitable 🌱" : "Not Habitable ❌";
    resultDiv.className = isHabitable ? "habitable" : "not-habitable";

    resultDiv.innerHTML = `
      <div class="card p-3 shadow">
        <h4>Prediction Result</h4>
        <p>Status: <strong>${status}</strong></p>
        <p>Confidence: <strong>${result.confidence}%</strong></p>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }

  button.disabled = false;
});
