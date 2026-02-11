# ExoHabitAI Frontend

Modern and responsive web interface for the ExoHabitAI exoplanet habitability prediction system.

##  Tech Stack

- **React 18** - UI library
- **Vite** - Build tool (fast, modern)
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

- Node.js 16+ and npm
- Flask backend running on `http://localhost:5000`

## 🛠️ Installation

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:3000**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── PredictPage.jsx
│   │   ├── BatchPage.jsx
│   │   ├── RankingPage.jsx
│   │   └── AboutPage.jsx
│   ├── services/         # API integration
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

##  Features

### 1. Home Page
- Impressive hero section with animations
- Key statistics and metrics
- Feature highlights
- Call-to-action buttons

### 2. Single Prediction
- Complete form with all 39 features
- Organized by parameter groups:
  - Planetary Parameters
  - Stellar Parameters
  - System & Positional Parameters
- Real-time validation
- Sample data loader
- Visual result display with confidence score

### 3. Batch Prediction
- JSON input for multiple planets
- Sample format loader
- Real-time results
- Download results as JSON
- Individual planet status tracking

### 4. Ranking System
- Top habitable planet candidates
- Filterable by:
  - Number of results
  - Minimum score threshold
- Visual score bars
- Medal system for top 3
- Stats summary

### 5. About Page
- Project overview
- Key features
- Milestone progress
- Technology stack
- Technical specifications

##  Design Features

### Visual Design
- **Dark theme** with space-inspired gradient background
- **Glass-morphism** cards with blur effects
- **Gradient text** for headings
- **Smooth animations** using Framer Motion
- **Responsive design** for all screen sizes

### Color Palette
- Primary: Blue (#0ea5e9)
- Secondary: Purple (#a855f7)
- Success: Green (#22c55e)
- Error: Red (#ef4444)
- Background: Dark gradient (#0a0a0f → #1a0b2e → #16213e)

### Animations
- Floating elements
- Fade-in on scroll
- Smooth transitions
- Loading spinners
- Progress bars

##  API Integration

All API calls are handled through `src/services/api.js`:

```javascript
import { apiService } from '../services/api'

// Health check
await apiService.getStatus()

// Single prediction
await apiService.predictHabitability(planetData)

// Batch prediction
await apiService.predictBatch(planetsArray)

// Get rankings
await apiService.getRanking(top, minScore)

// Model info
await apiService.getModelInfo()
```

##  Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

##  Testing the Frontend

### 1. Start Backend Server
```bash
cd backend
python app.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Features
1. Navigate to Home page
2. Click "Start Prediction"
3. Load sample data
4. Submit prediction
5. View results
6. Try Batch and Ranking pages

##  Building for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

Build output will be in `dist/` folder.

##  Performance

- **Fast load times** with Vite
- **Code splitting** for optimal bundle size
- **Lazy loading** for routes
- **Optimized images** and assets
- **Minimal dependencies**

##  For Mentor Evaluation

### Key Highlights to Show:

1. **Modern UI/UX**
   - Smooth animations
   - Responsive design
   - Glass-morphism effects

2. **Full Integration**
   - All 5 backend endpoints connected
   - Real-time data from Flask API
   - Error handling with toast notifications

3. **User Experience**
   - Sample data loaders
   - Form validation
   - Loading states
   - Clear feedback messages

4. **Professional Features**
   - Batch processing
   - Ranking system with filters
   - Download results
   - Complete documentation

##  Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ to gh-pages branch
```

## 🔧 Troubleshooting

### Backend Connection Issues
```javascript
// Check .env file
VITE_API_URL=http://localhost:5000

// Ensure Flask is running
// Check Flask CORS is enabled
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

##  License

 Infosys Internship Program - ExoHabitAI Project

## Author

**UJJWAL KUMAR**
- Internship: Infosys  
- Project: ExoHabitAI
- Milestone: 3 (Module-6)

---

**Made with ❤️ using React + Tailwind CSS**
