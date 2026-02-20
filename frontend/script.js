document.getElementById("predictionForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
    pl_rade: parseFloat(document.getElementById("pl_rade").value),
    pl_masse: parseFloat(document.getElementById("pl_masse").value),
    pl_orber: parseFloat(document.getElementById("pl_orber").value),
    pl_orbsmax: parseFloat(document.getElementById("pl_orbsmax").value),
    pl_eqt: parseFloat(document.getElementById("pl_eqt").value),
    pl_dens: parseFloat(document.getElementById("pl_dens").value),
    st_teff: parseFloat(document.getElementById("st_teff").value),
    st_lum: parseFloat(document.getElementById("st_lum").value),
    st_met: parseFloat(document.getElementById("st_met").value)
};
    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById("result").innerHTML = `
            <div class="alert alert-info">
                <p><strong>Status:</strong> ${result.prediction}</p>
                <p><strong>Confidence:</strong> ${result.confidence_score}</p>
            </div>
        `;
    })
    .catch(error => {
        document.getElementById("result").innerHTML = `
            <div class="alert alert-danger">
                Error connecting to backend.
            </div>
        `;
    });
});