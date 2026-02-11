import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pie, Bar, Line } from 'react-chartjs-2'
import { Download, TrendingUp } from 'lucide-react'

const BatchVisualization = ({ results, onDownload }) => {
  if (!results || !results.results) return null

  const predictions = results.results
  const [sortBy, setSortBy] = useState('confidence')
  const [sortDir, setSortDir] = useState('desc')
  const [filterPrediction, setFilterPrediction] = useState('all')
  const [minConfidence, setMinConfidence] = useState(0)
  const [search, setSearch] = useState('')
  const habitable = predictions.filter(r => r.prediction_result === 'Habitable').length
  const nonHabitable = predictions.filter(r => r.prediction_result === 'Non-Habitable').length
  
  // Sort by confidence and get top 10
  const topConfident = [...predictions].sort((a, b) => b.confidence_score - a.confidence_score).slice(0, 10)
  
  // Get confidence distribution
  const confidenceRanges = {
    '90-100%': predictions.filter(r => r.confidence_score >= 0.9).length,
    '70-90%': predictions.filter(r => r.confidence_score >= 0.7 && r.confidence_score < 0.9).length,
    '50-70%': predictions.filter(r => r.confidence_score >= 0.5 && r.confidence_score < 0.7).length,
    '<50%': predictions.filter(r => r.confidence_score < 0.5).length,
  }

  // Pie chart data - Habitability Distribution
  const habPieData = {
    labels: ['Habitable', 'Non-Habitable'],
    datasets: [{
      data: [habitable, nonHabitable],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderColor: ['#16a34a', '#dc2626'],
      borderWidth: 2,
    }]
  }

  // Bar chart data - Confidence Distribution
  const confidenceBarData = {
    labels: Object.keys(confidenceRanges),
    datasets: [{
      label: 'Number of Planets',
      data: Object.values(confidenceRanges),
      backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444'],
      borderRadius: 8,
      borderSkipped: false,
    }]
  }

  // Line chart data - Top 10 Most Confident
  const topConfidentData = {
    labels: topConfident.map(p => p.planet_id?.substring(0, 15) || `Planet ${predictions.indexOf(p)}`),
    datasets: [{
      label: 'Confidence Score',
      data: topConfident.map(p => p.confidence_score * 100),
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#0ea5e9',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        beginAtZero: true,
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      }
    }
  }

  const filteredPredictions = predictions.filter((p, idx) => {
    const name = p.planet_id || `Planet ${idx + 1}`
    const matchesSearch = name.toLowerCase().includes(search.trim().toLowerCase())
    const matchesPrediction = filterPrediction === 'all' || p.prediction_result === filterPrediction
    const matchesConfidence = (p.confidence_score * 100) >= minConfidence
    return matchesSearch && matchesPrediction && matchesConfidence
  })

  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    let aVal = a
    let bVal = b
    if (sortBy === 'confidence') {
      aVal = a.confidence_score
      bVal = b.confidence_score
    } else if (sortBy === 'name') {
      aVal = a.planet_id || ''
      bVal = b.planet_id || ''
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    } else if (sortBy === 'prediction') {
      aVal = a.prediction_result || ''
      bVal = b.prediction_result || ''
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    if (aVal === bVal) return 0
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  return (
    <div className="space-y-6 mt-8">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass-card p-6 text-center">
          <p className="text-white/60 text-sm">Total Planets</p>
          <p className="text-3xl font-bold gradient-text mt-2">{results.total_processed}</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-white/60 text-sm">Habitable 🌍</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{habitable}</p>
          <p className="text-xs text-white/60 mt-1">({((habitable/results.total_processed)*100).toFixed(1)}%)</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-white/60 text-sm">Non-Habitable 🪨</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{nonHabitable}</p>
          <p className="text-xs text-white/60 mt-1">({((nonHabitable/results.total_processed)*100).toFixed(1)}%)</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-white/60 text-sm">Avg Confidence</p>
          <p className="text-3xl font-bold text-primary-400 mt-2">
            {((predictions.reduce((a, b) => a + b.confidence_score, 0) / predictions.length) * 100).toFixed(1)}%
          </p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habitability Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Habitability Distribution</h3>
          <div className="flex justify-center" style={{ height: '250px' }}>
            <Pie
              data={habPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#fff', font: { size: 12 }, padding: 20 }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Confidence Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Confidence Score Distribution</h3>
          <div style={{ height: '250px' }}>
            <Bar
              data={confidenceBarData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: true, labels: { color: '#fff' } }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Top Confident Planets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          Top 10 Most Confident Predictions
        </h3>
        <div style={{ height: '300px' }}>
          <Line
            data={topConfidentData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: { labels: { color: '#fff' } }
              }
            }}
          />
        </div>
      </motion.div>

      {/* Detailed Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">All Predictions</h3>
            <p className="text-xs text-white/60 mt-1">Showing {sortedPredictions.length} of {predictions.length}</p>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg transition-all text-primary-400"
          >
            <Download className="w-4 h-4" />
            Download Results
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <div>
            <label className="block text-xs text-white/60 mb-1">Search Planet</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g., Planet_162"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-400/40"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Prediction</label>
            <select
              value={filterPrediction}
              onChange={(e) => setFilterPrediction(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-400/40"
            >
              <option value="all">All</option>
              <option value="Habitable">Habitable</option>
              <option value="Non-Habitable">Non-Habitable</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Min Confidence %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-400/40"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-400/40"
            >
              <option value="confidence">Confidence</option>
              <option value="name">Planet Name</option>
              <option value="prediction">Prediction</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Order</label>
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-400/40"
            >
              <option value="desc">High → Low</option>
              <option value="asc">Low → High</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white/10 border-b border-white/10">
              <tr>
                <th className="text-left p-3 text-white/70 font-semibold">#</th>
                <th className="text-left p-3 text-white/70 font-semibold">Planet</th>
                <th className="text-center p-3 text-white/70 font-semibold">Prediction</th>
                <th className="text-right p-3 text-white/70 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {sortedPredictions.map((result, idx) => (
                <tr key={idx} className="border-t border-white/5 hover:bg-white/5 transition">
                  <td className="p-3 text-white/60">{idx + 1}</td>
                  <td className="p-3 text-primary-400 font-medium truncate">{result.planet_id || `Planet ${idx + 1}`}</td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      result.prediction_result === 'Habitable'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.prediction_result === 'Habitable' ? '🌍 Habitable' : '🪨 Non-Habitable'}
                    </span>
                  </td>
                  <td className="p-3 text-right text-white font-mono">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 bg-white/10 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                          style={{ width: `${result.confidence_score * 100}%` }}
                        />
                      </div>
                      <span className="text-white/70 text-xs">{(result.confidence_score * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default BatchVisualization
