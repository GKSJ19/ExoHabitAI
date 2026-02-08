
document.getElementById('predictForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent page reload (Step 6)

    // 1. Gather Data (Step 3)
    const payload = {
        Name: document.getElementById('p_name').value,
        Radius: parseFloat(document.getElementById('p_radius').value),
        Mass: parseFloat(document.getElementById('p_mass').value),
        Period: parseFloat(document.getElementById('p_period').value),
        EqTemp: parseFloat(document.getElementById('p_eqtemp').value),
        Insolation: parseFloat(document.getElementById('p_insol').value),
        StarTemp: parseFloat(document.getElementById('s_temp').value),
        StarType: document.getElementById('s_type').value
    };

    // 2. Prepare UI for Loading
    const btn = document.querySelector('button[type="submit"]');
    btn.innerHTML = 'Computing... ⏳';
    btn.disabled = true;

    try {
        // 3. Connect to Backend (Step 4)
        // Note: URL assumes Flask is running locally on port 5000
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Backend Error');

        const result = await response.json();

        // 4. Display Results (Step 5)
        displayResult(result);

    } catch (error) {
        alert('Error connecting to AI Model: ' + error.message + '\nMake sure backend/app.py is running!');
    } finally {
        btn.innerHTML = 'Predict Habitability 🚀';
        btn.disabled = false;
    }
});

function displayResult(data) {
    // Hide placeholder, show card
    document.getElementById('placeholder').style.display = 'none';
    const card = document.getElementById('resultCard');
    card.style.display = 'block';

    // Update Elements
    const statusEl = document.getElementById('res_status');
    const iconEl = document.getElementById('res_icon');
    const barEl = document.getElementById('res_bar');
    const detailsEl = document.getElementById('res_details');

    const scorePct = Math.round(data.confidence_score * 100);

    // Logic for Color/Icon
    if (data.habitable_flag === 1) {
        statusEl.innerText = "Potentially Habitable! 🌱";
        statusEl.className = "card-title text-success fw-bold";
        iconEl.innerText = "🌍";
        barEl.className = "progress-bar bg-success";
        card.style.borderColor = "#198754";
    } else {
        statusEl.innerText = "Non-Habitable 💀";
        statusEl.className = "card-title text-danger fw-bold";
        iconEl.innerText = "☄️";
        barEl.className = "progress-bar bg-danger";
        card.style.borderColor = "#dc3545";
    }

    // Update Bar
    barEl.style.width = scorePct + '%';
    barEl.innerText = scorePct + '%';

    detailsEl.innerHTML = `Planet: <strong>${data.input_planet}</strong><br>AI Confidence: ${data.confidence_score}`;
}