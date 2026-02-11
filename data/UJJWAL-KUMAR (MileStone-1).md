#  ExoHabitAI – NASA Exoplanet Dataset

This repository uses the **NASA Exoplanet Archive (Planetary Systems Table)** as the core dataset to analyze, classify, and predict the habitability of planets beyond our solar system using Artificial Intelligence.

---

##  Dataset Overview

|Item |Description |
|------|------------|
| Dataset | NASA Exoplanet Archive – Planetary Systems (PS) |
| Format | CSV |
| Rows | ~39,000+ confirmed exoplanets |
| Columns | 289 attributes |
| Domain | Astronomy, Astrophysics, Exoplanet Science |
| Use Case | Machine Learning, Habitability Prediction, Planet Classification |

Each row in the dataset represents **one confirmed exoplanet** and its **host star**.

---

##  What Does One Row Represent?

One row corresponds to:

- A single **planet**
- Its **host star**
- Its **discovery method**
- Its **orbit**
- Its **physical and thermal properties**
- Its **observational history**

So:

> **1 row = 1 real exoplanet in a real star system**

---

##  Planet & Star Identification

These fields uniquely identify planets across global astronomical databases:

|Category |Examples |
|--------|---------|
| Planet | `pl_name`, `pl_letter` |
| Host Star | `hostname` |
| Catalog IDs | `hd_name`, `hip_name`, `tic_id` |
| Space Mission IDs | `gaia_dr2_id`, `gaia_dr3_id` |
| Quality Flag | `default_flag` |

They act as **primary keys and cross-references** between NASA, Gaia, and TESS missions.

---

##  Discovery & Detection System

These columns describe **how the planet was found**:

| Type | Purpose |
|------|--------|
| `discoverymethod` | Detection technique |
| `disc_year` | Year of discovery |
| `disc_facility` | Observatory |
| `disc_telescope` | Telescope |
| `disc_instrument` | Instrument |
| `tran_flag`, `rv_flag`, `ima_flag` | Detection signals |

These features help in **bias analysis** and **data reliability modeling**.

---

##  Planet Physical Properties

These columns describe **what the planet is made of**:

| Property | Columns |
|--------|--------|
| Size | `pl_rade`, `pl_radj` |
| Mass | `pl_masse`, `pl_bmasse` |
| Density | `pl_dens` |
| Temperature | `pl_eqt` |
| Energy from Star | `pl_insol` |

These are used to determine:

- Rocky vs Gas planets  
- Earth-likeness  
- Habitability potential  

---

##  Orbital & Transit Data

These parameters describe **how the planet moves around its star**:

| Measurement | Columns |
|------------|--------|
| Orbital Period | `pl_orbper` |
| Orbit Shape | `pl_orbeccen` |
| Distance from Star | `pl_orbsmax` |
| Transit Depth | `pl_trandep` |
| Transit Duration | `pl_trandur` |
| Orbit Tilt | `pl_orbincl` |

These are crucial for:
- Transit detection ML  
- Orbit stability  
- Star-planet dynamics  

---

##  Host Star & Light Measurements

These columns describe the **star that controls the planet’s climate**.

### Star Properties
| Feature | Columns |
|--------|--------|
| Temperature | `st_teff` |
| Size | `st_rad` |
| Mass | `st_mass` |
| Luminosity | `st_lum` |
| Metallicity | `st_met` |

### Brightness (Photometry)
`sy_gmag`, `sy_vmag`, `sy_tmag`, `sy_kepmag`, `sy_w1mag`, etc.

These help models understand:
- Radiation
- Energy output
- Observational accuracy

---

##  Space Location

These fields define **where the system exists in the galaxy**:

| Type | Columns |
|------|--------|
| Sky Position | `ra`, `dec` |
| Galactic Position | `glat`, `glon` |
| Ecliptic Position | `elat`, `elon` |
| Distance | `sy_dist`, `sy_plx` |

---

##  Data Governance & Updates

These fields track **scientific and archival validity**:

| Field | Meaning |
|------|-------|
| `rowupdate` | Last update in NASA archive |
| `releasedate` | Data release date |
| `pl_pubdate` | Scientific publication date |
| `pl_refname`, `st_refname` | Research source |

This ensures the dataset is **traceable, verified, and reproducible**.

---

##  Why This Dataset Powers ExoHabitAI

This dataset allows ExoHabitAI to:

- Predict **planet habitability**
- Detect **Earth-like worlds**
- Model **star-planet interactions**
- Analyze **discovery bias**
- Train **astronomical ML models**

It is a **digital map of real planetary systems** across the galaxy 

---

##  Summary

The NASA Exoplanet dataset is not just raw data —  
it is a **complete scientific model of planetary systems** combining:

- Physics  
- Astronomy  
- Observation  
- Machine Learning  

This makes it the perfect foundation for **ExoHabitAI**.

---
