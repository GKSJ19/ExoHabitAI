Dataset Report: Habitability-Oriented Feature Selection from NASA Exoplanet Archive
1. Project Aim

The aim of this project is to identify potentially habitable exoplanets by transforming astrophysical parameters into machine-learning-ready features. The focus is on planetary, stellar, and orbital characteristics that directly influence surface conditions and long-term habitability.

2. Dataset Description
2.1 Data Source

The primary data source is the NASA Exoplanet Archive, specifically the Planetary Systems (PS) Table filtered for confirmed exoplanets detected by the TESS mission.

Source URL: NASA Exoplanet Archive (PS Table)

Maintained by: IPAC, California Institute of Technology (Caltech), under NASA

Nature of Data: Peer-reviewed observational and derived astrophysical measurements

Project Phase: Data Collection

Last Updated: January 2, 2026

2.2 Dataset Origin and Scale

The dataset aggregates measurements reported across multiple discovery missions and observatories worldwide. Each row represents the best-confirmed parameter set for an exoplanet.

Initial Size: ~39,000 records × 288 columns

Granularity: Planet-level with linked stellar and system-level parameters

Data Characteristics:

Numerical (continuous & discrete)

Categorical

Boolean flags

Measurement uncertainties and limit indicators

3. Column Categorization Based on Habitability Usability

To support habitability prediction, columns are categorized by direct impact, indirect influence, and non-contributory (excluded) relevance.

3.1 Core Habitability Indicators (Primary Features)

These parameters directly affect surface temperature, atmospheric retention, and liquid water potential.

Planetary Properties

pl_rade, pl_masse, pl_bmasse

pl_dens

pl_eqt

pl_insol

pl_orbeccen

Orbital Characteristics

pl_orbper

pl_orbsmax

pl_orbincl

Derived Ratios

pl_ratror

pl_ratdor

3.2 Stellar Environment Features (Secondary Features)

These parameters define the radiation environment and long-term stability of the planetary system.

Stellar Physical Properties

>st_teff

>st_rad

>st_mass

>st_lum

>st_met

>st_age

>st_logg

Stellar Activity & Motion

>st_vsin

>st_rotp

>st_radv

3.3 Observational & Detection Reliability Features (Supporting Features)

Used to assess data quality, confirmation confidence, and bias.

>discoverymethod

>disc_facility

>disc_year

>tran_flag, rv_flag

>ttv_flag

>pl_trandep

>pl_trandur

3.4 System Context Features (Auxiliary Features)

These features provide environmental and observational context.

>sy_snum, sy_pnum

>sy_dist

>sy_plx

>Proper motion features (sy_pm, sy_pmra, sy_pmdec)

3.5 Metadata & Administrative Columns (Excluded)

These columns do not contribute to habitability modeling and are excluded from training.

>Identifiers: pl_name, hostname, tic_id, gaia_dr2_id

>References: pl_refname, st_refname, sy_refname

>Dates: rowupdate, releasedate, pl_pubdate

>Positional coordinates used only for cataloging

3.6 Redundant Unit Variants & Drop Columns

To avoid multicollinearity, only Earth-based units are retained.

#Jupiter-unit equivalents (pl_massj, pl_radj, etc.)

#Duplicate uncertainty representations where superior values exist

4. Processed Dataset Strategy

The final processed dataset will be created by:

1.Retaining core and secondary habitability features

2.Removing metadata, references, and redundant unit columns

3.Handling uncertainty bounds and limit flags

4.Normalizing astrophysical scales

5.Imputing missing values using astrophysically consistent methods
