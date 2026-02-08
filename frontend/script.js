document.getElementById("predictForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // prevent page reload

    const form = e.target;
    const messageDiv = document.getElementById("message");
    const resultDiv = document.getElementById("result");

    messageDiv.innerHTML = "";
    resultDiv.innerHTML = "";

    // Client-side validation
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        messageDiv.innerHTML = `
            <div class="alert alert-danger">
                Please fill all fields with valid values.
            </div>
        `;
        return;
    }

    // Collect input values
    const inputData = {
        planet_radius: parseFloat(document.getElementById("pl_rade").value),
        planet_mass: parseFloat(document.getElementById("pl_bmasse").value),
        stellar_temperature: parseFloat(document.getElementById("st_teff").value),
        stellar_radius: parseFloat(document.getElementById("st_rad").value)
    };

    // Loading alert
    messageDiv.innerHTML = `
        <div class="alert alert-info">
            Processing prediction...
        </div>
    `;

    try {
        const response = await fetch("http://127.0.0.1:5500/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            throw new Error("Backend error");
        }

        const data = await response.json();

        // Success alert
        messageDiv.innerHTML = `
            <div class="alert alert-success">
                Prediction completed successfully.
            </div>
        `;

        // Result display (Step 5)
        let alertClass = data.habitability.toLowerCase() === "habitable"
            ? "alert-success"
            : "alert-warning";

        resultDiv.innerHTML = `
            <div class="alert ${alertClass} text-center">
                <strong>${data.habitability}</strong>
            </div>

            <div class= "card shadow p-4" >
                <h4 class="mb-3 text-center">Prediction Result</h4>
                <table class="table table-bordered">
                    <tr>
                        <th>Habitability Status</th>
                        <td>${data.habitability}</td>
                    </tr>
                    <tr>
                        <th>Habitability Score</th>
                        <td>${data.score}</td>
                    </tr>
                </table>
            </div>
        `;

    } catch (error) {
        messageDiv.innerHTML = `
            <div class="alert alert-danger">
                Unable to connect to server. Please try again later.
            </div>
        `;
    }
});
console.time("Prediction Time");
console.timeEnd("Prediction Time");

