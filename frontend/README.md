## 🚀 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── Hero.tsx            # Hero section with animations
│   ├── PlanetForm.tsx      # Main input form
│   ├── ResultsDisplay.tsx  # Prediction results display
│   ├── StarField.tsx       # Animated star background
│   └── Toast.tsx           # Toast notifications
├── lib/
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript types
```

## 🎯 Usage

### Input Parameters

The form accepts the following parameters:

#### Planetary Parameters
- **Planet Name**: Custom name for the exoplanet
- **Orbital Period**: 0.1 - 100,000 days
- **Semi-major Axis**: 0.001 - 1,000 AU
- **Planet Mass**: 0.01 - 13,000 Earth masses
- **Planet Type**: Rocky, Super Earth, Neptune-like, Jupiter-like

#### Stellar Parameters
- **Stellar Metallicity [Fe/H]**: -3.0 to 1.0
- **Surface Gravity (log g)**: 0.0 to 6.0
- **Stellar Type**: F, G, K, M, Other
- **Discovery Year**: 1990 - 2030

### Example Input

```json
{
  "planet_name": "Kepler-442b",
  "pl_orbper": 112.3,
  "pl_orbsmax": 0.409,
  "pl_bmasse": 2.34,
  "st_met": 0.0,
  "st_logg": 4.48,
  "disc_year": 2015,
  "st_type": "K",
  "pl_type": "super_earth"
}
```

## 🔧 Configuration

### API Endpoint

The frontend is configured to proxy requests to the backend API. Update `next.config.js` if your backend runs on a different port:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:5000/:path*',
    },
  ];
}
```

### Environment Variables

Create a `.env.local` file for custom configuration:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 API Response Format

The backend returns predictions in the following format:

```json
{
  "status": "success",
  "planet_name": "Kepler-442b",
  "habitability_prediction": {
    "is_habitable": true,
    "probability": 0.8234,
    "score": 82.34,
    "category": "High Priority",
    "description": "Strong habitability candidate..."
  },
  "confidence": {
    "level": "High",
    "explanation": "Model is 64.7% confident..."
  },
  "recommendation": {
    "observe": true,
    "priority_rank": "Top 10%"
  }
}
```

## 📝 License

This project is part of the ExoHabitAI system.

## 👥 Contributing

For questions or contributions, please refer to the main project repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS