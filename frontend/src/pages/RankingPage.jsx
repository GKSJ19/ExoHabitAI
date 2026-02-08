import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Trophy, Loader, Filter, Star, Crown, Award, Medal, ChevronRight, X, Globe, Zap, Target, TrendingUp } from 'lucide-react'
import { apiService, handleApiError } from '../services/api'
import toast from 'react-hot-toast'
import BackgroundScene from '../components/3d/BackgroundScene'

const RankingPage = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const [loading, setLoading] = useState(true)
  const [rankings, setRankings] = useState(null)
  const [topN, setTopN] = useState(20)
  const [minScore, setMinScore] = useState(0.5)
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    setLoading(true)
    try {
      const data = await apiService.getRanking(topN, minScore)
      setRankings(data)
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    fetchRankings()
  }

  const getScoreColor = (score) => {
    if (score >= 0.9) return 'from-green-400 to-emerald-400'
    if (score >= 0.7) return 'from-yellow-400 to-amber-400'
    if (score >= 0.5) return 'from-orange-400 to-red-400'
    return 'from-red-400 to-rose-400'
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-400" />
    if (rank === 2) return <Medal className="w-7 h-7 text-gray-300" />
    if (rank === 3) return <Award className="w-7 h-7 text-amber-600" />
    return <span className="text-white/50 font-mono text-lg">#{rank}</span>
  }

  // Fetch detailed planet data from backend
  const getPlanetDetails = async (rank) => {
    try {
      const planet = rankings.planets.find(p => p.rank === rank)
      if (!planet) return null
      
      // If planet already has metadata from ranking endpoint, return it
      if (planet.pl_name && planet.hostname) {
        return planet
      }
      
      // Otherwise fetch from dedicated endpoint (fallback)
      // Note: Using rank-1 as index since ranks start at 1
      const response = await apiService.get(`/planet/${rank - 1}`)
      return response
    } catch (error) {
      console.error('Error fetching planet details:', error)
      toast.error('Could not load planet details')
      return null
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
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/70">Exoplanet Leaderboard</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
                Habitability Rankings
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Top exoplanet candidates ranked by habitability confidence score
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Number of Results
                </label>
                <input
                  type="number"
                  value={topN}
                  onChange={(e) => setTopN(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  min="1"
                  max="100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Minimum Score
                </label>
                <input
                  type="number"
                  value={minScore}
                  onChange={(e) => setMinScore(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
              <motion.button
                onClick={handleFilter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-yellow-500/25"
              >
                <Filter className="w-5 h-5" />
                Apply Filters
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Summary */}
          {rankings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {[
                { value: rankings.total_planets, label: 'Total Candidates', icon: <Star className="w-6 h-6" /> },
                { value: rankings.filtered_count, label: 'Filtered Results', icon: <Filter className="w-6 h-6" /> },
                { 
                  value: rankings.planets.length > 0 
                    ? (rankings.planets[0].habitability_score * 100).toFixed(2) + '%'
                    : 'N/A', 
                  label: 'Top Score', 
                  icon: <Trophy className="w-6 h-6" /> 
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 mb-4">
                      <span className="text-yellow-400">{stat.icon}</span>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/50">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Rankings Table */}
          {loading ? (
            <div className="p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
              <Loader className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-spin" />
              <p className="text-white/60">Loading rankings...</p>
            </div>
          ) : rankings && rankings.planets.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Planet Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Habitability Score</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Classification</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Score Bar</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-white">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rankings.planets.map((planet, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.03 }}
                        className={`hover:bg-white/5 transition-colors ${idx < 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-10 h-10">
                            {getRankBadge(planet.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-cyan-400" />
                            <span className="text-white font-medium">
                              {planet.pl_name || `Exoplanet #${planet.rank}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-lg font-bold bg-gradient-to-r ${getScoreColor(planet.habitability_score)} bg-clip-text text-transparent`}>
                            {(planet.habitability_score * 100).toFixed(4)}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            planet.classification === 'Habitable'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {planet.classification}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${planet.habitability_score * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.7 + idx * 0.03 }}
                              className={`h-full bg-gradient-to-r ${getScoreColor(planet.habitability_score)} rounded-full`}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.button
                            onClick={async () => {
                              const details = await getPlanetDetails(planet.rank)
                              setSelectedPlanet(details)
                            }}
                            whileHover={{ scale: 1.1, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-white/10 transition-all"
                          >
                            <ChevronRight className="w-5 h-5 text-white" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl" />
                <Trophy className="relative w-16 h-16 text-yellow-400/50" />
              </div>
              <p className="text-white/50">No planets found matching the criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Planet Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getRankBadge(selectedPlanet.rank)}
                      <h2 className="text-3xl font-bold text-white">
                        {selectedPlanet.pl_name || `Exoplanet #${selectedPlanet.rank}`}
                      </h2>
                    </div>
                    <p className="text-white/60">
                      {selectedPlanet.hostname && `Host: ${selectedPlanet.hostname} • `}
                      {selectedPlanet.st_spectype && `Type: ${selectedPlanet.st_spectype}`}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setSelectedPlanet(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Prediction Summary */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-400" />
                    Prediction Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-white/60 mb-1">Habitability Score</p>
                      <p className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(selectedPlanet.habitability_score)} bg-clip-text text-transparent`}>
                        {(selectedPlanet.habitability_score * 100).toFixed(4)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-white/60 mb-1">Classification</p>
                      <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
                        selectedPlanet.classification === 'Habitable'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {selectedPlanet.classification}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-white/60 mb-1">Model Threshold</p>
                      <p className="text-2xl font-bold text-cyan-400">0.0763</p>
                    </div>
                  </div>
                </div>

                {/* Visual Score Bar */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    Confidence Visualization
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-white/60">Habitability Probability</span>
                        <span className="text-sm font-bold text-white">{(selectedPlanet.habitability_score * 100).toFixed(2)}%</span>
                      </div>
                      <div className="relative w-full h-8 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedPlanet.habitability_score * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${getScoreColor(selectedPlanet.habitability_score)} flex items-center justify-end pr-2`}
                        >
                          <span className="text-xs font-bold text-white drop-shadow-lg">
                            {(selectedPlanet.habitability_score * 100).toFixed(1)}%
                          </span>
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <div className="text-center flex-1">
                        <p className="text-xs text-white/50">Low</p>
                        <p className="text-xs text-red-400 mt-1">0-50%</p>
                      </div>
                      <div className="text-center flex-1 border-x border-white/10">
                        <p className="text-xs text-white/50">Medium</p>
                        <p className="text-xs text-yellow-400 mt-1">50-70%</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-xs text-white/50">High</p>
                        <p className="text-xs text-green-400 mt-1">70-100%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Planetary Parameters */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-green-400" />
                    Planetary Parameters
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Orbital Period</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.pl_orbper ? `${selectedPlanet.pl_orbper.toFixed(2)} days` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Semi-Major Axis</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.pl_orbsmax ? `${selectedPlanet.pl_orbsmax.toFixed(3)} AU` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Planet Radius</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.pl_rade ? `${selectedPlanet.pl_rade.toFixed(3)} R⊕` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Planet Mass</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.pl_bmasse ? `${selectedPlanet.pl_bmasse.toFixed(3)} M⊕` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Discovery Method</p>
                      <p className="text-sm font-bold text-white">
                        {selectedPlanet.discoverymethod || 'Unknown'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">System Distance</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.sy_dist ? `${selectedPlanet.sy_dist.toFixed(2)} pc` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stellar Parameters */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                    Stellar Parameters
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Host Star</p>
                      <p className="text-sm font-bold text-white">
                        {selectedPlanet.hostname || 'Unknown'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Effective Temp</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.st_teff ? `${selectedPlanet.st_teff.toFixed(0)} K` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Star Radius</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.st_rad ? `${selectedPlanet.st_rad.toFixed(3)} R☉` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50 mb-1">Star Mass</p>
                      <p className="text-lg font-bold text-white">
                        {selectedPlanet.st_mass ? `${selectedPlanet.st_mass.toFixed(3)} M☉` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Model Information */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Model Information
                  </h3>
                  <div className="space-y-2 text-sm text-white/70">
                    <p>• <span className="font-semibold text-white">Model:</span> Hybrid Stacking Ensemble (XGBoost + Random Forest)</p>
                    <p>• <span className="font-semibold text-white">Accuracy:</span> 99%</p>
                    <p>• <span className="font-semibold text-white">Recall:</span> 83.33% (detects 5/6 habitable planets)</p>
                    <p>• <span className="font-semibold text-white">Precision:</span> 38.46%</p>
                    <p>• <span className="font-semibold text-white">Features Analyzed:</span> 39 planetary and stellar parameters</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RankingPage
