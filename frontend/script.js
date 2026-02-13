// DOM Elements
const scanForm = document.getElementById('scanForm');
const scanButton = document.getElementById('scanButton');
const resultsSection = document.getElementById('resultsSection');
const probabilityValue = document.getElementById('probabilityValue');
const statusValue = document.getElementById('statusValue');
const statusBadge = document.getElementById('statusBadge');
const statusDescription = document.getElementById('statusDescription');
const resultPlanet = document.getElementById('resultPlanet');
const progressCircle = document.getElementById('progressCircle');
const orbitingPlanet = document.getElementById('orbitingPlanet');
const orbitPeriod = document.getElementById('orbitPeriod');
const orbitDistance = document.getElementById('orbitDistance');

// Chart instances
let radarChart = null;
let barChart = null;

// Preset configurations
const presets = {
    earth: {
        pl_rade: 1.0,
        pl_orbper: 365.25,
        pl_eqt: 288,
        st_teff: 5778,
        st_rad: 1.0,
        st_mass: 1.0
    },
    mars: {
        pl_rade: 0.53,
        pl_orbper: 687,
        pl_eqt: 210,
        st_teff: 5778,
        st_rad: 1.0,
        st_mass: 1.0
    },
    jupiter: {
        pl_rade: 11.0,
        pl_orbper: 3.5,
        pl_eqt: 1200,
        st_teff: 6000,
        st_rad: 1.1,
        st_mass: 1.05
    },
    super: {
        pl_rade: 1.3,
        pl_orbper: 412,
        pl_eqt: 285,
        st_teff: 5500,
        st_rad: 0.95,
        st_mass: 0.98
    }
};

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        const config = presets[preset];
        
        // Fill form with preset values
        Object.keys(config).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = config[key];
                // Trigger animation
                input.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    input.style.transform = 'scale(1)';
                }, 200);
            }
        });
        
        // Visual feedback
        btn.style.background = 'rgba(0, 212, 255, 0.3)';
        setTimeout(() => {
            btn.style.background = '';
        }, 300);
    });
});

// Form submission
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

    // Update orbital visualization
    updateOrbitalVisualization(formData);

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

        // Display results with animation delay
        setTimeout(() => {
            displayResults(data, formData);
        }, 800);

    } catch (error) {
        console.error('Error:', error);
        alert('⚠️ Error connecting to backend.\n\nMake sure Flask server is running at http://127.0.0.1:5000\n\nRun: python app.py');
    } finally {
        // Remove loading state
        setTimeout(() => {
            scanButton.classList.remove('loading');
        }, 800);
    }
});

// Update orbital visualization
function updateOrbitalVisualization(data) {
    // Update period display
    orbitPeriod.textContent = data.pl_orbper.toFixed(2);
    
    // Calculate approximate distance (simplified)
    const distance = Math.pow(data.pl_orbper / 365.25, 2/3).toFixed(3);
    orbitDistance.textContent = distance;
    
    // Update planet appearance based on radius
    const planetSize = Math.min(80, 40 + data.pl_rade * 10);
    orbitingPlanet.style.width = planetSize + 'px';
    orbitingPlanet.style.height = planetSize + 'px';
    
    // Update planet color based on temperature
    let planetColor;
    if (data.pl_eqt > 350) {
        planetColor = 'linear-gradient(135deg, #ff6600, #ff3366)'; // Hot
    } else if (data.pl_eqt > 250) {
        planetColor = 'linear-gradient(135deg, #4466ff, #00d4ff)'; // Moderate
    } else {
        planetColor = 'linear-gradient(135deg, #6699ff, #ffffff)'; // Cold
    }
    orbitingPlanet.querySelector('.planet-surface').style.background = planetColor;
}

// Display results
function displayResults(data, formData) {
    // Calculate percentage from score
    const percentage = (data.score * 100).toFixed(1);

    // Update probability value with animation
    animateValue(probabilityValue, 0, percentage, 1500, '%');

    // Update progress circle
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (data.score * circumference);
    progressCircle.style.strokeDashoffset = offset;
    
    // Update progress circle color based on score
    if (data.score >= 0.7) {
        progressCircle.style.stroke = '#00ff88';
    } else if (data.score >= 0.4) {
        progressCircle.style.stroke = '#ffaa00';
    } else {
        progressCircle.style.stroke = '#ff3366';
    }

    // Update status
    statusValue.textContent = data.status.toUpperCase();
    
    // Remove previous classes
    statusBadge.classList.remove('habitable', 'not-habitable');
    resultPlanet.querySelector('.planet-3d').classList.remove('habitable', 'not-habitable');

    // Add appropriate class
    if (data.status.toLowerCase() === 'habitable') {
        statusBadge.classList.add('habitable');
        resultPlanet.querySelector('.planet-3d').classList.add('habitable');
        statusDescription.textContent = '✅ This exoplanet shows promising conditions for supporting life as we know it.';
    } else {
        statusBadge.classList.add('not-habitable');
        resultPlanet.querySelector('.planet-3d').classList.add('not-habitable');
        statusDescription.textContent = '❌ Current parameters indicate unfavorable conditions for life.';
    }

    // Update additional info cards
    updateInfoCards(formData, data.score);

    // Create/Update Charts
    createRadarChart(formData);
    createBarChart(formData, data.score);

    // Show results section
    resultsSection.classList.add('show');

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// Animate number counting
function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(1) + suffix;
    }, 16);
}

// Update info cards
function updateInfoCards(data, score) {
    // Temperature Zone
    const tempZone = document.getElementById('tempZone');
    if (data.pl_eqt > 350) {
        tempZone.textContent = '🔥 Hot Zone';
    } else if (data.pl_eqt >= 250 && data.pl_eqt <= 320) {
        tempZone.textContent = '✅ Habitable Zone';
    } else {
        tempZone.textContent = '❄️ Cold Zone';
    }

    // Planet Type
    const planetType = document.getElementById('planetType');
    if (data.pl_rade > 4) {
        planetType.textContent = '🪐 Gas Giant';
    } else if (data.pl_rade > 1.5) {
        planetType.textContent = '🌎 Super-Earth';
    } else if (data.pl_rade >= 0.5) {
        planetType.textContent = '🌍 Rocky Planet';
    } else {
        planetType.textContent = '🌑 Small Body';
    }

    // Star Class
    const starClass = document.getElementById('starClass');
    if (data.st_teff > 7000) {
        starClass.textContent = '⚪ A-Type (Hot)';
    } else if (data.st_teff >= 6000) {
        starClass.textContent = '🟡 F-Type (White)';
    } else if (data.st_teff >= 5200) {
        starClass.textContent = '☀️ G-Type (Sun-like)';
    } else if (data.st_teff >= 3700) {
        starClass.textContent = '🟠 K-Type (Orange)';
    } else {
        starClass.textContent = '🔴 M-Type (Red Dwarf)';
    }

    // Habitability Index
    const habitIndex = document.getElementById('habitIndex');
    const index = (score * 10).toFixed(1);
    habitIndex.textContent = `${index} / 10`;
    
    if (score >= 0.7) {
        habitIndex.style.color = '#00ff88';
    } else if (score >= 0.4) {
        habitIndex.style.color = '#ffaa00';
    } else {
        habitIndex.style.color = '#ff3366';
    }
}

// Create Radar Chart
function createRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    // Destroy existing chart
    if (radarChart) {
        radarChart.destroy();
    }

    // Normalize data for comparison with Earth
    const earthValues = {
        pl_rade: 1.0,
        pl_orbper: 365.25,
        pl_eqt: 288,
        st_teff: 5778,
        st_rad: 1.0,
        st_mass: 1.0
    };

    const normalizedData = {
        'Planet Radius': (data.pl_rade / earthValues.pl_rade) * 100,
        'Orbital Period': Math.min((data.pl_orbper / earthValues.pl_orbper) * 100, 200),
        'Planet Temp': (data.pl_eqt / earthValues.pl_eqt) * 100,
        'Star Temp': (data.st_teff / earthValues.st_teff) * 100,
        'Star Radius': (data.st_rad / earthValues.st_rad) * 100,
        'Star Mass': (data.st_mass / earthValues.st_mass) * 100
    };

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(normalizedData),
            datasets: [
                {
                    label: 'This Planet',
                    data: Object.values(normalizedData),
                    fill: true,
                    backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    borderColor: '#00d4ff',
                    borderWidth: 2,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00d4ff'
                },
                {
                    label: 'Earth (Reference)',
                    data: [100, 100, 100, 100, 100, 100],
                    fill: true,
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderColor: '#00ff88',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#00ff88',
                    pointBorderColor: '#fff'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    min: 0,
                    max: 200,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 50,
                        color: '#a0a0c0',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(0, 212, 255, 0.2)'
                    },
                    pointLabels: {
                        color: '#00d4ff',
                        font: {
                            size: 11,
                            family: 'Rajdhani'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                        font: {
                            size: 12,
                            family: 'Rajdhani'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create Bar Chart
function createBarChart(data, score) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    // Destroy existing chart
    if (barChart) {
        barChart.destroy();
    }

    // Calculate individual factor contributions (simplified model)
    const factors = {
        'Temperature': calculateTempFactor(data.pl_eqt),
        'Planet Size': calculateSizeFactor(data.pl_rade),
        'Orbital Period': calculateOrbitFactor(data.pl_orbper),
        'Star Type': calculateStarFactor(data.st_teff),
        'Star Mass': calculateMassFactor(data.st_mass)
    };

    const colors = Object.values(factors).map(val => 
        val > 0.7 ? '#00ff88' : val > 0.4 ? '#ffaa00' : '#ff3366'
    );

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(factors),
            datasets: [{
                label: 'Favorability Score',
                data: Object.values(factors).map(v => v * 100),
                backgroundColor: colors.map(c => c + '40'),
                borderColor: colors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        color: '#a0a0c0',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 212, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#00d4ff',
                        font: {
                            size: 11,
                            family: 'Rajdhani'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Score: ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Factor calculation functions (simplified)
function calculateTempFactor(temp) {
    // Optimal range: 250-320K
    if (temp >= 250 && temp <= 320) return 1.0;
    if (temp >= 200 && temp < 250) return 0.7 - (250 - temp) / 100;
    if (temp > 320 && temp <= 370) return 0.7 - (temp - 320) / 100;
    return 0.2;
}

function calculateSizeFactor(radius) {
    // Optimal range: 0.8-1.5 Earth radii
    if (radius >= 0.8 && radius <= 1.5) return 1.0;
    if (radius >= 0.5 && radius < 0.8) return 0.6;
    if (radius > 1.5 && radius <= 2.0) return 0.5;
    return 0.2;
}

function calculateOrbitFactor(period) {
    // Optimal range: 200-600 days
    if (period >= 200 && period <= 600) return 1.0;
    if (period >= 100 && period < 200) return 0.6;
    if (period > 600 && period <= 1000) return 0.5;
    return 0.3;
}

function calculateStarFactor(temp) {
    // Optimal range: 5000-6500K (G-type stars)
    if (temp >= 5000 && temp <= 6500) return 1.0;
    if (temp >= 4500 && temp < 5000) return 0.7;
    if (temp > 6500 && temp <= 7500) return 0.6;
    return 0.3;
}

function calculateMassFactor(mass) {
    // Optimal range: 0.8-1.2 Solar masses
    if (mass >= 0.8 && mass <= 1.2) return 1.0;
    if (mass >= 0.5 && mass < 0.8) return 0.6;
    if (mass > 1.2 && mass <= 1.5) return 0.5;
    return 0.3;
}

// Add input validation and real-time feedback
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        const value = parseFloat(this.value);
        const indicator = this.nextElementSibling;
        
        if (value && value > 0) {
            this.style.borderColor = '#00d4ff';
            if (indicator) indicator.style.width = '100%';
        } else {
            this.style.borderColor = '';
            if (indicator) indicator.style.width = '0';
        }
    });
});

// Initialize - set Earth as default on page load
window.addEventListener('load', () => {
    const earthPreset = presets.earth;
    Object.keys(earthPreset).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = earthPreset[key];
        }
    });
    
    // Update orbital visualization with Earth values
    updateOrbitalVisualization(earthPreset);
});