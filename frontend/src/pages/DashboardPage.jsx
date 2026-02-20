import React from 'react'

const DashboardPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-white mb-4">Dashboard</h1>
      <p className="text-white/80 mb-6">Overview and visualizations are coming here.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-6">Placeholder card 1</div>
        <div className="bg-white/5 rounded-lg p-6">Placeholder card 2</div>
      </div>
    </div>
  )
}

export default DashboardPage
