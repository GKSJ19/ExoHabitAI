document.getElementById("predictForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const button = document.querySelector(".btn-predict");
    const loading = document.getElementById("loadingBox");
    const resultBox = document.getElementById("resultBox");

    // Show loading
    button.disabled = true;
    loading.style.display = "block";
    resultBox.innerHTML = "";

    const data = {
        radius: document.getElementById("radius").value,
        mass: document.getElementById("mass").value,
        temperature: document.getElementById("temp").value,
        distance: document.getElementById("distance").value
    };

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {

        // Hide loading
        loading.style.display = "none";
        button.disabled = false;

        resultBox.innerHTML = `
            <div class="success-card">
                <h5>✅ Prediction Result</h5>
                <p><b>Habitability Score:</b> ${result.score}</p>
                <p><b>Status:</b> ${result.status}</p>
            </div>
        `;
    })
    .catch(() => {

        loading.style.display = "none";
        button.disabled = false;

        resultBox.innerHTML = `
            <div class="error-card">
                <h5>❌ Error</h5>
                <p>Backend connection failed.</p>
            </div>
        `;
    });
});
