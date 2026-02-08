import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Database, Globe, Rocket, Zap } from 'lucide-react';
import MetricCard from './components/MetricCard';
import HabitabilityDistribution from './components/HabitabilityDistribution';
import FeatureImportance from './components/FeatureImportance';
import ScatterPlot from './components/ScatterPlot';
import TopPlanetsTable from './components/TopPlanetsTable';
import PredictionPanel from './components/PredictionPanel';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [metrics, setMetrics] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [topPlanets, setTopPlanets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, distRes, featuresRes, scatterRes, planetsRes] = await Promise.all([
          axios.get(`${API_URL}/api/metrics`),
          axios.get(`${API_URL}/api/habitability-distribution`),
          axios.get(`${API_URL}/api/feature-importance`),
          axios.get(`${API_URL}/api/scatter-data`),
          axios.get(`${API_URL}/api/top-planets`)
        ]);

        setMetrics(metricsRes.data);
        setDistribution(distRes.data.distribution);
        setFeatureImportance(featuresRes.data.features);
        setScatterData(scatterRes.data.data);
        setTopPlanets(planetsRes.data.planets);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-slate-400 font-mono">Loading ExoHabitAI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md h-20 flex items-center px-8" data-testid="dashboard-header">
        <div className="flex items-center gap-3">
          <Rocket className="text-cyan-400" size={32} />
          <h1 className="font-heading text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            EXOHABITAI
          </h1>
        </div>
        <p className="ml-auto text-slate-400 text-sm font-mono hidden md:block">
          Exoplanet Habitability Analysis Dashboard
        </p>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 md:p-12 mt-20">
        <div className="mb-8" data-testid="hero-section">
          <h2 className="font-heading font-black text-4xl md:text-6xl tracking-tighter uppercase glow-text mb-4">
            DISCOVER HABITABLE WORLDS
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-3xl">
            Leveraging machine learning to analyze exoplanet characteristics and predict habitability potential across the cosmos.
            Explore planetary and stellar parameters that determine whether distant worlds could support life.
          </p>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8" data-testid="metrics-section">
            <MetricCard
              icon={Database}
              label="Total Exoplanets"
              value={metrics.total_exoplanets.toLocaleString()}
              testId="metric-total-exoplanets"
            />
            <MetricCard
              icon={Globe}
              label="Habitable Planets"
              value={metrics.habitable_planets.toLocaleString()}
              testId="metric-habitable-planets"
            />
            <MetricCard
              icon={Activity}
              label="Non-Habitable"
              value={metrics.non_habitable_planets.toLocaleString()}
              testId="metric-non-habitable-planets"
            />
            <MetricCard
              icon={Zap}
              label="Avg Habitability"
              value={metrics.average_habitability_score.toFixed(3)}
              testId="metric-avg-habitability"
            />
            <MetricCard
              icon={Rocket}
              label="Best Model"
              value={metrics.best_model}
              testId="metric-best-model"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {distribution.length > 0 && <HabitabilityDistribution data={distribution} />}
          {featureImportance.length > 0 && <FeatureImportance data={featureImportance} />}
        </div>

        <div className="mb-6">
          {scatterData.length > 0 && <ScatterPlot data={scatterData} />}
        </div>

        <div className="mb-6">
          {topPlanets.length > 0 && <TopPlanetsTable planets={topPlanets} />}
        </div>

        <div>
          <PredictionPanel />
        </div>
      </main>
    </div>
  );
}

export default App;