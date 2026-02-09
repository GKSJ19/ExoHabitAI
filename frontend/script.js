const scanForm = document.getElementById('scanForm');
const scanButton = document.getElementById('scanButton');
const resultsPanel = document.getElementById('resultsPanel');
const probabilityValue = document.getElementById('probabilityValue');
const statusValue = document.getElementById('statusValue');
const planetVisual = document.getElementById('planetVisual');

scanForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const formData = {
        pl_rade: parseFloat(document.getElementById('pl_rade').value),
        pl_orbper: parseFloat(document.getElementById('pl_orbper').value),
        pl_eqt: parseFloat(document.getElementById('pl_eqt').value),
        st_teff: parseFloat(document.getElementById('st_teff').value),
        st_rad: parseFloat(document.getElementById('st_rad').value),
        st_mass: parseFloat(document.getElementById('st_mass').value)
    };

    // Show loading state
    scanButton.classList.add('loading');

    try {
        // Send POST request to Flask backend
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Display results
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to backend. Make sure Flask server is running at http://127.0.0.1:5000');
    } finally {
        // Remove loading state
        scanButton.classList.remove('loading');
    }
});

function displayResults(data) {
    // Calculate percentage from score (assuming score is between 0 and 1)
    const percentage = (data.score * 100).toFixed(1);

    // Update probability
    probabilityValue.textContent = `${percentage}%`;

    // Update status
    statusValue.textContent = data.status.toUpperCase();
    
    // Remove previous status classes
    statusValue.classList.remove('habitable', 'not-habitable');
    planetVisual.classList.remove('habitable', 'not-habitable');

    // Add appropriate status class
    if (data.status.toLowerCase() === 'habitable') {
        statusValue.classList.add('habitable');
        planetVisual.classList.add('habitable');
    } else {
        statusValue.classList.add('not-habitable');
        planetVisual.classList.add('not-habitable');
    }

    // Show results panel
    resultsPanel.classList.add('show');

    // Scroll to results
    setTimeout(() => {
        resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}
