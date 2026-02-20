import { motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Zap, Shield, Target, GitBranch, Award, Sparkles, Rocket, Globe, Star } from 'lucide-react'
import { useRef } from 'react'
import BackgroundScene from '../components/3d/BackgroundScene'

const AboutPage = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  const milestones = [
    {
      title: 'Data Engineering',
      description: 'Processed NASA exoplanet archive with advanced feature engineering',
      status: 'Complete',
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: 'Machine Learning',
      description: 'Built Hybrid Stacking Ensemble achieving 99% accuracy with 83.33% recall',
      status: 'Complete',
      icon: <Brain className="w-5 h-5" />
    },
    {
      title: 'Backend API',
      description: 'Deployed Flask REST API with real-time predictions',
      status: 'Complete',
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: 'Frontend UI',
      description: 'Modern React dashboard with 3D visualizations',
      status: 'Complete',
      icon: <Sparkles className="w-5 h-5" />
    }
  ]

  const technologies = [
    { name: 'React', icon: '⚛️', color: 'from-teal to-scientific' },
    { name: 'Three.js', icon: '🎮', color: 'from-scientific to-teal' },
    { name: 'Flask', icon: '🌶️', color: 'from-green-400 to-emerald-500' },
    { name: 'XGBoost', icon: '🚀', color: 'from-orange-400 to-red-500' },
    { name: 'Random Forest', icon: '🌳', color: 'from-green-400 to-teal-500' },
    { name: 'scikit-learn', icon: '🔬', color: 'from-scientific to-teal' },
  ]

  const stats = [
    { value: '83.33%', label: 'Recall Rate', icon: <Target className="w-6 h-6" /> },
    { value: '99%', label: 'Accuracy', icon: <Shield className="w-6 h-6" /> },
    { value: '39', label: 'Features', icon: <GitBranch className="w-6 h-6" /> },
    { value: '0.0763', label: 'Threshold', icon: <Zap className="w-6 h-6" /> },
  ]

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <BackgroundScene />

      <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
              <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            >
              <Rocket className="w-4 h-4 text-scientific" />
              <span className="text-sm text-white/70">Exploring the Cosmos with AI</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-clean via-scientific to-teal bg-clip-text text-transparent">
                About ExoHabitAI
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              An advanced machine learning system revolutionizing exoplanet habitability prediction, 
              built with cutting-edge AI and immersive visualization technology.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-scientific/20 to-teal/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-scientific/20 to-teal/20 mb-4">
                    <span className="text-scientific">{stat.icon}</span>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-clean to-scientific bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Vision Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-r from-scientific/10 via-transparent to-teal/10 border border-white/10 backdrop-blur-sm overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-scientific/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal/20 rounded-full blur-[80px]" />
              
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-scientific to-teal bg-clip-text text-transparent">
                    Our Vision
                  </span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-6">
                  ExoHabitAI represents the convergence of advanced machine learning and astronomical research, 
                  designed to accelerate humanity's search for habitable worlds beyond our solar system.
                </p>
                <p className="text-lg text-white/70 leading-relaxed">
                  Built on a Hybrid Stacking Ensemble architecture combining XGBoost and Random Forest 
                  with a Logistic Regression meta-learner, the system achieves <span className="text-teal font-semibold">99% accuracy</span> with 
                  an optimized threshold of 0.0763. The model balances <span className="text-green-400 font-semibold">83.33% recall</span> and 
                  <span className="text-scientific font-semibold">38.46% precision</span>, prioritizing the detection of potentially 
                  habitable planets while maintaining reliability.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Milestones Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-clean to-scientific bg-clip-text text-transparent">
                Project Milestones
              </span>
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-scientific via-teal to-scientific hidden md:block" />
              
              <div className="space-y-8">
                {milestones.map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 inline-block w-full"
                      >
                        <div className={`flex items-center gap-3 mb-3 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                          <div className="p-2 rounded-lg bg-gradient-to-r from-scientific/20 to-teal/20">
                            {milestone.icon}
                          </div>
                          <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                        </div>
                        <p className="text-white/60 mb-3">{milestone.description}</p>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          {milestone.status}
                        </span>
                      </motion.div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-scientific to-teal flex-shrink-0">
                      <span className="text-white font-bold">{idx + 1}</span>
                    </div>
                    
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Technologies Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-clean to-scientific bg-clip-text text-transparent">
                Built With
              </span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {technologies.map((tech, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`} />
                  <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
                    <div className="text-5xl mb-3">{tech.icon}</div>
                    <div className="text-sm font-medium text-white/80">{tech.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technical Specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-scientific/10 to-transparent border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-scientific/20">
                    <Brain className="w-6 h-6 text-scientific" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Model Architecture</h3>
                </div>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-scientific rounded-full" />
                    Base Models: XGBoost, Random Forest
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-scientific rounded-full" />
                    Meta-Learner: Logistic Regression
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-scientific rounded-full" />
                    Ensemble Type: Stacking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-scientific rounded-full" />
                    Optimized Threshold: 0.0763
                  </li>
                </ul>
              </div>
              
              <div className="p-8 rounded-3xl bg-gradient-to-br from-teal/10 to-transparent border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-teal/20">
                    <Award className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                </div>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                    Accuracy: 99% | Recall: 83.33% | Precision: 38.46%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                    Response Time: &lt;100ms per prediction
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                    Test Set: 1,089 samples (6 habitable)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                    Features: 39 astronomical parameters
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <p className="text-white/50 text-sm">
              Developed as part of Infosys Internship Program
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
