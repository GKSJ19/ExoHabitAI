function predictPlanet() {
    const radius = parseFloat(document.getElementById("radius").value);
    const mass = parseFloat(document.getElementById("mass").value);
    const temperature = parseFloat(document.getElementById("temperature").value);
    const distance = parseFloat(document.getElementById("distance").value);
    const flux = parseFloat(document.getElementById("flux").value);

    if ([radius, mass, temperature, distance, flux].some(isNaN)) {
        alert("Please enter all values!");
        return;
    }

    let score = 0;

    if (radius >= 0.5 && radius <= 2) score += 25;
    else if (radius >= 0.3 && radius <= 3) score += 15;
    else score += 5;

    if (mass >= 0.5 && mass <= 5) score += 25;
    else if (mass >= 0.2 && mass <= 10) score += 15;
    else score += 5;

    if (temperature >= 200 && temperature <= 350) score += 25;
    else if (temperature >= 150 && temperature <= 450) score += 15;
    else score += 5;

    if (distance >= 0.8 && distance <= 1.5) score += 15;
    else if (distance >= 0.5 && distance <= 2.5) score += 10;
    else score += 3;

    if (flux >= 0.5 && flux <= 1.5) score += 10;
    else if (flux >= 0.2 && flux <= 2.5) score += 6;
    else score += 2;

    score = Math.min(score, 100);

    let resultText = "";
    if (score >= 60) {
        resultText = `✅ Habitable Planet (Score: ${score}%)`;
    } else {
        resultText = `❌ Non-Habitable Planet (Score: ${score}%)`;
    }

    document.getElementById("result").innerHTML = resultText;
    document.getElementById("progress-bar").style.width = score + "%";
}
