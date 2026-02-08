import { Heart, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-4">ExoHabitAI</h3>
            <p className="text-white/60 text-sm">
              Advanced machine learning system for predicting exoplanet habitability.
              Powered by Hybrid Stacking Ensemble.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="/predict" className="hover:text-primary-400 transition-colors">Predict</a></li>
              <li><a href="/ranking" className="hover:text-primary-400 transition-colors">Ranking</a></li>
              <li><a href="/about" className="hover:text-primary-400 transition-colors">About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-110">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:your.email@example.com"
                 className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-110">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> for Infosys Internship • Milestone 3 
            • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
