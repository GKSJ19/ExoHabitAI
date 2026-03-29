document.getElementById("predictionForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    let planet_radius = document.getElementById("planet_radius").value;
    let planet_mass = document.getElementById("planet_mass").value;
    let star_temp = document.getElementById("star_temp").value;
    let orbital_period = document.getElementById("orbital_period").value;

    let data = {
        planet_radius: parseFloat(planet_radius),
        planet_mass: parseFloat(planet_mass),
        star_temp: parseFloat(star_temp),
        orbital_period: parseFloat(orbital_period)
    };

    try {

        let response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        document.getElementById("result").innerHTML = `

            <div class="alert alert-success">
                <h4>Prediction Result</h4>
                <p><b>Status:</b> ${result.status}</p>
                <p><b>Habitability Score:</b> ${result.score}</p>
            </div>
        `;

    } catch (error) {

        document.getElementById("result").innerHTML = `

            <div class="alert alert-danger">
                Error connecting to backend server!
            </div>
        `;
    }

});
