import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Loader, AlertCircle, CheckCircle2, Rocket, Globe, Star, Zap } from 'lucide-react'
import { apiService, handleApiError } from '../services/api'
import toast from 'react-hot-toast'
import BackgroundScene from '../components/3d/BackgroundScene'

const PredictPage = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState({
    pl_name: 'Earth-Twin-Alpha',
    pl_dens: 5.51,
    pl_bmasse: 1.0,
    pl_ratdor: 215.0,
    st_logg: 4.44,
    st_dens: 1.41,
    pl_rvamp: 0.089,
    st_lum: 1.0,
    sy_bmag: 5.48,
    pl_ratror: 0.0091,
    pl_orbincl: 89.0,
    st_met: 0.0,
    st_mass: 1.0,
    pl_trandep: 0.008,
    st_rad: 1.0,
    pl_orbper: 365.25,
    dec: -0.44,
    pl_imppar: 0.1,
    glat: -6.0,
    pl_trandur: 13.0,
    pl_tranmid: 2450000.0,
    sy_pmra: 0.0,
    sy_w4mag: 8.0,
    st_age: 4.6,
    sy_pm: 0.0,
    rowid: 1,
    pl_orbsmax: 1.0,
    sy_pmdec: 0.0,
    glon: 0.0,
    ra: 0.0,
    elon: 0.0,
    rv_flag: 1,
    st_teff: 5778.0,
    pl_nnotes: 0,
    sy_plx: 100.0,
    pl_ntranspec: 0,
    pl_orblper: 0.0,
    tran_flag: 1,
    'pl_insol.1': 1.0,
    'pl_orbeccen.1': 0.017
  })

  const featureGroups = [
    {
      title: 'Planetary Parameters',
      icon: <Globe className="w-5 h-5" />,
      color: 'from-purple-500/20 to-pink-500/20',
      features: [
        { key: 'pl_dens', label: 'Planet Density (g/cm³)' },
        { key: 'pl_bmasse', label: 'Planet Mass (Earth masses)' },
        { key: 'pl_ratdor', label: 'Planet-Star Distance Ratio' },
        { key: 'pl_ratror', label: 'Planet-to-Star Radius Ratio' },
        { key: 'pl_orbincl', label: 'Orbital Inclination (degrees)' },
        { key: 'pl_orbper', label: 'Orbital Period (days)' },
        { key: 'pl_orbsmax', label: 'Semi-Major Axis (AU)' },
        { key: 'pl_orbeccen.1', label: 'Orbital Eccentricity' },
        { key: 'pl_insol.1', label: 'Insolation Flux (Earth units)' },
        { key: 'pl_trandep', label: 'Transit Depth (%)' },
        { key: 'pl_trandur', label: 'Transit Duration (hours)' },
        { key: 'pl_tranmid', label: 'Transit Midpoint (JD)' },
        { key: 'pl_rvamp', label: 'RV Semi-Amplitude (m/s)' },
        { key: 'pl_imppar', label: 'Impact Parameter' },
        { key: 'pl_orblper', label: 'Longitude of Periastron (deg)' },
        { key: 'pl_nnotes', label: 'Number of Notes' },
        { key: 'pl_ntranspec', label: 'Number of Transit Spectra' },
      ]
    },
    {
      title: 'Stellar Parameters',
      icon: <Star className="w-5 h-5" />,
      color: 'from-cyan-500/20 to-blue-500/20',
      features: [
        { key: 'st_teff', label: 'Stellar Temperature (K)' },
        { key: 'st_mass', label: 'Stellar Mass (Solar masses)' },
        { key: 'st_rad', label: 'Stellar Radius (Solar radii)' },
        { key: 'st_lum', label: 'Stellar Luminosity (Solar units)' },
        { key: 'st_dens', label: 'Stellar Density (g/cm³)' },
        { key: 'st_logg', label: 'Surface Gravity log10(cm/s²)' },
        { key: 'st_met', label: 'Stellar Metallicity [Fe/H]' },
        { key: 'st_age', label: 'Stellar Age (Gyr)' },
      ]
    },
    {
      title: 'System & Position',
      icon: <Rocket className="w-5 h-5" />,
      color: 'from-orange-500/20 to-red-500/20',
      features: [
        { key: 'sy_bmag', label: 'B-band Magnitude' },
        { key: 'sy_w4mag', label: 'WISE W4-band Magnitude' },
        { key: 'sy_pm', label: 'Total Proper Motion (mas/yr)' },
        { key: 'sy_pmra', label: 'Proper Motion in RA (mas/yr)' },
        { key: 'sy_pmdec', label: 'Proper Motion in Dec (mas/yr)' },
        { key: 'sy_plx', label: 'Parallax (mas)' },
        { key: 'ra', label: 'Right Ascension (degrees)' },
        { key: 'dec', label: 'Declination (degrees)' },
        { key: 'glon', label: 'Galactic Longitude (degrees)' },
        { key: 'glat', label: 'Galactic Latitude (degrees)' },
        { key: 'elon', label: 'Ecliptic Longitude (degrees)' },
        { key: 'rv_flag', label: 'RV Detection Flag' },
        { key: 'tran_flag', label: 'Transit Detection Flag' },
        { key: 'rowid', label: 'Database Row ID' },
      ]
    }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const loadSampleData = () => {
    const earthLike = {
      pl_name: 'Earth-Twin-Sample',
      pl_dens: '-0.048',
      pl_bmasse: '1.96',
      pl_ratdor: '-0.238',
      st_logg: '-0.334',
      st_dens: '-0.014',
      pl_rvamp: '0.766',
      st_lum: '0.296',
      sy_bmag: '0.559',
      pl_ratror: '0.066',
      pl_orbincl: '-0.180',
      st_met: '1.404',
      st_mass: '0.930',
      pl_trandep: '-0.012',
      st_rad: '0.948',
      pl_orbper: '-0.023',
      dec: '0.634',
      pl_imppar: '0.047',
      glat: '0.146',
      pl_trandur: '-0.172',
      pl_tranmid: '-0.578',
      sy_pmra: '-0.015',
      sy_w4mag: '0.269',
      st_age: '-0.151',
      sy_pm: '-0.228',
      rowid: '0.622',
      pl_orbsmax: '-0.353',
      sy_pmdec: '0.060',
      glon: '-0.576',
      ra: '0.629',
      elon: '0.680',
      rv_flag: '1.323',
      st_teff: '0.779',
      pl_nnotes: '0.120',
      sy_plx: '-0.299',
      pl_ntranspec: '-0.112',
      pl_orblper: '-0.196',
      tran_flag: '0.508',
      'pl_insol.1': '-0.216',
      'pl_orbeccen.1': '0.584'
    }
    setFormData(earthLike)
    toast.success('Sample data loaded!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const numericData = {}
      for (const [key, value] of Object.entries(formData)) {
        if (key !== 'pl_name') {
          const num = parseFloat(value)
          if (isNaN(num)) {
            toast.error(`Invalid value for ${key}`)
            setLoading(false)
            return
          }
          numericData[key] = num
        } else {
          numericData[key] = value
        }
      }

      const response = await apiService.predictHabitability(numericData)
      setResult(response)
      toast.success('Prediction complete!')
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <BackgroundScene />

      <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/70">Single Planet Analysis</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Habitability Prediction
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Enter exoplanet parameters to analyze habitability potential using our advanced AI model
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Planet Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Planet Designation
                  </label>
                  <input
                    type="text"
                    name="pl_name"
                    value={formData.pl_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Enter planet name"
                  />
                </motion.div>

                {/* Feature Groups */}
                {featureGroups.map((group, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${group.color} backdrop-blur-sm border border-white/10`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-white/10">
                        {group.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white">{group.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.features.map(feature => (
                        <div key={feature.key}>
                          <label className="block text-xs font-medium text-white/50 mb-2">
                            {feature.label}
                          </label>
                          <input
                            type="number"
                            step="any"
                            name={feature.key}
                            value={formData[feature.key]}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                            placeholder="0.0"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Predict Habitability
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={loadSampleData}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Load Sample Data
                  </motion.button>
                </motion.div>
              </form>
            </div>

            {/* Result Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-6"
                  >
                    {/* Result Badge */}
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xl ${
                          result.prediction_result === 'Habitable' 
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {result.prediction_result === 'Habitable' ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <AlertCircle className="w-7 h-7" />
                        )}
                        {result.prediction_result}
                      </motion.div>
                    </div>

                    {/* Confidence Score */}
                    <div>
                      <div className="text-sm text-white/50 mb-3">Confidence Score</div>
                      <div className="relative">
                        <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence_score * 100}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full"
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            {(result.confidence_score * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-white/50">Planet</span>
                        <span className="font-medium text-white">{result.planet_id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/50">Threshold</span>
                        <span className="font-mono text-white/70">{result.threshold_used}</span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-white/30 text-center pt-4 border-t border-white/10">
                      {result.timestamp}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 text-center"
                  >
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                      <Sparkles className="relative w-16 h-16 text-purple-400" />
                    </div>
                    <p className="text-white/50">
                      Fill in the exoplanet parameters and click "Predict" to analyze habitability potential
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictPage
