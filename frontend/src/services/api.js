import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
})

// API Service Methods
export const apiService = {
  // Health check
  getStatus: async () => {
    const response = await api.get('/status')
    return response.data
  },

  // Get model information
  getModelInfo: async () => {
    const response = await api.get('/model/info')
    return response.data
  },

  // Single planet prediction
  predictHabitability: async (planetData) => {
    const response = await api.post('/predict', planetData)
    return response.data
  },

  // Batch prediction
  predictBatch: async (planetsArray) => {
    const response = await api.post('/predict/batch', { planets: planetsArray })
    return response.data
  },

  // Get ranking
  getRanking: async (top = 10, minScore = 0) => {
    const response = await api.get('/rank', {
      params: { top, min_score: minScore }
    })
    return response.data
  },

  // Get detailed planet information
  getPlanetDetails: async (planetIndex) => {
    const response = await api.get(`/planet/${planetIndex}`)
    return response.data
  },

  // Generic GET method
  get: async (endpoint) => {
    const response = await api.get(endpoint)
    return response.data
  },
}

// Error handling helper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'Server error occurred'
  } else if (error.request) {
    // Request made but no response
    return 'Backend server not responding. Please check if Flask is running.'
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred'
  }
}

export default api
