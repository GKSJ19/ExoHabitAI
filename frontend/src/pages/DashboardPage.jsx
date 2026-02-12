import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BarChart as BarChartIcon, LineChart as LineChartIcon, Download, Activity, Target, TrendingUp, Zap, FileText, Table2, Lightbulb, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { apiService, handleApiError } from '../services/api'
import toast from 'react-hot-toast'
import BackgroundScene from '../components/3d/BackgroundScene'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Papa from 'papaparse'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const DashboardPage = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [featureImportance, setFeatureImportance] = useState(null)
  const [correlations, setCorrelations] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)
  const dashboardRef = useRef(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Fetch all dashboard data in parallel
      const [statsData, featureData, correlationData] = await Promise.all([
        apiService.get('/dashboard/stats'),
        apiService.get('/dashboard/feature-importance'),
        apiService.get('/dashboard/correlations')
      ])
      
      setStats(statsData)
      setFeatureImportance(featureData)
      setCorrelations(correlationData)
      toast.success('Dashboard data loaded successfully!')
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = async () => {
    try {
      setExportLoading(true)
      const element = dashboardRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f0f1e',
        useCORS: true,
        logging: false
      })
      
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageHeight = pdf.internal.pageSize.getHeight()
      let heightLeft = imgHeight
      let position = 0
      
      const imgData = canvas.toDataURL('image/png')
      
      while (heightLeft > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        position -= pageHeight
        if (heightLeft > 0) {
          pdf.addPage()
        }
      }
      
      pdf.save('exoplanet-dashboard-report.pdf')
      toast.success('PDF exported successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF')
    } finally {
      setExportLoading(false)
    }
  }

  const exportCSV = () => {
    try {
      setExportLoading(true)
      
      // Prepare data for CSV
      const csvData = [
        ['Exoplanet Habitability Dashboard Report'],
        [],
        ['Generated:', new Date().toLocaleString()],
        [],
        ['SUMMARY STATISTICS'],
        ['Total Planets Analyzed', stats?.total_planets || 1089],
        ['Habitable Candidates', stats?.habitable_count || 13],
        ['Non-Habitable', (stats?.total_planets || 1089) - (stats?.habitable_count || 13)],
        [],
        ['MODEL PERFORMANCE METRICS'],
        ['Accuracy', ((stats?.model_metrics?.accuracy || 0.9917) * 100).toFixed(2) + '%'],
        ['Recall', ((stats?.model_metrics?.recall || 0.8333) * 100).toFixed(2) + '%'],
        ['Precision', ((stats?.model_metrics?.precision || 0.3846) * 100).toFixed(2) + '%'],
        ['F1 Score', ((stats?.model_metrics?.f1_score || 0.5263) * 100).toFixed(2) + '%'],
        ['Optimized Threshold', stats?.model_metrics?.threshold || 0.0763],
        [],
        ['TOP 15 FEATURE IMPORTANCE'],
        ['Feature', 'Importance Score']
      ]
      
      if (featureImportance) {
        featureImportance.features.forEach((feature, index) => {
          csvData.push([feature, featureImportance.importance_scores[index]])
        })
      }
      
      csvData.push([])
      csvData.push(['HABITABILITY SCORE DISTRIBUTION'])
      csvData.push(['Score Range', 'Count'])
      
      if (stats?.score_distribution) {
        stats.score_distribution.bins.slice(0, -1).forEach((bin, i) => {
          csvData.push([
            `${bin}-${stats.score_distribution.bins[i + 1]}%`,
            stats.score_distribution.counts[i]
          ])
        })
      }
      
      const csv = Papa.unparse(csvData)
      const link = document.createElement('a')
      const blob = new Blob([csv], { type: 'text/csv' })
      link.href = URL.createObjectURL(blob)
      link.download = `exoplanet-dashboard-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      
      toast.success('CSV exported successfully!')
    } catch (error) {
      console.error('CSV export error:', error)
      toast.error('Failed to export CSV')
    } finally {
      setExportLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <BackgroundScene />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative z-10 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Chart configurations with theme matching
  const featureImportanceChartData = featureImportance ? {
    labels: featureImportance.features,
    datasets: [{
      label: 'Importance Score',
      data: featureImportance.importance_scores,
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderColor: 'rgba(168, 85, 247, 1)',
      borderWidth: 2,
      borderRadius: 8,
    }]
  } : null

  const scoreDistributionData = stats?.score_distribution ? {
    labels: stats.score_distribution.bins.slice(0, -1).map((bin, i) => 
      `${bin}-${stats.score_distribution.bins[i + 1]}%`
    ),
    datasets: [{
      label: 'Number of Planets',
      data: stats.score_distribution.counts,
      fill: true,
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      borderColor: 'rgba(6, 182, 212, 1)',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: 'rgba(6, 182, 212, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  } : null

  const confusionMatrixData = stats?.model_metrics ? {
    labels: ['Non-Habitable', 'Habitable'],
    datasets: [{
      label: 'Classification Results',
      data: [stats.non_habitable_count, stats.habitable_count],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 2,
    }]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e5e7eb',
          font: { size: 12 },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
      }
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
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/80">Live Dashboard</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                Analytics Dashboard
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive insights into exoplanet habitability predictions across {stats?.total_planets || 1089} analyzed worlds
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={<Activity />}
              title="Total Analyzed"
              value={stats?.total_planets || 1089}
              color="from-purple-500 to-pink-500"
              delay={0.1}
            />
            <StatCard
              icon={<Target />}
              title="Habitable Candidates"
              value={stats?.habitable_count || 13}
              color="from-green-500 to-emerald-500"
              delay={0.2}
            />
            <StatCard
              icon={<TrendingUp />}
              title="Model Accuracy"
              value={`${((stats?.model_metrics?.accuracy || 0.9917) * 100).toFixed(2)}%`}
              color="from-cyan-500 to-blue-500"
              delay={0.3}
            />
            <StatCard
              icon={<Zap />}
              title="Recall Rate"
              value={`${((stats?.model_metrics?.recall || 0.8333) * 100).toFixed(2)}%`}
              color="from-orange-500 to-red-500"
              delay={0.4}
            />
          </div>

          {/* Key Insights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <InsightCard 
              icon={<Lightbulb />}
              title="Habitability Rate"
              value={`${(((stats?.habitable_count || 13) / (stats?.total_planets || 1089)) * 100).toFixed(2)}%`}
              description="Of analyzed planets are potentially habitable"
              color="from-yellow-500 to-amber-500"
            />
            <InsightCard 
              icon={<ArrowUpRight />}
              title="Model Sensitivity"
              value={`${((stats?.model_metrics?.recall || 0.8333) * 100).toFixed(2)}%`}
              description="Ability to identify habitable planets"
              color="from-green-500 to-emerald-500"
            />
            <InsightCard 
              icon={<ArrowDownLeft />}
              title="False Positive Rate"
              value={`${(((1 - (stats?.model_metrics?.precision || 0.3846)) * 100).toFixed(2))}%`}
              description="Incorrectly classified as habitable"
              color="from-red-500 to-pink-500"
            />
          </motion.div>

          {/* Charts Grid */}
          <div ref={dashboardRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Feature Importance */}
            <ChartCard 
              title="Feature Importance" 
              icon={<BarChartIcon />}
              subtitle="Top 15 features driving habitability predictions"
              delay={0.6}
            >
              {featureImportanceChartData ? (
                <div className="h-80">
                  <Bar data={featureImportanceChartData} options={{
                    ...chartOptions,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        ticks: { color: '#9ca3af', font: { size: 11 } },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                      },
                      y: {
                        ticks: { color: '#9ca3af', font: { size: 10 } },
                        grid: { display: false }
                      }
                    }
                  }} />
                </div>
              ) : (
                <LoadingPlaceholder />
              )}
            </ChartCard>

            {/* Score Distribution */}
            <ChartCard 
              title="Habitability Score Distribution" 
              icon={<LineChartIcon />}
              subtitle="Frequency of confidence scores across all planets"
              delay={0.7}
            >
              {scoreDistributionData ? (
                <div className="h-80">
                  <Line data={scoreDistributionData} options={chartOptions} />
                </div>
              ) : (
                <LoadingPlaceholder />
              )}
            </ChartCard>

            {/* Classification Results */}
            <ChartCard 
              title="Classification Results" 
              icon={<Target />}
              subtitle="Distribution of predicted classes"
              delay={0.8}
            >
              {confusionMatrixData ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <Doughnut data={confusionMatrixData} options={doughnutOptions} />
                  </div>
                </div>
              ) : (
                <LoadingPlaceholder />
              )}
            </ChartCard>

            {/* Model Metrics */}
            <ChartCard 
              title="Model Performance Metrics" 
              icon={<TrendingUp />}
              subtitle="Detailed classification performance"
              delay={0.9}
            >
              <div className="h-80 flex flex-col justify-center space-y-4 px-4">
                <MetricBar 
                  label="Accuracy" 
                  value={stats?.model_metrics?.accuracy || 0.9917}
                  color="from-cyan-500 to-blue-500"
                />
                <MetricBar 
                  label="Recall" 
                  value={stats?.model_metrics?.recall || 0.8333}
                  color="from-purple-500 to-pink-500"
                />
                <MetricBar 
                  label="Precision" 
                  value={stats?.model_metrics?.precision || 0.3846}
                  color="from-orange-500 to-red-500"
                />
                <MetricBar 
                  label="F1 Score" 
                  value={stats?.model_metrics?.f1_score || 0.5263}
                  color="from-green-500 to-emerald-500"
                />
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400">Optimized Threshold</p>
                  <p className="text-2xl font-bold text-purple-400">{stats?.model_metrics?.threshold || 0.0763}</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Data Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="glass-card rounded-2xl p-8 border border-white/10 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Table2 className="text-purple-400" size={24} />
              <h3 className="text-2xl font-semibold text-white">Data Summary</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <SummaryItem label="Total Planets" value={stats?.total_planets || 1089} />
              <SummaryItem label="Habitable" value={stats?.habitable_count || 13} />
              <SummaryItem label="Non-Habitable" value={(stats?.total_planets || 1089) - (stats?.habitable_count || 13)} />
              <SummaryItem label="Classification Threshold" value={`${(stats?.model_metrics?.threshold || 0.0763).toFixed(4)}`} />
            </div>
          </motion.div>

          {/* Export Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <ExportButton
              icon={<FileText size={20} />}
              label="Export PDF Report"
              onClick={exportPDF}
              loading={exportLoading}
              gradient="from-purple-600 to-pink-600"
              hoverShadow="hover:shadow-purple-500/50"
            />
            <ExportButton
              icon={<Download size={20} />}
              label="Export CSV Data"
              onClick={exportCSV}
              loading={exportLoading}
              gradient="from-cyan-600 to-blue-600"
              hoverShadow="hover:shadow-cyan-500/50"
            />
          </motion.div>

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAllData}
              disabled={loading}
              className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group"
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${color} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  )
}

const ChartCard = ({ title, icon, subtitle, children, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-purple-400">{icon}</div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

const MetricBar = ({ label, value, color }) => {
  const percentage = value * 100
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-white">{percentage.toFixed(2)}%</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  )
}

const LoadingPlaceholder = () => (
  <div className="h-80 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
    />
  </div>
)

const InsightCard = ({ icon, title, value, description, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${color} mb-4`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </motion.div>
  )
}

const SummaryItem = ({ label, value }) => {
  return (
    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">{value}</p>
    </div>
  )
}

const ExportButton = ({ icon, label, onClick, loading, gradient, hoverShadow }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={loading}
      className={`px-8 py-4 bg-gradient-to-r ${gradient} rounded-xl font-semibold hover:shadow-lg ${hoverShadow} transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </motion.button>
  )
}

export default DashboardPage
