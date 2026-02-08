const themeSwitch = document.getElementById("themeSwitch");
document.body.classList.add("dark");

themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
});

document.getElementById("predictForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload

    const resultBox = document.getElementById("resultBox");
    resultBox.innerHTML = "";

    // Collect inputs
    const data = {
        pl_rade: parseFloat(document.getElementById("pl_rade").value),
        pl_bmasse: parseFloat(document.getElementById("pl_bmasse").value),
        pl_orbper: parseFloat(document.getElementById("pl_orbper").value),
        pl_orbsmax: parseFloat(document.getElementById("pl_orbsmax").value),
        pl_eqt: parseFloat(document.getElementById("pl_eqt").value),
        st_teff: parseFloat(document.getElementById("st_teff").value),
        st_lum: parseFloat(document.getElementById("st_lum").value),
        Star_Type: document.getElementById("star_type").value
    };

    // 🔹 Client-side validation
    for (let key in data) {
        if (key !== "Star_Type" && (isNaN(data[key]) || data[key] === "")) {
            resultBox.innerHTML = `
                <div class="alert alert-danger">
                     Please fill all numerical fields correctly.
                </div>`;
            return;
        }
    }

    if (!data.Star_Type) {
        resultBox.innerHTML = `
            <div class="alert alert-warning">
                ⚠️ Please select a star type.
            </div>`;
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            resultBox.innerHTML = `
                <div class="alert alert-danger">
                     ${result.error || "Prediction failed"}
                </div>`;
            return;
        }
        resultBox.innerHTML = `
            <div class="card text-center shadow-lg">
                <div class="card-body">
                    <h4 class="card-title">
                        ${result.habitability_label === "Potentially Habitable"
                            ? "🌍 Potentially Habitable"
                            : "Non-Habitable"}
                    </h4>

                    <p class="card-text mt-3">
                        <strong>Confidence Score:</strong>
                        ${(result.confidence_score * 100).toFixed(2)}%
                    </p>

                    <div class="alert ${
                        result.habitability_flag === 1
                            ? "alert-success"
                            : "alert-secondary"
                    } mt-3">
                        Prediction Successful ✔
                    </div>
                </div>
            </div>`;
    }
    catch (error) {
        resultBox.innerHTML = `
            <div class="alert alert-danger">
                 Backend not reachable. Make sure Flask is running.
            </div>`;
    }
});
