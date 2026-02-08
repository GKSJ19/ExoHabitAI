import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Rocket, Star, Globe, ChevronDown, ArrowRight, Zap, Target, BarChart3, Shield, Orbit, Eye, Cpu, Waves } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AdvancedHeroScene from '../components/3d/AdvancedHeroScene'

gsap.registerPlugin(ScrollTrigger)

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.from('.hero-title span', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.5
      })
      
      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
      })
      
      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 1.5
      })
    })
    
    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Hybrid ML Model",
      description: "XGBoost + Random Forest ensemble with Logistic Regression meta-learner achieving 99% accuracy"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "83.33% Recall",
      description: "Optimized threshold of 0.0763 balances sensitivity and precision for reliable habitability detection"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "39 Features",
      description: "Comprehensive analysis of planetary and stellar parameters for accurate habitability assessment"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Batch Processing",
      description: "Analyze thousands of exoplanets simultaneously with real-time visualization"
    }
  ]

  const stats = [
    { value: "1,089", label: "Test Samples" },
    { value: "99%", label: "Accuracy" },
    { value: "39", label: "Features Analyzed" },
    { value: "83.33%", label: "Recall Rate" }
  ]

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* 3D Background Scene with advanced effects */}
      <AdvancedHeroScene scrollY={scrollY} mousePosition={mousePosition} />
      
      {/* Floating orbs that follow cursor */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none z-0"
        animate={{
          x: mousePosition.x * 100 + window.innerWidth / 2 - 192,
          y: mousePosition.y * 100 + window.innerHeight / 2 - 192,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none z-0"
        animate={{
          x: -mousePosition.x * 80 + window.innerWidth / 2 - 192,
          y: -mousePosition.y * 80 + window.innerHeight / 2 - 192,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 25 }}
      />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 rounded-full glass-card border border-purple-500/30 backdrop-blur-xl group hover:border-purple-400/50 transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
            </motion.div>
            <span className="text-sm text-white/90 font-medium">99% Accuracy with Hybrid Stacking</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Hero title with advanced animations */}
          <div className="hero-title mb-10 overflow-hidden">
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-black leading-[1.1] tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <span className="text-white">Discover the</span>
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <span className="gradient-text inline-block">Next Habitable</span>
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <span className="gradient-text inline-block">World</span>
              </motion.div>
            </motion.h1>
          </div>

          {/* Subtitle with typing effect */}
          <motion.p 
            className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-white/70 max-w-4xl mx-auto mb-14 leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Leveraging <span className="text-purple-400 font-semibold">83.33% recall</span> and <span className="text-cyan-400 font-semibold">cutting-edge ML</span> to identify 
            potentially habitable exoplanets across the cosmos
          </motion.p>

          {/* CTA Buttons with enhanced effects */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <Link to="/predict" className="hero-cta">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="relative group px-10 py-5 text-lg font-semibold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
                  <span>Start Prediction</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </Link>
            
            <Link to="/ranking" className="hero-cta">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 text-lg font-semibold rounded-2xl border-2 border-white/20 text-white backdrop-blur-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-3"
              >
                <Globe className="w-6 h-6" />
                <span>Explore Rankings</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Real-time Analysis</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>99% Accuracy</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>39 Features</span>
            </div>
          </motion.div>

          {/* Scroll indicator with animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ 
                y: [0, 12, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center text-white/40 cursor-pointer hover:text-white/60 transition-colors"
            >
              <span className="text-xs uppercase tracking-wider mb-3 font-medium">Scroll to explore</span>
              <div className="relative">
                <ChevronDown className="w-6 h-6" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Advanced Glassmorphism */}
      <section className="relative py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
            
            <div className="relative glass-card p-10 md:p-16 rounded-[2rem] border border-white/20 backdrop-blur-2xl overflow-hidden">
              {/* Animated mesh gradient background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: idx * 0.15, 
                      duration: 0.7,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="text-center relative group/stat"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 to-purple-500/0 group-hover/stat:from-purple-500/20 group-hover/stat:to-transparent rounded-2xl transition-all duration-300" />
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: idx * 0.15 + 0.3 }}
                    >
                      <p className="text-5xl md:text-6xl lg:text-7xl font-black gradient-text mb-3 tracking-tight">
                        {stat.value}
                      </p>
                      <p className="text-white/70 text-sm md:text-base font-medium uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </motion.div>
                    
                    {/* Decorative line */}
                    <motion.div
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: idx * 0.15 + 0.5, duration: 0.5 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="inline-block px-4 py-1 rounded-full border border-white/20 text-white/60 text-sm mb-4">
              [ What We Do ]
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Shaping the Future of<br />
              <span className="gradient-text">Exoplanet Discovery</span> with<br />
              Innovative ML and<br />
              Strategic Expertise
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white">Comprehensive Analysis & Prediction</h3>
              <p className="text-white/60 leading-relaxed">
                We specialize in designing integrated machine learning experiences that analyze 
                all key parameters, from stellar characteristics to planetary composition. 
                Our innovative hybrid stacking model brings cutting-edge predictions through 
                scientific analysis that drives informed discoveries.
              </p>
              <div className="flex gap-4">
                <Link to="/batch">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="btn-primary px-6 py-3"
                  >
                    Batch Analysis
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="btn-secondary px-6 py-3"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Spaceship/3D element placeholder */}
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Real-time Processing</h4>
                    <p className="text-white/40 text-sm">1000+ planets per batch</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Model Accuracy</span>
                    <span className="text-green-400 font-mono">99.99%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-full w-[99.99%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Recall Rate</span>
                    <span className="text-cyan-400 font-mono">83.33%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-full w-[83.33%] bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Advanced 3D Card Grid */}
      <section ref={featuresRef} className="relative py-40 px-6 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full border border-white/20 text-white/60 text-sm mb-6"
            >
              [ Advanced Technology ]
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Cutting-Edge<br />
              <span className="gradient-text">ML Architecture</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Powered by hybrid stacking ensemble combining XGBoost, Random Forest, 
              and Logistic Regression for unparalleled accuracy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 80, rotateX: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: idx * 0.15, 
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ 
                  y: -15,
                  rotateY: 5,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                className="group relative"
              >
                <div className="glass-card p-8 rounded-3xl border border-white/10 group-hover:border-purple-500/50 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-cyan-500/10 transition-all duration-500"
                    initial={false}
                  />
                  
                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icon container with 3D effect */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotateZ: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:text-pink-400 transition-colors duration-300 shadow-lg shadow-purple-500/20 group-hover:shadow-pink-500/30"
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/60 text-base leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional tech specs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: <Orbit className="w-6 h-6" />, label: "Threshold", value: "0.0763" },
              { icon: <Eye className="w-6 h-6" />, label: "Test Samples", value: "1,089" },
              { icon: <Cpu className="w-6 h-6" />, label: "Model Type", value: "Stacking" },
              { icon: <Waves className="w-6 h-6" />, label: "Precision", value: "38.46%" }
            ].map((spec, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-6 rounded-2xl border border-white/10 text-center backdrop-blur-xl"
              >
                <div className="text-purple-400 mb-3 flex justify-center">
                  {spec.icon}
                </div>
                <p className="text-2xl font-bold text-white mb-1">{spec.value}</p>
                <p className="text-sm text-white/50">{spec.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section with Cosmic Theme */}
      <section className="relative py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
          >
            {/* Animated cosmic background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-700 animate-pulse" />
            
            <div className="relative glass-card p-12 md:p-20 rounded-[2.5rem] border border-purple-500/30 overflow-hidden">
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    initial={{
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                    }}
                    animate={{
                      y: [Math.random() * 100 + '%', (Math.random() * 100 - 50) + '%'],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 text-center">
                {/* Animated icon */}
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-block mb-8"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  Ready to Discover<br />
                  <span className="gradient-text">New Worlds?</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Start analyzing exoplanet data with our <span className="text-purple-400 font-semibold">99% accurate</span> hybrid ML model. 
                  Unlock insights that could lead to the next <span className="text-cyan-400 font-semibold">Earth-like discovery</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/predict">
                    <motion.button
                      whileHover={{ 
                        scale: 1.08, 
                        boxShadow: '0 20px 80px rgba(139, 92, 246, 0.5)',
                        y: -5
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group/btn px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden shadow-2xl shadow-purple-500/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center gap-3">
                        <Rocket className="w-6 h-6" />
                        <span>Start Your Journey</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  </Link>
                  
                  <Link to="/about">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-12 py-6 text-xl font-semibold rounded-2xl border-2 border-white/30 text-white backdrop-blur-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                    >
                      Learn More
                    </motion.button>
                  </Link>
                </div>
                
                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>5,446 Planets Analyzed</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Production Ready</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Real-time Processing</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
