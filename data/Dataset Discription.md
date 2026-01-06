# Dataset Discription: NASA Exoplanet Archive

Document Type: Dataset Description
Status: Completed
Project Phase: Data Collection
Target Audience: Developers, Project Managers
Related Components: Dataset, Infrastructure
Author: Hardik Jain
Last Updated: January 2, 2026

Overview: This document describes the primary data source and the supplementary Data Dictionary created to translate astronomical parameters into machine learning features.

## 1. Initial Dataset: NASA Confirmed Planets

---

The core of this project relies on the **NASA Exoplanet Archive’s Planetary Systems (PS) Table**. This is a self-consistent, comprehensive database of all confirmed exoplanets discovered to date.

- **Source:** [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=PS&constraint=default_flag=1&constraint=disc_facility+like+%27%25TESS%25%27)
- **Nature of Data:** The dataset contains observational parameters for exoplanets and their host stars, collected from peer-reviewed scientific literature.
- **Initial Scale:** 39212 rows × 288 columns.
- **Key Data Points:** * **Planetary Parameters:** Orbit, Mass, Radius, Density, Temperature.
    - **Stellar Parameters:** Temperature, Mass, Radius, Luminosity, Age, Metallicity.
    - **System Parameters:** Distance from Earth, Brightness (Magnitudes), Galactic Coordinates.

## 2. Secondary Dataset: Data Column Discription

---

Because the initial NASA dataset uses abbreviated scientific headers (e.g., `pl_orbper`), a secondary mapping dataset was created. This "Data Column Dictionary" serves as the translation layer between raw astronomical data and each data column discription.

*The table below provides a granular breakdown of all 263 active columns used in this project.*

---

| **S.No** | **Column Previous Name** | **Column Full Name** | **Description** | **Purpose** |
| --- | --- | --- | --- | --- |
| 1 | pl_name | Planet Name | Full name of the exoplanet. | Metadata |
| 2 | hostname | Host Name | Name of the host star. | Metadata |
| 3 | pl_letter | Planet Letter | Assigned letter (b, c, d, etc.). | Metadata |
| 4 | hd_name | HD ID | ID in Henry Draper Catalogue. | Metadata |
| 5 | hip_name | HIP ID | ID in Hipparcos Catalogue. | Metadata |
| 6 | tic_id | TIC ID | ID in TESS Input Catalog. | Metadata |
| 7 | gaia_dr2_id | Gaia DR2 ID | ID from Gaia Data Release 2. | Metadata |
| 8 | gaia_dr3_id | Gaia DR3 ID | ID from Gaia Data Release 3. | Metadata |
| 9 | default_flag | Default Parameter Set | 1 if this is the best row for this planet; 0 if not. | Filter |
| 10 | sy_snum | Number of Stars | Number of stars in the system. | Feature |
| 11 | sy_pnum | Number of Planets | Number of known planets in the system. | Feature |
| 12 | sy_mnum | Number of Moons | Number of known moons in the system. | Feature |
| 13 | cb_flag | Circumbinary Flag | 1 if the planet orbits two stars. | Feature |
| 14 | discoverymethod | Discovery Method | Method used to find the planet. | Feature |
| 15 | disc_year | Discovery Year | Year of confirmation. | Feature |
| 16 | disc_refname | Discovery Reference | Text citation for the discovery. | Drop |
| 17 | disc_pubdate | Discovery Publication Date | Date the discovery was published. | Drop |
| 18 | disc_locale | Discovery Locale | Ground-based or Space-based observation. | Feature |
| 19 | disc_facility | Discovery Facility | Name of the observatory. | Feature |
| 20 | disc_telescope | Discovery Telescope | Name of the telescope used. | Feature |
| 21 | disc_instrument | Discovery Instrument | Name of the instrument used. | Feature |
| 22 | rv_flag | Detected by Radial Velocity Variations | 1 if radial velocity detected the planet. | Feature |
| 23 | pul_flag | Detected by Pulsar Timing Variations | 1 if pulsar timing detected the planet. | Feature |
| 24 | ptv_flag | Detected by Pulsation Timing Variations | 1 if pulsation timing detected the planet. | Feature |
| 25 | tran_flag | Detected by Transits | 1 if the transit method detected it. | Feature |
| 26 | ast_flag | Detected by Astrometric Variations | 1 if astrometric variations were used. | Feature |
| 27 | obm_flag | Detected by Orbital Brightness Modulations | 1 if orbital brightness modulation used. | Feature |
| 28 | micro_flag | Detected by Microlensing | 1 if microlensing was the method. | Feature |
| 29 | etv_flag | Detected by Eclipse Timing Variations | 1 if eclipse timing was used. | Feature |
| 30 | ima_flag | Detected by Imaging | 1 if direct imaging detected it. | Feature |
| 31 | dkin_flag | Detected by Disk Kinematics | 1 if disk kinematics detected it. | Feature |
| 32 | soltype | Solution Type | The type of confirmed solution. | Filter |
| 33 | pl_controv_flag | Controversial Flag | 1 if existence is controversial. | Filter |
| 34 | pl_refname | Planetary Parameter Reference | Text citation for the parameters. | Drop |
| 35 | pl_orbper | Orbital Period [days] | Time for one orbit in Earth days. | Feature |
| 36 | pl_orbpererr1 | Orbital Period Upper Unc. [days] | Upper margin of error for period. | Feature |
| 37 | pl_orbpererr2 | Orbital Period Lower Unc. [days] | Lower margin of error for period. | Feature |
| 38 | pl_orbperlim | Orbital Period Limit Flag | Indicates if period is an exact value. | Feature |
| 39 | pl_orbsmax | Orbit Semi-Major Axis [au] | Average distance from the star. | Feature |
| 40 | pl_orbsmaxerr1 | Orbit Semi-Major Axis Upper Unc. [au] | Upper margin of error for distance. | Feature |
| 41 | pl_orbsmaxerr2 | Orbit Semi-Major Axis Lower Unc. [au] | Lower margin of error for distance. | Feature |
| 42 | pl_orbsmaxlim | Orbit Semi-Major Axis Limit Flag | Indicates if distance is exact. | Feature |
| 43 | pl_rade | Planet Radius [Earth Radius] | Radius of planet (Earth = 1). | Feature |
| 44 | pl_radeerr1 | Planet Radius Upper Unc. [Earth Radius] | Upper margin of error for radius. | Feature |
| 45 | pl_radeerr2 | Planet Radius Lower Unc. [Earth Radius] | Lower margin of error for radius. | Feature |
| 46 | pl_radelim | Planet Radius Limit Flag | Indicates if radius is exact. | Feature |
| 47 | pl_radj | Planet Radius [Jupiter Radius] | Radius in Jupiter units. | Drop |
| 48 | pl_radjerr1 | Planet Radius Upper Unc. [Jupiter Radius] | Error in Jupiter units. | Drop |
| 49 | pl_radjerr2 | Planet Radius Lower Unc. [Jupiter Radius] | Error in Jupiter units. | Drop |
| 50 | pl_radjlim | Planet Radius Limit Flag | Limit flag in Jupiter units. | Drop |
| 51 | pl_masse | Planet Mass [Earth Mass] | Mass of the planet (Earth = 1). 2 | Feature |
| 52 | pl_masseerr1 | Planet Mass [Earth Mass] Upper Unc. | Upper margin of error for Earth mass. | Feature |
| 53 | pl_masseerr2 | Planet Mass [Earth Mass] Lower Unc. | Lower margin of error for Earth mass. | Feature |
| 54 | pl_masselim | Planet Mass [Earth Mass] Limit Flag | 1 if mass is an upper/lower limit. | Feature |
| 55 | pl_massj | Planet Mass [Jupiter Mass] | Mass in Jupiter units. | Drop |
| 56 | pl_massjerr1 | Planet Mass [Jupiter Mass] Upper Unc. | Error in Jupiter units. | Drop |
| 57 | pl_massjerr2 | Planet Mass [Jupiter Mass] Lower Unc. | Error in Jupiter units. | Drop |
| 58 | pl_massjlim | Planet Mass [Jupiter Mass] Limit Flag | Limit flag in Jupiter units. | Drop |
| 59 | pl_msinie | Planet Mass*sin(i) [Earth Mass] | Minimum mass ($M \sin i$) in Earth units. | Feature |
| 60 | pl_msinieerr1 | Planet Mass*sin(i) [Earth Mass] Upper Unc. | Upper error for minimum mass. | Feature |
| 61 | pl_msinieerr2 | Planet Mass*sin(i) [Earth Mass] Lower Unc. | Lower error for minimum mass. | Feature |
| 62 | pl_msinielim | Planet Mass*sin(i) [Earth Mass] Limit Flag | Limit flag for minimum mass. | Feature |
| 63 | pl_msinij | Planet Mass*sin(i) [Jupiter Mass] | Minimum mass in Jupiter units. | Drop |
| 64 | pl_msinijerr1 | Planet Mass*sin(i) [Jupiter Mass] Upper Unc. | Error in Jupiter units. | Drop |
| 65 | pl_msinijerr2 | Planet Mass*sin(i) [Jupiter Mass] Lower Unc. | Error in Jupiter units. | Drop |
| 66 | pl_msinijlim | Planet Mass*sin(i) [Jupiter Mass] Limit Flag | Limit flag in Jupiter units. | Drop |
| 67 | pl_cmasse | Planet Mass*sin(i)/sin(i) [Earth Mass] | Calculated mass from other parameters. | Feature |
| 68 | pl_cmasseerr1 | Planet Mass*sin(i)/sin(i) [Earth Mass] Upper Unc. | Upper error for calculated mass. | Feature |
| 69 | pl_cmasseerr2 | Planet Mass*sin(i)/sin(i) [Earth Mass] Lower Unc. | Lower error for calculated mass. | Feature |
| 70 | pl_cmasselim | Planet Mass*sin(i)/sin(i) [Earth Mass] Limit Flag | Limit flag for calculated mass. | Feature |
| 71 | pl_cmassj | Planet Mass*sin(i)/sin(i) [Jupiter Mass] | Calculated mass in Jupiter units. | Drop |
| 72 | pl_cmassjerr1 | Planet Mass*sin(i)/sin(i) [Jupiter Mass] Upper Unc. | Error in Jupiter units. | Drop |
| 73 | pl_cmassjerr2 | Planet Mass*sin(i)/sin(i) [Jupiter Mass] Lower Unc. | Error in Jupiter units. | Drop |
| 74 | pl_cmassjlim | Planet Mass*sin(i)/sin(i) [Jupiter Mass] Limit Flag | Limit flag in Jupiter units. | Drop |
| 75 | pl_bmasse | Planet Mass or Mass*sin(i) [Earth Mass] | The "best" mass value (Mass or Msini). | Feature |
| 76 | pl_bmasseerr1 | Planet Mass or Mass*sin(i) [Earth Mass] Upper Unc. | Upper error for best mass. | Feature |
| 77 | pl_bmasseerr2 | Planet Mass or Mass*sin(i) [Earth Mass] Lower Unc. | Lower error for best mass. | Feature |
| 78 | pl_bmasselim | Planet Mass or Mass*sin(i) [Earth Mass] Limit Flag | Limit flag for best mass. | Feature |
| 79 | pl_bmassj | Planet Mass or Mass*sin(i) [Jupiter Mass] | Best mass in Jupiter units. | Drop |
| 80 | pl_bmassjerr1 | Planet Mass or Mass*sin(i) [Jupiter Mass] Upper Unc. | Error in Jupiter units. | Drop |
| 81 | pl_bmassjerr2 | Planet Mass or Mass*sin(i) [Jupiter Mass] Lower Unc. | Error in Jupiter units. | Drop |
| 82 | pl_bmassjlim | Planet Mass or Mass*sin(i) [Jupiter Mass] Limit Flag | Limit flag in Jupiter units. | Drop |
| 83 | pl_bmassprov | Planet Mass or Mass*sin(i) Provenance | Source of the mass measurement. | Feature |
| 84 | pl_dens | Planet Density [g/cm**3] | Density ($g/cm^3$). 3 | Feature |
| 85 | pl_denserr1 | Planet Density Upper Unc. [g/cm**3] | Upper margin of error for density. | Feature |
| 86 | pl_denserr2 | Planet Density Lower Unc. [g/cm**3] | Lower margin of error for density. | Feature |
| 87 | pl_denslim | Planet Density Limit Flag | Limit flag for density. | Feature |
| 88 | pl_orbeccen | Eccentricity | How non-circular the orbit is. | Feature |
| 89 | pl_orbeccenerr1 | Eccentricity Upper Unc. | Upper error for eccentricity. | Feature |
| 90 | pl_orbeccenerr2 | Eccentricity Lower Unc. | Lower error for eccentricity. | Feature |
| 91 | pl_orbeccenlim | Eccentricity Limit Flag | Limit flag for eccentricity. | Feature |
| 92 | pl_insol | Insolation Flux [Earth Flux] | Energy received (Earth = 1). 4 | Feature |
| 93 | pl_insolerr1 | Insolation Flux Upper Unc. [Earth Flux] | Upper error for insolation. | Feature |
| 94 | pl_insolerr2 | Insolation Flux Lower Unc. [Earth Flux] | Lower error for insolation. | Feature |
| 95 | pl_insollim | Insolation Flux Limit Flag | Limit flag for insolation. | Feature |
| 96 | pl_eqt | Equilibrium Temperature [K] | Surface temperature (K). 5 | Feature |
| 97 | pl_eqterr1 | Equilibrium Temperature Upper Unc. [K] | Upper error for temperature. | Feature |
| 98 | pl_eqterr2 | Equilibrium Temperature Lower Unc. [K] | Lower error for temperature. | Feature |
| 99 | pl_eqtlim | Equilibrium Temperature Limit Flag | Limit flag for temperature. | Feature |
| 100 | pl_orbincl | Inclination [deg] | Tilt of the orbit (degrees). | Feature |
| 101 | pl_orbinclerr1 | Inclination Upper Unc. [deg] | Upper margin of error for the orbit's tilt angle. | Feature |
| 102 | pl_orbinclerr2 | Inclination Lower Unc. [deg] | Lower margin of error for the orbit's tilt angle. | Feature |
| 103 | pl_orbincllim | Inclination Limit Flag | Indicates if the inclination value is an exact measurement. | Feature |
| 104 | pl_tranmid | Transit Midpoint [days] | The specific time of the center of a transit event. | Feature |
| 105 | pl_tranmiderr1 | Transit Midpoint Upper Unc. [days] | Upper margin of error for the transit timing. | Feature |
| 106 | pl_tranmiderr2 | Transit Midpoint Lower Unc. [days] | Lower margin of error for the transit timing. | Feature |
| 107 | pl_tranmidlim | Transit Midpoint Limit Flag | Indicates if the transit time is an exact value. | Feature |
| 108 | pl_tsystemref | Time Reference Frame and Standard | The reference frame and standard used for timing data. | Metadata |
| 109 | ttv_flag | Data show Transit Timing Variations | 1 if the planet's transit times shift due to other planets. | Feature |
| 110 | pl_imppar | Impact Parameter | The closest distance between planet and star center in transit. | Feature |
| 111 | pl_impparerr1 | Impact Parameter Upper Unc. | Upper margin of error for the impact parameter. | Feature |
| 112 | pl_impparerr2 | Impact Parameter Lower Unc. | Lower margin of error for the impact parameter. | Feature |
| 113 | pl_impparlim | Impact Parameter Limit Flag | Indicates if the impact parameter is an exact value. | Feature |
| 114 | pl_trandep | Transit Depth [%] | The percentage drop in star brightness during transit. | Feature |
| 115 | pl_trandeperr1 | Transit Depth Upper Unc. [%] | Upper margin of error for the transit depth. | Feature |
| 116 | pl_trandeperr2 | Transit Depth Lower Unc. [%] | Lower margin of error for the transit depth. | Feature |
| 117 | pl_trandeplim | Transit Depth Limit Flag | Indicates if the transit depth is an exact value. | Feature |
| 118 | pl_trandur | Transit Duration [hours] | The total time the planet takes to cross the star. | Feature |
| 119 | pl_trandurerr1 | Transit Duration Upper Unc. [hours] | Upper margin of error for transit duration. | Feature |
| 120 | pl_trandurerr2 | Transit Duration Lower Unc. [hours] | Lower margin of error for transit duration. | Feature |
| 121 | pl_trandurlim | Transit Duration Limit Flag | Indicates if the transit duration is an exact value. | Feature |
| 122 | pl_ratdor | Ratio of Semi-Major Axis to Stellar Radius | Ratio of the planet's distance to its star's radius. | Feature |
| 123 | pl_ratdorerr1 | Ratio of Semi-Major Axis to Stellar Radius Upper Unc. | Upper margin of error for the distance-radius ratio. | Feature |
| 124 | pl_ratdorerr2 | Ratio of Semi-Major Axis to Stellar Radius Lower Unc. | Lower margin of error for the distance-radius ratio. | Feature |
| 125 | pl_ratdorlim | Ratio of Semi-Major Axis to Stellar Radius Limit Flag | Indicates if the distance-radius ratio is exact. | Feature |
| 126 | pl_ratror | Ratio of Planet to Stellar Radius | Ratio of the planet's radius to its star's radius. | Feature |
| 127 | pl_ratrorerr1 | Ratio of Planet to Stellar Radius Upper Unc. | Upper margin of error for the radius ratio. | Feature |
| 128 | pl_ratrorerr2 | Ratio of Planet to Stellar Radius Lower Unc. | Lower margin of error for the radius ratio. | Feature |
| 129 | pl_ratrorlim | Ratio of Planet to Stellar Radius Limit Flag | Indicates if the radius ratio is exact. | Feature |
| 130 | pl_occdep | Occultation Depth [%] | Drop in brightness when the planet passes behind the star. | Feature |
| 131 | pl_occdeperr1 | Occultation Depth Upper Unc. [%] | Upper margin of error for occultation depth. | Feature |
| 132 | pl_occdeperr2 | Occultation Depth Lower Unc. [%] | Lower margin of error for occultation depth. | Feature |
| 133 | pl_occdeplim | Occultation Depth Limit Flag | Indicates if the occultation depth is exact. | Feature |
| 134 | pl_orbtper | Epoch of Periastron [days] | Time when the planet is at its closest point to the star. | Feature |
| 135 | pl_orbtpererr1 | Epoch of Periastron Upper Unc. [days] | Upper margin of error for the periastron time. | Feature |
| 136 | pl_orbtpererr2 | Epoch of Periastron Lower Unc. [days] | Lower margin of error for the periastron time. | Feature |
| 137 | pl_orbtperlim | Epoch of Periastron Limit Flag | Indicates if the periastron time is exact. | Feature |
| 138 | pl_orblper | Argument of Periastron [deg] | Angle describing the orientation of the orbit in space. | Feature |
| 139 | pl_orblpererr1 | Argument of Periastron Upper Unc. [deg] | Upper margin of error for the periastron angle. | Feature |
| 140 | pl_orblpererr2 | Argument of Periastron Lower Unc. [deg] | Lower margin of error for the periastron angle. | Feature |
| 141 | pl_orblperlim | Argument of Periastron Limit Flag | Indicates if the periastron angle is exact. | Feature |
| 142 | pl_rvamp | Radial Velocity Amplitude [m/s] | The speed of the star's "wobble" in meters per second. | Feature |
| 143 | pl_rvamperr1 | Radial Velocity Amplitude Upper Unc. [m/s] | Upper margin of error for the radial velocity. | Feature |
| 144 | pl_rvamperr2 | Radial Velocity Amplitude Lower Unc. [m/s] | Lower margin of error for the radial velocity. | Feature |
| 145 | pl_rvamplim | Radial Velocity Amplitude Limit Flag | Indicates if the radial velocity value is exact. | Feature |
| 146 | pl_projobliq | Projected Obliquity [deg] | Planet's axial tilt relative to the orbit (2D projection). | Feature |
| 147 | pl_projobliqerr1 | Projected Obliquity Upper Unc. [deg] | Upper margin of error for projected tilt. | Feature |
| 148 | pl_projobliqerr2 | Projected Obliquity Lower Unc. [deg] | Lower margin of error for projected tilt. | Feature |
| 149 | pl_projobliqlim | Projected Obliquity Limit Flag | Indicates if the projected tilt is exact. | Feature |
| 150 | pl_trueobliq | True Obliquity [deg] | The actual 3D axial tilt (spin axis) of the planet. | Feature |
| 151 | pl_trueobliqerr1 | True Obliquity Upper Unc. [deg] | Upper error for the planet's 3D axial tilt3. | Feature |
| 152 | pl_trueobliqerr2 | True Obliquity Lower Unc. [deg] | Lower error for the planet's 3D axial tilt4. | Feature |
| 153 | pl_trueobliqlim | True Obliquity Limit Flag | Flag indicating if the true obliquity is an exact value5. | Feature |
| 154 | st_refname | Stellar Parameter Reference | Text citation for the stellar parameters6. | Drop |
| 155 | st_spectype | Spectral Type | The classification of the star based on its light spectrum7. | Feature |
| 156 | st_teff | Stellar Effective Temperature [K] | Effective temperature of the star in Kelvin88. | Feature |
| 157 | st_tefferr1 | Stellar Effective Temperature Upper Unc. [K] | Upper margin of error for star temperature9. | Feature |
| 158 | st_tefferr2 | Stellar Effective Temperature Lower Unc. [K] | Lower margin of error for star temperature10. | Feature |
| 159 | st_tefflim | Stellar Effective Temperature Limit Flag | Flag for star temperature measurement limits11. | Feature |
| 160 | st_rad | Stellar Radius [Solar Radius] | Radius of the star relative to our Sun1212. | Feature |
| 161 | st_raderr1 | Stellar Radius Upper Unc. [Solar Radius] | Upper margin of error for stellar radius13. | Feature |
| 162 | st_raderr2 | Stellar Radius Lower Unc. [Solar Radius] | Lower margin of error for stellar radius14. | Feature |
| 163 | st_radlim | Stellar Radius Limit Flag | Flag for stellar radius measurement limits15. | Feature |
| 164 | st_mass | Stellar Mass [Solar mass] | Mass of the star relative to our Sun1616. | Feature |
| 165 | st_masserr1 | Stellar Mass Upper Unc. [Solar mass] | Upper margin of error for stellar mass17. | Feature |
| 166 | st_masserr2 | Stellar Mass Lower Unc. [Solar mass] | Lower margin of error for stellar mass18. | Feature |
| 167 | st_masslim | Stellar Mass Limit Flag | Flag for stellar mass measurement limits19. | Feature |
| 168 | st_met | Stellar Metallicity [dex] | The abundance of heavy elements in the star20. | Feature |
| 169 | st_meterr1 | Stellar Metallicity Upper Unc. [dex] | Upper margin of error for metallicity21. | Feature |
| 170 | st_meterr2 | Stellar Metallicity Lower Unc. [dex] | Lower margin of error for metallicity22. | Feature |
| 171 | st_metlim | Stellar Metallicity Limit Flag | Flag for stellar metallicity limits23. | Feature |
| 172 | st_metratio | Stellar Metallicity Ratio | The ratio used to measure metallicity (e.g., [Fe/H])24. | Feature |
| 173 | st_lum | Stellar Luminosity [log(Solar)] | Logarithmic measure of the star's total power output25. | Feature |
| 174 | st_lumerr1 | Stellar Luminosity Upper Unc. [log(Solar)] | Upper margin of error for stellar luminosity26. | Feature |
| 175 | st_lumerr2 | Stellar Luminosity Lower Unc. [log(Solar)] | Lower margin of error for stellar luminosity27. | Feature |
| 176 | st_lumlim | Stellar Luminosity Limit Flag | Flag for stellar luminosity limits28. | Feature |
| 177 | st_logg | Stellar Surface Gravity [log10(cm/s**2)] | The gravity at the star's surface ($log10(cm/s^2)$). | Feature |
| 178 | st_loggerr1 | Stellar Surface Gravity Upper Unc. [log10(cm/s**2)] | Upper margin of error for stellar gravity. | Feature |
| 179 | st_loggerr2 | Stellar Surface Gravity Lower Unc. [log10(cm/s**2)] | Lower margin of error for stellar gravity. | Feature |
| 180 | st_logglim | Stellar Surface Gravity Limit Flag | Flag for stellar gravity limits. | Feature |
| 181 | st_age | Stellar Age [Gyr] | Age of the star in billions of years. | Feature |
| 182 | st_ageerr1 | Stellar Age Upper Unc. [Gyr] | Upper margin of error for star age. | Feature |
| 183 | st_ageerr2 | Stellar Age Lower Unc. [Gyr] | Lower margin of error for star age. | Feature |
| 184 | st_agelim | Stellar Age Limit Flag | Flag for star age limits. | Feature |
| 185 | st_dens | Stellar Density [g/cm**3] | Density of the star in $g/cm^3$. | Feature |
| 186 | st_denserr1 | Stellar Density Upper Unc. [g/cm**3] | Upper margin of error for star density. | Feature |
| 187 | st_denserr2 | Stellar Density Lower Unc. [g/cm**3] | Lower margin of error for star density. | Feature |
| 188 | st_denslim | Stellar Density Limit Flag | Flag for star density limits. | Feature |
| 189 | st_vsin | Stellar Rotational Velocity [km/s] | Speed at which the star rotates at its equator. | Feature |
| 190 | st_vsinerr1 | Stellar Rotational Velocity [km/s] Upper Unc. | Upper margin of error for rotational velocity. | Feature |
| 191 | st_vsinerr2 | Stellar Rotational Velocity [km/s] Lower Unc. | Lower margin of error for rotational velocity. | Feature |
| 192 | st_vsinlim | Stellar Rotational Velocity Limit Flag | Flag for rotational velocity limits. | Feature |
| 193 | st_rotp | Stellar Rotational Period [days] | Time it takes the star to complete one rotation. | Feature |
| 194 | st_rotperr1 | Stellar Rotational Period [days] Upper Unc. | Upper margin of error for rotational period. | Feature |
| 195 | st_rotperr2 | Stellar Rotational Period [days] Lower Unc. | Lower margin of error for rotational period. | Feature |
| 196 | st_rotplim | Stellar Rotational Period Limit Flag | Flag for rotational period limits. | Feature |
| 197 | st_radv | Systemic Radial Velocity [km/s] | The systemic motion of the star relative to the Sun. | Feature |
| 198 | st_radverr1 | Systemic Radial Velocity Upper Unc. [km/s] | Upper margin of error for radial velocity. | Feature |
| 199 | st_radverr2 | Systemic Radial Velocity Lower Unc. [km/s] | Lower margin of error for radial velocity. | Feature |
| 200 | st_radvlim | Systemic Radial Velocity Limit Flag | Flag for radial velocity limits. | Feature |
| 201 | sy_refname | System Parameter Reference | Text citation for the system-level parameters. | Drop |
| 202 | rastr | RA [sexagesimal] | Right Ascension in hours:minutes:seconds format. | Metadata |
| 203 | ra | RA [deg] | Right Ascension (celestial longitude) in degrees. | Metadata |
| 204 | decstr | Dec [sexagesimal] | Declination in degrees:minutes:seconds format. | Metadata |
| 205 | dec | Dec [deg] | Declination (celestial latitude) in degrees. | Metadata |
| 206 | glat | Galactic Latitude [deg] | Latitude of the system relative to the Milky Way plane. | Metadata |
| 207 | glon | Galactic Longitude [deg] | Longitude of the system relative to the Galactic Center. | Metadata |
| 208 | elat | Ecliptic Latitude [deg] | Latitude relative to the Earth's orbital plane. | Metadata |
| 209 | elon | Ecliptic Longitude [deg] | Longitude relative to the Earth's orbital plane. | Metadata |
| 210 | sy_pm | Total Proper Motion [mas/yr] | The total observed angular motion of the star per year. | Feature |
| 211 | sy_pmerr1 | Total Proper Motion Upper Unc [mas/yr] | Upper margin of error for total proper motion. | Feature |
| 212 | sy_pmerr2 | Total Proper Motion Lower Unc [mas/yr] | Lower margin of error for total proper motion. | Feature |
| 213 | sy_pmra | Proper Motion (RA) [mas/yr] | Proper motion component in the Right Ascension direction. | Feature |
| 214 | sy_pmraerr1 | Proper Motion (RA) [mas/yr] Upper Unc | Upper margin of error for PM in Right Ascension. | Feature |
| 215 | sy_pmraerr2 | Proper Motion (RA) [mas/yr] Lower Unc | Lower margin of error for PM in Right Ascension. | Feature |
| 216 | sy_pmdec | Proper Motion (Dec) [mas/yr] | Proper motion component in the Declination direction. | Feature |
| 217 | sy_pmdecerr1 | Proper Motion (Dec) [mas/yr] Upper Unc | Upper margin of error for PM in Declination. | Feature |
| 218 | sy_pmdecerr2 | Proper Motion (Dec) [mas/yr] Lower Unc | Lower margin of error for PM in Declination. | Feature |
| 219 | sy_dist | Distance [pc] | Distance from Earth to the system in Parsecs. | Metadata |
| 220 | sy_disterr1 | Distance [pc] Upper Unc | Upper margin of error for system distance. | Metadata |
| 221 | sy_disterr2 | Distance [pc] Lower Unc | Lower margin of error for system distance. | Metadata |
| 222 | sy_plx | Parallax [mas] | The apparent shift of the star used to calculate distance. | Feature |
| 223 | sy_plxerr1 | Parallax [mas] Upper Unc | Upper margin of error for parallax measurement. | Feature |
| 224 | sy_plxerr2 | Parallax [mas] Lower Unc | Lower margin of error for parallax measurement. | Feature |
| 225 | sy_bmag | B (Johnson) Magnitude | Apparent brightness in the Blue (Johnson) filter. | Feature |
| 226 | sy_bmagerr1 | B (Johnson) Magnitude Upper Unc | Upper margin of error for B-band magnitude. | Feature |
| 227 | sy_bmagerr2 | B (Johnson) Magnitude Lower Unc | Lower margin of error for B-band magnitude. | Feature |
| 228 | sy_vmag | V (Johnson) Magnitude | Apparent brightness in the Visual (Johnson) filter. | Feature |
| 229 | sy_vmagerr1 | V (Johnson) Magnitude Upper Unc | Upper margin of error for V-band magnitude. | Feature |
| 230 | sy_vmagerr2 | V (Johnson) Magnitude Lower Unc | Lower margin of error for V-band magnitude. | Feature |
| 231 | sy_jmag | J (2MASS) Magnitude | Apparent brightness in the J-band (Infrared). | Feature |
| 232 | sy_jmagerr1 | J (2MASS) Magnitude Upper Unc | Upper margin of error for J-band magnitude. | Feature |
| 233 | sy_jmagerr2 | J (2MASS) Magnitude Lower Unc | Lower margin of error for J-band magnitude. | Feature |
| 234 | sy_hmag | H (2MASS) Magnitude | Apparent brightness in the H-band (Infrared). | Feature |
| 235 | sy_hmagerr1 | H (2MASS) Magnitude Upper Unc | Upper margin of error for H-band magnitude. | Feature |
| 236 | sy_hmagerr2 | H (2MASS) Magnitude Lower Unc | Lower margin of error for H-band magnitude. | Feature |
| 237 | sy_kmag | Ks (2MASS) Magnitude | Apparent brightness in the K-band (Infrared). | Feature |
| 238 | sy_kmagerr1 | Ks (2MASS) Magnitude Upper Unc | Upper margin of error for K-band magnitude. | Feature |
| 239 | sy_kmagerr2 | Ks (2MASS) Magnitude Lower Unc | Lower margin of error for K-band magnitude. | Feature |
| 240 | sy_umag | u (Sloan) Magnitude | Apparent brightness in the Ultraviolet (Sloan) filter. | Feature |
| 241 | sy_umagerr1 | u (Sloan) Magnitude Upper Unc | Upper margin of error for u-band magnitude. | Feature |
| 242 | sy_umagerr2 | u (Sloan) Magnitude Lower Unc | Lower margin of error for u-band magnitude. | Feature |
| 243 | sy_gmag | g (Sloan) Magnitude | Apparent brightness in the Green (Sloan) filter. | Feature |
| 244 | sy_gmagerr1 | g (Sloan) Magnitude Upper Unc | Upper margin of error for g-band magnitude. | Feature |
| 245 | sy_gmagerr2 | g (Sloan) Magnitude Lower Unc | Lower margin of error for g-band magnitude. | Feature |
| 246 | sy_rmag | r (Sloan) Magnitude | Apparent brightness in the Red (Sloan) filter. | Feature |
| 247 | sy_rmagerr1 | r (Sloan) Magnitude Upper Unc | Upper margin of error for r-band magnitude. | Feature |
| 248 | sy_rmagerr2 | r (Sloan) Magnitude Lower Unc | Lower margin of error for r-band magnitude. | Feature |
| 249 | sy_imag | i (Sloan) Magnitude | Apparent brightness in the Near-Infrared (Sloan) filter. | Feature |
| 250 | sy_imagerr1 | i (Sloan) Magnitude Upper Unc | Upper margin of error for i-band magnitude. | Feature |
| 251 | sy_imagerr2 | i (Sloan) Magnitude Lower Unc | Lower margin of error for i-band (near-infrared) magnitude. | Feature |
| 252 | sy_zmag | z (Sloan) Magnitude | Apparent brightness in the z-band (Infrared/Sloan). | Feature |
| 253 | sy_zmagerr1 | z (Sloan) Magnitude Upper Unc | Upper margin of error for z-band magnitude. | Feature |
| 254 | sy_zmagerr2 | z (Sloan) Magnitude Lower Unc | Lower margin of error for z-band magnitude. | Feature |
| 255 | sy_w1mag | W1 (WISE) Magnitude | Brightness in the WISE W1 band (3.4 microns). | Feature |
| 256 | sy_w1magerr1 | W1 (WISE) Magnitude Upper Unc | Upper margin of error for W1 magnitude. | Feature |
| 257 | sy_w1magerr2 | W1 (WISE) Magnitude Lower Unc | Lower margin of error for W1 magnitude. | Feature |
| 258 | sy_w2mag | W2 (WISE) Magnitude | Brightness in the WISE W2 band (4.6 microns). | Feature |
| 259 | sy_w2magerr1 | W2 (WISE) Magnitude Upper Unc | Upper margin of error for W2 magnitude. | Feature |
| 260 | sy_w2magerr2 | W2 (WISE) Magnitude Lower Unc | Lower margin of error for W2 magnitude. | Feature |
| 261 | sy_w3mag | W3 (WISE) Magnitude | Brightness in the WISE W3 band (12 microns). | Feature |
| 262 | sy_w3magerr1 | W3 (WISE) Magnitude Upper Unc | Upper margin of error for W3 magnitude. | Feature |
| 263 | sy_w3magerr2 | W3 (WISE) Magnitude Lower Unc | Lower margin of error for W3 magnitude. | Feature |
| 264 | sy_w4mag | W4 (WISE) Magnitude | Brightness in the WISE W4 band (22 microns). | Feature |
| 265 | sy_w4magerr1 | W4 (WISE) Magnitude Upper Unc | Upper margin of error for W4 magnitude. | Feature |
| 266 | sy_w4magerr2 | W4 (WISE) Magnitude Lower Unc | Lower margin of error for W4 magnitude. | Feature |
| 267 | sy_gaiamag | Gaia Magnitude | Apparent brightness as measured by the Gaia mission. | Feature |
| 268 | sy_gaiamagerr1 | Gaia Magnitude Upper Unc | Upper margin of error for Gaia magnitude. | Feature |
| 269 | sy_gaiamagerr2 | Gaia Magnitude Lower Unc | Lower margin of error for Gaia magnitude. | Feature |
| 270 | sy_icmag | I (Cousins) Magnitude | Brightness in the I (Cousins) filter. | Feature |
| 271 | sy_icmagerr1 | I (Cousins) Magnitude Upper Unc | Upper margin of error for Ic-band magnitude. | Feature |
| 272 | sy_icmagerr2 | I (Cousins) Magnitude Lower Unc | Lower margin of error for Ic-band magnitude. | Feature |
| 273 | sy_tmag | TESS Magnitude | Brightness as measured in the TESS mission filter. | Feature |
| 274 | sy_tmagerr1 | TESS Magnitude Upper Unc | Upper margin of error for TESS magnitude. | Feature |
| 275 | sy_tmagerr2 | TESS Magnitude Lower Unc | Lower margin of error for TESS magnitude. | Feature |
| 276 | sy_kepmag | Kepler Magnitude | Brightness as measured in the Kepler mission filter. | Feature |
| 277 | sy_kepmagerr1 | Kepler Magnitude Upper Unc | Upper margin of error for Kepler magnitude. | Feature |
| 278 | sy_kepmagerr2 | Kepler Magnitude Lower Unc | Lower margin of error for Kepler magnitude. | Feature |
| 279 | rowupdate | Date of Last Update | Date the record was last modified in the archive. | Metadata |
| 280 | pl_pubdate | Planetary Parameter Reference Publication Date | Date of the academic publication for these parameters. | Metadata |
| 281 | releasedate | Release Date | Date the data was made public in the archive. | Metadata |
| 282 | pl_nnotes | Number of Notes | Total number of scientific notes for this planet. | Feature |
| 283 | st_nphot | Number of Photometry Time Series | Number of photometry time series available. | Feature |
| 284 | st_nrvc | Number of Radial Velocity Time Series | Number of radial velocity time series available. | Feature |
| 285 | st_nspec | Number of Stellar Spectra Measurements | Total stellar spectra measurements recorded. | Feature |
| 286 | pl_nespec | Number of Eclipse Spectra | Number of secondary eclipse spectra available. | Feature |
| 287 | pl_ntranspec | Number of Transmission Spectra | Number of transmission spectra available. | Feature |
| 288 | pl_ndispec | Number of Direct Imaging Spectra | Number of direct imaging spectra available. | Feature |
| 289 | - |  | The final target variable you will calculate. | Target |