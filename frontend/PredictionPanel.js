import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PredictionPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pl_rade: '',
    pl_bmasse: '',
    pl_orbper: '',
    pl_orbsmax: '',
    pl_eqt: '',
    st_teff: '',
    st_lum: '',
    st_met: '',
    pl_insol: '',
    star_type: 'G'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/api/predict`, {
        ...formData,
        pl_rade: parseFloat(formData.pl_rade),
        pl_bmasse: parseFloat(formData.pl_bmasse),
        pl_orbper: parseFloat(formData.pl_orbper),
        pl_orbsmax: parseFloat(formData.pl_orbsmax),
        pl_eqt: parseFloat(formData.pl_eqt),
        st_teff: parseFloat(formData.st_teff),
        st_lum: parseFloat(formData.st_lum),
        st_met: parseFloat(formData.st_met),
        pl_insol: parseFloat(formData.pl_insol)
      });

      setResult(response.data.result);
    } catch (error) {
      console.error('Prediction error:', error);
      setResult({ prediction: 'Error', confidence_score: 0, error: error.response?.data?.detail || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard data-testid="prediction-panel">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Zap className="text-yellow-400" size={24} />
          <h3 className="font-subheading font-semibold text-xl text-slate-300">
            Habitability Prediction Tool
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-cyan-400 hover:text-cyan-300"
          data-testid="toggle-prediction-panel"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-400 text-xs font-mono">Planet Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Kepler-442b"
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-planet-name"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Radius (Earth radii)</Label>
              <Input
                name="pl_rade"
                type="number"
                step="0.01"
                value={formData.pl_rade}
                onChange={handleChange}
                placeholder="1.2"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-radius"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Mass (Earth masses)</Label>
              <Input
                name="pl_bmasse"
                type="number"
                step="0.01"
                value={formData.pl_bmasse}
                onChange={handleChange}
                placeholder="1.5"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-mass"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Orbital Period (days)</Label>
              <Input
                name="pl_orbper"
                type="number"
                step="0.01"
                value={formData.pl_orbper}
                onChange={handleChange}
                placeholder="365"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-orbital-period"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Semi-Major Axis (AU)</Label>
              <Input
                name="pl_orbsmax"
                type="number"
                step="0.01"
                value={formData.pl_orbsmax}
                onChange={handleChange}
                placeholder="1.0"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-semi-major-axis"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Equilibrium Temp (K)</Label>
              <Input
                name="pl_eqt"
                type="number"
                step="0.1"
                value={formData.pl_eqt}
                onChange={handleChange}
                placeholder="288"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-temperature"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Stellar Temp (K)</Label>
              <Input
                name="st_teff"
                type="number"
                step="1"
                value={formData.st_teff}
                onChange={handleChange}
                placeholder="5778"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-stellar-temp"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Stellar Luminosity (Solar)</Label>
              <Input
                name="st_lum"
                type="number"
                step="0.01"
                value={formData.st_lum}
                onChange={handleChange}
                placeholder="1.0"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-stellar-luminosity"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Stellar Metallicity</Label>
              <Input
                name="st_met"
                type="number"
                step="0.01"
                value={formData.st_met}
                onChange={handleChange}
                placeholder="0.0"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-stellar-metallicity"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Insolation Flux</Label>
              <Input
                name="pl_insol"
                type="number"
                step="0.01"
                value={formData.pl_insol}
                onChange={handleChange}
                placeholder="1.0"
                required
                className="bg-slate-900/50 border-slate-700 text-white"
                data-testid="input-insolation"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-xs font-mono">Star Type</Label>
              <Select value={formData.star_type} onValueChange={(value) => setFormData({ ...formData, star_type: value })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white" data-testid="select-star-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {['A', 'B', 'D', 'F', 'G', 'K', 'L', 'M', 'T', 'W'].map((type) => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-slate-800">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold"
            data-testid="predict-button"
          >
            {loading ? 'Analyzing...' : 'Predict Habitability'}
          </Button>

          {result && (
            <div className="mt-4 p-4 rounded-lg bg-slate-900/70 border border-slate-700" data-testid="prediction-result">
              {result.error ? (
                <p className="text-red-400 font-mono text-sm">{result.error}</p>
              ) : (
                <>
                  <p className="text-slate-400 text-xs font-mono mb-1">Prediction Result</p>
                  <p className={`text-2xl font-bold font-mono ${result.prediction === 'Habitable' ? 'text-green-400' : 'text-orange-400'}`}>
                    {result.prediction}
                  </p>
                  <p className="text-slate-400 text-sm font-mono mt-2">
                    Confidence Score: <span className="text-cyan-400">{(result.confidence_score * 100).toFixed(2)}%</span>
                  </p>
                </>
              )}
            </div>
          )}
        </form>
      )}
    </GlassCard>
  );
};

export default PredictionPanel;