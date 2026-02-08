
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Upload, Loader, CheckCircle2, XCircle, Download, FileUp, AlertCircle, Eye, Rocket, Database, Zap } from 'lucide-react'
import { apiService, handleApiError } from '../services/api'
import toast from 'react-hot-toast'
import { Pie, Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)
import BatchVisualization from '../components/BatchVisualization'
import BackgroundScene from '../components/3d/BackgroundScene'

const BatchPage = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [jsonInput, setJsonInput] = useState('')
  const [uploadMode, setUploadMode] = useState('json')
  const [dragActive, setDragActive] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const sampleBatchData = `{
  "planets": [
    {
      "pl_name": "Earth-Twin-Alpha",
      "pl_dens": 5.51, "pl_bmasse": 1.0, "pl_ratdor": 215.0, "st_logg": 4.44, "st_dens": 1.41,
      "pl_rvamp": 0.089, "st_lum": 1.0, "sy_bmag": 5.48, "pl_ratror": 0.0091, "pl_orbincl": 89.0,
      "st_met": 0.0, "st_mass": 1.0, "pl_trandep": 0.008, "st_rad": 1.0, "pl_orbper": 365.25,
      "dec": -0.44, "pl_imppar": 0.1, "glat": -6.0, "pl_trandur": 13.0, "pl_tranmid": 2450000.0,
      "sy_pmra": 0.0, "sy_w4mag": 8.0, "st_age": 4.6, "sy_pm": 0.0, "rowid": 1, "pl_orbsmax": 1.0,
      "sy_pmdec": 0.0, "glon": 0.0, "ra": 0.0, "elon": 0.0, "rv_flag": 1, "st_teff": 5778.0,
      "pl_nnotes": 0, "sy_plx": 100.0, "pl_ntranspec": 0, "pl_orblper": 0.0, "tran_flag": 1,
      "pl_insol.1": 1.0, "pl_orbeccen.1": 0.017
    },
    {
      "pl_name": "Hot-Jupiter-Gamma",
      "pl_dens": 1.2, "pl_bmasse": 300.0, "pl_ratdor": 10.0, "st_logg": 4.1, "st_dens": 0.8,
      "pl_rvamp": 100.0, "st_lum": 2.5, "sy_bmag": 8.5, "pl_ratror": 0.1, "pl_orbincl": 85.0,
      "st_met": 0.2, "st_mass": 1.2, "pl_trandep": 1.5, "st_rad": 1.4, "pl_orbper": 3.0,
      "dec": 15.0, "pl_imppar": 0.5, "glat": 10.0, "pl_trandur": 3.0, "pl_tranmid": 2451000.0,
      "sy_pmra": 5.0, "sy_w4mag": 7.0, "st_age": 1.5, "sy_pm": 5.0, "rowid": 2, "pl_orbsmax": 0.04,
      "sy_pmdec": 2.0, "glon": 120.0, "ra": 280.0, "elon": 285.0, "rv_flag": 1, "st_teff": 6500.0,
      "pl_nnotes": 2, "sy_plx": 10.0, "pl_ntranspec": 0, "pl_orblper": 90.0, "tran_flag": 1,
      "pl_insol.1": 2000.0, "pl_orbeccen.1": 0.05
    }
  ]
}`

  const loadSample = () => {
    setJsonInput(sampleBatchData)
    setUploadMode('json')
    toast.success('Sample JSON loaded!')
  }

  // Parse CSV file with proper error handling
  const parseCSV = (csvText) => {
    try {
      const lines = csvText.trim().split('\n').filter(line => line.trim())
      if (lines.length < 2) throw new Error('CSV must have header and at least one data row')

      const headers = lines[0].split(',').map(h => h.trim())
      const planets = []

      console.log(`📋 CSV Headers: ${headers.join(', ')}`)

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length === 0 || values.every(v => !v)) continue

        if (values.length !== headers.length) {
          console.warn(`⚠️ Row ${i + 1} has ${values.length} columns, expected ${headers.length}. Skipping.`)
          continue
        }

        const planet = {}
        for (let j = 0; j < headers.length; j++) {
          const value = values[j]
          const numValue = parseFloat(value)
          planet[headers[j]] = isNaN(numValue) ? value : numValue
        }
        planets.push(planet)
      }

      if (planets.length === 0) throw new Error('No valid data rows found in CSV')
      console.log(`✅ Parsed ${planets.length} planets from CSV`)
      return planets
    } catch (error) {
      console.error('CSV Parse Error:', error)
      throw error
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) return

    try {
      console.log(`📁 Processing file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
      let planets = []

      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        planets = parseCSV(text)
        setJsonInput(JSON.stringify({ planets }, null, 2))
        setPreviewData(planets.slice(0, 10))
        setShowPreview(true)
        toast.success(`✅ Loaded ${planets.length} planets from ${file.name}`)
        console.log(`🔍 Preview: First 10 planets loaded`)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        toast.error('❌ Excel files: Please convert to CSV first')
        return
      } else {
        toast.error(`❌ Unsupported file format. Use CSV`)
        return
      }
    } catch (error) {
      console.error('File processing error:', error)
      toast.error(`❌ Error: ${error.message}`)
      setPreviewData(null)
    }
  }

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResults(null)

    try {
      console.log('🚀 Starting batch prediction...')
      const data = JSON.parse(jsonInput)
      
      if (!data.planets || !Array.isArray(data.planets)) {
        throw new Error('Invalid format: must have "planets" array')
      }

      if (data.planets.length === 0) {
        throw new Error('No planets to predict')
      }

      console.log(`📊 Processing ${data.planets.length} planets...`)
      const response = await apiService.predictBatch(data.planets)
      
      setResults(response)
      console.log('✅ Batch prediction successful:', response)
      toast.success(`✅ Processed ${response.total_processed} planets!`)
    } catch (error) {
      console.error('Batch prediction error:', error)
      if (error instanceof SyntaxError) {
        toast.error('❌ Invalid JSON format')
      } else {
        const errorMessage = handleApiError(error)
        toast.error(`❌ ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `batch_results_${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('✅ Results downloaded!')
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <BackgroundScene />

      <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white/70">Multi-Planet Analysis</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Batch Prediction
              </span>
            </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Analyze multiple exoplanets simultaneously. Upload CSV or paste JSON with 39 features per planet.
          </p>
        </motion.div>

        {/* Tab Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex gap-2 mb-8 sticky top-20 z-40"
        >
          <button
            onClick={() => setUploadMode('json')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              uploadMode === 'json'
                ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-white/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            📄 JSON Input
          </button>
          <button
            onClick={() => setUploadMode('csv')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              uploadMode === 'csv'
                ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-white/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileUp className="w-4 h-4" />
            CSV Upload
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* JSON Input */}
            {uploadMode === 'json' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  JSON Input
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="input-field font-mono text-sm min-h-[350px] resize-y"
                    placeholder='{"planets": [{"pl_name": "...", ...39 features}]}'
                    required
                  />

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading || !jsonInput.trim()}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <span>Process Batch</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={loadSample}
                      className="btn-secondary px-6"
                    >
                      Load Sample
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* CSV Upload */}
            {uploadMode === 'csv' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileUp className="w-5 h-5" />
                  CSV File Upload
                </h3>
                
                <div className="space-y-4">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      dragActive
                        ? 'border-primary-500/80 bg-primary-500/10'
                        : 'border-primary-500/30 hover:border-primary-500/60'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer block">
                      <FileUp className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-primary-400' : 'text-primary-400/70'}`} />
                      <p className="text-white font-medium">Drag & drop CSV or click to upload</p>
                      <p className="text-white/60 text-sm">CSV with 39 columns (headers on first row)</p>
                    </label>
                  </div>

                  {previewData && showPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-white/5 rounded-lg p-4 border border-primary-500/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-bold flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Preview (First {Math.min(previewData.length, 10)} Planets)
                        </h4>
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="text-primary-400 hover:text-primary-300 text-sm"
                        >
                          {showPreview ? 'Hide' : 'Show'}
                        </button>
                      </div>

                      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                        <table className="w-full text-xs text-white/70">
                          <thead className="sticky top-0 bg-white/10">
                            <tr>
                              <th className="text-left p-2 font-bold">Planet</th>
                              <th className="text-right p-2">Density</th>
                              <th className="text-right p-2">Mass</th>
                              <th className="text-right p-2">Orbit Period</th>
                              <th className="text-right p-2">Temp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((planet, idx) => (
                              <tr key={idx} className="border-t border-white/5 hover:bg-white/5 transition">
                                <td className="p-2 truncate text-primary-400">{planet.pl_name || '—'}</td>
                                <td className="text-right p-2">{planet.pl_dens?.toFixed(2) || '—'}</td>
                                <td className="text-right p-2">{planet.pl_bmasse?.toFixed(2) || '—'}</td>
                                <td className="text-right p-2">{planet.pl_orbper?.toFixed(2) || '—'}</td>
                                <td className="text-right p-2">{planet.st_teff?.toFixed(0) || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {jsonInput && (
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="btn-primary w-full mt-4"
                        >
                          {loading ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              Processing {previewData.length} planets...
                            </>
                          ) : (
                            <>
                              🚀 Predict Habitability for {previewData.length} Planets
                            </>
                          )}
                        </button>
                      )}
                    </motion.div>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
                    <p className="text-blue-300 font-medium mb-2">📋 CSV Format Required:</p>
                    <ul className="text-white/70 space-y-1">
                      <li>• Header row with 39 feature names</li>
                      <li>• Each row = one planet</li>
                      <li>• First column recommended: <code className="bg-white/10 px-2 py-1 rounded">pl_name</code></li>
                      <li>• All numeric values except planet names</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results & Info Section */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sticky top-32"
            >
              <h3 className="text-lg font-bold text-white mb-4">Model Info</h3>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <span className="text-primary-400">🤖</span>
                  <div>
                    <p className="font-medium text-white">Hybrid Stacking</p>
                    <p className="text-xs">XGBoost + Random Forest</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-400">📊</span>
                  <div>
                    <p className="font-medium text-white">39 Features</p>
                    <p className="text-xs">Planetary & stellar params</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-400">🎯</span>
                  <div>
                    <p className="font-medium text-white">83.33% Recall</p>
                    <p className="text-xs">Optimized threshold: 0.0763</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-400">⚡</span>
                  <div>
                    <p className="font-medium text-white">Real-time</p>
                    <p className="text-xs">Instant predictions</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Display */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mt-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Results
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm">Total Processed</p>
                    <p className="text-3xl font-bold gradient-text">{results.total_processed}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-white/60 text-sm">Status Breakdown</p>
                    {results.results && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">✅ Habitable</span>
                          <span className="font-bold">{results.results.filter(r => r.prediction_result === 'Habitable').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-400">❌ Non-Habitable</span>
                          <span className="font-bold">{results.results.filter(r => r.prediction_result === 'Non-Habitable').length}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={downloadResults}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON
                  </button>
                </div>

                {/* Detailed Results */}
                <div className="mt-6 max-h-96 overflow-y-auto">
                  <p className="text-white/60 text-sm mb-3">Predictions</p>
                  <div className="space-y-2">
                    {results.results?.map((result, idx) => (
                      <div key={idx} className="bg-white/5 rounded p-3 text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-primary-400 font-medium">{result.planet_id}</span>
                          <span className={result.prediction_result === 'Habitable' ? 'text-green-400' : 'text-red-400'}>
                            {result.prediction_result === 'Habitable' ? '✅' : '❌'}
                          </span>
                        </div>
                        <div className="flex justify-between text-white/60">
                          <span>Confidence:</span>
                          <span className="font-mono">{(result.confidence_score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Instructions */}
                {/* Data Visualization Charts */}
                {results && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12"
                  >
                    <BatchVisualization results={results} onDownload={downloadResults} />
                  </motion.div>
                )}
                
        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 backdrop-blur-sm mt-12"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-400" />
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                <span className="text-xl">1️⃣</span>
              </div>
              <p className="font-bold text-white mb-2">Upload Data</p>
              <p className="text-white/50 text-sm">Use CSV or JSON format with all 39 planetary & stellar features per planet</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                <span className="text-xl">2️⃣</span>
              </div>
              <p className="font-bold text-white mb-2">Preview & Review</p>
              <p className="text-white/50 text-sm">CSV files show a preview (first 10 planets) before processing</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4">
                <span className="text-xl">3️⃣</span>
              </div>
              <p className="font-bold text-white mb-2">Get Results</p>
              <p className="text-white/50 text-sm">Model evaluates habitability with confidence scores for each planet</p>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}

export default BatchPage
