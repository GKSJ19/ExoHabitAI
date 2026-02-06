document.getElementById("predictionForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        pl_rade: parseFloat(document.getElementById("pl_rade").value),
        pl_orbper: parseFloat(document.getElementById("pl_orbper").value),
        pl_eqt: parseFloat(document.getElementById("pl_eqt").value),
        st_teff: parseFloat(document.getElementById("st_teff").value),
        st_rad: parseFloat(document.getElementById("st_rad").value),
        st_mass: parseFloat(document.getElementById("st_mass").value)
    };

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)   // ✅ USE data object
    })
    .then(res => res.json())
    .then(result => {
        document.getElementById("score").innerText =
            "Habitability Score: " + result.habitability_score;

        document.getElementById("status").innerText =
            "Status: " + result.status;
    })
    .catch(err => console.error(err));
});
